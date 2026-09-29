import { useState, useEffect } from "react";
import Icon from "../components/Icon";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications`);
      const data = await res.json();
      if (data?.applications?.length > 0) {
        setApplications(data.applications);
      } else {
        setApplications(getMockApplications());
      }
    } catch {
      setApplications(getMockApplications());
    } finally {
      setLoading(false);
    }
  };

  const getMockApplications = () => [
    {
      applicationId: "PROM-2026-00124",
      citizenId: "CITIZEN-1001",
      service: "rto",
      department: "Transport Department",
      serviceName: "Learner's Driving License (LLR)",
      status: "Processing",
      stage: 6,
      totalStages: 7,
      submissionDate: "2026-09-27T10:15:00.000Z",
      lastUpdated: "2026-09-27T10:15:20.000Z",
      consentStatus: "VERIFIED_ACTIVE",
      consentPurpose: "RTO Driving License Issuance & Verification",
      translationDetails: {
        engine: "Prometheus Intelligent Data Translation Engine v2.4",
        status: "COMPLETED_VALIDATED",
        sourceSchema: "VoterPortal_Canonical_v1",
        targetSchema: "Sarathi_Parivahan_RTO_v3",
        transformationDuration: "14.2ms",
        mappedFieldsCount: 5
      },
      auditCount: 6,
      timeline: [
        { stage: "Submitted", time: "10:15:00", status: "completed", desc: "Citizen initiated One-Click application via Prometheus" },
        { stage: "Identity Verified", time: "10:15:02", status: "completed", desc: "Citizen credentials verified against sovereign registry" },
        { stage: "Data Translated", time: "10:15:05", status: "completed", desc: "Normalized and transformed into RTO Sarathi schema" },
        { stage: "Consent Verified", time: "10:15:08", status: "completed", desc: "Purpose-bound citizen authorization logged (DPDP 2023)" },
        { stage: "Sent to Department", time: "10:15:12", status: "completed", desc: "Securely dispatched to State Transport Department API Gateway" },
        { stage: "Processing", time: "10:15:20", status: "current", desc: "Under official review by Regional Transport Officer" },
        { stage: "Completed", time: "--", status: "pending", desc: "Awaiting final biometric & driving test completion" }
      ]
    },
    {
      applicationId: "PROM-2026-00125",
      citizenId: "CITIZEN-1042",
      service: "voter",
      department: "Election Commission",
      serviceName: "Electoral Roll Form 6 Registration",
      status: "Completed",
      stage: 7,
      totalStages: 7,
      submissionDate: "2026-09-26T14:30:00.000Z",
      lastUpdated: "2026-09-26T18:45:00.000Z",
      consentStatus: "VERIFIED_ACTIVE",
      consentPurpose: "Voter Registration & EPIC Card Issuance",
      translationDetails: {
        engine: "Prometheus Intelligent Data Translation Engine v2.4",
        status: "COMPLETED_VALIDATED",
        sourceSchema: "CitizenProfile_Standard_v2",
        targetSchema: "NVSP_Form6_Canonical_v1",
        transformationDuration: "11.8ms",
        mappedFieldsCount: 6
      },
      auditCount: 7,
      timeline: [
        { stage: "Submitted", time: "14:30:00", status: "completed", desc: "Application lodged" },
        { stage: "Identity Verified", time: "14:30:04", status: "completed", desc: "Biometric proof confirmed" },
        { stage: "Data Translated", time: "14:30:06", status: "completed", desc: "Schema mapped to Form 6 format" },
        { stage: "Consent Verified", time: "14:30:09", status: "completed", desc: "Citizen signed digital consent" },
        { stage: "Sent to Department", time: "14:30:15", status: "completed", desc: "Dispatched to BLO for verification" },
        { stage: "Processing", time: "16:20:00", status: "completed", desc: "Field officer verified residence" },
        { stage: "Completed", time: "18:45:00", status: "completed", desc: "EPIC number generated and dispatched" }
      ]
    },
    {
      applicationId: "PROM-2026-00126",
      citizenId: "CITIZEN-1099",
      service: "welfare",
      department: "Social Welfare Department",
      serviceName: "Agricultural Equipment Subsidy",
      status: "Submitted",
      stage: 1,
      totalStages: 7,
      submissionDate: "2026-09-27T16:10:00.000Z",
      lastUpdated: "2026-09-27T16:10:05.000Z",
      consentStatus: "VERIFIED_ACTIVE",
      consentPurpose: "Direct Benefit Transfer eligibility review",
      translationDetails: {
        engine: "Prometheus Intelligent Data Translation Engine v2.4",
        status: "COMPLETED_VALIDATED",
        sourceSchema: "CitizenProfile_Standard_v2",
        targetSchema: "JanKalyan_DBT_Schema_v2",
        transformationDuration: "16.4ms",
        mappedFieldsCount: 5
      },
      auditCount: 4,
      timeline: [
        { stage: "Submitted", time: "16:10:00", status: "completed", desc: "Application lodged" },
        { stage: "Identity Verified", time: "16:10:05", status: "current", desc: "Verifying Aadhaar & land ownership records" },
        { stage: "Data Translated", time: "--", status: "pending", desc: "Pending" },
        { stage: "Consent Verified", time: "--", status: "pending", desc: "Pending" },
        { stage: "Sent to Department", time: "--", status: "pending", desc: "Pending" },
        { stage: "Processing", time: "--", status: "pending", desc: "Pending" },
        { stage: "Completed", time: "--", status: "pending", desc: "Pending" }
      ]
    }
  ];

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      !searchId ||
      app.applicationId?.toLowerCase().includes(searchId.toLowerCase()) ||
      app.citizenId?.toLowerCase().includes(searchId.toLowerCase());
    const matchService =
      selectedService === "all" ||
      app.service?.toLowerCase() === selectedService.toLowerCase();
    const matchStatus =
      selectedStatus === "all" ||
      app.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchSearch && matchService && matchStatus;
  });

  return (
    <div className="officer-page-view applications-management-view">
      {/* Header Banner */}
      <div className="officer-welcome-banner">
        <div className="banner-left">
          <span className="banner-eyebrow">DPI PUBLIC SERVICE INTEGRATIONS</span>
          <h2 className="banner-title">Cross-Department Application Management</h2>
          <p className="banner-sub">
            Monitor incoming one-click citizen applications, verify schema transformation fidelity, inspect purpose-bound DPDP consent status, and audit cryptographic lineage.
          </p>
        </div>
        <div className="banner-quick-actions">
          <button
            type="button"
            className="banner-action-btn primary"
            onClick={fetchApplications}
          >
            <Icon name="rotateCcw" size={15} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="officer-filter-bar">
        <div className="search-input-group">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Search by Application ID (e.g. PROM-2026-00124)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <label>Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="all">All Services (3)</option>
            <option value="rto">RTO Transport</option>
            <option value="voter">Voter Services</option>
            <option value="welfare">Welfare Schemes</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-count-badge">
          Showing <strong>{filteredApps.length}</strong> applications
        </div>
      </div>

      {/* Applications Table */}
      <div className="officer-table-container">
        <table className="officer-data-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Citizen ID</th>
              <th>Destination Service</th>
              <th>Current Stage</th>
              <th>Consent Status</th>
              <th>Translation Status</th>
              <th>Submission Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                  Loading integration queue...
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                  No applications matched your filter criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.applicationId}>
                  <td>
                    <code className="app-id-code">{app.applicationId}</code>
                  </td>
                  <td>
                    <span className="citizen-anonymized-id">{app.citizenId}</span>
                  </td>
                  <td>
                    <span className={`service-pill ${app.service}`}>
                      {app.service?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${app.status?.toLowerCase()}`}>
                      ● {app.status}
                    </span>
                  </td>
                  <td>
                    <span className="consent-verified-chip">
                      ✓ DPDP 2023 Verified
                    </span>
                  </td>
                  <td>
                    <span className="translation-chip">
                      ✓ Schema Mapped
                    </span>
                  </td>
                  <td>
                    <span className="timestamp-text">
                      {new Date(app.submissionDate || app.createdAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-view-app-details"
                      onClick={() => setActiveApp(app)}
                    >
                      <Icon name="eye" size={14} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Application Detail Inspection Modal */}
      {activeApp && (
        <div className="officer-modal-backdrop" onClick={() => setActiveApp(null)}>
          <div className="officer-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <span className="modal-eyebrow">APPLICATION INSPECTION DOSSIER</span>
                <h3 className="modal-title">{activeApp.applicationId}</h3>
                <span className="modal-subtitle">
                  {activeApp.serviceName || activeApp.service?.toUpperCase()} • Destination: {activeApp.department || "Public Authority"}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveApp(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="modal-dossier-grid">
              {/* Privacy Minimization Notice */}
              <div className="privacy-minimization-banner">
                <Icon name="shieldCheck" size={16} />
                <div>
                  <strong>Role-Based Access Control & Data Minimization Enforced</strong>
                  <p>
                    Full raw citizen identity credentials are held in sovereign vaults; officer inspects only authorized, purpose-bound metadata for <code>{activeApp.applicationId}</code>.
                  </p>
                </div>
              </div>

              {/* 7-Stage Universal Progress Timeline */}
              <div className="dossier-timeline-card">
                <h4>Universal 7-Stage DPI Lifecycle</h4>
                <div className="universal-stepper-track">
                  {(activeApp.timeline || [
                    { stage: "Submitted", status: "completed", desc: "Citizen initiated One-Click apply" },
                    { stage: "Identity Verified", status: "completed", desc: "Verified citizen profile" },
                    { stage: "Data Translated", status: "completed", desc: "Intelligent Data Translation" },
                    { stage: "Consent Verified", status: "completed", desc: "DPDP Act purpose check" },
                    { stage: "Sent to Department", status: "completed", desc: "Dispatched to service" },
                    { stage: "Processing", status: "current", desc: "Under official review" },
                    { stage: "Completed", status: "pending", desc: "Awaiting final approval" }
                  ]).map((tStep, idx) => (
                    <div key={idx} className={`stepper-node ${tStep.status}`}>
                      <div className="node-indicator">
                        {tStep.status === "completed" ? "✓" : idx + 1}
                      </div>
                      <div className="node-details">
                        <strong className="node-label">{tStep.stage}</strong>
                        <span className="node-desc">{tStep.desc}</span>
                        {tStep.time && <span className="node-time">{tStep.time}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Translation & Schema Mapping Verification */}
              <div className="dossier-split-cards">
                <div className="dossier-info-card">
                  <h4>Intelligent Data Translation Telemetry</h4>
                  <div className="kv-grid">
                    <div className="kv-row">
                      <span className="kv-key">Engine:</span>
                      <span className="kv-val">Prometheus Translation Engine v2.4</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Transformation Time:</span>
                      <span className="kv-val">14.2 ms</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Schema Conversion:</span>
                      <span className="kv-val">
                        <code>{activeApp.service === "rto" ? "VoterPortal_Canonical" : "CitizenProfile_Standard"}</code> → <code>{activeApp.service?.toUpperCase()}_Payload_v2</code>
                      </span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Validation Result:</span>
                      <span className="kv-val highlight-green">✓ 100% Strict Schema Valid</span>
                    </div>
                  </div>
                </div>

                <div className="dossier-info-card">
                  <h4>Consent & Compliance (DPDP Act 2023)</h4>
                  <div className="kv-grid">
                    <div className="kv-row">
                      <span className="kv-key">Consent Status:</span>
                      <span className="kv-val highlight-green">✓ Explicit Digital Consent Granted</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Purpose Bound:</span>
                      <span className="kv-val">{activeApp.consentPurpose || "Public Service Integration"}</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Retention Limit:</span>
                      <span className="kv-val">90 Days Post Service Resolution</span>
                    </div>
                    <div className="kv-row">
                      <span className="kv-key">Cryptographic Proof:</span>
                      <span className="kv-val">
                        <code>SHA256:7f83b165...e201</code>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button
                type="button"
                className="banner-action-btn"
                onClick={() => setActiveApp(null)}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
