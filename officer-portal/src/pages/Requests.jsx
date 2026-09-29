import { useState, useMemo } from "react";
import Icon from "../components/Icon";

export default function Requests({
  requests,
  onSelectRequest,
  initialSearch = ""
}) {
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const categories = ["All", "Drinking Water", "Roads", "Healthcare", "Electricity", "Sanitation", "Education"];
  const statuses = ["All", "Submitted", "Under Review", "Assigned", "In Progress", "Completed", "Resolved"];
  const priorities = ["All", "High", "Medium", "Low", "Critical"];
  const departments = [
    "All",
    "Public Works & Road Infrastructure",
    "Water Supply & Drainage Board",
    "Health & Family Welfare Department",
    "Electricity & Energy Distribution (TANGEDCO)",
    "Municipal Solid Waste & Sanitation"
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.requestId?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.location?.city?.toLowerCase().includes(q) ||
        r.location?.district?.toLowerCase().includes(q) ||
        r.assignedOfficer?.toLowerCase().includes(q);

      const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || (r.priority || r.analysis?.severity) === priorityFilter;
      const matchesDept = departmentFilter === "All" || r.assignedDepartment === departmentFilter;

      return matchesSearch && matchesCat && matchesStatus && matchesPriority && matchesDept;
    });
  }, [requests, search, categoryFilter, statusFilter, priorityFilter, departmentFilter]);

  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setPriorityFilter("All");
    setDepartmentFilter("All");
  };

  return (
    <div className="officer-page-view requests-view">
      {/* Top Controls & Filter Bar */}
      <div className="requests-filter-card">
        <div className="filter-top-row">
          <div className="search-box-large">
            <Icon name="search" size={16} className="search-icon" />
            <input
              type="search"
              placeholder="Search by Request ID, citizen complaint text, location or officer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-search-input"
            />
          </div>

          <div className="filter-counts-summary">
            <span>Showing <strong>{filteredRequests.length}</strong> of {requests.length} Requests</span>
            {(search || categoryFilter !== "All" || statusFilter !== "All" || priorityFilter !== "All" || departmentFilter !== "All") && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div className="filter-selects-row">
          <div className="filter-field">
            <label htmlFor="cat-filter">Category:</label>
            <select
              id="cat-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="priority-filter">Priority:</label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="dept-filter">Department:</label>
            <select
              id="dept-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="officer-table-card">
        {filteredRequests.length === 0 ? (
          <div className="table-empty-box">
            <Icon name="folder" size={32} className="empty-icon" />
            <h3>No requests match your current filters</h3>
            <p>Try adjusting your search criteria or resetting filters.</p>
            <button
              type="button"
              className="officer-btn-secondary"
              onClick={handleResetFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="officer-data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Category</th>
                  <th>Citizen Complaint Details</th>
                  <th>Location / District</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Department / Officer</th>
                  <th>Date Logged</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} onClick={() => onSelectRequest(req)}>
                    <td>
                      <code className="table-code">{req.requestId}</code>
                    </td>
                    <td>
                      <span className="table-cat-tag">{req.category}</span>
                    </td>
                    <td className="table-desc-cell">
                      <div className="table-desc-wrapper">
                        <strong className="table-desc-subcat">{req.subcategory || req.category}</strong>
                        <span className="desc-truncate">{req.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-loc-text">
                        {req.location?.city || req.location?.label || req.location?.district || "Coimbatore"}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-pill priority-${(req.priority || req.analysis?.severity || "Medium").toLowerCase()}`}>
                        {req.priority || req.analysis?.severity || "Medium"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${(req.status || "Submitted").toLowerCase().replace(/\s+/g, "-")}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-dept-col">
                        <span className="dept-name-cell">{req.assignedDepartment || "Pending Dispatch"}</span>
                        <small className="officer-name-cell">{req.assignedOfficer || "Unassigned"}</small>
                      </div>
                    </td>
                    <td>
                      <span className="table-date-text">
                        {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRequest(req);
                        }}
                      >
                        <Icon name="eye" size={14} />
                        <span>Process</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
