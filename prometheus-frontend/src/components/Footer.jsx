import React from "react";
import UiIcon from "./UiIcon";
import PrometheusLogo from "./PrometheusLogo";

export default function Footer({ onNavigate, t }) {
  return (
    <footer className="prometheus-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-columns-grid">
          {/* Col 1: Prometheus */}
          <div className="footer-col-brand">
            <div className="footer-brand-header">
              <PrometheusLogo size="sm" />
              <div className="brand-titles">
                <strong>PROMETHEUS</strong>
                <span>UNIFIED DIGITAL GOVERNANCE</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Next-generation Digital Public Infrastructure interconnecting public services with privacy-first citizen data sharing.
            </p>
          </div>

          {/* Col 2: Government Services */}
          <div className="footer-col">
            <h4>Government Services</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => onNavigate("services")}>
                  Voter ID Services (ECI)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("services")}>
                  Parivahan Driving Licence (RTO)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("services")}>
                  Jan Kalyan Welfare &amp; DBT
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("services")}>
                  Service Catalog &amp; Eligibility
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen */}
          <div className="footer-col">
            <h4>Citizen</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => onNavigate("tracking")}>
                  Application Tracking
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("requests")}>
                  My Development Requests
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("profile")}>
                  Citizen Profile &amp; Identity
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("consent")}>
                  Consent Management
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => onNavigate("architecture")}>
                  How Prometheus Works
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("translation")}>
                  Intelligent Translation Engine
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate("settings")}>
                  System Settings &amp; A11y
                </button>
              </li>
              <li>
                <span className="footer-prototype-tag">Demo Prototype</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <span>&copy; 2026 PROMETHEUS · Unified Digital Public Infrastructure</span>
          </div>

          <div className="bottom-center-links">
            <button type="button" onClick={() => onNavigate("consent")}>Privacy</button>
            <span className="dot-sep">•</span>
            <button type="button" onClick={() => onNavigate("settings")}>Accessibility</button>
            <span className="dot-sep">•</span>
            <button type="button" onClick={() => onNavigate("architecture")}>Terms</button>
          </div>

          <div className="bottom-right-compliance">
            <UiIcon name="shield" size={13} className="compliance-shield" />
            <span>Compliance: DPDP Act 2023</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
