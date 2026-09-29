import React from "react";
import logoAsset from "../assets/prometheus-logo.png";

/**
 * PrometheusLogo
 * 
 * Official Prometheus Digital Governance Logo Component.
 * Features:
 * - Completely static central Prometheus emblem.
 * - High-tech continuous 360° GPU-accelerated orbit ring with glowing blue -> cyan gradient.
 * - Circular glowing nodes travelling along the orbit path with subtle pulsing light.
 * - Gentle glow trail effect.
 * - 100% responsive across desktop, tablet, and mobile with strict aspect-ratio preservation.
 * - Accessible with prefers-reduced-motion support.
 */
export default function PrometheusLogo({
  size = "md",
  className = "",
  showOrbit = true,
  animated = true,
  ariaLabel = "Prometheus - Unified Digital Governance Platform Logo"
}) {
  const sizeClass = typeof size === "string" ? `size-${size}` : "";
  const customStyle = typeof size === "number" ? { "--logo-size": `${size}px` } : undefined;

  return (
    <div
      className={`prometheus-logo-wrapper ${sizeClass} ${!animated ? "static-mode" : ""} ${className}`}
      style={customStyle}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="prometheus-logo-ambient-glow" aria-hidden="true" />

      <div className="prometheus-logo-core">
        <img
          src={logoAsset}
          alt=""
          className="prometheus-logo-img"
          loading="eager"
          decoding="async"
        />
      </div>

      {showOrbit && (
        <div className="prometheus-orbit-stage" aria-hidden="true">
          <div className="prometheus-orbit-plane">
            <div className="prometheus-orbit-track">
              <div className="prometheus-orbit-ring-visual" />
              <div className="prometheus-orbit-trail" />

              <div className="prometheus-orbit-node node-alpha">
                <div className="node-dot" />
              </div>

              <div className="prometheus-orbit-node node-beta">
                <div className="node-dot" />
              </div>

              <div className="prometheus-orbit-node node-gamma">
                <div className="node-dot" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
