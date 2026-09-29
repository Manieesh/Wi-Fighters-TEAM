const express = require("express");
const axios = require("axios");
const { logAudit } = require("./auditRoutes");

const router = express.Router();

const startTime = Date.now();

const getSelfBase = () => {
  if (process.env.PROMETHEUS_BACKEND_URL) return process.env.PROMETHEUS_BACKEND_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 5000}`;
};

const getServices = () => {
  const selfBase = getSelfBase();
  const rtoEndpoint = process.env.RTO_BACKEND_URL 
    ? `${process.env.RTO_BACKEND_URL.replace(/\/$/, "")}/api/health` 
    : `${selfBase}/api/rto/applications`;

  return [
    { id: "voter", name: "Voter ID Service", endpoint: `${selfBase}/api/voter/applications`, type: "Core Sovereign API" },
    { id: "rto", name: "RTO Transport Service", endpoint: rtoEndpoint, type: "Core Departmental API" },
    { id: "welfare", name: "Social Welfare & DBT Service", endpoint: `${selfBase}/api/welfare/applications`, type: "Core Beneficiary API" },
    { id: "translate", name: "Intelligent Data Translation Engine", endpoint: `${selfBase}/api/health`, type: "Internal Transformation Engine" },
    { id: "consent", name: "DPDP Consent Service", endpoint: `${selfBase}/api/consent`, type: "Privacy & Compliance Gateway" },
    { id: "profile", name: "Citizen Identity & Profile Service", endpoint: `${selfBase}/api/profile/CITIZEN-1001`, type: "Verified Citizen Registry" }
  ];
};

// In-memory counter for demo request telemetry
const gatewayMetrics = {
  totalRequests: 1428,
  successfulRequests: 1412,
  failedRequests: 16,
  retryCount: 23,
  translationsCount: 894
};

// Ping individual endpoint and measure latency
async function pingService(svc) {
  const start = Date.now();
  try {
    const res = await axios.get(svc.endpoint, { timeout: 3000 });
    const latency = Date.now() - start;
    return {
      id: svc.id,
      name: svc.name,
      type: svc.type,
      status: "Healthy",
      latencyMs: latency,
      httpStatus: res.status,
      lastChecked: new Date().toISOString()
    };
  } catch (err) {
    const latency = Date.now() - start;
    // Even if method is not allowed or 404, server is responding and alive
    const isResponding = err.response && err.response.status < 500;
    return {
      id: svc.id,
      name: svc.name,
      type: svc.type,
      status: isResponding ? "Healthy" : "Degraded",
      latencyMs: latency || 12,
      httpStatus: err.response ? err.response.status : 503,
      lastChecked: new Date().toISOString()
    };
  }
}

// GET Gateway Status Monitor
router.get("/status", async (req, res) => {
  try {
    const serviceHealth = await Promise.all(getServices().map(pingService));
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    gatewayMetrics.totalRequests += 1;
    gatewayMetrics.successfulRequests += 1;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      overallStatus: serviceHealth.every((s) => s.status === "Healthy") ? "Optimal" : "Degraded",
      services: serviceHealth,
      metrics: {
        ...gatewayMetrics,
        successRate: ((gatewayMetrics.successfulRequests / gatewayMetrics.totalRequests) * 100).toFixed(2) + "%",
        averageLatencyMs: Math.round(serviceHealth.reduce((acc, s) => acc + s.latencyMs, 0) / serviceHealth.length)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gateway monitor evaluation failed",
      error: error.message
    });
  }
});

// POST Controlled Failure and Recovery Simulation
router.post("/simulate-recovery", async (req, res) => {
  try {
    const { service = "rto", citizenId = "CITIZEN-1001", citizenData } = req.body;

    const stages = [];
    const timestamp0 = new Date();

    // 1. Initial request arrival
    stages.push({
      step: 1,
      title: "Request Received at Prometheus Gateway",
      description: `Payload received for target service: ${service.toUpperCase()}`,
      status: "SUCCESS",
      timestamp: timestamp0.toLocaleTimeString()
    });

    // 2. Simulated Downstream Failure
    stages.push({
      step: 2,
      title: `${service.toUpperCase()} Service Gateway Unavailable (HTTP 503)`,
      description: "Downstream regional endpoint timed out. Temporary network partitioned state detected.",
      status: "WARNING",
      timestamp: new Date(timestamp0.getTime() + 400).toLocaleTimeString()
    });

    // 3. Resilient Buffer Queuing
    stages.push({
      step: 3,
      title: "Prometheus Resilient Dead-Letter Buffer Activated",
      description: "Citizen payload safely isolated in encrypted queue. Zero data loss guaranteed by DPDP Act 2023 compliance.",
      status: "SUCCESS",
      timestamp: new Date(timestamp0.getTime() + 650).toLocaleTimeString()
    });

    // 4. Retry Mechanism with Exponential Backoff
    stages.push({
      step: 4,
      title: "Circuit Breaker Backoff Retry (Attempt 1 / 3)",
      description: "Transmitting ping verification probe to target gateway with 800ms backoff interval...",
      status: "SUCCESS",
      timestamp: new Date(timestamp0.getTime() + 1450).toLocaleTimeString()
    });

    // 5. Downstream Target Reconnected
    stages.push({
      step: 5,
      title: `${service.toUpperCase()} Service Healthy & Restored`,
      description: "Health handshake acknowledged (HTTP 200 OK). Queue drain initiated.",
      status: "SUCCESS",
      timestamp: new Date(timestamp0.getTime() + 2100).toLocaleTimeString()
    });

    // 6. Final Payload Dispatch
    const generatedId = `${service.toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    stages.push({
      step: 6,
      title: "Payload Dispatched & Application Registered",
      description: `Target acknowledged receipt. Official reference ID allocated: ${generatedId}`,
      status: "SUCCESS",
      timestamp: new Date(timestamp0.getTime() + 2450).toLocaleTimeString(),
      generatedId
    });

    // Record audit entry
    await logAudit({
      action: "RETRY_RECOVERED",
      citizenId,
      service,
      actor: "Prometheus Resilience Engine",
      details: {
        simulationMode: true,
        retryAttempts: 2,
        recoveredAt: new Date().toISOString(),
        allocatedRefId: generatedId
      },
      status: "SUCCESS"
    });

    gatewayMetrics.retryCount += 1;
    gatewayMetrics.totalRequests += 1;
    gatewayMetrics.successfulRequests += 1;

    res.json({
      success: true,
      message: "Resilience demonstration executed successfully",
      service,
      stages,
      applicationId: generatedId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Simulation failure",
      error: error.message
    });
  }
});

module.exports = router;
