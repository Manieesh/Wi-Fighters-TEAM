import { useState } from "react";
import Icon from "./Icon";

const WORKFLOW_STEPS = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved"
];

const DEPARTMENTS_LIST = [
  "Public Works & Road Infrastructure",
  "Water Supply & Drainage Board",
  "Health & Family Welfare Department",
  "Electricity & Energy Distribution (TANGEDCO)",
  "Municipal Solid Waste & Sanitation",
  "School Education Infrastructure"
];

export default function RequestDetailsModal({
  request,
  onClose,
  onUpdateStatus,
  onAssign,
  onAddRemark,
  currentOfficer
}) {
  const [selectedStatus, setSelectedStatus] = useState(request.status || "Submitted");
  const [targetDepartment, setTargetDepartment] = useState(request.assignedDepartment || DEPARTMENTS_LIST[0]);
  const [targetOfficer, setTargetOfficer] = useState(request.assignedOfficer || "");
  const [remarkInput, setRemarkInput] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  if (!request) return null;

  const currentStepIdx = WORKFLOW_STEPS.indexOf(request.status);
  const effectiveStepIdx = currentStepIdx === -1 ? (request.status === "Completed" ? 4 : 1) : currentStepIdx;

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateStatus(request.requestId, {
        status: selectedStatus,
        officerName: currentOfficer?.name || "Dr. Rajesh Sharma, IAS",
        remarks: remarkInput || `Status transitioned to ${selectedStatus}`
      });
      setSuccessToast(`Request status updated to ${selectedStatus}`);
      setRemarkInput("");
      setTimeout(() => setSuccessToast(""), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAssign(request.requestId, {
        department: targetDepartment,
        officer: targetOfficer,
        assignedBy: currentOfficer?.name || "Dr. Rajesh Sharma, IAS",
        notes: assignmentNotes
      });
      setSuccessToast(`Assigned to ${targetDepartment}`);
      setAssignmentNotes("");
      setTimeout(() => setSuccessToast(""), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    if (!remarkInput.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddRemark(request.requestId, {
        remark: remarkInput,
        officerName: currentOfficer?.name || "Dr. Rajesh Sharma, IAS",
        department: currentOfficer?.department || "District Operations",
        actionTaken: "Official Inspection Note"
      });
      setSuccessToast("Remark recorded on official case file.");
      setRemarkInput("");
      setTimeout(() => setSuccessToast(""), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="officer-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-req-title"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="officer-modal-container">
        {/* Modal Top Header */}
        <div className="modal-header-strip">
          <div className="modal-title-group">
            <div className="req-id-badge-row">
              <span className="req-id-code">{request.requestId}</span>
              <span className={`status-pill status-${(request.status || "Submitted").toLowerCase().replace(/\s+/g, "-")}`}>
                {request.status}
              </span>
              <span className={`priority-pill priority-${(request.priority || "Medium").toLowerCase()}`}>
                {request.priority || "Medium"} Priority
              </span>
            </div>
            <h2 id="modal-req-title" className="modal-heading-text">
              {request.category} Infrastructure Deficit
            </h2>
            <span className="modal-sub-location">
              <Icon name="pin" size={14} />
              <span>{request.location?.city || request.location?.district || "Coimbatore"}, {request.location?.state || "Tamil Nadu"}</span>
            </span>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close request details"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {successToast && (
          <div className="modal-toast-alert" role="alert">
            <Icon name="check" size={16} />
            <span>{successToast}</span>
          </div>
        )}

        <div className="modal-scroll-body">
          {/* 5-Step Visual Workflow Stepper */}
          <div className="workflow-stepper-panel" aria-label="Resolution timeline progression">
            <span className="stepper-label">GOVERNMENT TRIAGE &amp; RESOLUTION PROGRESS</span>
            <div className="stepper-track">
              {WORKFLOW_STEPS.map((step, idx) => {
                const isPassed = effectiveStepIdx > idx;
                const isCurrent = effectiveStepIdx === idx;
                return (
                  <div
                    key={step}
                    className={`step-item ${isPassed ? "completed" : isCurrent ? "active" : "upcoming"}`}
                  >
                    <div className="step-circle">
                      {isPassed ? <Icon name="check" size={13} /> : idx + 1}
                    </div>
                    <span className="step-name">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request Content 2-Column Split */}
          <div className="modal-content-split">
            {/* Left: Original Request & AI Analysis */}
            <div className="modal-content-left">
              <div className="content-card">
                <span className="card-micro-label">ORIGINAL CITIZEN REPORT</span>
                <p className="citizen-raw-text">"{request.description}"</p>
                <div className="citizen-meta-row">
                  <span>Language: <strong>{request.language || "English"}</strong></span>
                  <span>Citizen ID: <code>{request.citizenId || "Anonymous"}</code></span>
                  <span>Logged: <strong>{new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                </div>
              </div>

              {request.analysis?.translatedText && request.analysis?.translatedText !== request.description && (
                <div className="content-card translation-card">
                  <span className="card-micro-label">ENGLISH SYSTEM TRANSLATION</span>
                  <p className="translated-text">"{request.analysis.translatedText}"</p>
                </div>
              )}

              {/* AI Deficit Assessment */}
              <div className="content-card ai-assessment-card">
                <div className="ai-card-top">
                  <Icon name="shield" size={16} className="ai-icon" />
                  <strong>AI Demand Clustering &amp; Assessment</strong>
                </div>
                <div className="ai-metrics-grid">
                  <div className="ai-metric-item">
                    <span className="ai-m-label">Cluster ID</span>
                    <strong className="ai-m-val">{request.analysis?.clusterId || "CL-DEF-1042"}</strong>
                  </div>
                  <div className="ai-metric-item">
                    <span className="ai-m-label">Similar Reports</span>
                    <strong className="ai-m-val">{request.analysis?.similarRequests || 840}</strong>
                  </div>
                  <div className="ai-metric-item">
                    <span className="ai-m-label">Demand Trend</span>
                    <strong className="ai-m-val">{request.analysis?.demandTrend || "Increasing"}</strong>
                  </div>
                </div>
              </div>

              {/* Official Timeline Audit */}
              <div className="content-card timeline-card">
                <span className="card-micro-label">CASE AUDIT TRAIL</span>
                <div className="audit-timeline-list">
                  {(request.timeline && request.timeline.length > 0 ? request.timeline : [
                    { status: "Submitted", title: "Request Received", actor: "Citizen", createdAt: request.createdAt }
                  ]).map((tItem, i) => (
                    <div key={i} className="audit-timeline-row">
                      <div className="audit-node" />
                      <div className="audit-content">
                        <strong>{tItem.title || tItem.status}</strong>
                        {tItem.description && <p>{tItem.description}</p>}
                        <div className="audit-footer-info">
                          <span>By: {tItem.actor || "Operations Engine"}</span>
                          <span>•</span>
                          <span>{new Date(tItem.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Officer Action Controls */}
            <div className="modal-content-right">
              {/* Action 1: Status Transition */}
              <div className="officer-action-box">
                <span className="action-box-title">
                  <Icon name="refresh" size={15} />
                  <span>Update Resolution Status</span>
                </span>
                <form onSubmit={handleStatusSubmit} className="action-form">
                  <label className="action-label" htmlFor="officer-select-status">
                    Target Status Stage:
                  </label>
                  <select
                    id="officer-select-status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="action-select-input"
                  >
                    {WORKFLOW_STEPS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                    <option value="Closed">Closed</option>
                  </select>

                  <label className="action-label" htmlFor="officer-remarks-area">
                    Status Update Remark:
                  </label>
                  <textarea
                    id="officer-remarks-area"
                    rows={2}
                    placeholder="Provide reason or operational note..."
                    value={remarkInput}
                    onChange={(e) => setRemarkInput(e.target.value)}
                    className="action-textarea"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="officer-btn-primary"
                  >
                    <Icon name="check" size={15} />
                    <span>Confirm Status Update</span>
                  </button>
                </form>
              </div>

              {/* Action 2: Department & Officer Assignment */}
              <div className="officer-action-box">
                <span className="action-box-title">
                  <Icon name="assign" size={15} />
                  <span>Assign Department &amp; Officer</span>
                </span>
                <form onSubmit={handleAssignSubmit} className="action-form">
                  <label className="action-label" htmlFor="assign-dept-select">
                    Assigned Department:
                  </label>
                  <select
                    id="assign-dept-select"
                    value={targetDepartment}
                    onChange={(e) => setTargetDepartment(e.target.value)}
                    className="action-select-input"
                  >
                    {DEPARTMENTS_LIST.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  <label className="action-label" htmlFor="assign-officer-input">
                    Lead Officer / Division Engineer:
                  </label>
                  <input
                    id="assign-officer-input"
                    type="text"
                    placeholder="e.g. Er. P. Murugesan (EE)"
                    value={targetOfficer}
                    onChange={(e) => setTargetOfficer(e.target.value)}
                    className="action-text-input"
                  />

                  <label className="action-label" htmlFor="assign-notes-input">
                    Dispatch Instructions:
                  </label>
                  <textarea
                    id="assign-notes-input"
                    rows={2}
                    placeholder="Action timeline, field survey directive..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="action-textarea"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="officer-btn-secondary"
                  >
                    <Icon name="send" size={15} />
                    <span>Dispatch Assignment</span>
                  </button>
                </form>
              </div>

              {/* Action 3: Existing Officer Remarks */}
              {request.officerRemarks && request.officerRemarks.length > 0 && (
                <div className="officer-action-box">
                  <span className="action-box-title">
                    <Icon name="document" size={15} />
                    <span>Official Officer Notes ({request.officerRemarks.length})</span>
                  </span>
                  <div className="remarks-history-list">
                    {request.officerRemarks.map((rem, idx) => (
                      <div key={idx} className="remark-bubble">
                        <div className="remark-header-line">
                          <strong>{rem.officerName}</strong>
                          <small>{new Date(rem.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small>
                        </div>
                        <p className="remark-body-text">{rem.remark}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-footer-strip">
          <div className="footer-meta-notes">
            <span>Logged under Official Case File: <strong>{request.requestId}</strong></span>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            Close Case File
          </button>
        </div>
      </div>
    </div>
  );
}
