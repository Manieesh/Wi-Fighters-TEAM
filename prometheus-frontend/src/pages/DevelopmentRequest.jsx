import { useState } from "react";
import UiIcon from "../components/UiIcon";
import VoiceInput from "../components/VoiceInput";

const categories = [
  "Drinking Water",
  "Roads & Transport",
  "Electricity & Power",
  "Healthcare & Clinics",
  "Education & Schools",
  "Sanitation & Waste",
  "Drainage & Sewage",
  "Public Safety & Lighting",
  "Other Community Need"
];

export default function DevelopmentRequest({ onSubmitted, onNavigate, t }) {
  const [locating, setLocating] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "Drinking Water",
    language: "Tamil",
    description: "எங்கள் பகுதியில் கடந்த இரண்டு வாரங்களாக குடிநீர் விநியோகம் இல்லை. பிரதான பைப்லைன் உடைந்துள்ளது.",
    district: "Coimbatore",
    state: "Tamil Nadu",
    location: "Ramanathapuram Main Junction, Ward 42",
    contactInfo: "+91 98765 43210",
    anonymous: false
  });

  // Voice metadata tracking (original language, original transcript, english translation)
  const [voiceMetadata, setVoiceMetadata] = useState({
    originalLanguage: "Tamil",
    originalText: "எங்கள் பகுதியில் கடந்த இரண்டு வாரங்களாக குடிநீர் விநியோகம் இல்லை. பிரதான பைப்லைன் உடைந்துள்ளது.",
    englishText: "There has been no drinking water supply in our area for the past two weeks. The main pipeline is damaged."
  });

  // Pending voice transcript replacement confirmation modal state
  const [pendingVoiceData, setPendingVoiceData] = useState(null); // { textToApply, lang, details }

  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // When citizen clicks "Use English Version" or "Use Original Version"
  const handleApplyVoiceTranscript = (textToApply, lang, details) => {
    if (!textToApply) return;

    // Check if description already has substantial text that differs from textToApply
    if (
      formData.description &&
      formData.description.trim() &&
      formData.description.trim() !== textToApply.trim()
    ) {
      setPendingVoiceData({ textToApply, lang, details });
    } else {
      updateField("description", textToApply);
      if (details?.selectedVoiceLang) updateField("language", details.selectedVoiceLang);
      if (details) {
        setVoiceMetadata({
          originalLanguage: details.selectedVoiceLang || formData.language,
          originalText: details.originalTranscript || textToApply,
          englishText: details.englishTranslation || (lang === "English" ? textToApply : "")
        });
      }
    }
  };

  // Confirm replacing existing text with voice transcript
  const handleConfirmReplace = () => {
    if (pendingVoiceData) {
      updateField("description", pendingVoiceData.textToApply);
      if (pendingVoiceData.details?.selectedVoiceLang) {
        updateField("language", pendingVoiceData.details.selectedVoiceLang);
      }
      if (pendingVoiceData.details) {
        setVoiceMetadata({
          originalLanguage: pendingVoiceData.details.selectedVoiceLang || formData.language,
          originalText: pendingVoiceData.details.originalTranscript || pendingVoiceData.textToApply,
          englishText: pendingVoiceData.details.englishTranslation || (pendingVoiceData.lang === "English" ? pendingVoiceData.textToApply : "")
        });
      }
      setPendingVoiceData(null);
    }
  };

  // Reject replacing existing text
  const handleKeepExisting = () => {
    setPendingVoiceData(null);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      updateField("location", "Coimbatore, Tamil Nadu (GPS Estimated)");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        updateField("location", `Near Ward 42, Coordinates: ${lat}, ${lng}`);
        setLocating(false);
      },
      () => {
        updateField("location", "Ramanathapuram, Coimbatore (Estimated)");
        setLocating(false);
      },
      { timeout: 6000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    const generatedId = `REQ-${Math.floor(1000 + Math.random() * 8999)}`;
    const newRequest = {
      id: generatedId,
      category: formData.category,
      description: formData.description,
      language: formData.language,
      originalLanguage: voiceMetadata.originalLanguage || formData.language,
      originalText: voiceMetadata.originalText || formData.description,
      englishText: voiceMetadata.englishText || (formData.language === "English" ? formData.description : ""),
      location: `${formData.location}, ${formData.district}, ${formData.state}`,
      district: formData.district,
      state: formData.state,
      status: "Submitted",
      date: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date()),
      similar:
        formData.category === "Drinking Water"
          ? 2843
          : formData.category === "Roads & Transport"
          ? 1189
          : 756,
      priority: formData.category === "Drinking Water" ? "High" : "Medium",
      urgency: formData.category === "Drinking Water" ? "High" : "Medium",
      affectedArea: `${formData.district} District`,
      anonymous: formData.anonymous
    };

    setSubmittedRequest(newRequest);
    if (onSubmitted) onSubmitted(newRequest);
  };

  // If submitted, show success state with official confirmation
  if (submittedRequest) {
    return (
      <div className="request-success-container">
        <div className="receipt-success-card">
          <div className="receipt-top-badge">
            <span className="success-icon-circle">
              <UiIcon name="check" size={24} />
            </span>
            <span>{t?.("request.receiptTitle") || "Request submitted"}</span>
          </div>

          <span className="ref-tag-label">{t?.("request.refNumber") || "REFERENCE NUMBER"}</span>
          <h2 className="receipt-id-heading">{submittedRequest.id}</h2>
          <p className="receipt-intro">
            {t?.("request.subtitle") || "Your request has been recorded successfully."}
          </p>

          <div className="save-ref-notice">
            <UiIcon name="shield" size={16} />
            <span>{t?.("request.saveNotice") || "Save this reference number for future tracking."}</span>
          </div>

          <div className="request-summary-box">
            <div className="summary-box-header">
              <h4>{t?.("request.summaryTitle") || "Request Summary"}</h4>
              <span className="summary-status-pill">{t?.("myRequests.status.submitted") || "Submitted"}</span>
            </div>

            <div className="summary-grid">
              <div className="summary-col">
                <span className="col-label">Reference ID:</span>
                <span className="col-val font-mono">
                  <strong>{submittedRequest.id}</strong>
                </span>
              </div>
              <div className="summary-col">
                <span className="col-label">{t?.("request.categoryLabel") || "Category"}:</span>
                <span className="col-val">{submittedRequest.category}</span>
              </div>
              <div className="summary-col">
                <span className="col-label">{t?.("request.locationLabel") || "Location"}:</span>
                <span className="col-val">{submittedRequest.location}</span>
              </div>
              <div className="summary-col">
                <span className="col-label">Submitted Date:</span>
                <span className="col-val">{submittedRequest.date}</span>
              </div>
              <div className="summary-col">
                <span className="col-label">Current Status:</span>
                <span className="col-val text-primary-blue">
                  <strong>{t?.("myRequests.status.underReview") || "Under Administrative Review"}</strong>
                </span>
              </div>
              <div className="summary-col">
                <span className="col-label">{t?.("request.similarReports") || "Similar Community Reports"}:</span>
                <span className="col-val highlight-val">
                  {submittedRequest.similar.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {submittedRequest.englishText && submittedRequest.originalText !== submittedRequest.englishText && (
              <div className="receipt-bilingual-preview">
                <div className="preview-lang-box">
                  <small>Original ({submittedRequest.originalLanguage}):</small>
                  <p>"{submittedRequest.originalText}"</p>
                </div>
                <div className="preview-lang-box en-box">
                  <small>English Version:</small>
                  <p>"{submittedRequest.englishText}"</p>
                </div>
              </div>
            )}

            <div className="why-prioritised-box">
              <div className="why-header">
                <UiIcon name="alert" size={14} />
                <strong>{t?.("request.whyPrioritised") || "Why this request was prioritised:"}</strong>
              </div>
              <p>
                {t?.("request.whyReason") ||
                  "Multiple similar reports were identified in this area. The preliminary assessment detected an infrastructure deficit in basic public utilities."}
              </p>
              <div className="responsible-ai-note">
                <UiIcon name="shield" size={13} />
                <span>
                  {t?.("request.aiDisclaimer") ||
                    "AI-assisted assessment. Final decisions are made by the responsible authorities."}
                </span>
              </div>
            </div>
          </div>

          <div className="receipt-action-buttons">
            <button className="gov-btn primary" onClick={() => onNavigate("requests")}>
              <UiIcon name="clipboard" size={16} />
              <span>{t?.("request.trackBtn") || "Track Request"}</span>
            </button>
            <button className="gov-btn secondary" onClick={() => setSubmittedRequest(null)}>
              <span>{t?.("request.raiseAnotherBtn") || "Raise Another Request"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculated preliminary assessment stats based on current form
  const aiStats = {
    category: formData.category,
    language: formData.language,
    location: `${formData.district} District`,
    urgency:
      formData.category === "Drinking Water"
        ? "High Priority"
        : formData.category === "Roads & Transport"
        ? "High Priority"
        : "Medium Priority",
    similarRequests:
      formData.category === "Drinking Water"
        ? "2,843"
        : formData.category === "Roads & Transport"
        ? "1,189"
        : "642"
  };

  return (
    <div className="dev-request-page">
      {/* Page Header (Formal Citizen-first) */}
      <div className="page-header-block">
        <span className="page-eyebrow">CIVIC PARTICIPATION</span>
        <h1 className="page-main-title">
          {t?.("request.title") || "Tell us about a problem in your area"}
        </h1>
        <p className="page-lead-text">
          {t?.("request.subtitle") ||
            "Your feedback helps identify local infrastructure needs and improve public services."}
        </p>
      </div>

      {/* Multilingual Voice Input Component */}
      <VoiceInput
        language={formData.language}
        onTranscript={(transcript, translated, lang) => {
          if (!formData.description) {
            updateField("description", transcript);
            if (lang) updateField("language", lang);
          }
          setVoiceMetadata({
            originalLanguage: lang || formData.language,
            originalText: transcript,
            englishText: translated || ""
          });
        }}
        onApplyTranscript={handleApplyVoiceTranscript}
        t={t}
      />

      {/* Confirmation Modal: Replace existing description? */}
      {pendingVoiceData && (
        <div
          className="service-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-replace-title"
        >
          <div className="service-details-modal confirm-replace-card">
            <div className="confirm-icon-row">
              <UiIcon name="alert" size={24} className="text-warning" />
              <h3 id="confirm-replace-title">
                {t?.("request.replaceTitle") || "Replace existing description with voice transcript?"}
              </h3>
            </div>
            <p className="confirm-text">
              {t?.("request.replaceBody") ||
                "The problem description field already contains text. Would you like to overwrite it with your voice recording?"}
            </p>

            <div className="replace-preview-box">
              <span className="preview-label">New Voice Content:</span>
              <p className="preview-content">"{pendingVoiceData.textToApply}"</p>
            </div>

            <div className="confirm-buttons-row">
              <button
                type="button"
                className="gov-btn primary"
                onClick={handleConfirmReplace}
              >
                {t?.("request.replaceBtn") || "Replace"}
              </button>
              <button
                type="button"
                className="gov-btn secondary"
                onClick={handleKeepExisting}
              >
                {t?.("request.keepExistingBtn") || "Keep Existing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-section structure: LEFT form, RIGHT process & preliminary assessment */}
      <div className="dev-request-columns-grid">
        {/* LEFT SECTION: Citizen Request Form */}
        <section className="dev-form-card" aria-labelledby="form-heading">
          <div className="column-header">
            <h2 id="form-heading">
              {t?.("request.formHeading") || "Citizen Request Form"}
            </h2>
            <p>{t?.("request.formSub") || "Tell us what needs attention in your neighborhood."}</p>
          </div>

          <form onSubmit={handleSubmit} className="dev-request-form">
            {/* Category & Language */}
            <div className="form-field-row">
              <label className="form-field">
                <span className="field-label">
                  {t?.("request.categoryLabel") || "Problem Category"} <span className="req-star">*</span>
                </span>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="gov-select"
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="field-hint">Select the public utility or infrastructure involved</span>
              </label>

              <label className="form-field">
                <span className="field-label">
                  {t?.("request.languageLabel") || "Preferred Language"}
                </span>
                <select
                  value={formData.language}
                  onChange={(e) => updateField("language", e.target.value)}
                  className="gov-select"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                </select>
                <span className="field-hint">Language used for communication</span>
              </label>
            </div>

            {/* Description */}
            <label className="form-field full-width">
              <span className="field-label">
                {t?.("request.descLabel") || "Problem Description"} <span className="req-star">*</span>
              </span>
              <textarea
                rows="4"
                className="gov-textarea"
                placeholder={
                  t?.("request.descPlaceholder") ||
                  "Describe the issue affecting your area in detail..."
                }
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
              <span className="field-hint">
                Provide details such as duration, how many residents are affected, or hazard severity
              </span>
            </label>

            {/* District & State */}
            <div className="form-field-row">
              <label className="form-field">
                <span className="field-label">
                  {t?.("request.districtLabel") || "District"} <span className="req-star">*</span>
                </span>
                <input
                  type="text"
                  className="gov-input"
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">
                  {t?.("request.stateLabel") || "State"} <span className="req-star">*</span>
                </span>
                <input
                  type="text"
                  className="gov-input"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Location with GPS action */}
            <label className="form-field full-width">
              <div className="field-label-split">
                <span className="field-label">
                  {t?.("request.locationLabel") || "Specific Location / Landmark"}{" "}
                  <span className="req-star">*</span>
                </span>
                <button
                  type="button"
                  className="btn-use-location"
                  onClick={handleUseLocation}
                  disabled={locating}
                >
                  <UiIcon name="pin" size={13} />
                  <span>
                    {locating
                      ? "Detecting GPS..."
                      : t?.("request.useLocation") || "Use My Current Location"}
                  </span>
                </button>
              </div>
              <input
                type="text"
                className="gov-input"
                placeholder="e.g. Near Municipal Primary School, 4th Cross Road"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                required
              />
            </label>

            {/* Contact Information */}
            <label className="form-field full-width">
              <span className="field-label">Contact Information (Optional)</span>
              <input
                type="text"
                className="gov-input"
                placeholder="Mobile number or email address for status SMS"
                value={formData.contactInfo}
                onChange={(e) => updateField("contactInfo", e.target.value)}
              />
              <span className="field-hint">Used only for official status updates regarding this request</span>
            </label>

            {/* Anonymous Submission Checkbox */}
            <div className="checkbox-field-row">
              <input
                type="checkbox"
                id="anon-checkbox"
                checked={formData.anonymous}
                onChange={(e) => updateField("anonymous", e.target.checked)}
              />
              <label htmlFor="anon-checkbox">
                {t?.("request.anonymous") ||
                  "Submit anonymously. Your personal contact details will not be visible in public community aggregates."}
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-submit-row">
              <button type="submit" className="btn-submit-request">
                <span>{t?.("request.submitBtn") || "Submit Development Request"}</span>
                <UiIcon name="arrowRight" size={16} />
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT SECTION: "How your request is processed" + "Preliminary assessment" */}
        <aside className="dev-info-column" aria-label="Process Information and Assessment">
          {/* Card 1: How your request is processed */}
          <div className="how-it-works-sidebar-card">
            <div className="column-header">
              <span className="panel-eyebrow">TRANSPARENCY</span>
              <h3>{t?.("request.howProcessedTitle") || "How your request is processed"}</h3>
              <p>Clear, accountable steps from submission to resolution.</p>
            </div>

            <ol className="processing-timeline-list">
              <li className="process-step-item">
                <div className="step-circle-badge">1</div>
                <div className="step-content">
                  <strong>You report an issue</strong>
                  <p>Describe the problem through text or voice in your preferred language.</p>
                </div>
              </li>

              <li className="process-step-item">
                <div className="step-circle-badge">2</div>
                <div className="step-content">
                  <strong>PROMETHEUS analyses the request</strong>
                  <p>The system categorises the issue and checks for similar neighborhood reports.</p>
                </div>
              </li>

              <li className="process-step-item">
                <div className="step-circle-badge">3</div>
                <div className="step-content">
                  <strong>Relevant department reviews it</strong>
                  <p>District administrative officers inspect the report and verify on-ground conditions.</p>
                </div>
              </li>

              <li className="process-step-item">
                <div className="step-circle-badge">4</div>
                <div className="step-content">
                  <strong>You can track the progress</strong>
                  <p>Follow status milestones and official updates in real-time through 'My Requests'.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Card 2: AI Preliminary Assessment (Professional, objective, well-scoped) */}
          <div className="ai-assessment-card">
            <div className="column-header">
              <div className="ai-tag-row">
                <span className="ai-badge">
                  {t?.("request.preliminaryTitle") || "Preliminary assessment"}
                </span>
                <span className="ai-live-indicator">● LIVE ESTIMATION</span>
              </div>
              <h3>Automated Signal Intelligence</h3>
              <p>Preliminary classification based on neighborhood report density.</p>
            </div>

            <div className="ai-metrics-grid">
              <div className="ai-metric-item">
                <span className="metric-label">Category</span>
                <strong className="metric-value">{aiStats.category}</strong>
              </div>

              <div className="ai-metric-item">
                <span className="metric-label">Location</span>
                <strong className="metric-value">{aiStats.location}</strong>
              </div>

              <div className="ai-metric-item highlight-metric">
                <span className="metric-label">
                  {t?.("request.similarReports") || "Similar Reported Issues"}
                </span>
                <strong className="metric-value highlight">{aiStats.similarRequests}</strong>
              </div>

              <div className="ai-metric-item">
                <span className="metric-label">
                  {t?.("request.recommendedPriority") || "Suggested Urgency"}
                </span>
                <span className="metric-value-tag high">{aiStats.urgency}</span>
              </div>
            </div>

            <div className="ai-rationale-section">
              <div className="rationale-header">
                <UiIcon name="shield" size={14} />
                <h4>RESPONSIBLE GOVERNANCE DISCLOSURE</h4>
              </div>
              <p className="ai-note-text">
                {t?.("request.aiDisclaimer") ||
                  "AI-assisted assessment. Final decisions are made by the responsible authorities."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
