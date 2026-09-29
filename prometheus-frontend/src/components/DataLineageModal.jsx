import React, { useState } from "react";
import UiIcon from "./UiIcon";

export default function DataLineageModal({ fieldKey = "fullName", onClose }) {
  const [copiedHash, setCopiedHash] = useState(false);

  const LINEAGE_DEFINITIONS = {
    fullName: {
      label: "Full Name",
      sourceService: "Election Commission — Voter Portal",
      sourceField: "full_name",
      sourceValue: "Manieesh Kumar R",
      canonicalField: "citizenName",
      canonicalValue: "Manieesh Kumar R",
      transformationType: "Intelligent Mapping Rules",
      transformationRules: [
        "Title Case normalization",
        "Whitespace sanitization",
        "Schema mapping",
        "Validation pass"
      ],
      destinationService: "Destination Department (Parivahan RTO)",
      destinationField: "applicantName",
      destinationValue: "Manieesh Kumar R",
      legalBasis: "Representation of the People Act, 1950",
      syncedDate: "24 Sep 2026, 10:14 AM",
      hash: "7f83b165c2a1e921b790d55e8103c812"
    },
    dob: {
      label: "Date of Birth",
      sourceService: "Election Commission — Voter Portal",
      sourceField: "dob",
      sourceValue: "2004-01-15",
      canonicalField: "dateOfBirth",
      canonicalValue: "2004-01-15",
      transformationType: "ISO-8601 Date Normalization",
      transformationRules: [
        "ISO-8601 formatting (YYYY-MM-DD)",
        "Minimum age check (Age >= 18)",
        "Schema mapping",
        "Validation pass"
      ],
      destinationService: "Destination Department (Parivahan RTO)",
      destinationField: "dateOfBirth",
      destinationValue: "2004-01-15",
      legalBasis: "Motor Vehicles Act, 1988 (Section 9)",
      syncedDate: "24 Sep 2026, 10:14 AM",
      hash: "e921a481c19b7f83b16503c81255e810"
    },
    address: {
      label: "Residential Address",
      sourceService: "Election Commission — Voter Portal",
      sourceField: "address",
      sourceValue: "42, Anna Salai, Gandhipuram, Coimbatore",
      canonicalField: "residentialAddress",
      canonicalValue: "42, Anna Salai, Gandhipuram, Coimbatore - 641001",
      transformationType: "Jurisdiction & Address Resolution",
      transformationRules: [
        "Pincode & District lookup",
        "RTO jurisdiction resolution: TN-38",
        "Schema mapping",
        "Validation pass"
      ],
      destinationService: "Destination Department (Parivahan RTO)",
      destinationField: "residentialAddress",
      destinationValue: "42, Anna Salai, Gandhipuram, Coimbatore - 641001",
      legalBasis: "Representation of the People Act, 1950",
      syncedDate: "24 Sep 2026, 10:14 AM",
      hash: "81255e8103c87f83b165c2a1e921b790"
    }
  };

  const current = LINEAGE_DEFINITIONS[fieldKey] || LINEAGE_DEFINITIONS.fullName;

  const handleCopyHash = () => {
    try {
      navigator.clipboard.writeText(current.hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    } catch {}
  };

  return (
    <div
      className="lineage-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lineage-explorer-title"
    >
      <div className="lineage-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="lineage-card-header">
          <div>
            <span className="lineage-eyebrow">DATA LINEAGE EXPLORER</span>
            <h2 id="lineage-explorer-title">Field Lineage: {current.label}</h2>
            <div className="lineage-meta-pills">
              <span className="meta-pill status-verified">
                <span className="status-dot green" />
                <span>Status: <strong>Verified</strong></span>
              </span>
              <span className="meta-pill legal-basis">
                <UiIcon name="document" size={13} />
                <span>Legal Basis: <strong>{current.legalBasis}</strong></span>
              </span>
              <span className="meta-pill synced-date">
                <UiIcon name="clock" size={13} />
                <span>Synced: <strong>{current.syncedDate}</strong></span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="lineage-close-button"
            onClick={onClose}
            aria-label="Close lineage explorer"
          >
            <UiIcon name="close" size={18} />
          </button>
        </div>

        {/* 4-Stage Visual Pipeline */}
        <div className="lineage-pipeline-section">
          <span className="pipeline-section-heading">4-STAGE INTEROPERABILITY PIPELINE</span>
          <div className="lineage-pipeline-cards">
            {/* 1. SOURCE */}
            <div className="pipeline-card stage-source">
              <div className="card-stage-label">
                <span className="stage-num">1</span>
                <span>SOURCE</span>
              </div>
              <div className="card-dept-name">{current.sourceService}</div>
              <div className="card-field-row">
                <span className="field-name-lbl">Field:</span>
                <code className="field-code">{current.sourceField}</code>
              </div>
              <div className="card-value-box">
                <span className="val-lbl">Value:</span>
                <strong>{current.sourceValue}</strong>
              </div>
            </div>

            <div className="pipeline-arrow-separator" aria-hidden="true">
              <UiIcon name="arrowRight" size={18} />
            </div>

            {/* 2. PROMETHEUS CANONICAL */}
            <div className="pipeline-card stage-canonical">
              <div className="card-stage-label">
                <span className="stage-num blue">2</span>
                <span>PROMETHEUS</span>
              </div>
              <div className="card-dept-name">Canonical Data Engine</div>
              <div className="card-field-row">
                <span className="field-name-lbl">Normalized Field:</span>
                <code className="field-code blue">{current.canonicalField}</code>
              </div>
              <div className="card-value-box">
                <span className="val-lbl">Value:</span>
                <strong>{current.canonicalValue}</strong>
              </div>
            </div>

            <div className="pipeline-arrow-separator" aria-hidden="true">
              <UiIcon name="arrowRight" size={18} />
            </div>

            {/* 3. TRANSFORMATION */}
            <div className="pipeline-card stage-transform">
              <div className="card-stage-label">
                <span className="stage-num amber">3</span>
                <span>TRANSFORMATION</span>
              </div>
              <div className="card-dept-name">{current.transformationType}</div>
              <ul className="transform-rules-checklist">
                {current.transformationRules.map((rule, idx) => (
                  <li key={idx}>
                    <UiIcon name="check" size={13} className="check-amber" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pipeline-arrow-separator" aria-hidden="true">
              <UiIcon name="arrowRight" size={18} />
            </div>

            {/* 4. TARGET */}
            <div className="pipeline-card stage-target">
              <div className="card-stage-label">
                <span className="stage-num green">4</span>
                <span>TARGET</span>
              </div>
              <div className="card-dept-name">{current.destinationService}</div>
              <div className="card-field-row">
                <span className="field-name-lbl">Target Field:</span>
                <code className="field-code green">{current.destinationField}</code>
              </div>
              <div className="card-value-box">
                <span className="val-lbl">Value:</span>
                <strong>{current.destinationValue}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Schema Comparison Table */}
        <div className="lineage-schema-table-section">
          <span className="pipeline-section-heading">TECHNICAL SCHEMA COMPARISON</span>
          <div className="schema-table-wrapper">
            <table className="schema-comparison-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Schema Field</th>
                  <th>Payload Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="table-stage-tag source">1. SOURCE</span>
                  </td>
                  <td>
                    <code>{current.sourceField}</code>
                  </td>
                  <td>
                    <strong>{current.sourceValue}</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-stage-tag canonical">2. PROMETHEUS</span>
                  </td>
                  <td>
                    <code>{current.canonicalField}</code>
                  </td>
                  <td>
                    <strong>{current.canonicalValue}</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-stage-tag transform">3. TRANSLATION</span>
                  </td>
                  <td>
                    <span className="rules-summary-tag">
                      {current.transformationRules.length} Mapping Rules Applied
                    </span>
                  </td>
                  <td>
                    <span className="text-green font-semibold">✓ In-Memory Verified</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-stage-tag destination">4. DESTINATION</span>
                  </td>
                  <td>
                    <code>{current.destinationField}</code>
                  </td>
                  <td>
                    <strong>{current.destinationValue}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Footer: Hash & Close */}
        <div className="lineage-card-footer">
          <div className="lineage-hash-box">
            <UiIcon name="shield" size={15} className="hash-icon" />
            <span className="hash-label">SHA-256:</span>
            <code className="hash-code">{current.hash.slice(0, 8)}...{current.hash.slice(-4)}</code>
            <button
              type="button"
              className="copy-hash-btn"
              onClick={handleCopyHash}
              title="Copy audit hash"
            >
              <UiIcon name={copiedHash ? "check" : "copy"} size={13} />
              <span>{copiedHash ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <button type="button" className="gov-btn primary" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
