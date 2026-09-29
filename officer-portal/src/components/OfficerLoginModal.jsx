import { useState } from "react";
import Icon from "./Icon";
import PrometheusLogo from "./PrometheusLogo";

export default function OfficerLoginModal({ onLogin, availableOfficers }) {
  const [selectedOfficerId, setSelectedOfficerId] = useState("OFF-101");
  const [password, setPassword] = useState("GovPass@2026");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const officers = availableOfficers && availableOfficers.length > 0 ? availableOfficers : [
    {
      id: "OFF-101",
      name: "Dr. Rajesh Sharma, IAS",
      designation: "District Collector & Commissioner of Operations",
      department: "District Administration & Governance Command",
      jurisdiction: "Coimbatore & Western Districts",
      badgeNumber: "IAS-TN-2012-4821",
      avatar: "RS"
    },
    {
      id: "OFF-102",
      name: "Er. P. Murugesan",
      designation: "Executive Engineer (Infrastructure)",
      department: "Public Works & Road Infrastructure",
      jurisdiction: "Coimbatore Metro & Highways",
      badgeNumber: "PWD-SE-8839",
      avatar: "PM"
    },
    {
      id: "OFF-103",
      name: "Dr. K. Anitha",
      designation: "Chief Public Health Officer",
      department: "Health & Family Welfare Department",
      jurisdiction: "Coimbatore District",
      badgeNumber: "DHO-TN-10492",
      avatar: "KA"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg("");

    setTimeout(() => {
      const matched = officers.find((o) => o.id === selectedOfficerId) || officers[0];
      onLogin(matched);
      setIsAuthenticating(false);
    }, 400);
  };

  return (
    <div className="officer-login-screen">
      <div className="login-backdrop-glow" />

      <div className="officer-login-box">
        {/* Emblem & Title */}
        <div className="login-emblem-row">
          <div className="login-emblem">
            <PrometheusLogo size="md" />
          </div>
          <div>
            <div className="login-brand-line">
              <strong>PROMETHEUS</strong>
              <span className="login-gov-chip">GOV SECURE</span>
            </div>
            <span className="login-sub-text">Unified Digital Governance Command</span>
          </div>
        </div>

        <div className="login-header-text">
          <h2>Authorised Officer Access</h2>
          <p>
            Restricted Government Operations Portal. Sign in with official badge credentials to access district requests, live triage, and inter-agency workflows.
          </p>
        </div>

        {errorMsg && (
          <div className="login-error-alert" role="alert">
            <Icon name="alert" size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-inner">
          <div className="form-group">
            <label className="form-label" htmlFor="officer-identity-select">
              Select Officer Profile:
            </label>
            <div className="officer-select-cards-list">
              {officers.map((off) => (
                <div
                  key={off.id}
                  className={`officer-select-card ${selectedOfficerId === off.id ? "selected" : ""}`}
                  onClick={() => setSelectedOfficerId(off.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedOfficerId(off.id)}
                >
                  <div className="card-avatar">{off.avatar || "OF"}</div>
                  <div className="card-info">
                    <strong className="card-name">{off.name}</strong>
                    <span className="card-desig">{off.designation}</span>
                    <span className="card-badge">Badge: {off.badgeNumber}</span>
                  </div>
                  <div className="radio-dot">
                    {selectedOfficerId === off.id && <span className="inner-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="officer-pass-input">
              Official PIN / Password:
            </label>
            <input
              id="officer-pass-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="officer-login-input"
              placeholder="Enter security passcode..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="btn-authenticate-officer"
          >
            <Icon name="shield" size={17} />
            <span>{isAuthenticating ? "Verifying Credentials..." : "Authenticate & Open Operations Console"}</span>
          </button>
        </form>

        <div className="login-footer-info">
          <p>
            Official access is audited in compliance with the Digital Personal Data Protection Act, 2023. Unauthorised access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
