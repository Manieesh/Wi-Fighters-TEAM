const express = require("express");
const RtoApplication = require("../models/RtoApplication");
const Application = require("../models/Application");
const { getHandoff } = require("../services/handoffService");

const router = express.Router();

router.get("/prefill/:token", (req, res) => {
  const handoff = getHandoff(req.params.token);
  if (!handoff || handoff.service !== "rto") {
    return res.status(404).json({
      success: false,
      message: "This Prometheus integration link is invalid or expired"
    });
  }

  res.json({
    success: true,
    citizenId: handoff.citizenId,
    source: "PROMETHEUS",
    data: handoff.data,
    prefilledData: handoff.data
  });
});

// ========================================
// Submit Driving Licence Application
// ========================================

router.post("/applications", async (req, res) => {
  try {
    const {
      applicantName,
      dateOfBirth,
      address,
      mobileNumber,
      vehicleClass,
      citizenId,
      email,
      stateRto,
      applicationType
    } = req.body;

    // Validate required fields
    if (
      !applicantName ||
      !dateOfBirth ||
      !address ||
      !mobileNumber ||
      !vehicleClass
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Applicant name, date of birth, address, mobile number and vehicle class are required"
      });
    }

    // Generate application ID
    const applicationId =
      `RTO-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

    // Save to MongoDB
    const application = await RtoApplication.create({
      applicationId,
      applicantName,
      dateOfBirth,
      address,
      mobileNumber,
      vehicleClass,
      email,
      stateRto,
      applicationType,
      citizenId: citizenId || "CITIZEN-1001",
      status: "SUBMITTED"
    });

    // Also register in unified Application tracking
    try {
      await Application.create({
        applicationId,
        citizenId: citizenId || "CITIZEN-1001",
        service: "rto",
        status: "SUBMITTED",
        submittedData: { applicantName, dateOfBirth, address, mobileNumber, email, vehicleClass, stateRto, applicationType }
      });
    } catch (e) {
      // Ignore duplicate
    }

    res.status(201).json({
      success: true,
      service: "Driving Licence",
      message: "Driving Licence application submitted successfully",

      application: {
        applicationId: application.applicationId,
        applicantName: application.applicantName,
        dateOfBirth: application.dateOfBirth,
        address: application.address,
        mobileNumber: application.mobileNumber,
        vehicleClass: application.vehicleClass,
        email: application.email,
        stateRto: application.stateRto,
        applicationType: application.applicationType,
        citizenId: application.citizenId,
        status: application.status,
        createdAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("RTO application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit Driving Licence application",
      error: error.message
    });
  }
});


// ========================================
// Get All Driving Licence Applications
// ========================================

router.get("/applications", async (req, res) => {
  try {
    const applications = await RtoApplication
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error("Fetch RTO applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Driving Licence applications"
    });
  }
});


// ========================================
// Get Application By ID
// ========================================

router.get("/applications/:applicationId", async (req, res) => {
  try {
    const application = await RtoApplication.findOne({
      applicationId: req.params.applicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Driving Licence application not found"
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error("Fetch RTO application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch application"
    });
  }
});

router.post("/applications/:applicationId/status", async (req, res) => {
  const allowed = ["SUBMITTED", "UNDER_VERIFICATION", "APPROVED", "REJECTED", "COMPLETED"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ success: false, message: "Invalid RTO application status" });
  }

  const application = await RtoApplication.findOneAndUpdate(
    { applicationId: req.params.applicationId },
    { status: req.body.status },
    { new: true }
  );
  if (!application) {
    return res.status(404).json({ success: false, message: "Driving Licence application not found" });
  }

  await Application.findOneAndUpdate(
    { applicationId: application.applicationId },
    { status: application.status }
  );
  res.json({ success: true, application });
});

module.exports = router;