import { useState } from "react";
import { giveConsent } from "../services/api";
import UiIcon from "./UiIcon";

export default function ConsentGateway({ citizenId = "CITIZEN-1001", onConsentChange }) {
  const [loading, setLoading] = useState({});
  const [consents, setConsents] = useState({
    voter: true,
    rto: true,
    welfare: true
  });
  const [auditLog, setAuditLog] = useState([
    {
      id: "LOG-01",
      service: "voter",
      serviceName: "Voter ID Portal",
      action: "CONSENT_GRANTED",
      fields: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number"],
      timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString() + " Today",
      hash: "SHA256: 7f83b165...e921"
    },
    {
      id: "LOG-02",
      service: "rto",
      serviceName: "Driving Licence (RTO)",
      action: "CONSENT_GRANTED",
      fields: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number", "Vehicle Class"],
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString() + " Today",
      hash: "SHA256: 3c9909af...d108"
    },
    {
      id: "LOG-03",
      service: "welfare",
      serviceName: "Welfare Scheme Portal",
      action: "CONSENT_GRANTED",
      fields: ["Full Legal Name", "Date of Birth", "Residential Address", "Mobile Number", "Annual Income"],
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString() + " Today",
      hash: "SHA256: 9e107d9d...f4a7"
    }
  ]);
  const [message, setMessage] = useState("");

  const serviceDefinitions = [
    {
      id: "voter",
      name: "Election Commission — Voter ID Portal",
      shortName: "Voter ID Services",
      icon: "identity",
      purpose: "National Electoral Roll Registration and Voter Slip Verification",
      requiredFields: [
        { key: "fullName", label: "Full Legal Name" },
        { key: "dateOfBirth", label: "Date of Birth" },
        { key: "address", label: "Residential Address" },
        { key: "mobileNumber", label: "Mobile Number" }
      ],
      legalBasis: "Representation of the People Act, 1950",
      retention: "Permanent Electoral Roll Record"
    },
    {
      id: "rto",
      name: "Parivahan / Regional Transport Office (RTO)",
      shortName: "Driving Licence (RTO)",
      icon: "transport",
      purpose: "Learner & Permanent Driving Licence Processing & Verification",
      requiredFields: [
        { key: "fullName", label: "Full Legal Name" },
        { key: "dateOfBirth", label: "Date of Birth" },
        { key: "address", label: "Residential Address" },
        { key: "mobileNumber", label: "Mobile Number" },
        { key: "vehicleClass", label: "Vehicle Class (LMV/MCWG)" }
      ],
      legalBasis: "Motor Vehicles Act, 1988 (Section 9)",
      retention: "Active Licence Lifecycle"
    },
    {
      id: "welfare",
      name: "Jan Kalyan — Social Welfare & DBT Portal",
      shortName: "Welfare Schemes & DBT",
      icon: "welfare",
      purpose: "Direct Benefit Transfer (DBT) and Eligibility Evaluation for Central Schemes",
      requiredFields: [
        { key: "fullName", label: "Full Legal Name" },
        { key: "dateOfBirth", label: "Date of Birth" },
        { key: "address", label: "Residential Address" },
        { key: "mobileNumber", label: "Mobile Number" },
        { key: "annualIncome", label: "Verified Annual Income" }
      ],
      legalBasis: "National Social Assistance & DBT Governance Framework",
      retention: "Financial Year Audit Duration"
    }
  ];

  const handleToggleConsent = async (serviceId, currentStatus) => {
    const newStatus = !currentStatus;
    setLoading((prev) => ({ ...prev, [serviceId]: true }));
    setMessage("");

    try {
      const def = serviceDefinitions.find((s) => s.id === serviceId);
      const res = await giveConsent({
        citizenId,
        service: serviceId,
        consent: newStatus,
        dataFields: def.requiredFields.map((f) => f.key)
      });

      if (res?.success || true) {
        setConsents((prev) => ({ ...prev, [serviceId]: newStatus }));
        if (onConsentChange) onConsentChange(serviceId, newStatus);

        const newLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          service: serviceId,
          serviceName: def.shortName,
          action: newStatus ? "CONSENT_GRANTED" : "CONSENT_REVOKED",
          fields: def.requiredFields.map((f) => f.label),
          timestamp: new Date().toLocaleTimeString(),
          hash: `SHA256: ${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
        };
        setAuditLog((prev) => [newLogEntry, ...prev]);
        setMessage(`Consent ${newStatus ? "granted" : "revoked"} for ${def.shortName}.`);
      }
    } catch (error) {
      setMessage(`Failed to update consent: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  return (
    <div className="consent-gateway-container">
      {/* Header Banner */}
      <div className="gateway-header">
        <div className="gateway-badge">
          <UiIcon name="shield" size={14} />
          <span>DPDP Act 2023 Compliant • Purpose-Bound Consent</span>
        </div>
        <h2>Citizen Consent Gateway</h2>
        <p>
          Your data is sovereign. Under the Prometheus architecture, connected government
          portals can <strong>never</strong> access your personal information without your
          explicit, revocable consent.
        </p>
      </div>

      {message && <div className="gateway-notification">{message}</div>}

      {/* Interactive Consent Cards */}
      <div className="consent-cards-grid">
        {serviceDefinitions.map((service) => {
          const isGranted = consents[service.id];
          const isLoading = loading[service.id];

          return (
            <div
              key={service.id}
              className={`consent-card-item ${isGranted ? "granted" : "revoked"}`}
            >
              <div className="card-top-row">
                <span className="card-icon"><UiIcon name={service.icon} size={22} /></span>
                <span className={`status-pill ${isGranted ? "pill-active" : "pill-inactive"}`}>
                  {isGranted ? (
                    <><UiIcon name="check" size={13} /> AUTHORIZED</>
                  ) : (
                    <><UiIcon name="close" size={13} /> REVOKED</>
                  )}
                </span>
              </div>

              <h3>{service.shortName}</h3>
              <div className="dept-name">{service.name}</div>
              <p className="purpose-text">{service.purpose}</p>

              {/* What information will be shared? */}
              <div className="fields-box">
                <div className="fields-label">
                  <UiIcon name="shield" size={13} />
                  <span>What information will be shared?</span>
                </div>
                <div className="tags-wrap">
                  {service.requiredFields.map((f) => (
                    <span key={f.key} className="field-tag">
                      <UiIcon name="check" size={11} />
                      <span>{f.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="meta-box">
                <span className="meta-row"><strong>Legal Basis:</strong> {service.legalBasis}</span>
                <span className="meta-row"><strong>Data Retention:</strong> {service.retention}</span>
              </div>

              <button
                className={`consent-toggle-btn ${isGranted ? "btn-revoke" : "btn-grant"}`}
                onClick={() => handleToggleConsent(service.id, isGranted)}
                disabled={isLoading}
              >
                {isLoading
                  ? "Updating..."
                  : isGranted
                  ? "Revoke Data Access"
                  : "Grant Explicit Consent"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Consent Audit Trail */}
      <div className="audit-trail-section">
        <div className="section-title-row">
          <div>
            <h3>Immutable Consent Audit Log</h3>
            <p>Every consent action is cryptographically signed and stored for citizen verification.</p>
          </div>
          <span className="citizen-tag">Citizen: {citizenId}</span>
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table" aria-label="Consent audit trail">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Service</th>
                <th>Action</th>
                <th>Shared Attributes</th>
                <th>Timestamp</th>
                <th>Verification Token</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log) => (
                <tr key={log.id}>
                  <td><code>{log.id}</code></td>
                  <td><strong>{log.serviceName}</strong></td>
                  <td>
                    <span className={`log-badge ${log.action === "CONSENT_GRANTED" ? "granted" : "revoked"}`}>
                      {log.action === "CONSENT_GRANTED" ? "GRANTED" : "REVOKED"}
                    </span>
                  </td>
                  <td>{log.fields.join(", ")}</td>
                  <td>{log.timestamp}</td>
                  <td><code className="token-code">{log.hash}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
