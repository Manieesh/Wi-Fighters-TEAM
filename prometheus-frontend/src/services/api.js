// ======================================================
// PROMETHEUS FRONTEND API SERVICE
// Backend: http://localhost:5000
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ======================================================
// COMMON REQUEST HELPER
// ======================================================

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    let data;

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ======================================================
// HEALTH CHECK
// ======================================================

export const checkHealth = async () => {
  return request("/health");
};

// ======================================================
// VOTER ID
// ======================================================

export const submitVoterApplication = async (applicationData) => {
  return request("/voter/applications", {
    method: "POST",
    body: JSON.stringify(applicationData)
  });
};

// ======================================================
// DRIVING LICENCE / RTO
// ======================================================

export const submitRTOApplication = async (applicationData) => {
  return request("/rto/applications", {
    method: "POST",
    body: JSON.stringify(applicationData)
  });
};

// ======================================================
// WELFARE SCHEME
// ======================================================

export const submitWelfareApplication = async (applicationData) => {
  return request("/welfare/applications", {
    method: "POST",
    body: JSON.stringify(applicationData)
  });
};

// ======================================================
// CONSENT
// ======================================================

export const giveConsent = async (consentData) => {
  return request("/consent", {
    method: "POST",
    body: JSON.stringify(consentData)
  });
};

export const checkConsent = async (citizenId, service) => {
  return request(
    `/consent/${encodeURIComponent(citizenId)}/${encodeURIComponent(service)}`
  );
};

export const getAllConsents = async () => {
  return request("/consent");
};

// ======================================================
// PROMETHEUS INTEGRATION GATEWAY
// ======================================================

export const integrateApplication = async ({
  citizenId,
  service,
  citizenData
}) => {
  return request("/integrate", {
    method: "POST",
    body: JSON.stringify({
      citizenId,
      service,
      citizenData
    })
  });
};

export const getPrefillData = async (service, citizenId) => {
  return request(`/integrate/prefill/${encodeURIComponent(service)}/${encodeURIComponent(citizenId)}`);
};

export const createRtoHandoff = async (citizenId) => {
  return request("/integrate/handoff", {
    method: "POST",
    body: JSON.stringify({ citizenId, service: "rto" })
  });
};

// ======================================================
// APPLICATION TRACKING
// ======================================================

// Get one application
export const getApplicationById = async (applicationId) => {
  return request(
    `/applications/${encodeURIComponent(applicationId)}`
  );
};

// Get all applications
export const getAllApplications = async () => {
  return request("/applications");
};

// Get applications belonging to one citizen
export const getCitizenApplications = async (citizenId) => {
  return request(
    `/applications/citizen/${encodeURIComponent(citizenId)}`
  );
};

// ======================================================
// CITIZEN DEVELOPMENT REQUESTS
// ======================================================

export const createDevelopmentRequest = async (requestData) => {
  return request("/requests", {
    method: "POST",
    body: JSON.stringify(requestData)
  });
};

export const getDevelopmentRequests = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return request(`/requests${query ? `?${query}` : ""}`);
};

export const getDevelopmentRequest = async (requestId) => {
  return request(`/requests/${encodeURIComponent(requestId)}`);
};

export const analyzeDevelopmentRequest = async (requestId) => {
  return request(`/requests/${encodeURIComponent(requestId)}/analyze`, { method: "POST" });
};

// ======================================================
// CITIZEN PROFILE
// ======================================================

// Get citizen profile
export const getCitizenProfile = async (citizenId) => {
  return request(
    `/profile/${encodeURIComponent(citizenId)}`
  );
};

// Create / update citizen profile
export const saveCitizenProfile = async (profileData) => {
  return request("/profile", {
    method: "POST",
    body: JSON.stringify(profileData)
  });
};

// ======================================================
// AUDIT LOG & COMPLIANCE
// ======================================================

export const getAuditLogs = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return request(`/audit${query ? `?${query}` : ""}`);
};

export const recordAuditLog = async (logData) => {
  return request("/audit", {
    method: "POST",
    body: JSON.stringify(logData)
  });
};

// ======================================================
// API GATEWAY MONITOR & RESILIENCE
// ======================================================

export const getGatewayStatus = async () => {
  return request("/gateway/status");
};

export const simulateGatewayRecovery = async (payload = {}) => {
  return request("/gateway/simulate-recovery", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

// Revoke citizen consent
export const revokeConsent = async (citizenId, service, reason = "Citizen requested data revocation") => {
  return request("/consent/revoke", {
    method: "POST",
    body: JSON.stringify({ citizenId, service, reason })
  });
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  checkHealth,

  // Services
  submitVoterApplication,
  submitRTOApplication,
  submitWelfareApplication,

  // Consent
  giveConsent,
  revokeConsent,
  checkConsent,
  getAllConsents,

  // Integration
  integrateApplication,
  getPrefillData,
  createRtoHandoff,

  // Applications
  getAllApplications,
  getApplicationById,
  getCitizenApplications,
  createDevelopmentRequest,
  getDevelopmentRequests,
  getDevelopmentRequest,
  analyzeDevelopmentRequest,

  // Profile
  getCitizenProfile,
  saveCitizenProfile,

  // Audit & Gateway
  getAuditLogs,
  recordAuditLog,
  getGatewayStatus,
  simulateGatewayRecovery
};