import React, { useState } from "react";
import UiIcon from "../UiIcon";

export default function EndToEndFlowchart() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const FLOW_NODES = [
    {
      id: 1,
      num: "01",
      title: "CITIZEN",
      desc: "Starts a government service request",
      icon: "user",
      theme: "blue",
      badgeText: "Initiation",
      detailedTitle: "Citizen Access & Session Initiation",
      explanation: "The citizen accesses Prometheus via a single unified interface. Instead of navigating dozens of disconnected state portals, citizens begin any application journey from one verified gateway.",
      securityGuarantee: "Zero client-side credential storage; strict Content Security Policy (CSP)."
    },
    {
      id: 2,
      num: "02",
      title: "DIGITAL IDENTITY",
      desc: "Identity is verified",
      icon: "shield",
      theme: "indigo",
      badgeText: "Identity",
      detailedTitle: "Sovereign Digital Identity Verification",
      explanation: "Identity is verified using Level-3 Sovereign e-KYC and authenticated citizen claims. This confirms the citizen's authentic civil status without requiring repetitive physical photocopies or in-person visits.",
      securityGuarantee: "Ephemeral signed JSON Web Tokens (JWT) bound to sovereign citizen identifier (CITIZEN-1001)."
    },
    {
      id: 3,
      num: "03",
      title: "CONSENT",
      desc: "Citizen authorizes required data",
      icon: "badgeCheck",
      theme: "green",
      badgeText: "DPDP 2023",
      detailedTitle: "Explicit Purpose-Bound Citizen Consent",
      explanation: "Before any service receives citizen information, Prometheus checks whether the citizen has authorized the requested data. The citizen explicitly sees what attributes are needed and why.",
      securityGuarantee: "Full compliance with India's DPDP Act 2023. Real-time revocation capability."
    },
    {
      id: 4,
      num: "04",
      title: "SELECT SERVICE",
      desc: "Voter ID • RTO • Welfare",
      icon: "building",
      theme: "cyan",
      badgeText: "Catalog",
      detailedTitle: "Service Selection & Requirement Resolution",
      explanation: "The citizen selects the target public service (such as Driving Licence renewal, Voter Roll registration, or Jan Kalyan Welfare subsidies). Prometheus determines the exact schema requirements.",
      securityGuarantee: "Declarative service schema registries ensure only necessary attributes are requested."
    },
    {
      id: 5,
      num: "05",
      title: "SOURCE PORTAL",
      desc: "Existing government data",
      icon: "database",
      theme: "blue",
      badgeText: "Source",
      detailedTitle: "Source Department Verification",
      explanation: "Prometheus reaches out to the authentic source repository (e.g. Election Commission voter database or civil registry) where verified records already exist.",
      securityGuarantee: "Direct bi-directional connector authentication; authentic authority verification."
    },
    {
      id: 6,
      num: "06",
      title: "PROMETHEUS ENGINE",
      desc: "Receive → Validate → Normalize → Map → Transform",
      icon: "cpu",
      theme: "purple",
      badgeText: "Core Interop",
      detailedTitle: "Intelligent Data Translation Engine",
      explanation: "Prometheus validates, normalizes, maps and transforms source data into the schema required by the destination service. This occurs in memory without creating a centralized vulnerable database.",
      securityGuarantee: "Pure in-memory execution; zero persistent retention of citizen payloads."
    },
    {
      id: 7,
      num: "07",
      title: "SECURITY CHECK",
      desc: "Consent + authorization + validation",
      icon: "lock",
      theme: "indigo",
      badgeText: "Security",
      detailedTitle: "Zero-Trust Security & Authorization Enforcement",
      explanation: "Before dispatching the translated payload, Prometheus performs a secondary cryptographic security audit verifying that the consent token is active and the destination endpoint is genuine.",
      securityGuarantee: "SHA-256 hash lineage generated; append-only audit verification."
    },
    {
      id: 8,
      num: "08",
      title: "TARGET PORTAL",
      desc: "Government service receives compatible data",
      icon: "government",
      theme: "navy",
      badgeText: "Target",
      detailedTitle: "Target Department Ingestion",
      explanation: "The target government department (e.g. MoRTH Parivahan RTO) receives the payload in its exact native format, completely eliminating manual clerk data re-entry.",
      securityGuarantee: "Encrypted mTLS transmission directly to official departmental endpoint."
    },
    {
      id: 9,
      num: "09",
      title: "AUTO-FILLED APPLICATION",
      desc: "Citizen data is automatically populated",
      icon: "checkCircle",
      theme: "cyan",
      badgeText: "Auto-Fill",
      detailedTitle: "One-Click Application Completion",
      explanation: "The destination portal's application forms are pre-populated with 100% verified citizen data. The citizen merely reviews the pre-filled fields and submits the form.",
      securityGuarantee: "Zero transcription errors; guaranteed verified document authenticity."
    },
    {
      id: 10,
      num: "10",
      title: "TRACK & COMPLETE",
      desc: "Citizen tracks application status",
      icon: "activity",
      theme: "green",
      badgeText: "Tracking",
      detailedTitle: "Cross-Departmental Tracking & Certificate Delivery",
      explanation: "The application is registered in the Prometheus Unified Application Tracking ledger. The citizen follows real-time departmental progress from submission to official certificate issuance.",
      securityGuarantee: "Tamper-evident status callbacks and direct digital certificate receipt."
    }
  ];

  const activeNode = FLOW_NODES.find((n) => n.id === selectedNodeId);

  return (
    <section id="workflow-journey" className="end-to-end-flowchart-section" aria-labelledby="flowchart-heading">
      <div className="flowchart-section-header">
        <span className="section-eyebrow">VISUAL SYSTEM JOURNEY</span>
        <h2 id="flowchart-heading" className="flowchart-main-title">
          The Complete Citizen-to-Government Flow
        </h2>
        <p className="flowchart-subtitle">
          Follow the 10 connected stages that bridge citizen identity with departmental public services. Click any node to inspect what happens under the hood.
        </p>
      </div>

      {/* Connected Flowchart Layout */}
      <div className="flowchart-canvas" role="region" aria-label="10-stage system workflow diagram">
        {/* Row 1: Nodes 1 to 5 */}
        <div className="flowchart-row row-first">
          {FLOW_NODES.slice(0, 5).map((node, index) => {
            const isLastInRow = index === 4;
            return (
              <React.Fragment key={node.id}>
                <div
                  className={`flow-node-card theme-${node.theme} ${selectedNodeId === node.id ? "is-active" : ""}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedNodeId(node.id)}
                  aria-label={`Step ${node.num}: ${node.title}. ${node.desc}`}
                >
                  <div className="node-card-top">
                    <span className="node-num-tag">{node.num}</span>
                    <div className="node-icon-circle">
                      <UiIcon name={node.icon} size={18} />
                    </div>
                  </div>

                  <div className="node-content">
                    <h3 className="node-title">{node.title}</h3>
                    <p className="node-desc">{node.desc}</p>
                  </div>

                  <div className="node-footer-bar">
                    <span className="node-badge-text">{node.badgeText}</span>
                    <UiIcon name="chevronRight" size={12} className="node-expand-icon" />
                  </div>
                </div>

                {!isLastInRow && (
                  <div className="flow-arrow-connector horizontal" aria-hidden="true">
                    <div className="connector-line">
                      <span className="connector-pulse-dot" />
                    </div>
                    <UiIcon name="arrowRight" size={16} className="arrow-head-icon" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Turn Connector between Row 1 and Row 2 on Desktop */}
        <div className="flowchart-turn-connector-desktop" aria-hidden="true">
          <div className="turn-rail-wrap">
            <span className="turn-label">INTEROPERABILITY LAYER</span>
            <div className="turn-arrow-down">
              <UiIcon name="chevronDown" size={20} />
            </div>
          </div>
        </div>

        {/* Row 2: Nodes 6 to 10 */}
        <div className="flowchart-row row-second">
          {FLOW_NODES.slice(5, 10).map((node, index) => {
            const isLastInRow = index === 4;
            const isEngine = node.id === 6;

            return (
              <React.Fragment key={node.id}>
                <div
                  className={`flow-node-card theme-${node.theme} ${isEngine ? "engine-special-card" : ""} ${selectedNodeId === node.id ? "is-active" : ""}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedNodeId(node.id)}
                  aria-label={`Step ${node.num}: ${node.title}. ${node.desc}`}
                >
                  <div className="node-card-top">
                    <span className="node-num-tag">{node.num}</span>
                    <div className="node-icon-circle">
                      <UiIcon name={node.icon} size={18} />
                    </div>
                  </div>

                  <div className="node-content">
                    <h3 className="node-title">{node.title}</h3>
                    <p className="node-desc">{node.desc}</p>
                  </div>

                  <div className="node-footer-bar">
                    <span className="node-badge-text">{node.badgeText}</span>
                    <UiIcon name="chevronRight" size={12} className="node-expand-icon" />
                  </div>
                </div>

                {!isLastInRow && (
                  <div className="flow-arrow-connector horizontal" aria-hidden="true">
                    <div className="connector-line">
                      <span className="connector-pulse-dot" />
                    </div>
                    <UiIcon name="arrowRight" size={16} className="arrow-head-icon" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Modal / Inspector Drawer */}
      {activeNode && (
        <div
          className="flow-detail-backdrop"
          onClick={() => setSelectedNodeId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="flow-detail-title"
        >
          <div className="flow-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <div className="detail-title-group">
                <span className={`detail-step-chip theme-${activeNode.theme}`}>
                  STEP {activeNode.num}
                </span>
                <h3 id="flow-detail-title">{activeNode.detailedTitle}</h3>
              </div>
              <button
                type="button"
                className="detail-close-btn"
                onClick={() => setSelectedNodeId(null)}
                aria-label="Close stage details"
              >
                <UiIcon name="close" size={18} />
              </button>
            </div>

            <div className="detail-modal-body">
              <div className="detail-section">
                <span className="detail-section-lbl">What happens here?</span>
                <p className="detail-explanation-text">{activeNode.explanation}</p>
              </div>

              <div className="detail-section security-box">
                <span className="detail-section-lbl">Security &amp; Privacy Guarantee:</span>
                <div className="security-guarantee-line">
                  <UiIcon name="shield" size={15} className="text-cyan" />
                  <span>{activeNode.securityGuarantee}</span>
                </div>
              </div>
            </div>

            <div className="detail-modal-footer">
              <button
                type="button"
                className="gov-btn secondary"
                disabled={activeNode.id === 1}
                onClick={() => setSelectedNodeId(activeNode.id - 1)}
              >
                <UiIcon name="arrowLeft" size={14} />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                className="gov-btn primary"
                disabled={activeNode.id === 10}
                onClick={() => setSelectedNodeId(activeNode.id + 1)}
              >
                <span>Next Step</span>
                <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
