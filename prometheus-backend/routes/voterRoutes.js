const express = require("express");
const VoterApplication = require("../models/VoterApplication");
const Application = require("../models/Application");

const router = express.Router();

// Submit Voter ID application
router.post("/applications", async (req, res) => {
  try {
    const { name, dob, address, mobile, citizenId } = req.body;

    // Validate required fields
    if (!name || !dob || !address || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name, DOB, address and mobile are required"
      });
    }

    // Generate application ID
    const applicationId =
      "VOTER-" +
      Date.now();

    const application = await VoterApplication.create({
      applicationId,
      name,
      dob,
      address,
      mobile,
      status: "SUBMITTED"
    });

    // Also register in unified Application tracking if not already present
    try {
      await Application.create({
        applicationId,
        citizenId: citizenId || "CITIZEN-1001",
        service: "voter",
        status: "SUBMITTED",
        submittedData: { name, dob, address, mobile }
      });
    } catch (e) {
      // Ignore duplicate or non-fatal tracking error
    }

    res.status(201).json({
      success: true,
      service: "Voter ID",
      message: "Voter ID application submitted successfully",

      application: {
        applicationId: application.applicationId,
        name: application.name,
        dob: application.dob,
        address: application.address,
        mobile: application.mobile,
        status: application.status,
        createdAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("Voter application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit voter application",
      error: error.message
    });
  }
});


// Get all voter applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await VoterApplication
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error("Fetch voter applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch voter applications"
    });
  }
});


// Get application by ID
router.get("/applications/:applicationId", async (req, res) => {
  try {
    const application = await VoterApplication.findOne({
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
    console.error("Fetch application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch application"
    });
  }
});

module.exports = router;