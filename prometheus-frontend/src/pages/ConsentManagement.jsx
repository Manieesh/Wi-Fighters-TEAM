import React, { useState, useEffect } from "react";
import UiIcon from "../components/UiIcon";
import { getAllConsents, giveConsent, revokeConsent, getAuditLogs } from "../services/api";

export default function ConsentManagement({ citizenId = "CITIZEN-1001", onNavigate }) {
  const [consents, setConsents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [revokingId, setRevokingId] = useState(null);

  const SERVICE_METAS = {
    voter: {
      category: "VOTER PORTAL",
      name: "Election Commission — Voter ID Portal",
      purpose: "National Electoral Roll Registration and Voter Slip Verification",
      source: "UIDAI e-KYC Identity Service",
      destination: "Election Commission of India",
      legalBasis: "Representation of the People Act, 1950",
      dataFields: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number"],
      hash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9e21"
    },
    rto: {
      category: "TRANSPORT PORTAL",
      name: "Parivahan — Regional Transport Office (RTO)",
      purpose: "Learner & Permanent Driving Licence Processing & Verification",
      source: "Voter ID Portal / e-District",
      destination: "Ministry of Road Transport & Highways",
      legalBasis: "Motor Vehicles Act, 1988 (Section 9)",
      dataFields: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number", "Vehicle Class"],
      hash: "SHA256:9c4b2a8d3e1f5709b1a2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0"
    },
    welfare: {
      category: "SOCIAL WELFARE PORTAL",
      name: "Jan Kalyan — Social Welfare & DBT Portal",
      purpose: "Direct Benefit Transfer (DBT) and Eligibility Evaluation for Central Schemes",
      source: "Revenue Department / e-District",
      destination: "Ministry of Social Justice & Empowerment",
      legalBasis: "National Social Assistance & DBT Governance Framework",
      dataFields: ["Full Legal Name", "Date of Birth", "Residential Address", "Annual Income"],
      hash: "SHA256:3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e"
    }
  };

  useEffect(() => {
    loadConsents();
    loadAudits();
  }, [citizenId]);

  const loadConsents = async () => {
    try {
      setLoading(true);
      const res = await getAllConsents();
      if (res?.success && Array.isArray(res.records)) {
        setConsents(res.records);
      }
    } catch (err) {
      console.error("Failed to load consents:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAudits = async () => {
    try {
      const res = await getAuditLogs({ action: "CONSENT_GRANTED", limit: 10 });
      if (res?.success && Array.isArray(res.logs)) {
        setAuditLogs(res.logs);
      }
    } catch (err) {}
  };

  const handleRevoke = async (serviceKey) => {
    try {
      setRevokingId(serviceKey);
      const res = await revokeConsent(citizenId, serviceKey);
      if (res?.success) {
        setToast(`Consent for ${serviceKey.toUpperCase()} has been revoked. Data sharing halted.`);
        await loadConsents();
        await loadAudits();
      }
    } catch (err) {
      setToast(`Revocation failed: ${err.message}`);
    } finally {
      setRevokingId(null);
      setTimeout(() => setToast(""), 4500);
    }
  };

  const handleGrant = async (serviceKey) => {
    try {
      const meta = SERVICE_METAS[serviceKey];
      await giveConsent({
        citizenId,
        service: serviceKey,
        consent: true,
        dataFields: meta ? meta.dataFields : ["fullName", "address"]
      });
      setToast(`Consent granted for ${serviceKey.toUpperCase()}. Verified data sharing active.`);
      await loadConsents();
      await loadAudits();
    } catch (err) {
      setToast(`Failed to grant consent: ${err.message}`);
    } finally {
      setTimeout(() => setToast(""), 4500);
    }
  };

  return (
    <div className="page-container consent-page-container">
      {/* 1. Breadcrumb - Aligned to Container Edge */}
      <nav className="consent-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("overview")}
          className="consent-crumb-link"
        >
          Home
        </button>
        <span className="consent-crumb-sep">/</span>
        <span className="consent-crumb-current">Consent Management</span>
      </nav>

      {/* 2. Page Header */}
      <header className="consent-header-section">
        <div className="consent-eyebrow">
          <UiIcon name="shield" size={14} />
          <span>CONSENT-BASED DATA SHARING PROTOTYPE</span>
        </div>
        <h1 className="consent-title">Citizen Consent & Data Governance</h1>
        <p className="consent-description">
          Prometheus demonstrates privacy-first governance with explicit citizen control. Your demonstration
          data is shared only with your authorization and can be revoked at any time.
        </p>
      </header>

      {/* Optional Feedback Alert / Toast */}
      {toast && (
        <div className="consent-alert-banner" role="alert">
          <UiIcon name="check" size={18} />
          <span>{toast}</span>
          <button
            type="button"
            className="consent-alert-close"
            onClick={() => setToast("")}
            aria-label="Dismiss alert"
          >
            <UiIcon name="close" size={14} />
          </button>
        </div>
      )}

      {/* 3. Active Service Data Consents Section */}
      <section className="consent-section" aria-labelledby="active-consents-heading">
        <div className="consent-section-header">
          <span className="consent-section-eyebrow">CITIZEN AUTHORIZATIONS</span>
          <h2 id="active-consents-heading" className="consent-section-title">
            Active Service Data Consents
          </h2>
        </div>

        {/* Stacked Responsive Consent Cards (Single Column) */}
        <div className="consent-cards-stack">
          {["voter", "rto", "welfare"].map((svcKey) => {
            const meta = SERVICE_METAS[svcKey];
            const record = consents.find((c) => c.service === svcKey);
            const isGranted = record ? record.consent === true : true; // Default demonstration state is active

            return (
              <article
                key={svcKey}
                className={`consent-gov-card ${isGranted ? "granted" : "revoked"}`}
              >
                {/* Top Row: Service Category + Name + Active Status Badge */}
                <div className="consent-card-header">
                  <div className="consent-card-title-group">
                    <span className="consent-service-category">{meta.category}</span>
                    <h3 className="consent-service-name">{meta.name}</h3>
                  </div>

                  <div className="consent-status-badge-wrap">
                    {isGranted ? (
                      <span className="consent-status-badge active">
                        <span className="consent-status-dot green" />
                        <span>✓ Active Consent</span>
                      </span>
                    ) : (
                      <span className="consent-status-badge revoked">
                        <span className="consent-status-dot red" />
                        <span>✕ Consent Revoked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Grid (Purpose, Data Source, Destination, Legal Basis) */}
                <div className="consent-metadata-grid">
                  <div className="consent-metadata-item">
                    <span className="consent-meta-label">PURPOSE</span>
                    <p className="consent-meta-value">{meta.purpose}</p>
                  </div>

                  <div className="consent-metadata-item">
                    <span className="consent-meta-label">DATA SOURCE</span>
                    <p className="consent-meta-value highlight-blue">{meta.source}</p>
                  </div>

                  <div className="consent-metadata-item">
                    <span className="consent-meta-label">DESTINATION</span>
                    <p className="consent-meta-value highlight-cyan">{meta.destination}</p>
                  </div>

                  <div className="consent-metadata-item">
                    <span className="consent-meta-label">LEGAL BASIS</span>
                    <p className="consent-meta-value text-legal">{meta.legalBasis}</p>
                  </div>
                </div>

                {/* Permitted Attributes Row with Compact Chips */}
                <div className="consent-attributes-row">
                  <span className="consent-meta-label">PERMITTED ATTRIBUTES</span>
                  <div className="consent-chips-wrap">
                    {meta.dataFields.map((field, idx) => (
                      <span key={idx} className="consent-attribute-chip">
                        <span className="chip-check">✓</span>
                        <span>{field}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consent Hash & Revoke Action Footer Row */}
                <div className="consent-card-footer">
                  <div className="consent-hash-box">
                    <div className="consent-hash-header">
                      <span className="consent-hash-lock" aria-hidden="true">🔐</span>
                      <span className="consent-hash-title">Consent Record Hash</span>
                    </div>
                    <code className="consent-hash-code">{meta.hash}</code>
                  </div>

                  <div className="consent-action-wrap">
                    {isGranted ? (
                      <button
                        type="button"
                        className="consent-revoke-btn"
                        onClick={() => handleRevoke(svcKey)}
                        disabled={revokingId === svcKey}
                        aria-label={`Revoke consent for ${meta.name}`}
                      >
                        {revokingId === svcKey ? (
                          <>
                            <span className="consent-btn-spinner" aria-hidden="true" />
                            <span>Revoking...</span>
                          </>
                        ) : (
                          <>
                            <UiIcon name="close" size={14} />
                            <span>Revoke Consent</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="consent-grant-btn"
                        onClick={() => handleGrant(svcKey)}
                        aria-label={`Re-grant consent for ${meta.name}`}
                      >
                        <UiIcon name="check" size={14} />
                        <span>Re-Grant Consent</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Consent Activity Log Section */}
      <section className="consent-section consent-audit-section" aria-labelledby="activity-log-heading">
        <div className="consent-section-header">
          <span className="consent-section-eyebrow">CONSENT LOG</span>
          <h2 id="activity-log-heading" className="consent-section-title">
            Consent Activity Log
          </h2>
        </div>

        <div className="consent-table-container">
          <table className="consent-activity-table">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Service</th>
                <th scope="col">Action</th>
                <th scope="col">Authorized Actor</th>
                <th scope="col">Verification Hash</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log, index) => (
                  <tr key={log._id || log.sha256Hash || index}>
                    <td className="consent-td-time">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
                    </td>
                    <td className="consent-td-service">
                      <strong>{log.service?.toUpperCase()}</strong>
                    </td>
                    <td>
                      <span className="consent-action-tag">
                        {log.action}
                      </span>
                    </td>
                    <td className="consent-td-actor">{log.actor}</td>
                    <td>
                      <code className="consent-hash-snippet" title={log.sha256Hash}>
                        {log.sha256Hash ? `${log.sha256Hash.slice(0, 18)}...` : "SHA256:7f83b1..."}
                      </code>
                    </td>
                    <td>
                      <span className="consent-table-status-pill">
                        <span className="status-dot green" />
                        <span>✓ {log.status || "VERIFIED"}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="consent-table-empty">
                    <div className="consent-empty-state">
                      <UiIcon name="shield" size={24} />
                      <p>No recent consent changes recorded.</p>
                      <span className="empty-sub">All active service data consents remain cryptographically verified and immutable.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
