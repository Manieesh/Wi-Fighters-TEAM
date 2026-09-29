import React from "react";
import PrometheusLogo from "./PrometheusLogo";
import UiIcon from "./UiIcon";

export default function NetworkVisualization({ onSelectService }) {
  const CONNECTED_SERVICES = [
    { id: "voter", name: "Voter Portal", dept: "Election Commission", status: "Active", x: 620, y: 70, color: "#3B82F6", icon: "identity" },
    { id: "rto", name: "RTO Portal", dept: "Parivahan / Transport", status: "Active", x: 730, y: 320, color: "#10B981", icon: "transport" },
    { id: "welfare", name: "Welfare Portal", dept: "Social Justice & DBT", status: "Active", x: 130, y: 220, color: "#F59E0B", icon: "welfare" }
  ];

  const FUTURE_SERVICES = [
    { id: "passport", name: "Passport Seva", status: "Phase 2 Planned", x: 260, y: 440, color: "#64748B" },
    { id: "property", name: "Property Registry", status: "Phase 2 Planned", x: 440, y: 460, color: "#64748B" },
    { id: "education", name: "Higher Education", status: "Phase 2 Planned", x: 620, y: 450, color: "#64748B" },
    { id: "tax", name: "Direct Tax / GST", status: "Phase 3 Planned", x: 740, y: 190, color: "#64748B" },
    { id: "health", name: "ABHA Health Grid", status: "Phase 3 Planned", x: 250, y: 90, color: "#64748B" }
  ];

  // Center coordinate of Prometheus Hub in 860x520 canvas
  const CX = 430;
  const CY = 240;

  return (
    <div className="network-visualization-container" aria-label="Prometheus Interoperability Grid">
      <div className="network-vis-header">
        <div className="vis-tag">
          <span className="live-pulse" />
          <span>SOVEREIGN INTEROPERABILITY NETWORK</span>
        </div>
        <h3>Live Public Infrastructure Topology</h3>
        <p>
          Animated telemetry particles indicate real-time canonical data normalization between connected sovereign portals and Prometheus.
        </p>
      </div>

      <div className="network-svg-stage">
        <svg viewBox="0 0 860 520" className="network-svg-canvas">
          <defs>
            {/* Glowing lines gradients */}
            <linearGradient id="lineGradVoter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="lineGradRto" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="lineGradWelfare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.3" />
            </linearGradient>

            {/* Particle Glow Filter */}
            <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connected Lines to Active Services */}
          {CONNECTED_SERVICES.map((s) => (
            <g key={s.id}>
              {/* Background ambient line */}
              <line
                x1={CX}
                y1={CY}
                x2={s.x}
                y2={s.y}
                stroke={s.color}
                strokeWidth="2"
                strokeOpacity="0.45"
                strokeDasharray="6 4"
              />

              {/* Animated pulsing data beam */}
              <line
                x1={CX}
                y1={CY}
                x2={s.x}
                y2={s.y}
                stroke="#00E5FF"
                strokeWidth="2.5"
                strokeOpacity="0.9"
                strokeDasharray="14 180"
                className="animated-data-beam"
              />

              {/* Data particle 1 (outbound) */}
              <circle r="4" fill="#00E5FF" filter="url(#particleGlow)">
                <animateMotion
                  path={`M ${CX} ${CY} L ${s.x} ${s.y}`}
                  dur={`${4.5 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Data particle 2 (inbound) */}
              <circle r="3.5" fill="#3B82F6" filter="url(#particleGlow)">
                <animateMotion
                  path={`M ${s.x} ${s.y} L ${CX} ${CY}`}
                  dur={`${4.2 + Math.random()}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Dotted lines to Planned Future Services */}
          {FUTURE_SERVICES.map((fs) => (
            <line
              key={fs.id}
              x1={CX}
              y1={CY}
              x2={fs.x}
              y2={fs.y}
              stroke="#64748B"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.3"
            />
          ))}

          {/* Central Prometheus Hub Outer Pulse Rings */}
          <circle cx={CX} cy={CY} r="68" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.5" className="animate-ping-slow" />
          <circle cx={CX} cy={CY} r="88" fill="none" stroke="rgba(37, 99, 235, 0.12)" strokeWidth="1" />
        </svg>

        {/* Central Prometheus Sovereign Emblem */}
        <div className="net-hub-center" style={{ left: `${(CX / 860) * 100}%`, top: `${(CY / 520) * 100}%` }}>
          <PrometheusLogo size="lg" />
          <div className="hub-label-card">
            <strong>PROMETHEUS</strong>
            <span>Sovereign DPI Hub</span>
          </div>
        </div>

        {/* Active Connected Service Nodes (HTML interactive overlays) */}
        {CONNECTED_SERVICES.map((s) => (
          <div
            key={s.id}
            className="net-node-card active"
            style={{ left: `${(s.x / 860) * 100}%`, top: `${(s.y / 520) * 100}%`, borderColor: s.color }}
            onClick={() => onSelectService && onSelectService(s.id)}
            role="button"
            tabIndex={0}
          >
            <div className="node-icon-box" style={{ background: s.color }}>
              <UiIcon name={s.icon} size={16} />
            </div>
            <div className="node-info">
              <strong>{s.name}</strong>
              <span>{s.dept}</span>
              <div className="node-status-line">
                <span className="green-dot" />
                <span>Connected & Verified</span>
              </div>
            </div>
          </div>
        ))}

        {/* Future Services Nodes */}
        {FUTURE_SERVICES.map((fs) => (
          <div
            key={fs.id}
            className="net-node-card planned"
            style={{ left: `${(fs.x / 860) * 100}%`, top: `${(fs.y / 520) * 100}%` }}
          >
            <div className="node-info">
              <strong className="text-muted">{fs.name}</strong>
              <span className="planned-badge">{fs.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
