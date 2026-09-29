import KpiCard from "../components/KpiCard";
import Icon from "../components/Icon";

export default function Dashboard({
  stats,
  requests,
  onNavigate,
  onSelectRequest,
  currentOfficer
}) {
  const recentRequests = requests.slice(0, 5);

  const categories = stats?.categoryDistribution || [
    { label: "Drinking Water", count: 2843, percentage: 42 },
    { label: "Roads", count: 1189, percentage: 26 },
    { label: "Healthcare", count: 756, percentage: 16 },
    { label: "Electricity", count: 540, percentage: 10 },
    { label: "Sanitation", count: 920, percentage: 6 }
  ];

  return (
    <div className="officer-page-view dashboard-view">
      {/* Officer Welcome Banner */}
      <div className="officer-welcome-banner">
        <div className="banner-left">
          <span className="banner-eyebrow">DISTRICT OPERATIONS LIVE DESK</span>
          <h2 className="banner-title">Welcome back, {currentOfficer?.name || "Dr. Rajesh Sharma, IAS"}</h2>
          <p className="banner-sub">
            Real-time citizen deficit demand clustering, inter-departmental dispatch, and public infrastructure monitoring across {currentOfficer?.jurisdiction || "Coimbatore & Western Region"}.
          </p>
        </div>
        <div className="banner-quick-actions">
          <button
            type="button"
            className="banner-action-btn primary"
            onClick={() => onNavigate("requests")}
          >
            <Icon name="requests" size={16} />
            <span>Process Requests Queue</span>
          </button>
          <button
            type="button"
            className="banner-action-btn"
            onClick={() => onNavigate("map")}
          >
            <Icon name="map" size={16} />
            <span>Open GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="dashboard-kpi-grid">
        <KpiCard
          label="Total Citizen Requests"
          value={stats?.totalRequests ? stats.totalRequests.toLocaleString() : "6,248"}
          tone="blue"
          subtext="+14% registered this month"
          icon="requests"
          onClick={() => onNavigate("requests")}
        />
        <KpiCard
          label="Pending Initial Review"
          value={stats?.pendingRequests || "182"}
          tone="amber"
          subtext="Requires preliminary AI triage"
          icon="clock"
          onClick={() => onNavigate("requests")}
        />
        <KpiCard
          label="Active Under Execution"
          value={stats?.inProgressRequests || "327"}
          tone="purple"
          subtext="Work orders dispatched to PWD/TWAD"
          icon="dashboard"
          onClick={() => onNavigate("requests")}
        />
        <KpiCard
          label="Delivered & Resolved"
          value={stats?.resolvedRequests || "739"}
          tone="green"
          subtext={`${stats?.resolutionRate || 74}% resolution compliance`}
          icon="check"
          onClick={() => onNavigate("requests")}
        />
      </div>

      {/* DPI Integration Operations KPI Grid */}
      <div className="section-header-compact" style={{ marginTop: "1.5rem", marginBottom: "0.8rem" }}>
        <span className="section-eyebrow" style={{ color: "#38bdf8", fontSize: "0.75rem", letterSpacing: "0.06em", fontWeight: 700 }}>
          DPI CROSS-DEPARTMENT INTEGRATION TELEMETRY
        </span>
      </div>
      <div className="dashboard-kpi-grid">
        <KpiCard
          label="Total Integrated Applications"
          value="1,248"
          tone="blue"
          subtext="Voter, RTO, Welfare"
          icon="requests"
          onClick={() => onNavigate("applications")}
        />
        <KpiCard
          label="Active Processing Queue"
          value="46"
          tone="amber"
          subtext="Under departmental review"
          icon="clock"
          onClick={() => onNavigate("applications")}
        />
        <KpiCard
          label="Translation Engine Passes"
          value="1,428"
          tone="purple"
          subtext="99.5% schema conversion accuracy"
          icon="dashboard"
          onClick={() => onNavigate("translation")}
        />
        <KpiCard
          label="API Success Rate"
          value="99.8%"
          tone="green"
          subtext="6 healthy sovereign gateways"
          icon="check"
          onClick={() => onNavigate("gateway")}
        />
      </div>

      {/* Main Grid: Trends & Categories */}
      <div className="dashboard-charts-grid">
        {/* Monthly Requests vs Resolution Trend */}
        <div className="dashboard-card trend-card">
          <div className="card-header-row">
            <div>
              <span className="card-micro">TEMPORAL METRICS</span>
              <h3 className="card-title">Monthly Demand vs Resolution Trend</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot dot-blue" /> Registered</span>
              <span className="legend-item"><span className="dot dot-green" /> Resolved</span>
            </div>
          </div>

          <div className="trend-bar-chart">
            {[
              { m: "May", reg: 65, res: 50, valReg: 2190, valRes: 1820 },
              { m: "Jun", reg: 78, res: 60, valReg: 2840, valRes: 2100 },
              { m: "Jul", reg: 85, res: 70, valReg: 3410, valRes: 2680 },
              { m: "Aug", reg: 92, res: 78, valReg: 3950, valRes: 3120 },
              { m: "Sep", reg: 100, res: 84, valReg: 4320, valRes: 3490 }
            ].map((col) => (
              <div key={col.m} className="trend-bar-col">
                <div className="bars-group">
                  <div
                    className="bar bar-reg"
                    style={{ height: `${col.reg}%` }}
                    title={`Registered: ${col.valReg}`}
                  />
                  <div
                    className="bar bar-res"
                    style={{ height: `${col.res}%` }}
                    title={`Resolved: ${col.valRes}`}
                  />
                </div>
                <span className="bar-label">{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requests by Sector & Priority */}
        <div className="dashboard-card category-card">
          <div className="card-header-row">
            <div>
              <span className="card-micro">SECTORAL DISTRIBUTION</span>
              <h3 className="card-title">Requests by Infrastructure Category</h3>
            </div>
          </div>

          <div className="category-bars-list">
            {categories.map((cat) => (
              <div key={cat.label} className="cat-bar-item">
                <div className="cat-bar-info">
                  <span className="cat-name">{cat.label}</span>
                  <span className="cat-count">
                    <strong>{cat.count.toLocaleString()}</strong> ({cat.percentage}%)
                  </span>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{ width: `${Math.min(100, cat.percentage * 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests Table Section */}
      <div className="dashboard-card recent-requests-card">
        <div className="card-header-row">
          <div>
            <span className="card-micro">LIVE QUEUE</span>
            <h3 className="card-title">Recent Citizen Development Requests</h3>
          </div>
          <button
            type="button"
            className="view-all-table-btn"
            onClick={() => onNavigate("requests")}
          >
            <span>View Full Queue ({requests.length})</span>
            <Icon name="arrowRight" size={14} />
          </button>
        </div>

        <div className="table-responsive-wrapper">
          <table className="officer-data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Category</th>
                <th>Citizen Description</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Officer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req.requestId} onClick={() => onSelectRequest(req)}>
                  <td>
                    <code className="table-code">{req.requestId}</code>
                  </td>
                  <td>
                    <span className="table-cat-tag">{req.category}</span>
                  </td>
                  <td className="table-desc-cell">
                    <span className="desc-truncate">{req.description}</span>
                  </td>
                  <td>
                    <span className="table-loc-text">
                      {req.location?.city || req.location?.district || "Coimbatore"}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-pill priority-${(req.priority || "Medium").toLowerCase()}`}>
                      {req.priority || "Medium"}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-${(req.status || "Submitted").toLowerCase().replace(/\s+/g, "-")}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <span className="assigned-text">{req.assignedOfficer || "Unassigned"}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRequest(req);
                      }}
                      aria-label={`Open details for ${req.requestId}`}
                    >
                      <Icon name="eye" size={14} />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
