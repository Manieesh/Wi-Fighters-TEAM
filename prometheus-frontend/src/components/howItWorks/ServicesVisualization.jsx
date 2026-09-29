import React from "react";
import UiIcon from "../UiIcon";

export default function ServicesVisualization({ onNavigate }) {
  const AVAILABLE_SERVICES = [
    {
      id: "voter",
      name: "VOTER ID",
      subtitle: "Election / Voter Services",
      authority: "Election Commission of India",
      icon: "identity",
      badge: "AVAILABLE NOW"
    },
    {
      id: "rto",
      name: "RTO",
      subtitle: "Driving Licence Services",
      authority: "Ministry of Road Transport & Highways",
      icon: "transport",
      badge: "AVAILABLE NOW"
    },
    {
      id: "welfare",
      name: "WELFARE",
      subtitle: "Social Welfare & DBT",
      authority: "Ministry of Social Justice & Empowerment",
      icon: "welfare",
      badge: "AVAILABLE NOW"
    }
  ];

  const COMING_SOON_SERVICES = [
    { name: "Passport Seva", authority: "Ministry of External Affairs" },
    { name: "Property Registry", authority: "State Revenue Department" },
    { name: "Higher Education", authority: "Academic Bank of Credits" },
    { name: "Direct Tax / GST", authority: "Ministry of Finance" },
    { name: "ABHA Health Grid", authority: "National Health Authority" }
  ];

  return (
    <section className="services-visualization-section" aria-labelledby="services-vis-heading">
      <div className="services-vis-header">
        <span className="section-eyebrow">DEPARTMENTAL INTEGRATION</span>
        <h2 id="services-vis-heading" className="section-title-md">
          One Platform. Multiple Services.
        </h2>
        <p className="section-lead-text">
          Prometheus acts as the central interoperability hub. Connected government services exchange compatible citizen data without altering legacy department backends.
        </p>
      </div>

      {/* Central Hub Architecture */}
      <div className="hub-architecture-layout">
        {/* Top: 3 Available Services */}
        <div className="available-services-row">
          {AVAILABLE_SERVICES.map((svc) => (
            <div key={svc.id} className="hub-service-card live-card">
              <div className="card-status-strip">
                <span className="live-dot-pulse" />
                <span className="status-label">{svc.badge}</span>
              </div>

              <div className="card-main-content">
                <div className="svc-icon-bubble">
                  <UiIcon name={svc.icon} size={20} />
                </div>
                <h3 className="svc-card-title">{svc.name}</h3>
                <span className="svc-card-sub">{svc.subtitle}</span>
                <span className="svc-authority-text">{svc.authority}</span>
              </div>

              <div className="card-connector-indicator" aria-hidden="true">
                <div className="down-rail" />
                <UiIcon name="chevronDown" size={14} className="arrow-down-icon" />
              </div>
            </div>
          ))}
        </div>

        {/* Central Prometheus Hub Bar */}
        <div className="central-hub-bar">
          <div className="hub-bar-glow" />
          <div className="hub-bar-inner">
            <div className="hub-bar-titles">
              <span className="hub-sub-tag">CENTRAL INTEGRATION GATEWAY</span>
              <strong className="hub-title-text">PROMETHEUS INTEROPERABILITY BUS</strong>
            </div>
            <span className="hub-tech-tag">Bi-Directional Adapters Active</span>
          </div>
        </div>

        {/* Bottom: Coming Soon Services */}
        <div className="coming-soon-strip-container">
          <div className="coming-soon-header-line">
            <span className="coming-soon-title-lbl">PLANNED INTEGRATIONS — COMING SOON</span>
            <span className="coming-soon-sub-lbl">(Under Technical Evaluation)</span>
          </div>

          <div className="coming-soon-pills-row">
            {COMING_SOON_SERVICES.map((svc, idx) => (
              <div key={idx} className="coming-soon-pill">
                <span className="pill-dot" />
                <strong className="pill-name">{svc.name}</strong>
                <span className="pill-dept">{svc.authority}</span>
                <span className="pill-badge">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
