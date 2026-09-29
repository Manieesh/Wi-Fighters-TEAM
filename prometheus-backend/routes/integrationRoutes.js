const express = require("express");
const axios = require("axios");

const { hasConsent } = require("../services/consentService");
const { translateData } = require("../services/dataTranslation");
const { logAudit } = require("./auditRoutes");

const Application = require("../models/Application");

const router = express.Router();

// ==========================================
// PROMETHEUS INTEGRATION GATEWAY
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      citizenId,
      service,
      citizenData
    } = req.body;

    // --------------------------------------
    // 1. Validate request
    // --------------------------------------
    if (!citizenId || !service || !citizenData) {
      return res.status(400).json({
        success: false,
        message: "citizenId, service and citizenData are required"
      });
    }

    // --------------------------------------
    // 2. Check consent
    // --------------------------------------
    const consentGranted = await hasConsent(
      citizenId,
      service
    );

    if (!consentGranted) {
      return res.status(403).json({
        success: false,
        message: `Consent not granted for ${service}`,
        citizenId,
        service
      });
    }

    // --------------------------------------
    // 3. Translate citizen data
    // --------------------------------------
    const translatedData = translateData(citizenData, service);

    // --------------------------------------
    // 5. Determine target service
    // --------------------------------------
    const serviceEndpoints = {
      voter:
        "http://localhost:5000/api/voter/applications",

      rto:
        "http://localhost:5000/api/rto/applications",

      welfare:
        "http://localhost:5000/api/welfare/applications"
    };

    const targetEndpoint =
      serviceEndpoints[service];

    if (!targetEndpoint) {
      return res.status(400).json({
        success: false,
        message: "Unsupported service",
        supportedServices: [
          "voter",
          "rto",
          "welfare"
        ]
      });
    }

    // --------------------------------------
    // DEBUG
    // --------------------------------------
    console.log(
      "Integration Service:",
      service
    );

    console.log(
      "Translated Data:",
      { ...translatedData, citizenId }
    );

    // --------------------------------------
    // 6. Send data to actual service
    // --------------------------------------
    const serviceResponse = await axios.post(
      targetEndpoint,
      translatedData
    );

    // --------------------------------------
    // 7. Get generated application details
    // --------------------------------------
    const serviceApplication =
      serviceResponse.data.application;

    if (
      !serviceApplication ||
      !serviceApplication.applicationId
    ) {
      throw new Error(
        "Service did not return a valid application ID"
      );
    }

    // --------------------------------------
    // 8. Save unified application record
    // --------------------------------------
    const application = await Application.findOneAndUpdate(
      { applicationId: serviceApplication.applicationId },
      {
        applicationId:
          serviceApplication.applicationId,
        citizenId,
        service,
        status:
          serviceApplication.status ||
          "SUBMITTED",
        submittedData:
          translatedData
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Record audit trail event
    await logAudit({
      action: "REQUEST_DISPATCHED",
      citizenId,
      service,
      actor: "Prometheus Sovereign Gateway",
      details: {
        applicationId: serviceApplication.applicationId,
        endpoint: targetEndpoint,
        status: application.status
      },
      status: "SUCCESS"
    });

    // --------------------------------------
    // 9. Unified response
    // --------------------------------------
    return res.status(200).json({
      success: true,

      message:
        "Application integrated successfully",

      citizenId,

      service,

      consent: {
        granted: true
      },

      translation: {
        applied: true,
        data: translatedData
      },

      application: {
        applicationId:
          application.applicationId,

        citizenId:
          application.citizenId,

        service:
          application.service,

        status:
          application.status,

        submittedData:
          application.submittedData,

        createdAt:
          application.createdAt
      },

      serviceApplication:
        serviceResponse.data
    });

  } catch (error) {

    console.error(
      "Integration Error:",
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Integration failed",
      error:
        error.response?.data ||
        error.message
    });
  }
});

// ==========================================
// PREFILL ENDPOINT FOR EXTERNAL PORTALS
// ==========================================
const { getProfile } = require("../services/profileService");
const { createHandoff } = require("../services/handoffService");

router.post("/handoff", async (req, res) => {
  try {
    const { citizenId, service } = req.body;
    if (!citizenId || service !== "rto") {
      return res.status(400).json({
        success: false,
        message: "citizenId and service=rto are required"
      });
    }

    const consentGranted = await hasConsent(citizenId, service);
    if (!consentGranted) {
      return res.status(403).json({
        success: false,
        message: "Consent must be granted before creating an RTO handoff"
      });
    }

    const profile = getProfile(citizenId);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Citizen profile not found" });
    }

    const data = translateData(profile, service);
    const token = createHandoff({ citizenId, service, data });
    res.status(201).json({
      success: true,
      token,
      expiresInSeconds: 600,
      citizenId,
      source: "PROMETHEUS"
    });
  } catch (error) {
    console.error("Create integration handoff error:", error);
    res.status(500).json({ success: false, message: "Unable to create integration handoff" });
  }
});

router.get("/prefill/:service/:citizenId", async (req, res) => {
  try {
    const { service, citizenId } = req.params;

    if (!["voter", "rto", "welfare"].includes(service.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Unsupported service" });
    }
    const profile = getProfile(citizenId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Citizen profile not found"
      });
    }

    const consentGranted = await hasConsent(citizenId, service);

    const translatedData = translateData(profile, service);

    res.json({
      success: true,
      service,
      citizenId,
      consentGranted: !!consentGranted,
      profile,
      prefilledData: translatedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate prefill data",
      error: error.message
    });
  }
});

module.exports = router;
