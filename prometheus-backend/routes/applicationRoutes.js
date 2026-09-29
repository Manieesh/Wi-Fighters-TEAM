const express = require("express");
const Application = require("../models/Application");
const VoterApplication = require("../models/VoterApplication");
const RtoApplication = require("../models/RtoApplication");
const WelfareApplication = require("../models/WelfareApplication");

const router = express.Router();

function normalizePortalApplication(application, service, citizenId) {
  const data = application.toObject ? application.toObject() : application;
  return {
    ...data,
    citizenId: data.citizenId || citizenId,
    service,
    submittedData: data.submittedData || (service === "rto"
      ? { applicantName: data.applicantName, dateOfBirth: data.dateOfBirth, address: data.address, mobileNumber: data.mobileNumber, vehicleClass: data.vehicleClass }
      : service === "welfare"
        ? { name: data.name, address: data.address, income: data.income }
        : { name: data.name, dob: data.dob, address: data.address, mobile: data.mobile })
  };
}

async function aggregatedApplications(citizenId) {
  const filter = citizenId ? { citizenId } : {};
  const unified = await Application.find(filter).lean();
  const knownIds = new Set(unified.map((app) => app.applicationId));
  const [voter, rto, welfare] = await Promise.all([
    VoterApplication.find().lean(), RtoApplication.find().lean(), WelfareApplication.find().lean()
  ]);
  const portalRecords = [
    ...voter.map((app) => normalizePortalApplication(app, "voter", citizenId)),
    ...rto.map((app) => normalizePortalApplication(app, "rto", citizenId)),
    ...welfare.map((app) => normalizePortalApplication(app, "welfare", citizenId))
  ].filter((app) => !knownIds.has(app.applicationId) && (!citizenId || app.citizenId === citizenId));
  return [...unified, ...portalRecords].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ==========================================
// GET ALL APPLICATIONS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const applications = await aggregatedApplications();

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message
    });
  }
});

// ==========================================
// GET APPLICATIONS BY CITIZEN
// ==========================================
router.get("/citizen/:citizenId", async (req, res) => {
  try {
    const applications = await aggregatedApplications(req.params.citizenId);

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch citizen applications",
      error: error.message
    });
  }
});

// ==========================================
// GET APPLICATION BY ID
// ==========================================
router.get("/:applicationId", async (req, res) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message
    });
  }
});

// ==========================================
// CREATE / REGISTER APPLICATION
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { applicationId, citizenId, service, status, submittedData } = req.body;

    if (!applicationId || !service) {
      return res.status(400).json({
        success: false,
        message: "applicationId and service are required"
      });
    }

    const application = await Application.findOneAndUpdate(
      { applicationId },
      {
        applicationId,
        citizenId: citizenId || "CITIZEN-1001",
        service,
        status: status || "SUBMITTED",
        submittedData: submittedData || {}
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Application registered in unified tracking",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register application",
      error: error.message
    });
  }
});

module.exports = router;
