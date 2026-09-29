const express = require("express");
const WelfareApplication = require("../models/WelfareApplication");
const Application = require("../models/Application");

const router = express.Router();

const schemes = [
  { id: "education-support", name: "Education Support Scheme", department: "Social Welfare", category: "Education", benefit: "Educational financial assistance", eligibility: "Student households with annual income up to ₹5,00,000" },
  { id: "housing-assistance", name: "Housing Assistance", department: "Rural Development", category: "Housing", benefit: "Housing support for eligible households", eligibility: "Rural or urban low-income households" },
  { id: "women-empowerment", name: "Women Empowerment Assistance", department: "Women & Child Development", category: "Women & Child", benefit: "Livelihood and skills assistance", eligibility: "Eligible adult women applicants" },
  { id: "senior-support", name: "Senior Citizen Support", department: "Social Security", category: "Senior Citizens", benefit: "Monthly financial assistance", eligibility: "Citizens aged 60 years and above" }
];

router.get("/schemes", (req, res) => res.json({ success: true, schemes }));
router.get("/schemes/:id", (req, res) => {
  const scheme = schemes.find((item) => item.id === req.params.id);
  if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });
  res.json({ success: true, scheme });
});
router.post("/eligibility", (req, res) => {
  const income = Number(req.body.income || 0);
  const age = Number(req.body.age || 0);
  const eligible = income > 0 && income <= 500000 && (age === 0 || age >= 18);
  res.json({ success: true, eligible, reason: eligible ? "Income and age match the prototype eligibility rules." : "The prototype rules require an adult applicant with income up to ₹5,00,000." });
});

// ========================================
// Submit Welfare Scheme Application
// ========================================

router.post("/applications", async (req, res) => {
  try {
    const {
      name,
      address,
      income,
      schemeName,
      citizenId
    } = req.body;

    // Validate required fields
    if (!name || !address || income === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, address and income are required"
      });
    }

    // Validate income
    if (Number(income) < 0 || Number.isNaN(Number(income))) {
      return res.status(400).json({
        success: false,
        message: "Income must be a valid non-negative number"
      });
    }

    // Generate application ID
    const applicationId =
      `WEL-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

    // Save to MongoDB
    const application = await WelfareApplication.create({
      applicationId,
      name,
      address,
      income: Number(income),
      schemeName: schemeName || "Jan Kalyan DBT Scheme",
      citizenId: citizenId || "CITIZEN-1001",
      status: "SUBMITTED"
    });

    // Also register in unified Application tracking
    try {
      await Application.create({
        applicationId,
        citizenId: citizenId || "CITIZEN-1001",
        service: "welfare",
        status: "SUBMITTED",
        submittedData: {
          name,
          address,
          income: Number(income),
          schemeName: schemeName || "Jan Kalyan DBT Scheme"
        }
      });
    } catch (e) {
      // Ignore duplicate
    }

    res.status(201).json({
      success: true,
      service: "Welfare Scheme",
      message: "Welfare application submitted successfully",

      application: {
        applicationId: application.applicationId,
        name: application.name,
        address: application.address,
        income: application.income,
        schemeName: application.schemeName,
        status: application.status,
        createdAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("Welfare application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit welfare application",
      error: error.message
    });
  }
});


// ========================================
// Get All Welfare Applications
// ========================================

router.get("/applications", async (req, res) => {
  try {
    const applications = await WelfareApplication
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error("Fetch welfare applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch welfare applications"
    });
  }
});

router.get("/applications/citizen/:citizenId", async (req, res) => {
  const applications = await WelfareApplication.find({ citizenId: req.params.citizenId }).sort({ createdAt: -1 });
  res.json({ success: true, count: applications.length, applications });
});

router.post("/applications/:applicationId/status", async (req, res) => {
  const allowed = ["SUBMITTED", "UNDER_VERIFICATION", "PROCESSING", "APPROVED", "REJECTED", "DBT_INITIATED", "COMPLETED"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid application status" });
  const application = await WelfareApplication.findOneAndUpdate({ applicationId: req.params.applicationId }, { status: req.body.status }, { new: true });
  if (!application) return res.status(404).json({ success: false, message: "Application not found" });
  await Application.findOneAndUpdate({ applicationId: application.applicationId }, { status: application.status });
  res.json({ success: true, application });
});

router.get("/dbt/:applicationId", async (req, res) => {
  const application = await WelfareApplication.findOne({ applicationId: req.params.applicationId });
  if (!application) return res.status(404).json({ success: false, message: "Application not found" });
  res.json({ success: true, dbt: { applicationId: application.applicationId, beneficiary: application.name, schemeName: application.schemeName, amount: 15000, status: application.status === "APPROVED" || application.status === "DBT_INITIATED" || application.status === "COMPLETED" ? "TRANSFER INITIATED" : "PENDING", transactionId: `DBT-DEMO-${application.applicationId}`, paymentDate: new Date().toISOString() } });
});


// ========================================
// Get Welfare Application By ID
// ========================================

router.get("/applications/:applicationId", async (req, res) => {
  try {
    const application = await WelfareApplication.findOne({
      applicationId: req.params.applicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Welfare application not found"
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error("Fetch welfare application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch welfare application"
    });
  }
});

module.exports = router;
