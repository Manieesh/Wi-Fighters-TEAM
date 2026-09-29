import React, { useState } from "react";
import UiIcon from "../components/UiIcon";

export default function Settings({
  language = "en",
  onLanguageChange,
  onOpenA11y,
  citizenProfile,
  onNavigate
}) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoConsentPrompt, setAutoConsentPrompt] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [compactDensity, setCompactDensity] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="settings-header-strip">
        <span className="settings-eyebrow">CITIZEN ACCOUNT &amp; SYSTEM PREFERENCES</span>
        <h1 className="settings-main-title">Settings</h1>
        <p className="settings-subtitle">
          Manage your interface appearance, accessibility, alerts, privacy permissions, and authentication security.
        </p>
      </div>

      {toastMessage && (
        <div className="settings-toast-banner" role="alert">
          <UiIcon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="settings-sections-grid">
        {/* 1. APPEARANCE */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble blue">
              <UiIcon name="insights" size={18} />
            </div>
            <div>
              <h3>Appearance</h3>
              <p>Control visual density and dashboard presentation.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Compact View Density</strong>
                <span>Reduces padding across service catalogs and tracking lists for high-resolution displays.</span>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle compact view density">
                <input
                  type="checkbox"
                  checked={compactDensity}
                  onChange={(e) => {
                    setCompactDensity(e.target.checked);
                    showNotification(`Compact density ${e.target.checked ? "enabled" : "disabled"}`);
                  }}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* 2. ACCESSIBILITY */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble cyan">
              <UiIcon name="settings" size={18} />
            </div>
            <div>
              <h3>Accessibility</h3>
              <p>High contrast, text scaling, and motion preferences.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Universal Access Settings</strong>
                <span>Configure WCAG 2.1 AAA text sizing, high luminance contrast, and reduced motion.</span>
              </div>
              <button
                type="button"
                className="gov-btn secondary"
                onClick={onOpenA11y}
              >
                <span>Open Preferences</span>
                <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. LANGUAGE */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble indigo">
              <UiIcon name="globe" size={18} />
            </div>
            <div>
              <h3>Language</h3>
              <p>Choose your preferred multilingual navigation language.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Display Language</strong>
                <span>Select from official languages supported across all digital portals.</span>
              </div>
              <select
                className="settings-select-control"
                value={language}
                onChange={(e) => {
                  if (onLanguageChange) onLanguageChange(e.target.value);
                  showNotification("Language updated successfully");
                }}
                aria-label="Select display language"
              >
                <option value="en">English (English)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. NOTIFICATIONS */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble amber">
              <UiIcon name="bell" size={18} />
            </div>
            <div>
              <h3>Notifications</h3>
              <p>Manage application progress and district notices.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>SMS Status Updates</strong>
                <span>Receive instant mobile alerts when your departmental applications change status.</span>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle SMS alerts">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => {
                    setSmsAlerts(e.target.checked);
                    showNotification(`SMS updates ${e.target.checked ? "enabled" : "disabled"}`);
                  }}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Email Summaries</strong>
                <span>Receive periodic digests for public works and community development requests.</span>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle email summaries">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.checked);
                    showNotification(`Email summaries ${e.target.checked ? "enabled" : "disabled"}`);
                  }}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* 5. PRIVACY & CONSENT */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble emerald">
              <UiIcon name="shield" size={18} />
            </div>
            <div>
              <h3>Privacy &amp; Consent</h3>
              <p>Control inter-departmental data sharing permissions.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Always Prompt for Purpose-Bound Consent</strong>
                <span>Require explicit approval before pre-filling verified attributes into new services.</span>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle consent prompt">
                <input
                  type="checkbox"
                  checked={autoConsentPrompt}
                  onChange={(e) => {
                    setAutoConsentPrompt(e.target.checked);
                    showNotification("Consent policy updated");
                  }}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Active Authorizations &amp; Consents</strong>
                <span>Inspect or revoke active service authorizations for Voter, RTO, and Welfare portals.</span>
              </div>
              <button
                type="button"
                className="gov-btn secondary"
                onClick={() => onNavigate && onNavigate("consent")}
              >
                <span>Manage Consents</span>
                <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 6. SECURITY */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-bubble slate">
              <UiIcon name="badgeCheck" size={18} />
            </div>
            <div>
              <h3>Security &amp; Session</h3>
              <p>Authentication safeguards and automatic session timeout.</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Inactivity Timeout</strong>
                <span>Automatically terminate citizen session after period of inactivity.</span>
              </div>
              <select
                className="settings-select-control"
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  showNotification(`Session timeout set to ${e.target.value} minutes`);
                }}
                aria-label="Select session timeout"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div className="setting-item-row">
              <div className="setting-item-text">
                <strong>Citizen Identity Verification</strong>
                <span>Current authenticated status: <strong>Level-3 e-KYC Verified</strong></span>
              </div>
              <span className="security-verified-tag">
                <UiIcon name="check" size={13} />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
