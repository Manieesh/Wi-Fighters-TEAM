import React, { useState, useEffect } from "react";
import UiIcon from "./UiIcon";

export default function DemoModeBar({
  onNavigate,
  onTriggerOneClick,
  activeTab
}) {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem("prometheus_demo_tour_open") === "true";
    } catch {
      return false;
    }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      return parseInt(localStorage.getItem("prometheus_demo_tour_step") || "1", 10);
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("prometheus_demo_tour_open", isOpen);
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem("prometheus_demo_tour_step", currentStep);
    } catch {}
  }, [currentStep]);

  const DEMO_STEPS = [
    {
      step: 1,
      title: "1. Unified Citizen Portal",
      actionDesc: "Explore service discovery and real-time operational status.",
      targetTab: "overview",
      speakingPoint: "Prometheus unifies citizen service discovery under one human-centered digital gateway."
    },
    {
      step: 2,
      title: "2. Connected Services Catalog",
      actionDesc: "Review available Voter, RTO, and Welfare demonstration services.",
      targetTab: "services",
      speakingPoint: "Voter, RTO, and Welfare are available; future services are transparently marked as Coming Soon."
    },
    {
      step: 3,
      title: "3. Universal Citizen Profile",
      actionDesc: "View synchronized citizen attributes and verified identity status.",
      targetTab: "profile",
      speakingPoint: "Verified citizen identity eliminates repetitive data entry across departmental portals."
    },
    {
      step: 4,
      title: "4. Unified Application Tracking",
      actionDesc: "Monitor cross-departmental application ledger with vertical timeline.",
      targetTab: "tracking",
      speakingPoint: "Citizens track all applications across all connected services in one place."
    },
    {
      step: 5,
      title: "5. Citizen Consent Management",
      actionDesc: "Manage purpose-bound data sharing and revoke consents anytime.",
      targetTab: "consent",
      speakingPoint: "Prometheus operates on privacy-first governance: explicit citizen control over shared data."
    },
    {
      step: 6,
      title: "6. Data Translation Engine",
      actionDesc: "Inspect deterministic schema transformation and mapping pipeline.",
      targetTab: "translation",
      speakingPoint: "Our core interoperability innovation: translating disparate schemas in memory without data silos."
    },
    {
      step: 7,
      title: "7. System Architecture Specification",
      actionDesc: "Review end-to-end architectural flow and security guarantees.",
      targetTab: "architecture",
      speakingPoint: "Digital Public Infrastructure connecting independent departments via standard open protocols."
    }
  ];

  const current = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextObj = DEMO_STEPS[nextStep - 1];
      if (nextObj?.targetTab && onNavigate) {
        onNavigate(nextObj.targetTab);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevObj = DEMO_STEPS[prevStep - 1];
      if (prevObj?.targetTab && onNavigate) {
        onNavigate(prevObj.targetTab);
      }
    }
  };

  const handleGoToPage = () => {
    if (current?.targetTab && onNavigate) {
      onNavigate(current.targetTab);
    }
  };

  return (
    <aside className="floating-demo-tour-wrap" aria-label="Hackathon Demo Tour Controller">
      {/* 1. Closed State: Compact Floating Pill Button */}
      {!isOpen && (
        <button
          type="button"
          className="demo-tour-floating-trigger"
          onClick={() => setIsOpen(true)}
          title="Open Hackathon Demo Tour Guide"
          aria-expanded={false}
        >
          <span className="demo-tour-icon" aria-hidden="true">🎬</span>
          <span className="demo-tour-text">Demo Tour</span>
          <span className="demo-tour-step-pill">{currentStep}/{DEMO_STEPS.length}</span>
        </button>
      )}

      {/* 2. Opened State: Compact, High-Contrast Floating Tour Panel */}
      {isOpen && (
        <div className="demo-tour-compact-card" role="dialog" aria-modal="false" aria-label="Demo Tour Guide">
          {/* Card Header */}
          <div className="demo-tour-card-header">
            <div className="demo-tour-badge-row">
              <span className="demo-tag-cyan">🎬 DEMO TOUR</span>
              <span className="demo-step-indicator">Step {currentStep} of {DEMO_STEPS.length}</span>
            </div>
            <button
              type="button"
              className="demo-tour-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize Demo Tour"
            >
              <UiIcon name="close" size={16} />
            </button>
          </div>

          {/* Card Body */}
          <div className="demo-tour-card-body">
            <h4 className="demo-step-title">{current.title}</h4>
            <p className="demo-step-action">{current.actionDesc}</p>

            <div className="demo-speaking-point-box">
              <span className="speaking-lbl">TALKING POINT:</span>
              <p>"{current.speakingPoint}"</p>
            </div>
          </div>

          {/* Card Navigation Footer */}
          <div className="demo-tour-card-footer">
            <div className="demo-tour-btn-row">
              <button
                type="button"
                className="demo-tour-nav-btn prev"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <UiIcon name="arrowLeft" size={13} />
                <span>Prev</span>
              </button>

              <button
                type="button"
                className="demo-tour-view-btn"
                onClick={handleGoToPage}
                title="Navigate to this step page"
              >
                <span>Open View</span>
              </button>

              <button
                type="button"
                className="demo-tour-nav-btn next"
                onClick={handleNext}
                disabled={currentStep === DEMO_STEPS.length}
              >
                <span>Next</span>
                <UiIcon name="arrowRight" size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
