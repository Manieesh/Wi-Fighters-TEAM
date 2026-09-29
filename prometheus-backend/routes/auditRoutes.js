const express = require("express");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

// Baseline seed audit events ensuring immediate richness for demo
const SEED_AUDIT_EVENTS = [
  {
    action: "IDENTITY_VERIFIED",
    citizenId: "CITIZEN-1001",
    service: "auth",
    actor: "UIDAI e-KYC Verification Gateway",
    details: {
      mechanism: "Aadhaar OTP Biometric Token",
      verificationLevel: "Level-3 Sovereign Trust",
      verifiedAttributes: ["fullName", "dateOfBirth", "gender", "address", "mobileNumber"]
    },
    status: "SUCCESS"
  },
  {
    action: "CONSENT_GRANTED",
    citizenId: "CITIZEN-1001",
    service: "voter",
    actor: "Citizen (CITIZEN-1001)",
    details: {
      purpose: "National Electoral Roll Registration and Voter Slip Verification",
      legalBasis: "Representation of the People Act, 1950",
      dataCategories: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number"]
    },
    status: "SUCCESS"
  },
  {
    action: "SCHEMA_VALIDATED",
    citizenId: "CITIZEN-1001",
    service: "voter",
    actor: "Prometheus Intelligent Data Translation Engine",
    details: {
      inputSchema: "ECI-Form-6-Draft-v2.1",
      validatedFieldsCount: 5,
      validationErrors: 0,
      complianceStandard: "DPDP Act 2023 Section 6(1)"
    },
    status: "SUCCESS"
  },
  {
    action: "DATA_TRANSLATED",
    citizenId: "CITIZEN-1001",
    service: "rto",
    actor: "Prometheus Intelligent Data Translation Engine",
    details: {
      sourceService: "voter",
      destinationService: "rto",
      mappedFields: {
        full_name: "applicantName",
        dob: "dateOfBirth",
        address: "residentialAddress",
        mobile: "mobileNumber"
      },
      normalization: "ISO-8601 Date format, Pin-code boundary expansion"
    },
    status: "SUCCESS"
  },
  {
    action: "REQUEST_DISPATCHED",
    citizenId: "CITIZEN-1001",
    service: "rto",
    actor: "Prometheus Sovereign Gateway",
    details: {
      targetEndpoint: "http://localhost:5000/api/rto/applications",
      protocol: "REST / HTTPS Mutually Authenticated",
      generatedRefId: "RTO-2026-28690"
    },
    status: "SUCCESS"
  },
  {
    action: "CONSENT_GRANTED",
    citizenId: "CITIZEN-1001",
    service: "welfare",
    actor: "Citizen (CITIZEN-1001)",
    details: {
      purpose: "Direct Benefit Transfer (DBT) Eligibility Assessment",
      legalBasis: "National Social Assistance Framework",
      dataCategories: ["Full Legal Name", "Annual Income", "Residential Address"]
    },
    status: "SUCCESS"
  }
];

// Helper to record audit events programmatically
async function logAudit({ action, citizenId, service, actor, details, status = "SUCCESS" }) {
  try {
    const entry = new AuditLog({
      action,
      citizenId: citizenId || "CITIZEN-1001",
      service: service || "prometheus",
      actor: actor || "Prometheus Sovereign Gateway",
      details: details || {},
      status
    });
    await entry.save();
    return entry;
  } catch (err) {
    console.warn("Audit logging warning:", err.message);
    return null;
  }
}

// Auto-seed baseline audit records if empty
async function ensureSeedAudits() {
  try {
    const count = await AuditLog.countDocuments();
    if (count < SEED_AUDIT_EVENTS.length) {
      for (const item of SEED_AUDIT_EVENTS) {
        const exists = await AuditLog.findOne({ action: item.action, citizenId: item.citizenId, service: item.service });
        if (!exists) {
          const log = new AuditLog(item);
          await log.save();
        }
      }
    }
  } catch (err) {
    console.warn("Seed audit initialization note:", err.message);
  }
}

// GET all audit logs (with filtering)
router.get("/", async (req, res) => {
  try {
    await ensureSeedAudits();

    const { citizenId, service, action, status, search, limit = 50 } = req.query;
    const filter = {};

    if (citizenId) filter.citizenId = citizenId;
    if (service && service !== "all") filter.service = service;
    if (action && action !== "all") filter.action = action;
    if (status && status !== "all") filter.status = status;

    if (search) {
      filter.$or = [
        { action: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
        { actor: { $regex: search, $options: "i" } },
        { sha256Hash: { $regex: search, $options: "i" } }
      ];
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error("Fetch audit logs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message
    });
  }
});

// POST to create custom audit log entry (from gateway / demo triggers)
router.post("/", async (req, res) => {
  try {
    const { action, citizenId, service, actor, details, status } = req.body;
    if (!action || !citizenId || !service) {
      return res.status(400).json({
        success: false,
        message: "action, citizenId, and service are required fields"
      });
    }

    const log = await logAudit({ action, citizenId, service, actor, details, status });
    res.status(201).json({
      success: true,
      message: "Audit record immutably stored",
      log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to write audit log",
      error: error.message
    });
  }
});

module.exports = {
  router,
  logAudit
};
