import { useState, useMemo } from "react";
import UiIcon from "../components/UiIcon";
import RequestCard from "../components/RequestCard";
import RequestDetailsModal from "../components/RequestDetailsModal";

export default function MyRequests({ requests = [], onNavigate, t }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const getCitizenStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("closed")) return "Closed";
    if (s.includes("complete") || s.includes("resolved")) return "Resolved";
    if (s.includes("progress") || s.includes("action") || s.includes("approved")) return "In Progress";
    if (s.includes("assigned")) return "Assigned";
    if (s.includes("review") || s.includes("proposed") || s.includes("verified") || s.includes("ai")) return "Under Review";
    return "Submitted";
  };

  const statusOptions = [
    { key: "All", label: t?.("myRequests.status.all") || "All" },
    { key: "Submitted", label: t?.("myRequests.status.submitted") || "Submitted" },
    { key: "Under Review", label: t?.("myRequests.status.underReview") || "Under Review" },
    { key: "Assigned", label: t?.("myRequests.status.assigned") || "Assigned" },
    { key: "In Progress", label: t?.("myRequests.status.inProgress") || "In Progress" },
    { key: "Resolved", label: t?.("myRequests.status.resolved") || "Resolved" },
    { key: "Closed", label: t?.("myRequests.status.closed") || "Closed" }
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const citizenStatus = getCitizenStatus(req.status);
      const matchesStatus = filterStatus === "All" || citizenStatus === filterStatus;
      const matchesSearch =
        !searchQuery ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [requests, filterStatus, searchQuery]);

  return (
    <div className="my-requests-page">
      {/* Header */}
      <div className="page-header-block">
        <div className="header-split-row">
          <div>
            <span className="page-eyebrow">CITIZEN TRACKING</span>
            <h1 className="page-main-title">
              {t?.("myRequests.title") || "My Requests"}
            </h1>
            <p className="page-lead-text">
              {t?.("myRequests.subtitle") ||
                "Track the real-time progress and official departmental updates on your submitted community requests."}
            </p>
          </div>
          <button className="gov-btn primary" onClick={() => onNavigate("request")}>
            <UiIcon name="request" size={15} />
            <span>{t?.("hero.raiseRequest") || "Tell us about a problem"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="requests-filter-bar">
        <div className="req-search-box">
          <UiIcon name="search" size={16} />
          <input
            type="text"
            placeholder={
              t?.("myRequests.searchPlaceholder") ||
              "Search by Request ID, category or location..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search requests"
          />
          {searchQuery && (
            <button className="btn-clear" onClick={() => setSearchQuery("")}>
              <UiIcon name="close" size={13} />
            </button>
          )}
        </div>

        <div className="status-filter-pills" role="tablist" aria-label="Status filter">
          {statusOptions.map((st) => (
            <button
              key={st.key}
              role="tab"
              aria-selected={filterStatus === st.key}
              className={`filter-chip ${filterStatus === st.key ? "active" : ""}`}
              onClick={() => setFilterStatus(st.key)}
            >
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="requests-grid">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onViewDetails={(item) => setSelectedRequest(item)}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="no-requests-box">
          <div className="no-req-icon">
            <UiIcon name="request" size={32} />
          </div>
          <h3>{t?.("myRequests.noRequests") || "No requests found"}</h3>
          <p>
            {searchQuery || filterStatus !== "All"
              ? "No requests match the selected filters."
              : "You have not submitted any development requests yet."}
          </p>
          <button className="gov-btn primary" onClick={() => onNavigate("request")}>
            {t?.("hero.raiseRequest") || "Raise a Development Request"}
          </button>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          t={t}
        />
      )}
    </div>
  );
}
