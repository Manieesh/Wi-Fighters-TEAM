import React, { useState, useEffect } from "react";
import UiIcon from "./UiIcon";

export default function AccessibilityToolbar({ isOpen, onClose }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("prometheus_font_size") || "normal");
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("prometheus_high_contrast") === "true");
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem("prometheus_reduced_motion") === "true");
  const [clearTypography, setClearTypography] = useState(() => localStorage.getItem("prometheus_clear_typography") === "true");

  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove("text-size-large", "text-size-xl");
    if (fontSize === "large") document.documentElement.classList.add("text-size-large");
    if (fontSize === "xl") document.documentElement.classList.add("text-size-xl");
    localStorage.setItem("prometheus_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    // Apply High Contrast
    if (highContrast) {
      document.documentElement.classList.add("theme-high-contrast");
    } else {
      document.documentElement.classList.remove("theme-high-contrast");
    }
    localStorage.setItem("prometheus_high_contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    // Apply Reduced Motion
    if (reducedMotion) {
      document.documentElement.classList.add("theme-reduced-motion");
    } else {
      document.documentElement.classList.remove("theme-reduced-motion");
    }
    localStorage.setItem("prometheus_reduced_motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    // Apply Clear Typography
    if (clearTypography) {
      document.documentElement.classList.add("theme-clear-typography");
    } else {
      document.documentElement.classList.remove("theme-clear-typography");
    }
    localStorage.setItem("prometheus_clear_typography", clearTypography);
  }, [clearTypography]);

  if (!isOpen) return null;

  const handleSave = () => {
    onClose();
  };

  return (
    <div
      className="a11y-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
    >
      <div className="a11y-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="a11y-dialog-header">
          <div className="a11y-header-text">
            <span className="a11y-eyebrow">WCAG 2.1 AAA ACCESSIBILITY</span>
            <h2 id="a11y-modal-title">Accessibility &amp; Universal Access</h2>
            <p className="a11y-header-sub">
              Customize visual contrast, text sizing and motion preferences.
            </p>
          </div>
          <button
            type="button"
            className="a11y-close-btn"
            onClick={onClose}
            aria-label="Close accessibility settings"
          >
            <UiIcon name="close" size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="a11y-dialog-body">
          {/* 1. TEXT SIZE */}
          <div className="a11y-section-card">
            <div className="a11y-section-label-row">
              <UiIcon name="document" size={16} className="section-icon" />
              <span className="a11y-section-name">TEXT SIZE</span>
            </div>
            <div className="text-size-options-row" role="radiogroup" aria-label="Text sizing">
              {[
                { id: "normal", label: "Standard", sub: "100%" },
                { id: "large", label: "Large", sub: "115%" },
                { id: "xl", label: "Extra Large", sub: "130%" }
              ].map((opt) => {
                const isSelected = fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`text-size-choice-btn ${isSelected ? "selected" : ""}`}
                    onClick={() => setFontSize(opt.id)}
                  >
                    <span className="choice-indicator-dot">
                      {isSelected && <span className="inner-dot" />}
                    </span>
                    <span className="choice-title">{opt.label}</span>
                    <span className="choice-percent">{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. HIGH CONTRAST MODE */}
          <div className="a11y-section-card">
            <div className="a11y-toggle-row">
              <div className="toggle-info-col">
                <span className="a11y-section-name">HIGH CONTRAST MODE</span>
                <p className="toggle-explanation">
                  Increases color contrast to 7:1 ratio with distinct borders for enhanced visual legibility.
                </p>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle High Contrast Mode">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>

          {/* 3. REDUCED MOTION */}
          <div className="a11y-section-card">
            <div className="a11y-toggle-row">
              <div className="toggle-info-col">
                <span className="a11y-section-name">REDUCED MOTION</span>
                <p className="toggle-explanation">
                  Disables orbit animations, pulse rings, and page motion transitions for vestibular comfort.
                </p>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle Reduced Motion">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>

          {/* 4. CLEAR TYPOGRAPHY */}
          <div className="a11y-section-card">
            <div className="a11y-toggle-row">
              <div className="toggle-info-col">
                <span className="a11y-section-name">CLEAR TYPOGRAPHY</span>
                <p className="toggle-explanation">
                  Applies high-legibility letter spacing and open counters designed for cognitive ease.
                </p>
              </div>
              <label className="prometheus-switch-toggle" aria-label="Toggle Clear Typography">
                <input
                  type="checkbox"
                  checked={clearTypography}
                  onChange={(e) => setClearTypography(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="a11y-dialog-footer">
          <p className="a11y-footer-note">
            Preferences are automatically saved to your profile.
          </p>
          <div className="a11y-footer-actions">
            <button type="button" className="gov-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="gov-btn primary" onClick={handleSave}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
