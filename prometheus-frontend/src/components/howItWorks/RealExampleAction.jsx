import React, { useState } from "react";
import UiIcon from "../UiIcon";

export default function RealExampleAction() {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <section className="real-example-action-section" aria-labelledby="example-action-heading">
      <div className="example-section-header">
        <span className="section-eyebrow">PRACTICAL DEMONSTRATION</span>
        <h2 id="example-action-heading" className="section-title-md">
          See It In Action
        </h2>
        <p className="section-lead-text">
          How Prometheus maps Election Commission Voter ID data to an RTO Parivahan Driving Licence application in real time.
        </p>
      </div>

      {/* 3-Step Visual Transformation Cards */}
      <div className="example-transformation-grid">
        {/* Step 1: BEFORE */}
        <div className="example-card source-card">
          <div className="example-card-header">
            <span className="example-stage-pill source">1. SOURCE REPOSITORY</span>
            <div className="example-dept-title">
              <UiIcon name="identity" size={16} />
              <span>Voter ID Portal (ECI)</span>
            </div>
          </div>

          <div className="example-card-body">
            <span className="field-group-label">Raw Source Schema:</span>
            <div className="code-snippet-box">
              <div className="code-line">
                <span className="key">full_name:</span> <span className="val">"Manieesh Kumar R"</span>
              </div>
              <div className="code-line">
                <span className="key">dob:</span> <span className="val">"2004-01-15"</span>
              </div>
              <div className="code-line">
                <span className="key">mobile:</span> <span className="val">"9876543210"</span>
              </div>
            </div>
          </div>

          <div className="example-card-tag">
            <span>Verified Electoral Roll Record</span>
          </div>
        </div>

        {/* Center: PROMETHEUS MAPPING BRIDGE */}
        <div className="example-mapping-bridge">
          <div className="bridge-icon-bubble">
            <UiIcon name="cpu" size={20} />
          </div>
          <span className="bridge-title">PROMETHEUS</span>
          <span className="bridge-sub">In-Memory Schema Mapping</span>

          <div className="bridge-rules-pill-list">
            <div className="mapping-rule-item">
              <code>full_name</code> <span className="rule-arrow">→</span> <code>applicantName</code>
            </div>
            <div className="mapping-rule-item">
              <code>dob</code> <span className="rule-arrow">→</span> <code>dateOfBirth</code>
            </div>
            <div className="mapping-rule-item">
              <code>mobile</code> <span className="rule-arrow">→</span> <code>mobileNumber</code>
            </div>
          </div>
        </div>

        {/* Step 3: AFTER */}
        <div className="example-card target-card">
          <div className="example-card-header">
            <span className="example-stage-pill target">2. DESTINATION PORTAL</span>
            <div className="example-dept-title">
              <UiIcon name="transport" size={16} />
              <span>Parivahan RTO Portal</span>
            </div>
          </div>

          <div className="example-card-body">
            <span className="field-group-label">Pre-Filled Destination Schema:</span>
            <div className="code-snippet-box target-snippet">
              <div className="code-line">
                <span className="key target">applicantName:</span> <span className="val">"Manieesh Kumar R"</span>
              </div>
              <div className="code-line">
                <span className="key target">dateOfBirth:</span> <span className="val">"2004-01-15"</span>
              </div>
              <div className="code-line">
                <span className="key target">mobileNumber:</span> <span className="val">"9876543210"</span>
              </div>
            </div>
          </div>

          <div className="example-card-tag success">
            <UiIcon name="badgeCheck" size={13} />
            <span>Ready for Instant Application Auto-Fill</span>
          </div>
        </div>
      </div>

      {/* Optional Technical Details Toggle */}
      <div className="example-tech-details-container">
        <button
          type="button"
          className="btn-toggle-tech-details"
          onClick={() => setShowTechnicalDetails((v) => !v)}
          aria-expanded={showTechnicalDetails}
        >
          <UiIcon name={showTechnicalDetails ? "chevronUp" : "chevronDown"} size={14} />
          <span>{showTechnicalDetails ? "Hide Technical Schema Specification" : "View Technical Schema Specification"}</span>
        </button>

        {showTechnicalDetails && (
          <div className="technical-details-panel">
            <div className="tech-details-row">
              <div className="tech-col">
                <strong>Source Payload (JSON):</strong>
                <pre>
{`{
  "full_name": "Manieesh Kumar R",
  "dob": "2004-01-15",
  "mobile": "9876543210"
}`}
                </pre>
              </div>

              <div className="tech-col">
                <strong>Destination Payload (JSON):</strong>
                <pre>
{`{
  "applicantName": "Manieesh Kumar R",
  "dateOfBirth": "2004-01-15",
  "mobileNumber": "9876543210"
}`}
                </pre>
              </div>
            </div>
            <p className="tech-guarantee-note">
              Payload conforms strictly to MoRTH Parivahan Driving Licence API v2.1 specifications.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
