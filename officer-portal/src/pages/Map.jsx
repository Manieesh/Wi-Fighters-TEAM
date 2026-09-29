import { useState } from "react";
import Icon from "../components/Icon";

export default function Map({ requests, onSelectRequest }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [activePin, setActivePin] = useState(null);

  const categories = ["All", "Drinking Water", "Roads", "Healthcare", "Electricity", "Sanitation"];

  // Geo pins mapped to districts
  const geoPoints = [
    { id: "P-1", reqId: "REQ-1001", name: "Kinathukadavu Block", district: "Coimbatore", category: "Drinking Water", priority: "High", status: "Under Review", x: 28, y: 64, count: 2843 },
    { id: "P-2", reqId: "REQ-1002", name: "Tirumangalam Rural", district: "Madurai", category: "Roads", priority: "Medium", status: "In Progress", x: 42, y: 78, count: 1189 },
    { id: "P-3", reqId: "REQ-1003", name: "Berasia Sub-division", district: "Bhopal", category: "Healthcare", priority: "High", status: "Completed", x: 48, y: 28, count: 756 },
    { id: "P-4", reqId: "REQ-1004", name: "Ambattur Sector 3", district: "Chennai", category: "Electricity", priority: "Medium", status: "Submitted", x: 74, y: 52, count: 540 },
    { id: "P-5", reqId: "REQ-1005", name: "Singanallur Ward 61", district: "Coimbatore", category: "Sanitation", priority: "High", status: "Assigned", x: 32, y: 60, count: 920 }
  ];

  const filteredPoints = geoPoints.filter((pt) => {
    const matchCat = selectedCategory === "All" || pt.category === selectedCategory;
    const matchPri = selectedPriority === "All" || pt.priority === selectedPriority;
    return matchCat && matchPri;
  });

  const handlePointClick = (pt) => {
    setActivePin(pt);
    const fullReq = requests.find((r) => r.requestId === pt.reqId);
    if (fullReq) {
      // ready for preview
    }
  };

  const selectedFullReq = activePin ? requests.find((r) => r.requestId === activePin.reqId) : null;

  return (
    <div className="officer-page-view map-view">
      {/* Top Map Filters */}
      <div className="map-filter-strip">
        <div className="filter-item-group">
          <label htmlFor="map-cat-filter">Category:</label>
          <select
            id="map-cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-item-group">
          <label htmlFor="map-priority-filter">Priority:</label>
          <select
            id="map-priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="map-stats-summary">
          <span>Active Geospatial Clusters: <strong>{filteredPoints.length}</strong></span>
        </div>
      </div>

      {/* Main Map Visual Canvas Area */}
      <div className="map-container-frame">
        {/* SVG Base District Map Layer */}
        <div className="map-canvas-stage">
          <svg
            className="regional-map-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="mapGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#mapGridGrad)" />
            {/* Regional grid contour lines */}
            <path d="M 0,20 Q 50,30 100,15" stroke="#CBD5E1" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
            <path d="M 0,45 Q 40,55 100,40" stroke="#CBD5E1" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
            <path d="M 0,70 Q 60,65 100,75" stroke="#CBD5E1" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
            <path d="M 25,0 Q 30,50 20,100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
            <path d="M 60,0 Q 55,50 65,100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />

            {/* Region outlines */}
            <circle cx="30" cy="62" r="14" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.7" />
            <text x="30" y="50" fontSize="2.5" fill="#3B82F6" fontWeight="700" textAnchor="middle">Coimbatore Cluster (Demand: 3.7k)</text>

            <circle cx="42" cy="78" r="10" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
            <text x="42" y="70" fontSize="2.5" fill="#D97706" fontWeight="700" textAnchor="middle">Madurai Roads (1.2k)</text>

            <circle cx="74" cy="52" r="12" fill="#F3E8FF" stroke="#DDD6FE" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
            <text x="74" y="42" fontSize="2.5" fill="#7C3AED" fontWeight="700" textAnchor="middle">Chennai Metropolitan (3.4k)</text>
          </svg>

          {/* Render Interactive Pins */}
          {filteredPoints.map((pt) => {
            const isSelected = activePin?.id === pt.id;
            return (
              <div
                key={pt.id}
                className={`map-pin-marker ${isSelected ? "active" : ""} priority-${pt.priority.toLowerCase()}`}
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                onClick={() => handlePointClick(pt)}
                role="button"
                tabIndex={0}
                aria-label={`${pt.name} - ${pt.category}`}
              >
                <div className="pin-pulse-wave" />
                <div className="pin-circle">
                  <Icon name="pin" size={14} />
                </div>
                <div className="pin-label-pill">
                  <strong>{pt.reqId}</strong>
                  <span>{pt.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Details Overlay Card */}
        {activePin && (
          <div className="map-detail-drawer">
            <div className="drawer-header">
              <div>
                <span className="drawer-eyebrow">DISTRICT GIS TRIAGE PIN</span>
                <h4 className="drawer-title">{activePin.name} ({activePin.district})</h4>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setActivePin(null)}
                aria-label="Close pin preview"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="drawer-badge-row">
              <code className="drawer-req-id">{activePin.reqId}</code>
              <span className={`status-pill status-${activePin.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {activePin.status}
              </span>
              <span className={`priority-pill priority-${activePin.priority.toLowerCase()}`}>
                {activePin.priority} Priority
              </span>
            </div>

            <div className="drawer-stats-row">
              <div className="d-stat">
                <span className="d-label">Category</span>
                <strong className="d-val">{activePin.category}</strong>
              </div>
              <div className="d-stat">
                <span className="d-label">Demand Cluster</span>
                <strong className="d-val">{activePin.count.toLocaleString()} reports</strong>
              </div>
            </div>

            {selectedFullReq && (
              <p className="drawer-desc">"{selectedFullReq.description}"</p>
            )}

            <div className="drawer-action-row">
              <button
                type="button"
                className="btn-open-casefile"
                onClick={() => {
                  if (selectedFullReq) onSelectRequest(selectedFullReq);
                }}
              >
                <Icon name="eye" size={15} />
                <span>Open Full Case File</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
