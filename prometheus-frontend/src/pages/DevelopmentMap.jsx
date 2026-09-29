import { useState, useMemo } from "react";
import UiIcon from "../components/UiIcon";
import StatusBadge from "../components/StatusBadge";

export default function DevelopmentMap({ onNavigate, userRequests = [] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const initialMarkers = [
    {
      id: "REQ-1001",
      type: "community-request",
      title: "Drinking Water Pipeline Restoration",
      category: "Drinking Water",
      location: "Coimbatore District, Tamil Nadu",
      status: "Under Review",
      requestsCount: 2843,
      x: 32,
      y: 65,
      urgency: "High",
      desc: "Community reported recurring pipeline fractures leaving multiple rural wards without potable water."
    },
    {
      id: "PRJ-204",
      type: "ongoing-project",
      title: "Rural Water Supply Improvement Scheme",
      category: "Drinking Water",
      location: "Coimbatore Sub-division",
      status: "Action Started",
      requestsCount: 2843,
      x: 35,
      y: 62,
      urgency: "High",
      desc: "Installation of dedicated overhead tanks and digital flow monitoring sensors."
    },
    {
      id: "REQ-1002",
      type: "community-request",
      title: "Access Road Resurfacing",
      category: "Roads & Transport",
      location: "Madurai District, Tamil Nadu",
      status: "Action Started",
      requestsCount: 1189,
      x: 42,
      y: 74,
      urgency: "Medium",
      desc: "Heavy monsoon damage on arterial link connecting agrarian markets to highway."
    },
    {
      id: "PRJ-198",
      type: "ongoing-project",
      title: "Last-mile Road Restoration Works",
      category: "Roads & Transport",
      location: "Madurai District",
      status: "Action Started",
      requestsCount: 1189,
      x: 45,
      y: 72,
      urgency: "Medium",
      desc: "Resurfacing 14.2 km of panchayat link roads."
    },
    {
      id: "PRJ-176",
      type: "completed-project",
      title: "Mobile Primary Health Unit",
      category: "Healthcare",
      location: "Bhopal District, Madhya Pradesh",
      status: "Completed",
      requestsCount: 756,
      x: 58,
      y: 35,
      urgency: "High",
      desc: "Delivered 2 fully equipped mobile tele-health vans providing bi-weekly diagnostics."
    },
    {
      id: "NEED-301",
      type: "development-need",
      title: "Substation Capacity Expansion",
      category: "Electricity & Power",
      location: "Salem District, Tamil Nadu",
      status: "Under Review",
      requestsCount: 924,
      x: 38,
      y: 58,
      urgency: "Medium",
      desc: "High voltage fluctuations affecting agricultural pump sets."
    },
    {
      id: "NEED-302",
      type: "development-need",
      title: "High School Science Lab & Digital Room",
      category: "Education",
      location: "Tirunelveli District, Tamil Nadu",
      status: "Submitted",
      requestsCount: 642,
      x: 40,
      y: 84,
      urgency: "Medium",
      desc: "Public secondary school requires digital STEM lab upgrade."
    }
  ];

  // Merge any user submitted requests as "my-requests"
  const allMarkers = useMemo(() => {
    const userMarkers = userRequests.map((r, i) => ({
      id: r.id,
      type: "my-request",
      title: r.description ? r.description.slice(0, 40) + "..." : "My Development Request",
      category: r.category,
      location: r.location || "Tamil Nadu",
      status: r.status || "Submitted",
      requestsCount: r.similar || 1,
      x: 30 + ((i * 12) % 35),
      y: 50 + ((i * 15) % 30),
      urgency: r.priority || "Medium",
      desc: r.description
    }));
    return [...initialMarkers, ...userMarkers];
  }, [userRequests]);

  const filteredMarkers = useMemo(() => {
    if (activeFilter === "all") return allMarkers;
    if (activeFilter === "my-requests") return allMarkers.filter((m) => m.type === "my-request");
    if (activeFilter === "community") return allMarkers.filter((m) => m.type === "community-request" || m.type === "my-request");
    if (activeFilter === "ongoing") return allMarkers.filter((m) => m.type === "ongoing-project");
    if (activeFilter === "completed") return allMarkers.filter((m) => m.type === "completed-project");
    if (activeFilter === "needs") return allMarkers.filter((m) => m.type === "development-need");
    return allMarkers;
  }, [allMarkers, activeFilter]);

  const getMarkerIcon = (type) => {
    if (type === "completed-project") return "checkMark";
    if (type === "ongoing-project") return "refresh";
    if (type === "my-request") return "user";
    return "pin";
  };

  return (
    <div className="development-map-page">
      {/* Header */}
      <div className="page-header-block">
        <div className="header-split-row">
          <div>
            <span className="page-eyebrow">GEOGRAPHIC EXPLORER</span>
            <h1 className="page-main-title">Development Map</h1>
            <p className="page-lead-text">
              Explore community development needs, ongoing public works and verified completions in your region.
            </p>
          </div>
          <button className="gov-btn primary" onClick={() => onNavigate("request")}>
            <UiIcon name="request" size={14} />
            <span>Report Issue in Your Area</span>
          </button>
        </div>
      </div>

      {/* Map Filters */}
      <div className="map-filter-controls" role="tablist" aria-label="Map filters">
        {[
          { id: "all", label: "All Markers" },
          { id: "my-requests", label: "My Requests" },
          { id: "community", label: "Community Requests" },
          { id: "ongoing", label: "Ongoing Projects" },
          { id: "completed", label: "Completed Projects" },
          { id: "needs", label: "Development Needs" }
        ].map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={activeFilter === f.id}
            className={`map-chip-btn ${activeFilter === f.id ? "active" : ""}`}
            onClick={() => {
              setActiveFilter(f.id);
              setSelectedItem(null);
            }}
          >
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Main Map & Detail Panel Layout */}
      <div className="map-interactive-layout">
        {/* Visual Map Surface */}
        <div className="map-viewport-surface" role="region" aria-label="Interactive Regional Development Map">
          {/* Subtle Grid Lines */}
          <div className="map-geo-grid" />
          <div className="map-region-label">SOUTHERN REGIONAL CLUSTER · DEMO MAP LAYER</div>

          {/* Interactive Markers */}
          {filteredMarkers.map((marker) => {
            const isSelected = selectedItem?.id === marker.id;
            return (
              <button
                key={marker.id}
                className={`geo-pin-marker pin-${marker.type} ${isSelected ? "selected" : ""}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={() => setSelectedItem(marker)}
                aria-label={`${marker.title} at ${marker.location}`}
              >
                <div className="pin-head">
                  <UiIcon name={getMarkerIcon(marker.type)} size={12} />
                </div>
                <div className="pin-pulse" />
                <span className="pin-badge-count">{marker.requestsCount}</span>
              </button>
            );
          })}

          {/* Map Legend */}
          <div className="map-bottom-legend">
            <span className="legend-item"><i className="legend-color-dot dot-my-req" /> My Requests</span>
            <span className="legend-item"><i className="legend-color-dot dot-community" /> Community Requests</span>
            <span className="legend-item"><i className="legend-color-dot dot-ongoing" /> Ongoing Projects</span>
            <span className="legend-item"><i className="legend-color-dot dot-completed" /> Completed Projects</span>
            <span className="legend-item"><i className="legend-color-dot dot-needs" /> Development Needs</span>
          </div>
        </div>

        {/* Selected Marker Details Drawer */}
        <div className="map-sidebar-details">
          {selectedItem ? (
            <div className="marker-details-card">
              <div className="md-top-row">
                <span className="md-id-tag">{selectedItem.id}</span>
                <StatusBadge status={selectedItem.status} />
              </div>

              <h3 className="md-title">{selectedItem.title}</h3>

              <div className="md-meta-row">
                <span className="md-meta-item">
                  <UiIcon name="document" size={13} />
                  <span>{selectedItem.category}</span>
                </span>
                <span className="md-meta-item">
                  <UiIcon name="pin" size={13} />
                  <span>{selectedItem.location}</span>
                </span>
              </div>

              <p className="md-desc">{selectedItem.desc}</p>

              <div className="md-stat-box">
                <span className="stat-label">Community Signal Volume</span>
                <div className="stat-num-row">
                  <strong className="stat-num">{selectedItem.requestsCount.toLocaleString("en-IN")}</strong>
                  <span className="stat-sub">citizen reports in this cluster</span>
                </div>
              </div>

              <div className="md-actions">
                <button
                  className="gov-btn primary full-width"
                  onClick={() => onNavigate("request")}
                >
                  <UiIcon name="request" size={14} />
                  <span>Report Related Issue Here</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="map-empty-selection">
              <UiIcon name="map" size={32} />
              <h4>Select a Map Marker</h4>
              <p>Click on any marker on the map to view project information, community signals and ongoing government work.</p>
              <div className="quick-marker-stats">
                <div className="qms-col">
                  <strong>{allMarkers.length}</strong>
                  <span>Active Markers</span>
                </div>
                <div className="qms-col">
                  <strong>2,843</strong>
                  <span>Peak Demand Signal</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
