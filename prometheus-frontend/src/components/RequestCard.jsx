import UiIcon from "./UiIcon";
import StatusBadge from "./StatusBadge";
import RequestTimeline from "./RequestTimeline";

export default function RequestCard({ request, onViewDetails }) {
  const getCitizenStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("complete") || s.includes("resolved") || s.includes("closed")) return "Resolved";
    if (s.includes("progress") || s.includes("action") || s.includes("approved")) return "In Progress";
    if (s.includes("assign")) return "Assigned";
    if (s.includes("review") || s.includes("proposed") || s.includes("verified") || s.includes("ai")) return "Under Review";
    return "Submitted";
  };

  const citizenStatus = getCitizenStatus(request.status);
  const lastUpdatedText = request.lastUpdated || request.updatedAt || "Today, 10:45 AM";

  return (
    <article className="citizen-request-card">
      <div className="request-card-header">
        <div className="req-id-group">
          <span className="req-id-tag font-mono">{request.id}</span>
          <span className="req-date">Submitted: {request.date || "Recent"}</span>
        </div>
        <StatusBadge status={citizenStatus} />
      </div>

      <div className="request-card-body">
        <div className="req-title-row">
          <h3 className="req-category">{request.category}</h3>
          <span className="req-location">
            <UiIcon name="pin" size={13} />
            <span>{request.location}</span>
          </span>
        </div>

        <p className="req-desc">{request.description}</p>

        {/* 4-Stage Horizontal Timeline */}
        <div className="req-timeline-wrapper">
          <RequestTimeline currentStatus={citizenStatus} />
        </div>

        {/* Request Metadata: Last Updated */}
        <div className="req-meta-footer-strip">
          <div className="req-last-updated">
            <UiIcon name="clock" size={12} />
            <span>Last updated: <strong>{lastUpdatedText}</strong></span>
          </div>
          <button
            className="btn-view-request"
            onClick={() => onViewDetails(request)}
            aria-label={`View details for request ${request.id}`}
          >
            <span>View Details</span>
            <UiIcon name="arrowRight" size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
