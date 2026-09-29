import { useState } from "react";
import Icon from "../components/Icon";

export default function Assignments({
  requests,
  onSelectRequest,
  currentOfficer
}) {
  const [filterMode, setFilterMode] = useState("all-assigned"); // "my-assigned" | "all-assigned" | "unassigned"

  const filtered = requests.filter((r) => {
    if (filterMode === "my-assigned") {
      return (
        r.assignedOfficer?.toLowerCase().includes("rajesh") ||
        r.assignedOfficer?.toLowerCase().includes("sharma") ||
        r.assignedOfficer?.toLowerCase().includes("commissioner") ||
        r.assignedOfficer?.toLowerCase().includes("murugesan")
      );
    }
    if (filterMode === "unassigned") {
      return !r.assignedDepartment || r.assignedOfficer === "Unassigned";
    }
    return Boolean(r.assignedDepartment);
  });

  return (
    <div className="officer-page-view assignments-view">
      <div className="assignments-top-bar">
        <div className="filter-pill-switch">
          <button
            type="button"
            className={`pill-btn ${filterMode === "all-assigned" ? "active" : ""}`}
            onClick={() => setFilterMode("all-assigned")}
          >
            All Assigned Work Orders ({requests.filter((r) => r.assignedDepartment).length})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterMode === "my-assigned" ? "active" : ""}`}
            onClick={() => setFilterMode("my-assigned")}
          >
            Assigned to My Desk (2)
          </button>
          <button
            type="button"
            className={`pill-btn ${filterMode === "unassigned" ? "active" : ""}`}
            onClick={() => setFilterMode("unassigned")}
          >
            Pending Dispatch ({requests.filter((r) => !r.assignedDepartment || r.assignedOfficer === "Unassigned").length})
          </button>
        </div>
      </div>

      <div className="assignments-cards-grid">
        {filtered.map((req) => (
          <div
            key={req.requestId}
            className="assignment-card"
            onClick={() => onSelectRequest(req)}
          >
            <div className="assignment-card-header">
              <div className="header-left-badge">
                <code className="assignment-id">{req.requestId}</code>
                <span className="assignment-category">{req.category}</span>
              </div>
              <span className={`priority-pill priority-${(req.priority || "Medium").toLowerCase()}`}>
                {req.priority || "Medium"}
              </span>
            </div>

            <h4 className="assignment-subcat">{req.subcategory || req.category}</h4>
            <p className="assignment-desc">{req.description}</p>

            <div className="assignment-meta-box">
              <div className="meta-row">
                <span className="meta-label">Location:</span>
                <span className="meta-value">{req.location?.city || req.location?.district}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Department:</span>
                <strong className="meta-value dept">{req.assignedDepartment || "Awaiting Dispatch"}</strong>
              </div>
              <div className="meta-row">
                <span className="meta-label">Assigned Lead:</span>
                <span className="meta-value">{req.assignedOfficer || "Unassigned"}</span>
              </div>
            </div>

            <div className="assignment-footer">
              <span className={`status-pill status-${(req.status || "Submitted").toLowerCase().replace(/\s+/g, "-")}`}>
                {req.status}
              </span>
              <button
                type="button"
                className="btn-triage"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRequest(req);
                }}
              >
                <Icon name="assign" size={14} />
                <span>Triage &amp; Update</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
