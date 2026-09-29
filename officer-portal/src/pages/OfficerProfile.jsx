import Icon from "../components/Icon";

export default function OfficerProfile({ currentOfficer, onLogout }) {
  return (
    <div className="officer-page-view profile-view">
      <div className="profile-banner-card">
        <div className="banner-avatar-large">
          <span>{currentOfficer?.avatar || "RS"}</span>
        </div>
        <div className="banner-details">
          <div className="badge-row">
            <span className="official-service-tag">INDIAN ADMINISTRATIVE SERVICE</span>
            <span className="badge-id-code">Badge ID: {currentOfficer?.badgeNumber || "IAS-TN-2012-4821"}</span>
          </div>
          <h2>{currentOfficer?.name || "Dr. Rajesh Sharma, IAS"}</h2>
          <span className="official-desig">{currentOfficer?.designation || "District Collector & Commissioner of Operations"}</span>
          <p className="official-dept">{currentOfficer?.department || "District Administration & Governance Command"}</p>
        </div>
        <button type="button" className="btn-signout-profile" onClick={onLogout}>
          <Icon name="logout" size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="profile-grid-two">
        <div className="profile-info-card">
          <h3 className="card-section-title">Jurisdiction &amp; Authority</h3>
          <div className="info-rows-list">
            <div className="info-row">
              <span className="i-label">Assigned Jurisdiction:</span>
              <strong className="i-val">{currentOfficer?.jurisdiction || "Coimbatore & Western Districts"}</strong>
            </div>
            <div className="info-row">
              <span className="i-label">Authorisation Level:</span>
              <strong className="i-val">Level 1 — Executive Sanction Authority (Up to ₹50 Cr)</strong>
            </div>
            <div className="info-row">
              <span className="i-label">Official Email:</span>
              <span className="i-val">{currentOfficer?.email || "rajesh.sharma@gov-ops.in"}</span>
            </div>
            <div className="info-row">
              <span className="i-label">Direct Contact Office:</span>
              <span className="i-val">+91 422 2301001 (Collectorate Operations Room)</span>
            </div>
          </div>
        </div>

        <div className="profile-info-card">
          <h3 className="card-section-title">Security &amp; Compliance Audit</h3>
          <div className="info-rows-list">
            <div className="info-row">
              <span className="i-label">Active Session:</span>
              <span className="i-val text-green">Encrypted TLS 1.3 Handshake (Port 5000 API)</span>
            </div>
            <div className="info-row">
              <span className="i-label">DPDP Act Compliance:</span>
              <span className="i-val">Verified Purpose-Bound Citizen Access</span>
            </div>
            <div className="info-row">
              <span className="i-label">Audit Trail Log:</span>
              <span className="i-val">Session ID: PROMETHEUS-OPS-2026-9812</span>
            </div>
            <div className="info-row">
              <span className="i-label">Authentication Method:</span>
              <span className="i-val">Multi-Factor Hardware / Passcode Authenticated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
