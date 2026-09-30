import { useState } from "react";
import UiIcon from "./UiIcon";
import StatusBadge from "./StatusBadge";
import RequestTimeline from "./RequestTimeline";

export default function RequestDetailsModal({ request, onClose, onAddInfo }) {
  const [reportingInfo, setReportingInfo] = useState(false);
  const [additionalText, setAdditionalText] = useState("");
  const [submittedAdditional, setSubmittedAdditional] = useState(false);

  if (!request) return null;

  const getCitizenStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("complete")) return "Completed";
    if (s.includes("progress") || s.includes("action") || s.includes("approved")) return "Action Started";
    if (s.includes("review") || s.includes("assigned") || s.includes("proposed") || s.includes("verified") || s.includes("ai")) return "Under Review";
    return "Submitted";
  };

  const citizenStatus = getCitizenStatus(request.status);

  const getNextStep = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("complete")) return "Community feedback and impact evaluation.";
    if (s.includes("action") || s.includes("progress")) return "Field engineers completing on-ground works.";
    if (s.includes("review")) return "Assigned department officer conducting field verification.";
    return "Initial administrative triage and verification.";
  };

  const getLatestUpdate = (req) => {
    if (req.latestUpdate) return req.latestUpdate;
    if (req.status === "Completed") return "Work has been verified as completed by the local municipal engineer. Feedback survey is now open.";
    if (req.status === "In Progress" || req.status === "Action Started") return "Contractor has been mobilised and material procurement is underway.";
    return "Your request has been forwarded to the relevant district department for administrative review.";
  };

  const handleDownloadReceipt = () => {
    const content = `========================================================
PROMETHEUS — CITIZEN DEVELOPMENT REQUEST RECEIPT
Unified Digital Governance Platform
========================================================
Request Reference ID: ${request.id}
Date Submitted:      ${request.date || "24 September 2026"}
Category:            ${request.category}
Location:            ${request.location}
Status:              ${citizenStatus}

Description:
${request.description}

Latest Update:
${getLatestUpdate(request)}

Expected Next Step:
${getNextStep(request.status)}
========================================================
Verification Portal: ${typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app"}
This is an authentic computer-generated digital receipt.
========================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${request.id}_Receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendAdditional = (e) => {
    e.preventDefault();
    if (!additionalText.trim()) return;
    setSubmittedAdditional(true);
    if (onAddInfo) {
      onAddInfo(request.id, additionalText);
    }
    setTimeout(() => {
      setReportingInfo(false);
      setSubmittedAdditional(false);
      setAdditionalText("");
    }, 1500);
  };

  return (
    <div
      className="service-details-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="req-details-title"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="request-details-modal">
        {/* Header */}
        <div className="req-modal-header">
          <div>
            <div className="req-modal-meta">
              <span className="req-id-pill">{request.id}</span>
              <span className="req-date-text">Submitted: {request.date || "Recent"}</span>
            </div>
            <h2 id="req-details-title" className="req-modal-title">
              {request.category}
            </h2>
            <div className="req-modal-location">
              <UiIcon name="pin" size={14} />
              <span>{request.location}</span>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            <UiIcon name="close" size={16} />
          </button>
        </div>

        {/* Status & Timeline */}
        <div className="req-modal-section">
          <div className="section-title-row">
            <h4>Application Progress</h4>
            <StatusBadge status={citizenStatus} />
          </div>
          <RequestTimeline currentStatus={citizenStatus} />
        </div>

        {/* Latest Update Box */}
        <div className="latest-update-box">
          <div className="update-label-row">
            <UiIcon name="bell" size={14} />
            <strong>Latest Update</strong>
          </div>
          <p>{getLatestUpdate(request)}</p>
          <div className="next-step-row">
            <span>Expected next step:</span>
            <strong>{getNextStep(request.status)}</strong>
          </div>
        </div>

        {/* Description & Evidence */}
        <div className="req-modal-section">
          <h4>Problem Description</h4>
          <p className="req-full-desc">{request.description}</p>
        </div>

        {/* Evidence / Attachments */}
        <div className="req-modal-section">
          <h4>Submitted Evidence</h4>
          <div className="evidence-placeholder-box">
            <UiIcon name="document" size={18} />
            <span>Digital community report recorded. (Simulated photo/GPS timestamp attached).</span>
          </div>
        </div>

        {/* Additional Information Form Toggle */}
        {reportingInfo && (
          <form className="additional-info-form" onSubmit={handleSendAdditional}>
            <h4>Report Additional Information</h4>
            <textarea
              rows="3"
              placeholder="Provide more details, landmark references, or updates on the situation..."
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              required
            />
            <div className="form-btn-row">
              <button
                type="button"
                className="gov-btn secondary"
                onClick={() => setReportingInfo(false)}
              >
                Cancel
              </button>
              <button type="submit" className="gov-btn primary" disabled={submittedAdditional}>
                {submittedAdditional ? "Submitting update..." : "Send Update"}
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        <div className="req-modal-footer">
          <button className="gov-btn secondary" onClick={handleDownloadReceipt}>
            <UiIcon name="save" size={14} />
            <span>Download Request Receipt</span>
          </button>
          {!reportingInfo && (
            <button className="gov-btn primary" onClick={() => setReportingInfo(true)}>
              <UiIcon name="request" size={14} />
              <span>Report Additional Information</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
