import { useState, useEffect } from "react";
import UiIcon from "./UiIcon";
import {
  getCitizenProfile,
  giveConsent,
  integrateApplication,
  getPrefillData,
  createRtoHandoff
} from "../services/api";

export default function ServiceWizardModal({
  serviceId = "voter",
  citizenId = "CITIZEN-1001",
  onClose,
  onComplete
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [prefilledData, setPrefilledData] = useState(null);
  const [submittedAppId, setSubmittedAppId] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [handoffToken, setHandoffToken] = useState("");

  const voterBase = import.meta.env.VITE_VOTER_PORTAL_URL || (import.meta.env.PROD ? "/voter" : "http://localhost:5174");
  const rtoBase = import.meta.env.VITE_RTO_PORTAL_URL || (import.meta.env.PROD ? "/rto" : "http://localhost:5175");
  const welfareBase = import.meta.env.VITE_WELFARE_PORTAL_URL || (import.meta.env.PROD ? "/welfare" : "http://localhost:5176");

  const serviceConfig = {
    voter: {
      name: "Voter ID Portal",
      dept: "Election Commission of India",
      icon: "identity",
      port: 5174,
      portalUrl: `${voterBase}/voter/registration-form?citizenId=${encodeURIComponent(citizenId)}&source=prometheus`,
      schemaFields: [
        { label: "Full Name", key: "name", type: "text" },
        { label: "Date of Birth", key: "dob", type: "date" },
        { label: "Gender", key: "gender", type: "text" },
        { label: "Address", key: "address", type: "text" },
        { label: "Mobile Number", key: "mobile", type: "tel" },
        { label: "Assembly Constituency", key: "constituency", type: "text" }
      ]
    },
    rto: {
      name: "Driving Licence (RTO) Portal",
      dept: "Ministry of Road Transport & Highways",
      icon: "transport",
      port: 5175,
      portalUrl: `${rtoBase}/apply?source=prometheus`,
      schemaFields: [
        { label: "Applicant Name", key: "applicantName", type: "text" },
        { label: "Date of Birth", key: "dateOfBirth", type: "date" },
        { label: "Gender", key: "gender", type: "text" },
        { label: "Permanent Address", key: "address", type: "text" },
        { label: "Mobile Number", key: "mobileNumber", type: "tel" },
        { label: "Email", key: "email", type: "email" },
        { label: "Vehicle Class", key: "vehicleClass", type: "text" },
        { label: "Designated RTO", key: "stateRto", type: "text" }
      ]
    },
    welfare: {
      name: "Jan Kalyan Welfare Portal",
      dept: "Social Welfare & DBT Mission",
      icon: "welfare",
      port: 5176,
      portalUrl: `${welfareBase}?citizenId=${encodeURIComponent(citizenId)}&source=prometheus`,
      schemaFields: [
        { label: "Beneficiary Name", key: "name", type: "text" },
        { label: "Date of Birth", key: "dateOfBirth", type: "date" },
        { label: "Residential Address", key: "address", type: "text" },
        { label: "Annual Family Income (₹)", key: "income", type: "number" },
        { label: "Contact Mobile", key: "mobileNumber", type: "tel" },
        { label: "Target Scheme", key: "schemeName", type: "text" }
      ]
    }
  };

  const currentService = serviceConfig[serviceId] || serviceConfig.voter;

  useEffect(() => {
    loadCitizenData();
  }, [citizenId, serviceId]);

  const loadCitizenData = async () => {
    try {
      setLoading(true);
      const res = await getCitizenProfile(citizenId);
      if (res?.success && res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Step actions
  const handleProceedFromStep1 = () => setCurrentStep(2);

  const handleProceedFromStep2 = () => setCurrentStep(3);

  const handleProceedFromStep3 = () => setCurrentStep(4);

  const handleGrantConsentStep5 = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      // Give consent via backend API
      await giveConsent({
        citizenId,
        service: serviceId,
        consent: true,
        dataFields: currentService.schemaFields.map((f) => f.key)
      });

      // Fetch prefill data from translation engine
      const prefillRes = await getPrefillData(serviceId, citizenId);
      if (prefillRes?.success && prefillRes.prefilledData) {
        setPrefilledData(prefillRes.prefilledData);
        setCustomFields(prefillRes.prefilledData);
      }
      if (serviceId === "rto") {
        const handoff = await createRtoHandoff(citizenId);
        setHandoffToken(handoff.token);
      }
      setCurrentStep(6);
    } catch (err) {
      setErrorMsg(err.message || "Failed to grant consent");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToPortalStep6 = () => {
    if (serviceId === "rto" && !handoffToken) {
      setErrorMsg("The RTO handoff could not be created. Please grant consent again.");
      return;
    }
    const portalUrl = serviceId === "rto"
      ? `${currentService.portalUrl}&token=${encodeURIComponent(handoffToken)}`
      : currentService.portalUrl;
    window.open(portalUrl, "_blank", "noopener,noreferrer");
    setCurrentStep(7);
  };

  const handleFieldChange = (key, value) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleVerifyStep8 = () => {
    setCurrentStep(9);
  };

  const handleSubmitApplicationStep9 = async () => {
    if (serviceId === "rto") {
      setErrorMsg("RTO applications must be submitted in the RTO portal after citizen verification.");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await integrateApplication({
        citizenId,
        service: serviceId,
        citizenData: customFields
      });

      if (response?.success) {
        const appId =
          response.application?.applicationId ||
          response.serviceApplication?.application?.applicationId ||
          `APP-${Date.now()}`;
        setSubmittedAppId(appId);
        setCurrentStep(10);
        if (onComplete) onComplete(appId);
      } else {
        setErrorMsg(response?.message || "Application submission failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Open Prometheus", label: "Open Platform" },
    { num: 2, title: "Load Citizen Profile", label: "Load Profile" },
    { num: 3, title: "Select Service", label: "Select Service" },
    { num: 4, title: "Show Required Info", label: "Required Fields" },
    { num: 5, title: "Citizen Consent", label: "Give Consent" },
    { num: 6, title: "Transfer & Translate", label: "Data Transfer" },
    { num: 7, title: "Portal Opens Pre-filled", label: "Portal Pre-fill" },
    { num: 8, title: "Verify Information", label: "Citizen Verification" },
    { num: 9, title: "Submit Application", label: "Submit to Service" },
    { num: 10, title: "Prometheus Tracking", label: "Unified Tracking" }
  ];

  return (
    <div className="wizard-backdrop" onClick={onClose}>
      <div className="wizard-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="wizard-modal-header">
          <div className="wizard-title-group">
            <span className="wizard-top-badge">10-Step "Apply Once" Demonstration</span>
            <h3>
              <UiIcon name={currentService.icon} size={20} /> {currentService.name}
            </h3>
          </div>
          <button className="wizard-close-btn" onClick={onClose} aria-label="Close wizard">
            <UiIcon name="close" size={16} />
          </button>
        </div>

        {/* 10 Step Progress Ribbon */}
        <div className="wizard-stepper-bar">
          {stepsList.map((st) => {
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div
                key={st.num}
                className={`stepper-node ${isDone ? "node-done" : isCurrent ? "node-current" : ""}`}
                title={st.title}
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
              >
                <div className="node-bubble">{isDone ? <UiIcon name="checkMark" size={12} /> : st.num}</div>
                <span className="node-text">{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Error notification if any */}
        {errorMsg && <div className="wizard-error-banner"><UiIcon name="alert" size={14} /> {errorMsg}</div>}

        {/* Modal Body Content depending on currentStep */}
        <div className="wizard-step-content">
          {/* STEP 1: Opens Prometheus */}
          {currentStep === 1 && (
            <div className="step-view">
              <div className="step-tag">Step 1 of 10</div>
              <h4>Citizen Opens Prometheus Unified Platform</h4>
              <p>
                The citizen initiates a digital governance session on Prometheus. The platform acts as
                the secure integration layer connecting multiple government departments without
                centralizing or holding duplicate identities without consent.
              </p>
              <div className="session-card">
                <div className="session-item">
                  <span className="session-key">Session ID:</span>
                  <code>PROM-SESS-2026-X9</code>
                </div>
                <div className="session-item">
                  <span className="session-key">Citizen Context:</span>
                  <strong>{citizenId}</strong>
                </div>
                <div className="session-item">
                  <span className="session-key">Security Architecture:</span>
                  <span>End-to-End Cryptographic Handshake & DPDP Act Compliant</span>
                </div>
              </div>
              <button className="wizard-action-btn" onClick={handleProceedFromStep1}>
                Next: Load Citizen Profile <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 2: Load Citizen Profile */}
          {currentStep === 2 && (
            <div className="step-view">
              <div className="step-tag">Step 2 of 10</div>
              <h4>Verified Citizen Profile Loaded</h4>
              <p>
                Prometheus loads the citizen's single unified digital identity. This profile is
                stored once and will be selectively shared only when required.
              </p>

              {profile ? (
                <div className="profile-preview-card">
                  <div className="profile-preview-header">
                    <span className="avatar-circle"><UiIcon name="user" size={20} /></span>
                    <div>
                      <h5>{profile.fullName || profile.name}</h5>
                      <small>Citizen ID: {citizenId} • Verified UIDAI Identity</small>
                    </div>
                  </div>
                  <div className="profile-summary-grid">
                    <div><strong>DOB:</strong> {profile.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {profile.gender || "Male"}</div>
                    <div><strong>Mobile:</strong> {profile.mobileNumber || profile.mobile}</div>
                    <div><strong>Email:</strong> {profile.email}</div>
                    <div className="span-2"><strong>Address:</strong> {profile.address}, {profile.city}, {profile.state} - {profile.pincode}</div>
                  </div>
                </div>
              ) : (
                <div className="loading-state">Loading citizen record...</div>
              )}

              <button className="wizard-action-btn" onClick={handleProceedFromStep2}>
                Next: Select Government Service <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 3: Select Service */}
          {currentStep === 3 && (
            <div className="step-view">
              <div className="step-tag">Step 3 of 10</div>
              <h4>Service Selected: {currentService.name}</h4>
              <p>
                The citizen chooses to apply for <strong>{currentService.name}</strong> managed by{" "}
                <em>{currentService.dept}</em>.
              </p>
              <div className="service-selected-card">
                <span className="big-icon"><UiIcon name={currentService.icon} size={26} /></span>
                <div>
                  <h4>{currentService.name}</h4>
                  <div className="dept-tag">{currentService.dept}</div>
                  <p>
                    Instead of requiring manual form filling from scratch, Prometheus prepares to
                    bridge citizen profile data directly into the departmental portal.
                  </p>
                </div>
              </div>
              <button className="wizard-action-btn" onClick={handleProceedFromStep3}>
                Next: Inspect Required Information <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 4: Prometheus Shows Required Info */}
          {currentStep === 4 && (
            <div className="step-view">
              <div className="step-tag">Step 4 of 10</div>
              <h4>Prometheus Displays Required Information Schema</h4>
              <p>
                Before requesting permission, Prometheus transparently shows exactly which fields
                are demanded by <strong>{currentService.name}</strong>.
              </p>
              <div className="schema-table-box">
                <table className="schema-table">
                  <thead>
                    <tr>
                      <th>Required Department Field</th>
                      <th>Source in Prometheus Profile</th>
                      <th>Compliance Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentService.schemaFields.map((f) => (
                      <tr key={f.key}>
                        <td><strong>{f.label}</strong> (<code>{f.key}</code>)</td>
                        <td><span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><UiIcon name="check" size={13} /> Available from Citizen Profile</span></td>
                        <td><span className="badge-required">Mandatory</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="wizard-action-btn" onClick={() => setCurrentStep(5)}>
                Next: Grant Explicit Consent <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 5: Citizen Gives Consent */}
          {currentStep === 5 && (
            <div className="step-view">
              <div className="step-tag">Step 5 of 10</div>
              <h4>Citizen Consent Request</h4>
              <p>
                Prometheus prompts the citizen for affirmative, informed consent. Citizen can
                approve or decline sharing the requested data attributes.
              </p>
              <div className="consent-request-box">
                <div className="consent-shield-icon"><UiIcon name="shield" size={26} /></div>
                <div>
                  <h5>Authorize Data Sharing with {currentService.name}?</h5>
                  <p>
                    By granting consent, you permit Prometheus to translate and transmit your verified
                    name, date of birth, address, and contact details to {currentService.dept} exclusively
                    for processing this application.
                  </p>
                  <div className="consent-field-purpose-list">
                    {currentService.schemaFields.map((f) => (
                      <div key={f.key} className="consent-field-purpose"><strong><UiIcon name="check" size={14} /> {f.label}</strong><span>Required · {f.key.toLowerCase().includes("mobile") || f.key.toLowerCase().includes("phone") ? "used for application communication" : f.key.toLowerCase().includes("dob") || f.key.toLowerCase().includes("birth") ? "used to verify age and eligibility" : f.key.toLowerCase().includes("address") ? "used to verify residence and service area" : f.key.toLowerCase().includes("income") ? "used to assess scheme eligibility" : f.key.toLowerCase().includes("vehicle") || f.key.toLowerCase().includes("class") ? "used to process the selected service" : "used to identify you for this application"}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="btn-row-split">
                <button
                  className="wizard-action-btn consent-accept"
                  onClick={handleGrantConsentStep5}
                  disabled={loading}
                >
                  {loading ? "Authorizing with Gateway..." : <><UiIcon name="check" size={14} /> Grant Consent &amp; Share</>}
                </button>
                <button className="wizard-secondary-btn" onClick={onClose}>
                  <UiIcon name="close" size={14} /> Decline &amp; Cancel
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Data Transfer & Translation */}
          {currentStep === 6 && (
            <div className="step-view">
              <div className="step-tag">Step 6 of 10</div>
              <h4>Data Translated & Securely Transferred</h4>
              <p>
                The Prometheus Intelligent Data Translation Engine has adapted the citizen profile
                into <strong>{currentService.name}</strong>'s API schema.
              </p>
              <div className="translation-visual-card">
                <div className="trans-box">
                  <span className="trans-head">Prometheus Profile</span>
                  <code>{JSON.stringify({
                    fullName: profile?.fullName,
                    dob: profile?.dateOfBirth,
                    mobile: profile?.mobileNumber
                  }, null, 2)}</code>
                </div>
                <div className="trans-arrow"><UiIcon name="arrowRight" size={14} /> [Translation Engine] <UiIcon name="arrowRight" size={14} /></div>
                <div className="trans-box highlight">
                  <span className="trans-head">{currentService.name} Schema</span>
                  <code>{JSON.stringify(prefilledData || customFields, null, 2)}</code>
                </div>
              </div>
              <button className="wizard-action-btn" onClick={handleTransferToPortalStep6}>
                Next: Open Target Portal with Pre-filled Data <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 7: Portal Opens With Information Pre-filled */}
          {currentStep === 7 && (
            <div className="step-view">
              {serviceId === "rto" ? (
                <>
                  <div className="step-tag success">Step 7 of 10</div>
                  <h4>RTO Portal Opened with Profile Handoff</h4>
                  <p>
                    The existing RTO portal is open in a new tab. Review the prefilled citizen
                    information, enter the remaining RTO-specific fields, and submit there.
                  </p>
                  <div className="portal-simulation-frame">
                    <div className="portal-frame-bar">
                      <span className="portal-title"><UiIcon name="transport" size={16} /> Existing RTO Portal</span>
                      <span className="portal-indicator">Prometheus Connection · Connected</span>
                    </div>
                    <div className="portal-form-preview">
                      <p><strong>Citizen Profile <UiIcon name="check" size={13} /> Received</strong></p>
                      <p><strong>Consent <UiIcon name="check" size={13} /> Verified</strong></p>
                      <p><strong>Data Mapping <UiIcon name="check" size={13} /> Completed</strong></p>
                      <p className="muted">The RTO portal will never auto-submit this application.</p>
                    </div>
                  </div>
                  <button className="wizard-action-btn" onClick={onClose}>
                    Return to Prometheus Tracking <UiIcon name="arrowRight" size={14} />
                  </button>
                </>
              ) : (
                <>
              <div className="step-tag">Step 7 of 10</div>
              <h4>Target Portal Opened with Information Pre-filled</h4>
              <p>
                The target service portal has received your authorized data. Notice how all fields
                are automatically filled without requiring you to re-type anything!
              </p>

              <div className="portal-simulation-frame">
                <div className="portal-frame-bar">
                  <span className="portal-title">
                    <UiIcon name={currentService.icon} size={16} /> {currentService.name} &mdash; Live Pre-fill Screen
                  </span>
                  <span className="portal-indicator">Pre-filled via Prometheus</span>
                </div>
                <div className="portal-form-preview">
                  {currentService.schemaFields.map((f) => (
                    <div key={f.key} className="form-item-preview">
                      <label>{f.label}</label>
                      <input
                        type={f.type}
                        value={customFields[f.key] ?? ""}
                        readOnly
                        className="prefilled-input"
                      />
                      <span className="field-verified-tag"><UiIcon name="check" size={12} /> Pre-filled</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="wizard-action-btn" onClick={() => setCurrentStep(8)}>
                Next: Verify Information as Citizen <UiIcon name="arrowRight" size={14} />
              </button>
                </>
              )}
            </div>
          )}

          {/* STEP 8: Citizen Verifies Information */}
          {currentStep === 8 && (
            <div className="step-view">
              <div className="step-tag">Step 8 of 10</div>
              <h4>Citizen Verifies Pre-filled Details</h4>
              <p>
                The citizen reviews the pre-filled information, with full capability to make minor
                adjustments if needed before final submission.
              </p>

              <div className="portal-simulation-frame">
                <div className="portal-frame-bar edit-mode">
                  <span>Review & Verify (Editable)</span>
                  <small>Make any corrections before applying</small>
                </div>
                <div className="portal-form-preview">
                  {currentService.schemaFields.map((f) => (
                    <div key={f.key} className="form-item-preview">
                      <label>{f.label}</label>
                      <input
                        type={f.type}
                        value={customFields[f.key] ?? ""}
                        onChange={(e) => handleFieldChange(f.key, e.target.value)}
                        className="editable-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button className="wizard-action-btn" onClick={handleVerifyStep8}>
                Next: Submit Application to {currentService.name} <UiIcon name="arrowRight" size={14} />
              </button>
            </div>
          )}

          {/* STEP 9: Submits Application */}
          {currentStep === 9 && (
            <div className="step-view">
              <div className="step-tag">Step 9 of 10</div>
              <h4>Submit Application</h4>
              <p>
                Submitting your verified application directly to <strong>{currentService.name}</strong>.
                Upon submission, the department assigns an official tracking reference.
              </p>
              <div className="submission-summary-box">
                <h4>Submission Summary</h4>
                <p><strong>Service:</strong> {currentService.name}</p>
                <p><strong>Applicant:</strong> {customFields.name || customFields.applicantName}</p>
                <p><strong>Destination:</strong> {currentService.dept}</p>
                <p><strong>Verification:</strong> DigiLocker Credential Attached</p>
              </div>

              <button
                className="wizard-action-btn submit-final-btn"
                onClick={handleSubmitApplicationStep9}
                disabled={loading}
              >
                {loading ? "Submitting to Department API..." : <>Confirm &amp; Submit Application <UiIcon name="arrowRight" size={14} /></>}
              </button>
            </div>
          )}

          {/* STEP 10: Prometheus Tracks Application */}
          {currentStep === 10 && (
            <div className="step-view celebration">
              <div className="step-tag success">Step 10 of 10 Complete!</div>
              <h4>Application Successfully Tracked in Prometheus</h4>
              <p>
                Your application has been accepted by <strong>{currentService.name}</strong> and is now
                synchronized into your centralized Prometheus tracking ledger!
              </p>

              <div className="success-receipt-card">
                <div className="receipt-check"><UiIcon name="check" size={24} /></div>
                <h3>Official Reference ID</h3>
                <div className="receipt-id"><code>{submittedAppId}</code></div>
                <div className="receipt-meta">
                  <div><strong>Department:</strong> {currentService.dept}</div>
                  <div><strong>Initial Status:</strong> SUBMITTED / UNDER VERIFICATION</div>
                  <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
                </div>
              </div>

              <div className="next-actions-row">
                <button
                  className="wizard-action-btn"
                  onClick={() => {
                    onClose();
                    if (onComplete) onComplete(submittedAppId);
                  }}
                >
                  View in Prometheus Tracking Dashboard <UiIcon name="arrowRight" size={14} />
                </button>

                <a
                  href={currentService.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="wizard-link-btn"
                >
                  Open {currentService.name} Standalone Site <UiIcon name="external" size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
