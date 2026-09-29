import { useState } from "react";
import UiIcon from "./UiIcon";

export default function PortalsHub({ citizenId = "CITIZEN-1001", onLaunchWizard }) {
  const [activeIframe, setActiveIframe] = useState(null);

  const portals = [
    {
      id: "voter",
      name: "Voter Service Portal",
      authority: "Election Commission of India",
      icon: "identity",
      port: 5174,
      url: `http://localhost:5174/voter/registration-form?citizenId=${encodeURIComponent(citizenId)}&source=prometheus`,
      desc: "Dedicated electoral portal containing voter registration, existing voter login, application tracking, voter information, and update services.",
      features: [
        "Voter Registration (Form 6)",
        "EPIC Card Services",
        "Electoral Roll Verification",
        "Direct API Integration with Prometheus"
      ]
    },
    {
      id: "rto",
      name: "Parivahan / RTO Portal",
      authority: "Ministry of Road Transport & Highways",
      icon: "transport",
      port: 5175,
      url: "http://localhost:5175/apply",
      desc: "Separate transport portal for driving licence services, learner licences, applicant tracking, and vehicle class endorsements.",
      features: [
        "Learner / Permanent Licence",
        "Intelligent Translation Engine",
        "Vehicle Class Selection (LMV/MCWG)",
        "Biometric & Address Verification"
      ]
    },
    {
      id: "welfare",
      name: "Jan Kalyan DBT Welfare Portal",
      authority: "National Social Welfare & DBT Mission",
      icon: "welfare",
      port: 5176,
      url: `http://localhost:5176?citizenId=${encodeURIComponent(citizenId)}&source=prometheus`,
      desc: "Dedicated welfare portal for discovering eligible central/state schemes, citizen details, scheme applications, and status tracking.",
      features: [
        "Pradhan Mantri Awas Yojana",
        "PM Kisan Samman Nidhi",
        "National Scholarship Scheme",
        "Income-Based Eligibility Check"
      ]
    }
  ];

  return (
    <div className="portals-hub-container">
      {/* Header */}
      <div className="hub-header">
        <div className="gateway-badge">
          <span className="pulse-dot"></span> 3 Integrated Functional Portals
        </div>
        <h2>Standalone Government Portals Hub</h2>
        <p>
          Prometheus does <strong>not</strong> replace government portals. The Voter, RTO, and
          Welfare portals remain independent functional systems. Prometheus connects them into a
          frictionless citizen journey through the <strong>"Apply Once"</strong> integration layer.
        </p>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="architecture-diagram-card">
        <div className="diagram-layer central">
          <div className="diagram-box prometheus-box">
            <span className="box-tag">CORE PLATFORM</span>
            <h4>PROMETHEUS</h4>
            <p>Unified Citizen Identity • Consent Gateway • Data Translation</p>
          </div>
        </div>

        <div className="diagram-connectors">
          <div className="connector-line left">
            <span><UiIcon name="shield" size={13} /> Pre-filled via Consent</span>
          </div>
          <div className="connector-line middle">
            <span><UiIcon name="refresh" size={13} /> Translated Schema</span>
          </div>
          <div className="connector-line right">
            <span><UiIcon name="check" size={13} /> Automated Status Sync</span>
          </div>
        </div>

        <div className="diagram-layer portals-row">
          <div className="diagram-box portal-box voter">
            <span className="portal-icon"><UiIcon name="identity" size={24} /></span>
            <h5>Voter ID Portal</h5>
            <small>Port 5174</small>
          </div>
          <div className="diagram-box portal-box rto">
            <span className="portal-icon"><UiIcon name="transport" size={24} /></span>
            <h5>RTO DL Portal</h5>
            <small>Port 5175</small>
          </div>
          <div className="diagram-box portal-box welfare">
            <span className="portal-icon"><UiIcon name="welfare" size={24} /></span>
            <h5>Welfare Portal</h5>
            <small>Port 5176</small>
          </div>
        </div>
      </div>

      {/* Portal Cards */}
      <div className="portal-cards-grid">
        {portals.map((p) => (
          <div key={p.id} className="standalone-portal-card">
            <div className="portal-card-top">
              <span className="portal-logo"><UiIcon name={p.icon} size={23} /></span>
              <span className="port-badge">Port {p.port}</span>
            </div>

            <h3>{p.name}</h3>
            <div className="authority-text">{p.authority}</div>
            <p className="portal-desc">{p.desc}</p>

            <div className="portal-features-list">
              {p.features.map((feat, idx) => (
                <div key={idx} className="feature-item">
                  <span className="feat-check"><UiIcon name="check" size={13} /></span> {feat}
                </div>
              ))}
            </div>

            <div className="portal-card-actions">
              <button
                className="launch-wizard-btn"
                onClick={() => onLaunchWizard && onLaunchWizard(p.id)}
              >
                <UiIcon name="shield" size={15} /> 10-Step Guided Flow
              </button>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="open-standalone-link"
              >
                Open Site in New Tab <UiIcon name="external" size={13} />
              </a>

              <button
                className="preview-iframe-btn"
                onClick={() => setActiveIframe(activeIframe === p.id ? null : p.id)}
              >
                {activeIframe === p.id ? (
                  <>Close Live View <UiIcon name="chevronUp" size={13} /></>
                ) : (
                  <>Preview Portal Here <UiIcon name="chevronDown" size={13} /></>
                )}
              </button>
            </div>

            {/* Embedded Live Frame Preview */}
            {activeIframe === p.id && (
              <div className="embedded-preview-container">
                <div className="iframe-title-bar">
                  <span>Live Preview: {p.name} (Port {p.port})</span>
                  <a href={p.url} target="_blank" rel="noreferrer">
                    Expand <UiIcon name="external" size={13} />
                  </a>
                </div>
                <iframe
                  src={p.url}
                  title={p.name}
                  className="embedded-iframe"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
