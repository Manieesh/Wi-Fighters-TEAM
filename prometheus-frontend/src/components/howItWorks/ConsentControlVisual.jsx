import React from "react";
import UiIcon from "../UiIcon";

export default function ConsentControlVisual({ onNavigate }) {
  const CONSENT_STAGES = [
    { num: "1", title: "CITIZEN", desc: "Initiates service flow", icon: "user" },
    { num: "2", title: "REQUEST", desc: "Target portal specifies fields", icon: "document" },
    { num: "3", title: "CONSENT REQUIRED", desc: "Citizen reviews attributes", icon: "shield" },
    { num: "4", title: "AUTHORIZED DATA ONLY", desc: "Strict purpose binding", icon: "badgeCheck" },
    { num: "5", title: "SERVICE", desc: "Data delivered to department", icon: "building" }
  ];

  const RTO_REQUEST_FIELDS = [
    { field: "Full Legal Name", approved: true },
    { field: "Date of Birth (Age Verification)", approved: true },
    { field: "Residential Address (Jurisdiction)", approved: true },
    { field: "Mobile Number (OTP & SMS)", approved: true },
    { field: "Unrequested Financial / Health Data", approved: false }
  ];

  return (
    <section className="consent-control-visual-section" aria-labelledby="consent-control-heading">
      <div className="consent-vis-header">
        <span className="section-eyebrow">PRIVACY-FIRST GOVERNANCE</span>
        <h2 id="consent-control-heading" className="section-title-md">
          Citizen Always Controls Data
        </h2>
        <p className="section-lead-text">
          No data is shared between government departments without explicit citizen approval. You decide what is shared, for what purpose, and for how long.
        </p>
      </div>

      {/* 5-Node Visual Progression */}
      <div className="consent-progression-track" role="list" aria-label="Consent progression journey">
        {CONSENT_STAGES.map((stg, idx) => {
          const isLast = idx === CONSENT_STAGES.length - 1;
          return (
            <React.Fragment key={stg.num}>
              <div className="consent-node-card" role="listitem">
                <div className="node-icon-header">
                  <span className="node-index">{stg.num}</span>
                  <div className="node-icon-bubble">
                    <UiIcon name={stg.icon} size={16} />
                  </div>
                </div>
                <h4 className="node-title">{stg.title}</h4>
                <span className="node-desc">{stg.desc}</span>
              </div>

              {!isLast && (
                <div className="consent-connector-arrow" aria-hidden="true">
                  <UiIcon name="arrowRight" size={14} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Practical Consent Example Card */}
      <div className="consent-example-showcase-card">
        <div className="showcase-left-col">
          <div className="rto-example-header">
            <UiIcon name="transport" size={18} className="text-blue" />
            <div>
              <strong>Sample Service Request: Parivahan RTO</strong>
              <span>Required attributes for Learner's Licence (LLR):</span>
            </div>
          </div>

          <div className="rto-fields-checklist">
            {RTO_REQUEST_FIELDS.map((item, idx) => (
              <div key={idx} className={`rto-field-row ${item.approved ? "approved" : "rejected"}`}>
                <div className="field-icon-indicator">
                  {item.approved ? (
                    <UiIcon name="check" size={13} className="text-success" />
                  ) : (
                    <UiIcon name="close" size={13} className="text-danger" />
                  )}
                </div>
                <span className="field-name-text">{item.field}</span>
                <span className={`field-status-chip ${item.approved ? "chip-ok" : "chip-blocked"}`}>
                  {item.approved ? "Authorized" : "Blocked by Default"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-right-col">
          <div className="revocation-callout-box">
            <UiIcon name="shield" size={24} className="text-cyan" />
            <h4>Instant Revocation Guarantee</h4>
            <p>
              Under the Digital Personal Data Protection (DPDP) Act 2023, consent can be revoked at any time with a single click.
            </p>
            <button
              type="button"
              className="gov-btn primary view-consent-btn"
              onClick={() => onNavigate && onNavigate("consent")}
            >
              <UiIcon name="shield" size={15} />
              <span>View Consent Management</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
