import React from "react";
import UiIcon from "../UiIcon";

export default function WorkflowHero({ onExploreClick }) {
  const handleScroll = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById("workflow-journey");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section className="workflow-hero-strip" aria-labelledby="workflow-hero-heading">
      <div className="workflow-hero-badge">
        <UiIcon name="shield" size={14} className="text-cyan" />
        <span>INTEROPERABLE DIGITAL PUBLIC INFRASTRUCTURE</span>
      </div>

      <h1 id="workflow-hero-heading" className="workflow-hero-title">
        How Prometheus Works
      </h1>

      <p className="workflow-hero-tagline">
        One citizen identity. Multiple government services. Secure, consent-based data sharing.
      </p>

      <p className="workflow-hero-summary">
        Prometheus connects fragmented government services through a secure integration layer that verifies identity, obtains citizen consent, translates data between different schemas, and securely transfers only the required information.
      </p>

      <div className="workflow-hero-cta">
        <button
          type="button"
          className="gov-btn primary workflow-explore-btn"
          onClick={handleScroll}
        >
          <span>Explore the Workflow</span>
          <UiIcon name="chevronDown" size={16} />
        </button>
      </div>
    </section>
  );
}
