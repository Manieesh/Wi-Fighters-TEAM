import Icon from "../components/Icon";

export default function Analytics({ stats }) {
  const categories = stats?.categoryDistribution || [
    { label: "Drinking Water", count: 2843, percentage: 42 },
    { label: "Roads", count: 1189, percentage: 26 },
    { label: "Healthcare", count: 756, percentage: 16 },
    { label: "Electricity", count: 540, percentage: 10 },
    { label: "Sanitation", count: 920, percentage: 6 }
  ];

  const hotspots = [
    { district: "Coimbatore", category: "Drinking Water", demandScore: 94, urgency: "Critical", population: "91,200", trend: "+24%" },
    { district: "Madurai", category: "Roads", demandScore: 82, urgency: "High", population: "54,600", trend: "+12%" },
    { district: "Chennai", category: "Public Transport", demandScore: 89, urgency: "High", population: "185,000", trend: "+19%" },
    { district: "Bhopal", category: "Healthcare", demandScore: 76, urgency: "Moderate", population: "26,300", trend: "+8%" }
  ];

  const prioritisedSchemes = [
    { id: "PRJ-204", title: "Kinathukadavu Piped Drinking Water Supply", budget: "₹18.4 Cr", demandScore: 94, impactScore: 92, status: "Recommended for Sanction", dept: "TWAD" },
    { id: "PRJ-198", title: "Tirumangalam Arterial Road Restoration", budget: "₹9.8 Cr", demandScore: 82, impactScore: 78, status: "Approved for Tendering", dept: "PWD" },
    { id: "PRJ-176", title: "Berasia Tele-Health Mobile Diagnostic Fleet", budget: "₹4.2 Cr", demandScore: 88, impactScore: 84, status: "Operational Impact", dept: "Health" }
  ];

  return (
    <div className="officer-page-view analytics-view">
      <div className="analytics-header-banner">
        <div>
          <span className="banner-eyebrow">EVIDENCE-BASED POLICY &amp; BUDGET PLANNING</span>
          <h2>Infrastructure Deficit Analytics &amp; Impact Engine</h2>
          <p>
            Machine-clustered citizen demand indicators informing capital expenditure allocations and inter-departmental infrastructure sanctions.
          </p>
        </div>
      </div>

      {/* 2-Column Analytics Grid */}
      <div className="analytics-grid-two">
        {/* Trend Bar */}
        <div className="analytics-card">
          <div className="card-top-header">
            <div>
              <span className="card-micro">TEMPORAL ANALYSIS</span>
              <h3>Monthly Inflow vs Resolution Rate</h3>
            </div>
          </div>

          <div className="monthly-chart-bars">
            {[
              { m: "Apr", req: 1820, res: 1450, pct: 80 },
              { m: "May", req: 2190, res: 1820, pct: 83 },
              { m: "Jun", req: 2840, res: 2100, pct: 74 },
              { m: "Jul", req: 3410, res: 2680, pct: 78 },
              { m: "Aug", req: 3950, res: 3120, pct: 79 },
              { m: "Sep", req: 4320, res: 3490, pct: 81 }
            ].map((item) => (
              <div key={item.m} className="month-bar-row">
                <span className="month-name">{item.m}</span>
                <div className="bar-track-dual">
                  <div className="bar-registered" style={{ width: `${(item.req / 4500) * 100}%` }} title={`Registered: ${item.req}`} />
                  <div className="bar-resolved" style={{ width: `${(item.res / 4500) * 100}%` }} title={`Resolved: ${item.res}`} />
                </div>
                <span className="month-stat">
                  <strong>{item.res}</strong> / {item.req} ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share */}
        <div className="analytics-card">
          <div className="card-top-header">
            <div>
              <span className="card-micro">SECTOR GAP WEIGHT</span>
              <h3>Deficit Volume by Category</h3>
            </div>
          </div>

          <div className="analytics-cat-list">
            {categories.map((c) => (
              <div key={c.label} className="cat-row">
                <div className="cat-row-header">
                  <span className="cat-title">{c.label}</span>
                  <span className="cat-val">{c.count.toLocaleString()} reports ({c.percentage}%)</span>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{ width: `${c.percentage * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Demand Hotspots Table */}
      <div className="analytics-card table-section">
        <div className="card-top-header">
          <div>
            <span className="card-micro">GEOGRAPHIC VULNERABILITY</span>
            <h3>Regional Hotspots &amp; Population Impact Clusters</h3>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="officer-data-table">
            <thead>
              <tr>
                <th>District / Region</th>
                <th>Primary Infrastructure Gap</th>
                <th>Deficit Demand Score</th>
                <th>Urgency Level</th>
                <th>Beneficiary Population</th>
                <th>Monthly Inflow Trend</th>
              </tr>
            </thead>
            <tbody>
              {hotspots.map((h) => (
                <tr key={h.district}>
                  <td><strong>{h.district}</strong></td>
                  <td><span className="table-cat-tag">{h.category}</span></td>
                  <td>
                    <div className="score-meter">
                      <div className="score-fill" style={{ width: `${h.demandScore}%` }} />
                      <span>{h.demandScore}/100</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-pill priority-${h.urgency === "Critical" ? "high" : h.urgency === "High" ? "medium" : "low"}`}>
                      {h.urgency}
                    </span>
                  </td>
                  <td><strong>{h.population}</strong></td>
                  <td><span className="trend-green">{h.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Prioritised Schemes */}
      <div className="analytics-card table-section">
        <div className="card-top-header">
          <div>
            <span className="card-micro">CAPITAL ALLOCATION ENGINE</span>
            <h3>AI Prioritised Capital Infrastructure Projects</h3>
          </div>
        </div>

        <div className="prioritised-schemes-grid">
          {prioritisedSchemes.map((s) => (
            <div key={s.id} className="scheme-card">
              <div className="scheme-header">
                <code className="scheme-id">{s.id}</code>
                <span className="scheme-dept-tag">{s.dept}</span>
              </div>
              <h4 className="scheme-title">{s.title}</h4>
              <div className="scheme-stats-row">
                <div>
                  <span className="sc-lbl">Project Budget:</span>
                  <strong className="sc-val">{s.budget}</strong>
                </div>
                <div>
                  <span className="sc-lbl">Demand Score:</span>
                  <strong className="sc-val">{s.demandScore} / 100</strong>
                </div>
                <div>
                  <span className="sc-lbl">Impact Score:</span>
                  <strong className="sc-val">{s.impactScore} / 100</strong>
                </div>
              </div>
              <div className="scheme-status-pill">
                <Icon name="check" size={13} />
                <span>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
