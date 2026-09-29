import React from "react";
import UiIcon from "../UiIcon";
import PrometheusLogo from "../PrometheusLogo";

export default function IntelligentEngineDetail() {
  const MINI_STAGES = [
    {
      id: "receive",
      title: "RECEIVE",
      desc: "Ingest source data",
      icon: "database"
    },
    {
      id: "validate",
      title: "VALIDATE",
      desc: "Check schema and integrity",
      icon: "badgeCheck"
    },
    {
      id: "normalize",
      title: "NORMALIZE",
      desc: "Standardize values and formats",
      icon: "cpu"
    },
    {
      id: "map",
      title: "MAP",
      desc: "Match source fields to target fields",
      icon: "network"
    },
    {
      id: "transform",
      title: "TRANSFORM",
      desc: "Create destination-compatible payload",
      icon: "zap"
    },
    {
      id: "secure",
      title: "SECURE",
      desc: "Apply consent and authorization rules",
      icon: "lock"
    }
  ];

  return (
    <section className="intelligent-engine-detail-section" aria-labelledby="engine-detail-heading">
      <div className="engine-showcase-container">
        {/* Card Header */}
        <div className="engine-card-top-header">
          <div className="engine-brand-pill">
            <PrometheusLogo size="sm" />
            <span className="brand-pill-text">PROMETHEUS CORE INTEROPERABILITY</span>
          </div>
          <h2 id="engine-detail-heading" className="engine-card-title">
            Intelligent Data Translation Engine
          </h2>
          <p className="engine-card-subtitle">
            Different government systems use different data formats. Prometheus translates the information into the format required by the destination service in memory.
          </p>
        </div>

        {/* Mini Flow Pipeline */}
        <div className="engine-mini-pipeline-wrap" role="region" aria-label="Engine mini translation pipeline">
          {/* Source Data Input Pill */}
          <div className="pipeline-terminal-pill source-terminal">
            <UiIcon name="database" size={14} />
            <span>SOURCE DATA</span>
          </div>

          <div className="pipeline-terminal-arrow" aria-hidden="true">
            <UiIcon name="arrowRight" size={14} />
          </div>

          {/* 6 Compact Internal Stages */}
          <div className="mini-stages-grid">
            {MINI_STAGES.map((stg, index) => {
              const isLast = index === MINI_STAGES.length - 1;
              return (
                <React.Fragment key={stg.id}>
                  <div className="mini-stage-node">
                    <div className="mini-stage-icon-wrap">
                      <UiIcon name={stg.icon} size={15} />
                    </div>
                    <strong className="mini-stage-title">{stg.title}</strong>
                    <span className="mini-stage-desc">{stg.desc}</span>
                  </div>

                  {!isLast && (
                    <div className="mini-stage-arrow" aria-hidden="true">
                      <UiIcon name="arrowRight" size={12} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="pipeline-terminal-arrow" aria-hidden="true">
            <UiIcon name="arrowRight" size={14} />
          </div>

          {/* Target Data Output Pill */}
          <div className="pipeline-terminal-pill target-terminal">
            <UiIcon name="checkCircle" size={14} />
            <span>TARGET DATA</span>
          </div>
        </div>

        {/* Trust & Non-Storage Guarantee Footer */}
        <div className="engine-card-footer-strip">
          <UiIcon name="shield" size={14} className="text-cyan" />
          <span>Zero Persistent Citizen Data Storage • Pure In-Memory Ephemeral Execution</span>
        </div>
      </div>
    </section>
  );
}
