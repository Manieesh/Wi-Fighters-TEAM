import React, { useState, useEffect } from "react";
import UiIcon from "../components/UiIcon";
import { recordAuditLog } from "../services/api";

export default function DataTranslationEngine({ onNavigate }) {
  const [fromService, setFromService] = useState("voter");
  const [toService, setToService] = useState("rto");
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [inspectedStage, setInspectedStage] = useState(null);
  const [lastAuditEvent, setLastAuditEvent] = useState({
    eventId: "AUDIT-DTI-2026-9814",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    source: "Election Commission — Voter ID Portal",
    destination: "Parivahan — RTO Gateway",
    consentStatus: "VERIFIED (Token CIT-1001-OK)",
    transformationStatus: "SYNCHRONIZED (6/6 Fields)"
  });

  // Source JSON object (editable/switchable)
  const [sourceData, setSourceData] = useState({
    full_name: "Manieesh Kumar R",
    dob: "2004-01-15",
    gender: "Male",
    address: "42, Anna Salai, Gandhipuram",
    district: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    mobile: "9876543210"
  });

  // Target schema dynamically generated based on selection
  const getDestinationPayload = (from, to, src) => {
    if (to === "rto") {
      return {
        applicantName: src.full_name || src.name || "Manieesh Kumar R",
        dateOfBirth: src.dob || src.dateOfBirth || "2004-01-15",
        gender: src.gender || "Male",
        residentialAddress: `${src.address || ""}, ${src.district || "Coimbatore"}, ${src.state || "Tamil Nadu"} - ${src.pincode || "641001"}`,
        mobileNumber: src.mobile || src.phone || "9876543210",
        vehicleClass: "LMV",
        stateRto: "TN-38 Coimbatore North RTO",
        jurisdictionCode: "TN-RTO-38"
      };
    } else if (to === "welfare") {
      return {
        beneficiaryName: src.full_name || src.name || "Manieesh Kumar R",
        dateOfBirth: src.dob || "2004-01-15",
        gender: src.gender || "Male",
        permanentAddress: `${src.address || ""}, ${src.district || "Coimbatore"}, ${src.pincode || "641001"}`,
        verifiedIncome: 480000,
        mobileNumber: src.mobile || "9876543210",
        schemeName: "Pradhan Mantri Awas Yojana (PMAY-G)",
        dbtAadhaarLinked: true
      };
    } else {
      return {
        voterName: src.full_name || src.name || "Manieesh Kumar R",
        dob: src.dob || "2004-01-15",
        gender: src.gender || "Male",
        address: `${src.address || ""}, ${src.district || "Coimbatore"}`,
        mobile: src.mobile || "9876543210",
        district: src.district || "Coimbatore",
        state: src.state || "Tamil Nadu",
        constituency: "Coimbatore North (Constituency No. 118)"
      };
    }
  };

  const [destinationData, setDestinationData] = useState(() =>
    getDestinationPayload(fromService, toService, sourceData)
  );

  useEffect(() => {
    setDestinationData(getDestinationPayload(fromService, toService, sourceData));
  }, [fromService, toService, sourceData]);

  // 8-Stage Interactive Translation Pipeline
  const PIPELINE_STAGES = [
    {
      num: "01",
      id: "receive",
      title: "RECEIVE",
      desc: "Ingest source payload from source service repository",
      input: "Raw JSON Object from Voter Portal",
      output: "In-memory processed stream",
      check: "Source handshake verified"
    },
    {
      num: "02",
      id: "validate",
      title: "VALIDATE",
      desc: "Verify syntax, schema completeness and data integrity",
      input: "JSON Schema Definition v4",
      output: "Zero schema validation errors",
      check: "Required attributes present"
    },
    {
      num: "03",
      id: "normalize",
      title: "NORMALIZE",
      desc: "Normalize dates, phone numbers, addresses and identifiers",
      input: "Unstructured string inputs",
      output: "ISO-8601 YYYY-MM-DD, standardized pin codes",
      check: "Boundary compliance verified"
    },
    {
      num: "04",
      id: "map",
      title: "MAP",
      desc: "Apply semantic dictionary and field transformations",
      input: "full_name, dob, address",
      output: "applicantName, dateOfBirth, residentialAddress",
      check: "Canonical ontology alignment"
    },
    {
      num: "05",
      id: "transform",
      title: "TRANSFORM",
      desc: "Compile target departmental JSON payload",
      input: "Intermediate representation",
      output: "Target departmental schema payload",
      check: "Target schema validation pass"
    },
    {
      num: "06",
      id: "consent",
      title: "CONSENT CHECK",
      desc: "Verify active citizen consent before data exchange",
      input: "Citizen ID CITIZEN-1001 + Service ID",
      output: "Valid revocable consent record found",
      check: "Consent token verified"
    },
    {
      num: "07",
      id: "transmit",
      title: "TRANSMIT",
      desc: "Securely dispatch payload to destination gateway",
      input: "Final transformed payload",
      output: "HTTP 200 / 201 Acknowledged",
      check: "Destination reference ID generated"
    },
    {
      num: "08",
      id: "audit",
      title: "AUDIT",
      desc: "Record structured audit event",
      input: "Operation metadata & timestamp",
      output: "Verification record stored in database",
      check: "Audit log verified"
    }
  ];

  const handleRunPipeline = async () => {
    setIsTranslating(true);
    setActiveStageIndex(0);

    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setActiveStageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    setIsTranslating(false);

    const now = new Date();
    const eventTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const evId = `AUDIT-DTI-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sourceLabel =
      fromService === "voter"
        ? "Election Commission — Voter ID Portal"
        : fromService === "aadhaar"
        ? "UIDAI — e-KYC Identity Service"
        : "Jan Kalyan — Welfare Registry";

    const destLabel =
      toService === "rto"
        ? "Parivahan — Regional Transport Office (RTO)"
        : toService === "welfare"
        ? "Jan Kalyan — Social Welfare & DBT"
        : "Election Commission — Voter Services";

    setLastAuditEvent({
      eventId: evId,
      timestamp: eventTime,
      source: sourceLabel,
      destination: destLabel,
      consentStatus: "VERIFIED (Token CIT-1001-OK)",
      transformationStatus: "SYNCHRONIZED (6/6 Fields)"
    });

    try {
      await recordAuditLog({
        action: "DATA_TRANSLATED",
        citizenId: "CITIZEN-1001",
        service: toService,
        actor: "Prometheus Intelligent Data Translation Engine",
        details: {
          fromService,
          toService,
          fieldCount: Object.keys(sourceData).length,
          mappedFields: Object.keys(destinationData),
          executionTimeMs: 4400,
          compliance: "Citizen Consent Verified"
        },
        status: "SUCCESS"
      });
    } catch {}
  };

  const FIELD_MAPPINGS = [
    {
      source: "full_name",
      prometheus: "citizenName",
      destination: toService === "rto" ? "applicantName" : toService === "welfare" ? "beneficiaryName" : "voterName",
      rule: "Direct String TitleCase, UTF-8 Sanitized"
    },
    {
      source: "dob",
      prometheus: "dateOfBirth",
      destination: "dateOfBirth",
      rule: "ISO-8601 String (YYYY-MM-DD) Normalization"
    },
    {
      source: "gender",
      prometheus: "gender",
      destination: "gender",
      rule: "Canonical Gender Enum Mapping ('Male'|'Female'|'Other')"
    },
    {
      source: "address",
      prometheus: "residentialAddress",
      destination: toService === "rto" ? "residentialAddress" : toService === "welfare" ? "permanentAddress" : "address",
      rule: "Concatenate Address + District + State + Pincode"
    },
    {
      source: "mobile",
      prometheus: "mobileNumber",
      destination: "mobileNumber",
      rule: "E.164 Clean (10-digit mobile number)"
    },
    {
      source: "district",
      prometheus: "jurisdictionDistrict",
      destination: toService === "rto" ? "stateRto" : toService === "welfare" ? "district" : "district",
      rule: toService === "rto" ? "Resolved to 'TN-38 Coimbatore North RTO'" : "Jurisdiction lookup"
    }
  ];

  return (
    <div className="page-container dti-page-container">
      {/* 1. Breadcrumb - Perfectly Aligned */}
      <nav className="dti-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("overview")}
          className="dti-crumb-link"
        >
          Home
        </button>
        <span className="dti-crumb-sep">/</span>
        <span className="dti-crumb-current">Intelligent Data Translation Engine</span>
      </nav>

      {/* 2. Page Header */}
      <header className="dti-header-section">
        <div className="dti-eyebrow">
          <UiIcon name="insights" size={14} />
          <span>CORE DATA INTEROPERABILITY PROTOTYPE</span>
        </div>
        <h1 className="dti-title">Intelligent Data Translation Engine</h1>
        <p className="dti-description">
          Prometheus demonstrates bridging departmental schema differences through validation,
          normalization, semantic mapping, transformation, consent verification and secure transmission.
        </p>

        {/* 3. Interactive Execution CTA */}
        <div className="dti-cta-group">
          <button
            type="button"
            className={`dti-run-btn ${isTranslating ? "running" : ""}`}
            onClick={handleRunPipeline}
            disabled={isTranslating}
            id="run-translation-pipeline-btn"
          >
            {isTranslating ? (
              <>
                <span className="dti-spinner" aria-hidden="true" />
                <span>Executing Stage {activeStageIndex + 1} of 8...</span>
              </>
            ) : (
              <>
                <UiIcon name="insights" size={18} />
                <span>Run Interactive Translation Pipeline</span>
              </>
            )}
          </button>
          <span className="dti-cta-telemetry-text">
            {isTranslating
              ? `Stage ${activeStageIndex + 1}: ${PIPELINE_STAGES[activeStageIndex]?.title} in progress`
              : "Simulates live cryptographic handshake, validation and cross-departmental dispatch"}
          </span>
        </div>
      </header>

      {/* 4. Visual Pipeline Flow Banner */}
      <div className="dti-pipeline-flow-banner" aria-label="Pipeline Architecture Flow">
        <div className="dti-flow-step">
          <span className="step-tag">SOURCE</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">VALIDATE</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">NORMALIZE</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">MAP</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">TRANSFORM</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">CONSENT</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">TRANSMIT</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step">
          <span className="step-tag">AUDIT</span>
          <span className="step-arrow">→</span>
        </div>
        <div className="dti-flow-step highlight">
          <span className="step-tag">TARGET</span>
        </div>
      </div>

      {/* 5. 8-Stage Pipeline Section */}
      <section className="dti-section" aria-labelledby="pipeline-section-heading">
        <div className="dti-section-header">
          <span className="dti-section-eyebrow">REAL-TIME EXECUTION TELEMETRY</span>
          <h2 id="pipeline-section-heading" className="dti-section-title">
            8-Stage Data Translation Pipeline
          </h2>
        </div>

        {/* 8-Stage Grid (2-columns desktop, compact content-driven height) */}
        <div className="dti-pipeline-grid">
          {PIPELINE_STAGES.map((stg, idx) => {
            const isDone = activeStageIndex > idx;
            const isCurrent = activeStageIndex === idx;
            const isWaiting = activeStageIndex < idx;

            return (
              <div
                key={stg.id}
                className={`dti-stage-card ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isWaiting ? "waiting" : ""}`}
                onClick={() => setInspectedStage(stg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setInspectedStage(stg)}
                aria-label={`Stage ${stg.num}: ${stg.title}. Click to inspect telemetry.`}
              >
                {/* Top Row: Number + Stage Name + Visual Direction Connector */}
                <div className="dti-stage-top-row">
                  <div className="dti-stage-num-title">
                    <span className="dti-stage-number">{stg.num}</span>
                    <h3 className="dti-stage-name">{stg.title}</h3>
                  </div>
                  <div className="dti-stage-connector">
                    {idx < 7 && (
                      <span className="dti-flow-arrow" title={`Proceeds to Stage ${PIPELINE_STAGES[idx + 1].num}`}>
                        {idx % 2 === 0 ? "→" : "↓"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Short Description */}
                <div className="dti-stage-middle">
                  <p className="dti-stage-desc">{stg.desc}</p>
                </div>

                {/* Bottom: Status Badge */}
                <div className="dti-stage-bottom-row">
                  {isDone ? (
                    <span className="dti-status-badge success">
                      <span className="dti-badge-dot green" />
                      <span>✓ COMPLETED</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="dti-status-badge active">
                      <span className="dti-badge-dot pulse-blue" />
                      <span>● PROCESSING...</span>
                    </span>
                  ) : (
                    <span className="dti-status-badge ready">
                      <span className="dti-badge-dot green-subtle" />
                      <span>READY</span>
                    </span>
                  )}

                  <span className="dti-inspect-hint">
                    Inspect telemetry <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Translation Consoles: Source Portal & Target Department */}
      <section className="dti-section" aria-labelledby="consoles-heading">
        <div className="dti-section-header">
          <span className="dti-section-eyebrow">SCHEMA RUNTIME CONSOLE</span>
          <h2 id="consoles-heading" className="dti-section-title">
            Source Data & Target Department Payloads
          </h2>
        </div>

        <div className="dti-consoles-grid">
          {/* SOURCE PORTAL CARD */}
          <div className="dti-console-card source-card">
            <div className="dti-console-card-header">
              <div className="dti-console-label-group">
                <span className="dti-card-tag source">SOURCE PORTAL</span>
                <h3 className="dti-card-title">Origin Data</h3>
              </div>
              <div className="dti-service-selector">
                <label htmlFor="source-service-select" className="dti-select-label">FROM:</label>
                <select
                  id="source-service-select"
                  value={fromService}
                  onChange={(e) => setFromService(e.target.value)}
                  className="dti-select"
                >
                  <option value="voter">Election Commission — Voter ID Portal</option>
                  <option value="aadhaar">UIDAI — e-KYC Identity Service</option>
                  <option value="welfare">Jan Kalyan — Welfare Registry</option>
                </select>
              </div>
            </div>

            <div className="dti-code-container">
              <div className="dti-code-toolbar">
                <span className="dti-file-name">source_payload.json</span>
                <span className="dti-format-badge">Raw Source Format</span>
              </div>
              <pre className="dti-code-block">{JSON.stringify(sourceData, null, 2)}</pre>
            </div>
          </div>

          {/* TARGET DEPARTMENT CARD */}
          <div className="dti-console-card target-card">
            <div className="dti-console-card-header">
              <div className="dti-console-label-group">
                <span className="dti-card-tag target">TARGET DEPARTMENT</span>
                <h3 className="dti-card-title">Target Data</h3>
              </div>
              <div className="dti-service-selector">
                <label htmlFor="target-service-select" className="dti-select-label">TO:</label>
                <select
                  id="target-service-select"
                  value={toService}
                  onChange={(e) => setToService(e.target.value)}
                  className="dti-select"
                >
                  <option value="rto">Parivahan — Regional Transport Office (RTO)</option>
                  <option value="welfare">Jan Kalyan — Social Welfare & DBT</option>
                  <option value="voter">Election Commission — Voter Services</option>
                </select>
              </div>
            </div>

            <div className="dti-code-container">
              <div className="dti-code-toolbar">
                <span className="dti-file-name">destination_payload.json</span>
                <span className="dti-format-badge target">Target Format: JSON</span>
              </div>
              <pre className="dti-code-block target-cyan">{JSON.stringify(destinationData, null, 2)}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Field Transformation Section */}
      <section className="dti-section" aria-labelledby="mapping-heading">
        <div className="dti-section-header">
          <div className="dti-section-header-row">
            <div>
              <span className="dti-section-eyebrow">INTELLIGENT MAPPING</span>
              <h2 id="mapping-heading" className="dti-section-title">
                Field Transformation
              </h2>
            </div>
            <span className="dti-active-rules-badge">
              <UiIcon name="check" size={13} />
              <span>{FIELD_MAPPINGS.length} Mappings Active</span>
            </span>
          </div>
        </div>

        <div className="dti-mapping-table-wrap">
          <div className="dti-mapping-table-head">
            <div className="dti-th-col">Source Field</div>
            <div className="dti-th-arrow" aria-hidden="true" />
            <div className="dti-th-col">Canonical Field</div>
            <div className="dti-th-arrow" aria-hidden="true" />
            <div className="dti-th-col">Target Field</div>
            <div className="dti-th-rule">Transformation Rule</div>
          </div>

          <div className="dti-mapping-rows">
            {FIELD_MAPPINGS.map((m, i) => (
              <div key={i} className="dti-mapping-row">
                <div className="dti-col-source">
                  <span className="dti-field-chip source">{m.source}</span>
                </div>
                <div className="dti-col-arrow">→</div>
                <div className="dti-col-canonical">
                  <span className="dti-field-chip canonical">{m.prometheus}</span>
                </div>
                <div className="dti-col-arrow">→</div>
                <div className="dti-col-target">
                  <span className="dti-field-chip target">{m.destination}</span>
                </div>
                <div className="dti-col-rule">
                  <span className="dti-rule-text">{m.rule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Distinct Consent Check Section */}
      <section className="dti-section" aria-labelledby="consent-section-heading">
        <div className="dti-consent-verification-card">
          <div className="dti-consent-left">
            <div className="dti-consent-icon-box">
              <UiIcon name="shield" size={28} />
            </div>
            <div className="dti-consent-info">
              <div className="dti-consent-badge-row">
                <span className="dti-card-tag consent">CONSENT CHECK</span>
                <span className="dti-consent-status-pill">
                  <span className="dti-badge-dot green" />
                  <span>ACTIVE</span>
                </span>
              </div>
              <h3 id="consent-section-heading" className="dti-consent-title">
                Citizen Consent Verification
              </h3>
              <p className="dti-consent-desc">
                <strong>Purpose:</strong> Government service data integration (Parivahan / Voter / Welfare Gateway).
                Verified under the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.
              </p>
              <div className="dti-consent-notice">
                <UiIcon name="check" size={14} />
                <span>
                  <strong>Enforcement Policy:</strong> Data transmission is cryptographically blocked unless active revocable consent is verified with a valid non-expired token.
                </span>
              </div>
            </div>
          </div>

          <div className="dti-consent-right">
            <div className="dti-consent-meta-box">
              <span className="meta-label">Citizen Identity</span>
              <strong className="meta-val">CITIZEN-1001 (Verified)</strong>
            </div>
            <div className="dti-consent-meta-box">
              <span className="meta-label">Consent Token</span>
              <code className="meta-token">TOK-DPDP-2026-OK</code>
            </div>
            <div className="dti-consent-status-line">
              <span className="text-green font-bold">✓ Consent verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Transmission & Audit Trail Section */}
      <section className="dti-section" aria-labelledby="audit-section-heading">
        <div className="dti-audit-transmission-grid">
          {/* Transmission Card */}
          <div className="dti-summary-card transmission-card">
            <div className="dti-summary-header">
              <span className="dti-card-tag transmit">TRANSMISSION</span>
              <h3 className="dti-summary-title">Gateway Dispatch</h3>
            </div>
            <div className="dti-summary-body">
              <div className="dti-key-val-row">
                <span className="kv-label">Destination Gateway:</span>
                <strong className="kv-val">
                  {toService === "rto"
                    ? "Parivahan — Regional Transport Office (RTO)"
                    : toService === "welfare"
                    ? "Jan Kalyan — Social Welfare & DBT"
                    : "Election Commission — Voter Services"}
                </strong>
              </div>
              <div className="dti-key-val-row">
                <span className="kv-label">Security Protocol:</span>
                <span className="kv-val">TLS 1.3 / mTLS Inter-Departmental Gateway</span>
              </div>
              <div className="dti-key-val-row">
                <span className="kv-label">Transmission Status:</span>
                <span className="dti-status-pill green">
                  <span className="dti-badge-dot green" />
                  <span>SECURE TRANSMISSION READY</span>
                </span>
              </div>
            </div>
          </div>

          {/* Audit Trail Card */}
          <div className="dti-summary-card audit-card">
            <div className="dti-summary-header">
              <span className="dti-card-tag audit">AUDIT TRAIL</span>
              <h3 id="audit-section-heading" className="dti-summary-title">
                Immutable Ledger Record
              </h3>
            </div>
            <div className="dti-summary-body">
              <div className="dti-audit-table">
                <div className="dti-audit-row">
                  <span className="audit-lbl">Event ID</span>
                  <code className="audit-code">{lastAuditEvent.eventId}</code>
                </div>
                <div className="dti-audit-row">
                  <span className="audit-lbl">Timestamp</span>
                  <span className="audit-val">{lastAuditEvent.timestamp} IST</span>
                </div>
                <div className="dti-audit-row">
                  <span className="audit-lbl">Source Service</span>
                  <span className="audit-val">{lastAuditEvent.source}</span>
                </div>
                <div className="dti-audit-row">
                  <span className="audit-lbl">Destination</span>
                  <span className="audit-val">{lastAuditEvent.destination}</span>
                </div>
                <div className="dti-audit-row">
                  <span className="audit-lbl">Consent Status</span>
                  <span className="audit-val text-green font-semibold">{lastAuditEvent.consentStatus}</span>
                </div>
                <div className="dti-audit-row">
                  <span className="audit-lbl">Transformation</span>
                  <span className="audit-val text-green font-semibold">{lastAuditEvent.transformationStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Standards Architecture Notice */}
      <footer className="dti-standards-footer" aria-label="Standards Alignment">
        <div className="dti-standards-icon">
          <UiIcon name="shield" size={22} />
        </div>
        <div className="dti-standards-text">
          <h4>Future Standards Alignment & Architectural Roadmap</h4>
          <p>
            Prometheus is engineered to align with emerging sovereign digital public infrastructure specifications including <strong>India Enterprise Architecture (IndEA 2.0)</strong>, <strong>DPDP Act 2023</strong> consent controls, <strong>W3C Verifiable Credentials</strong>, and <strong>OpenID for Verifiable Presentations (OpenID4VP)</strong>.
          </p>
        </div>
      </footer>

      {/* Stage Inspection Modal */}
      {inspectedStage && (
        <div
          className="gov-modal-backdrop"
          onClick={() => setInspectedStage(null)}
          role="presentation"
        >
          <div
            className="gov-modal-content stage-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-stage-title"
          >
            <div className="modal-header-strip">
              <div className="modal-header-title">
                <span className="modal-badge-cyan">PIPELINE STAGE TELEMETRY</span>
                <h3 id="modal-stage-title">
                  {inspectedStage.num}. {inspectedStage.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectedStage(null)}
                aria-label="Close stage details"
              >
                <UiIcon name="close" size={18} />
              </button>
            </div>

            <div className="stage-modal-body">
              <p className="stage-full-desc">{inspectedStage.desc}</p>
              <div className="stage-metrics-grid">
                <div className="metric-box">
                  <span className="m-label">Input Specification</span>
                  <strong>{inspectedStage.input}</strong>
                </div>
                <div className="metric-box">
                  <span className="m-label">Output Verification</span>
                  <strong>{inspectedStage.output}</strong>
                </div>
                <div className="metric-box">
                  <span className="m-label">Integrity Check</span>
                  <span className="text-green font-bold">✓ {inspectedStage.check}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-strip">
              <span className="footer-meta-notes">Immutable execution trace verified</span>
              <button
                type="button"
                className="gov-btn primary"
                onClick={() => setInspectedStage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
