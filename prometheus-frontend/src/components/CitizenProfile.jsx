import React, { useEffect, useState } from "react";
import UiIcon from "./UiIcon";
import DataLineageModal from "./DataLineageModal";
import { getCitizenProfile, saveCitizenProfile, getCitizenApplications, getAllConsents } from "../services/api";

export default function CitizenProfile({ citizenId = "CITIZEN-1001", onNavigate, onProfileUpdated }) {
  const [activeTab, setActiveTab] = useState("attributes"); // attributes, services, applications, consents, lineage
  const [selectedFieldForLineage, setSelectedFieldForLineage] = useState(null);
  const [applications, setApplications] = useState([]);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    citizenId,
    name: "Manieesh Kumar R",
    fullName: "Manieesh Kumar R",
    dateOfBirth: "2004-01-15",
    gender: "Male",
    mobile: "9876543210",
    mobileNumber: "9876543210",
    email: "manieesh.kumar@gov-citizen.in",
    address: "42, Anna Salai, Gandhipuram",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    district: "Coimbatore",
    aadhaarNumber: "•••• •••• 8912",
    annualIncome: "480000",
    occupation: "Software Professional",
    category: "General / OBC",
    vehicleClass: "LMV",
    verifiedStatus: "Level-3 Sovereign e-KYC Verified",
    documents: {
      identity: true,
      addressProof: true,
      photograph: true,
      incomeCertificate: true,
      ageProof: true
    }
  });

  useEffect(() => {
    loadAllData();
  }, [citizenId]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [profRes, appRes, conRes] = await Promise.allSettled([
        getCitizenProfile(citizenId),
        getCitizenApplications(citizenId),
        getAllConsents()
      ]);

      if (profRes.status === "fulfilled" && profRes.value?.profile) {
        setProfile((prev) => ({
          ...prev,
          ...profRes.value.profile,
          name: profRes.value.profile.fullName || profRes.value.profile.name || prev.name,
          mobile: profRes.value.profile.mobileNumber || profRes.value.profile.mobile || prev.mobile
        }));
      }

      if (appRes.status === "fulfilled" && appRes.value?.applications) {
        setApplications(appRes.value.applications);
      }

      if (conRes.status === "fulfilled" && conRes.value?.records) {
        setConsents(conRes.value.records);
      }
    } catch (err) {
      console.log("Cached profile active");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveCitizenProfile(profile);
      setMessage("Profile saved successfully to Sovereign Registry.");
      if (onProfileUpdated) onProfileUpdated(profile);
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const CONNECTED_SERVICES_DATA = [
    {
      id: "voter",
      title: "Election Commission — Voter ID Portal",
      status: "Connected & Verified",
      connectedAttributes: ["Full Legal Name", "Date of Birth", "Residential Address", "Constituency"],
      lastSynced: "24 Sept 2026",
      verified: true
    },
    {
      id: "rto",
      title: "Parivahan — Regional Transport Office (RTO)",
      status: "Connected & Ready",
      connectedAttributes: ["Learner Licence", "Vehicle Registration TN-38", "Biometric Signature"],
      lastSynced: "26 Sept 2026",
      verified: true
    },
    {
      id: "welfare",
      title: "Jan Kalyan — Social Welfare & DBT Portal",
      status: "Connected & Synced",
      connectedAttributes: ["Income Certificate", "Ration Card Family Tree", "DBT Bank Seeding"],
      lastSynced: "22 Sept 2026",
      verified: true
    }
  ];

  return (
    <div className="page-container citizen-profile-page-container">
      {/* 1. Breadcrumb - Perfectly Aligned */}
      <nav className="citizen-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("overview")}
          className="citizen-crumb-link"
        >
          Home
        </button>
        <span className="citizen-crumb-sep">/</span>
        <span className="citizen-crumb-current">Citizen Profile</span>
      </nav>

      {/* 2. Citizen Header Section */}
      <header className="citizen-header-card">
        <div className="citizen-header-main">
          {/* Avatar with Initials & Online Dot */}
          <div className="citizen-avatar-box">
            <span className="citizen-avatar-initials">
              {(profile.fullName || profile.name || "MK")
                .split(" ")
                .filter(Boolean)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="citizen-avatar-dot" title="Active Sovereign Citizen" />
          </div>

          {/* Citizen Details */}
          <div className="citizen-identity-info">
            <div className="citizen-badge-row">
              <span className="citizen-verified-pill">VERIFIED CITIZEN</span>
              <span className="citizen-id-verified-pill">✓ Identity Verified</span>
            </div>

            <h1 className="citizen-name-title">{profile.fullName || profile.name}</h1>

            <div className="citizen-id-line">
              <span className="citizen-id-label">Citizen ID:</span>
              <code className="citizen-id-code">{profile.citizenId}</code>
            </div>

            <div className="profile-meta-row">
              <div className="profile-meta-item">
                <span className="profile-meta-label">DOB:</span>
                <span className="profile-meta-value">{profile.dateOfBirth}</span>
              </div>
              <span className="profile-meta-sep" aria-hidden="true">•</span>
              <div className="profile-meta-item">
                <span className="profile-meta-label">Gender:</span>
                <span className="profile-meta-value">{profile.gender}</span>
              </div>
              <span className="profile-meta-sep" aria-hidden="true">•</span>
              <div className="profile-meta-item">
                <span className="profile-meta-label">Location:</span>
                <span className="profile-meta-value">Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Services Summary Strip */}
        <div className="citizen-connected-services-bar">
          <span className="connected-services-title">Connected Services</span>
          <div className="connected-services-pills">
            <span className="service-pill-active">✓ Voter</span>
            <span className="service-pill-active">✓ RTO</span>
            <span className="service-pill-active">✓ Welfare</span>
          </div>
        </div>
      </header>

      {/* Global Feedback Banner */}
      {message && (
        <div className="profile-toast-banner" role="alert">
          <UiIcon name="check" size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* 3. Profile Navigation Tabs */}
      <nav className="profile-nav-tabs-bar" aria-label="Profile Sections">
        <button
          type="button"
          className={`profile-tab-item ${activeTab === "attributes" ? "active" : ""}`}
          onClick={() => setActiveTab("attributes")}
        >
          <UiIcon name="identity" size={16} />
          <span>Profile Attributes</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          <UiIcon name="document" size={16} />
          <span>Connected Services (3)</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          <UiIcon name="applications" size={16} />
          <span>Application History ({applications.length})</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === "consents" ? "active" : ""}`}
          onClick={() => setActiveTab("consents")}
        >
          <UiIcon name="shield" size={16} />
          <span>Consent Authorizations</span>
        </button>

        <button
          type="button"
          className={`profile-tab-item ${activeTab === "lineage" ? "active" : ""}`}
          onClick={() => setActiveTab("lineage")}
        >
          <UiIcon name="insights" size={16} />
          <span>Data Lineage</span>
        </button>
      </nav>

      {/* TAB 1: ATTRIBUTES */}
      {activeTab === "attributes" && (
        <section className="profile-content-section" aria-labelledby="verified-attributes-title">
          {/* Section Header */}
          <div className="profile-section-header">
            <div className="profile-section-text">
              <h2 id="verified-attributes-title" className="profile-section-heading">
                Verified Citizen Attributes
              </h2>
              <p className="profile-section-desc">
                These verified attributes are reused across government services so you never have to re-type documents.
              </p>
            </div>
            <button
              type="button"
              className="lineage-inspect-all-btn"
              onClick={() => setActiveTab("lineage")}
            >
              <UiIcon name="insights" size={14} />
              <span>Inspect All Lineage</span>
            </button>
          </div>

          {/* Form with Clean Attribute Fields */}
          <form onSubmit={handleSave} className="profile-form-container">
            <div className="attribute-fields-grid">
              {/* Field 1: Full Legal Name */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-fullName" className="attribute-label">
                    FULL LEGAL NAME
                  </label>
                  <button
                    type="button"
                    className="lineage-action-btn"
                    onClick={() => setSelectedFieldForLineage({ key: "fullName", label: "Full Legal Name" })}
                    aria-label="Inspect Lineage for Full Legal Name"
                  >
                    <span className="lineage-dot" aria-hidden="true">◉</span>
                    <span>Lineage</span>
                  </button>
                </div>
                <input
                  id="field-fullName"
                  type="text"
                  className="attribute-input"
                  value={profile.fullName || profile.name}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value, name: e.target.value })}
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>Verified via Voter ID Portal</span>
                </div>
              </div>

              {/* Field 2: Date of Birth */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-dateOfBirth" className="attribute-label">
                    DATE OF BIRTH
                  </label>
                  <button
                    type="button"
                    className="lineage-action-btn"
                    onClick={() => setSelectedFieldForLineage({ key: "dateOfBirth", label: "Date of Birth" })}
                    aria-label="Inspect Lineage for Date of Birth"
                  >
                    <span className="lineage-dot" aria-hidden="true">◉</span>
                    <span>Lineage</span>
                  </button>
                </div>
                <input
                  id="field-dateOfBirth"
                  type="date"
                  className="attribute-input"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>Verified via Voter ID Portal (Age: 22)</span>
                </div>
              </div>

              {/* Field 3: Mobile Number */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-mobile" className="attribute-label">
                    MOBILE NUMBER
                  </label>
                  <button
                    type="button"
                    className="lineage-action-btn"
                    onClick={() => setSelectedFieldForLineage({ key: "mobileNumber", label: "Mobile Number" })}
                    aria-label="Inspect Lineage for Mobile Number"
                  >
                    <span className="lineage-dot" aria-hidden="true">◉</span>
                    <span>Lineage</span>
                  </button>
                </div>
                <input
                  id="field-mobile"
                  type="tel"
                  className="attribute-input"
                  value={profile.mobileNumber || profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value, mobile: e.target.value })}
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>OTP Verified via Aadhaar e-KYC</span>
                </div>
              </div>

              {/* Field 4: Gender */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-gender" className="attribute-label">
                    GENDER
                  </label>
                </div>
                <select
                  id="field-gender"
                  className="attribute-select"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Third Gender">Third Gender</option>
                </select>
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>Verified via Electoral Registry</span>
                </div>
              </div>

              {/* Field 5: Residential & Permanent Address (Full Width Span) */}
              <div className="attribute-field full-width">
                <div className="attribute-label-row">
                  <label htmlFor="field-address" className="attribute-label">
                    RESIDENTIAL & PERMANENT ADDRESS
                  </label>
                  <button
                    type="button"
                    className="lineage-action-btn"
                    onClick={() => setSelectedFieldForLineage({ key: "address", label: "Residential Address" })}
                    aria-label="Inspect Lineage for Residential & Permanent Address"
                  >
                    <span className="lineage-dot" aria-hidden="true">◉</span>
                    <span>Lineage</span>
                  </button>
                </div>
                <input
                  id="field-address"
                  type="text"
                  className="attribute-input"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>Verified via Voter ID Electoral Roll (Coimbatore North)</span>
                </div>
              </div>

              {/* Field 6: Verified Annual Income */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-income" className="attribute-label">
                    VERIFIED ANNUAL INCOME
                  </label>
                  <button
                    type="button"
                    className="lineage-action-btn"
                    onClick={() => setSelectedFieldForLineage({ key: "annualIncome", label: "Annual Income" })}
                    aria-label="Inspect Lineage for Annual Income"
                  >
                    <span className="lineage-dot" aria-hidden="true">◉</span>
                    <span>Lineage</span>
                  </button>
                </div>
                <input
                  id="field-income"
                  type="text"
                  className="attribute-input"
                  value={profile.annualIncome}
                  onChange={(e) => setProfile({ ...profile, annualIncome: e.target.value })}
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>Revenue e-District Certificate #REV-TN-8921</span>
                </div>
              </div>

              {/* Field 7: Digital Identity Status */}
              <div className="attribute-field">
                <div className="attribute-label-row">
                  <label htmlFor="field-identity-status" className="attribute-label">
                    DIGITAL IDENTITY STATUS
                  </label>
                </div>
                <input
                  id="field-identity-status"
                  type="text"
                  className="attribute-input text-verified"
                  value={profile.verifiedStatus || "Level-3 Sovereign e-KYC Verified"}
                  disabled
                />
                <div className="verification-text">
                  <span className="verification-icon" aria-hidden="true">✓</span>
                  <span>UIDAI Biometric Authenticated</span>
                </div>
              </div>
            </div>

            {/* Dedicated Action Section Aligned Right */}
            <div className="profile-save-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="profile-btn-spinner" aria-hidden="true" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Profile Updates</span>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 2: CONNECTED SERVICES */}
      {activeTab === "services" && (
        <section className="profile-content-section" aria-labelledby="connected-services-heading">
          <div className="profile-section-header">
            <div className="profile-section-text">
              <h2 id="connected-services-heading" className="profile-section-heading">
                Connected Government Services
              </h2>
              <p className="profile-section-desc">
                Federated departmental portals synchronized under citizen consent and identity verification.
              </p>
            </div>
          </div>

          <div className="connected-services-stack">
            {CONNECTED_SERVICES_DATA.map((svc) => (
              <div key={svc.id} className="cs-detail-card">
                <div className="cs-detail-header">
                  <div className="cs-title-group">
                    <h3 className="cs-title">{svc.title}</h3>
                    <span className="cs-status-tag">✓ {svc.status}</span>
                  </div>
                  <span className="cs-sync-date">Last Synced: {svc.lastSynced}</span>
                </div>

                <div className="cs-attributes-list">
                  <span className="cs-attr-title">Connected Attributes:</span>
                  <div className="cs-attr-pills">
                    {svc.connectedAttributes.map((attr, idx) => (
                      <span key={idx} className="cs-attr-pill">✓ {attr}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: APPLICATION HISTORY */}
      {activeTab === "applications" && (
        <section className="profile-content-section" aria-labelledby="app-history-heading">
          <div className="profile-section-header">
            <div className="profile-section-text">
              <h2 id="app-history-heading" className="profile-section-heading">
                Application History
              </h2>
              <p className="profile-section-desc">
                Complete audit trace of service requests initiated through the Prometheus sovereign gateway.
              </p>
            </div>
          </div>

          <div className="app-history-stack">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.applicationId} className="app-history-card">
                  <div className="app-card-top">
                    <div className="app-id-group">
                      <span className="app-service-badge">{app.service?.toUpperCase()}</span>
                      <strong className="app-id-code">{app.applicationId}</strong>
                    </div>
                    <span className="app-status-badge">✓ {app.status}</span>
                  </div>
                  <div className="app-card-bottom">
                    <span className="app-date">Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                    <span className="app-gateway-text">Integrated via Prometheus Sovereign Gateway</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="profile-empty-card">
                <UiIcon name="applications" size={24} />
                <p>No prior applications recorded.</p>
                <span>Submitted applications will appear here with complete verification lineage.</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 4: CONSENT AUTHORIZATIONS */}
      {activeTab === "consents" && (
        <section className="profile-content-section" aria-labelledby="consent-auth-heading">
          <div className="profile-section-header">
            <div className="profile-section-text">
              <h2 id="consent-auth-heading" className="profile-section-heading">
                Active Consent Authorizations
              </h2>
              <p className="profile-section-desc">
                Explicit revocable data sharing permissions registered under the Digital Personal Data Protection Act 2023.
              </p>
            </div>
          </div>

          <div className="consent-history-stack">
            {["voter", "rto", "welfare"].map((svc) => (
              <div key={svc} className="consent-summary-card">
                <div className="c-sum-header">
                  <h3 className="c-sum-title">{svc.toUpperCase()} Data Sharing Authorization</h3>
                  <span className="c-sum-badge">✓ Active Citizen Consent</span>
                </div>
                <p className="c-sum-desc">
                  Authorized for purpose-bound digital service application pre-fill and status verification.
                </p>
                <div className="c-sum-hash-box">
                  <code>Consent Record ID: PRM-CNS-0{svc === "voter" ? "1" : svc === "rto" ? "2" : "3"}</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: DATA LINEAGE MATRIX */}
      {activeTab === "lineage" && (
        <section className="profile-content-section" aria-labelledby="lineage-matrix-heading">
          <div className="profile-section-header">
            <div className="profile-section-text">
              <h2 id="lineage-matrix-heading" className="profile-section-heading">
                Data Lineage Matrix
              </h2>
              <p className="profile-section-desc">
                Source portal origins, canonical Prometheus ontology keys, and verified cryptographic trust tiers.
              </p>
            </div>
          </div>

          <div className="lineage-table-wrap">
            <table className="lineage-matrix-table">
              <thead>
                <tr>
                  <th scope="col">Citizen Attribute</th>
                  <th scope="col">Originating Sovereign Portal</th>
                  <th scope="col">Canonical Key</th>
                  <th scope="col">Trust Tier</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Full Legal Name</strong></td>
                  <td>Election Commission (Voter Portal)</td>
                  <td><code className="canonical-code">citizenName</code></td>
                  <td><span className="trust-tier-badge">Level-3 e-KYC</span></td>
                  <td>
                    <button
                      type="button"
                      className="lineage-inspect-btn"
                      onClick={() => setSelectedFieldForLineage({ key: "fullName", label: "Full Legal Name" })}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Date of Birth</strong></td>
                  <td>Election Commission (Voter Portal)</td>
                  <td><code className="canonical-code">dateOfBirth</code></td>
                  <td><span className="trust-tier-badge">Verified DOB</span></td>
                  <td>
                    <button
                      type="button"
                      className="lineage-inspect-btn"
                      onClick={() => setSelectedFieldForLineage({ key: "dateOfBirth", label: "Date of Birth" })}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Residential Address</strong></td>
                  <td>Election Commission (Voter Portal)</td>
                  <td><code className="canonical-code">residentialAddress</code></td>
                  <td><span className="trust-tier-badge">Electoral Roll</span></td>
                  <td>
                    <button
                      type="button"
                      className="lineage-inspect-btn"
                      onClick={() => setSelectedFieldForLineage({ key: "address", label: "Residential Address" })}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Mobile Number</strong></td>
                  <td>UIDAI Aadhaar OTP Gateway</td>
                  <td><code className="canonical-code">mobileNumber</code></td>
                  <td><span className="trust-tier-badge">OTP Verified</span></td>
                  <td>
                    <button
                      type="button"
                      className="lineage-inspect-btn"
                      onClick={() => setSelectedFieldForLineage({ key: "mobileNumber", label: "Mobile Number" })}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Annual Income</strong></td>
                  <td>Revenue Department e-District</td>
                  <td><code className="canonical-code">annualIncome</code></td>
                  <td><span className="trust-tier-badge">Income Certificate</span></td>
                  <td>
                    <button
                      type="button"
                      className="lineage-inspect-btn"
                      onClick={() => setSelectedFieldForLineage({ key: "annualIncome", label: "Annual Income" })}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Sub-modal: Interactive Data Lineage Inspector */}
      {selectedFieldForLineage && (
        <DataLineageModal
          fieldKey={selectedFieldForLineage.key}
          fieldLabel={selectedFieldForLineage.label}
          onClose={() => setSelectedFieldForLineage(null)}
        />
      )}
    </div>
  );
}
