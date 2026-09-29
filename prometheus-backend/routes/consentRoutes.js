const express = require("express");

const {
  addConsent,
  getConsent,
  getAllConsents
} = require("../services/consentService");
const { logAudit } = require("./auditRoutes");

const router = express.Router();

// ==========================================
// GIVE / UPDATE CONSENT
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      citizenId,
      service,
      consent,
      dataFields
    } = req.body;

    if (!citizenId || !service || consent === undefined) {
      return res.status(400).json({
        success: false,
        message: "citizenId, service and consent are required"
      });
    }

    const isGranted = consent === true;
    const record = await addConsent({
      citizenId,
      service,
      consent: isGranted,
      dataFields: dataFields || []
    });

    // Record immutable audit log
    await logAudit({
      action: isGranted ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
      citizenId,
      service,
      actor: `Citizen (${citizenId})`,
      details: {
        dataFields: dataFields || [],
        legalBasis: "DPDP Act 2023 Section 6(1)",
        status: isGranted ? "Active" : "Revoked"
      },
      status: "SUCCESS"
    });

    res.status(201).json({
      success: true,
      message: isGranted
        ? "Consent granted successfully"
        : "Consent revoked/denied",
      record
    });

  } catch (error) {
    console.error("Consent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save consent",
      error: error.message
    });
  }
});

// ==========================================
// REVOKE CONSENT EXPLICIT ENDPOINT
// ==========================================
router.post("/revoke", async (req, res) => {
  try {
    const { citizenId, service, reason = "Citizen requested data revocation" } = req.body;
    if (!citizenId || !service) {
      return res.status(400).json({ success: false, message: "citizenId and service are required" });
    }

    const record = await addConsent({
      citizenId,
      service,
      consent: false,
      dataFields: []
    });

    await logAudit({
      action: "CONSENT_REVOKED",
      citizenId,
      service,
      actor: `Citizen (${citizenId})`,
      details: {
        reason,
        revokedAt: new Date().toISOString()
      },
      status: "SUCCESS"
    });

    res.json({
      success: true,
      message: `Consent for ${service.toUpperCase()} successfully revoked`,
      record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to revoke consent", error: error.message });
  }
});

// ==========================================
// CHECK CONSENT
// ==========================================
router.get("/:citizenId/:service", async (req, res) => {
  try {
    const {
      citizenId,
      service
    } = req.params;

    const record = await getConsent(
      citizenId,
      service
    );

    res.json({
      success: true,
      consentGranted: !!record,
      record: record || null
    });

  } catch (error) {
    console.error("Check consent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check consent",
      error: error.message
    });
  }
});

// ==========================================
// GET ALL CONSENTS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const records = await getAllConsents();

    res.json({
      success: true,
      count: records.length,
      records
    });

  } catch (error) {
    console.error("Fetch consent records error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch consent records",
      error: error.message
    });
  }
});

module.exports = router;