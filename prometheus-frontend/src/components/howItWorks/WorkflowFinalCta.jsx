import React from "react";
import UiIcon from "../UiIcon";

export default function WorkflowFinalCta({ onNavigate }) {
  return (
    <section className="workflow-final-cta-card" aria-labelledby="cta-heading">
      <div className="cta-brand-emblem">
        <span className="cta-tagline">PROMETHEUS DIGITAL PUBLIC INFRASTRUCTURE</span>
      </div>

      <h2 id="cta-heading" className="cta-headline">
        From fragmented services to one connected citizen journey.
      </h2>

      <p className="cta-subheading">
        Prometheus simplifies government service access while keeping citizens in control of their data.
      </p>

      <div className="cta-actions-row">
        <button
          type="button"
          className="gov-btn primary cta-button"
          onClick={() => onNavigate && onNavigate("services")}
        >
          <UiIcon name="document" size={16} />
          <span>Explore Services</span>
        </button>

        <button
          type="button"
          className="gov-btn secondary cta-button"
          onClick={() => onNavigate && onNavigate("requests")}
        >
          <UiIcon name="clipboard" size={16} />
          <span>View My Requests</span>
        </button>
      </div>
    </section>
  );
}
