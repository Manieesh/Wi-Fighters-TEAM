import { useState } from "react";
import UiIcon from "../components/UiIcon";
import StatusBadge from "../components/StatusBadge";

export default function GovernanceConsole({ onNavigate, userRole = "official", onToggleRole }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, hotspots, gaps, prioritisation, impact, tracker
  const [feedbackVote, setFeedbackVote] = useState(null);

  const kpis = [
    { label: "Total Citizen Requests", val: "128,430", tone: "blue", sub: "+18% from last month" },
    { label: "Active Public Projects", val: "2,183", tone: "amber", sub: "Under execution" },
    { label: "Completed Projects", val: "1,492", tone: "green", sub: "Audited & delivered" },
    { label: "High-Priority Areas", val: "42", tone: "red", sub: "Immediate triage" },
    { label: "Infrastructure Gaps", val: "318", tone: "red", sub: "Clustered deficits" },
    { label: "Affected Citizens", val: "4.8M", tone: "blue", sub: "Regional population" }
  ];

  const hotspots = [
    {
      city: "Coimbatore District",
      state: "Tamil Nadu",
      category: "Drinking Water",
      urgency: "High Demand",
      requests: "2,843",
      population: "91,200",
      trend: "+24%",
      gapLevel: "Critical"
    },
    {
      city: "Madurai District",
      state: "Tamil Nadu",
      category: "Road Infrastructure",
      urgency: "Medium Demand",
      requests: "1,189",
      population: "54,600",
      trend: "+12%",
      gapLevel: "High"
    },
    {
      city: "Chennai Metropolitan",
      state: "Tamil Nadu",
      category: "Public Transport",
      urgency: "High Demand",
      requests: "3,410",
      population: "185,000",
      trend: "+19%",
      gapLevel: "High"
    },
    {
      city: "Bhopal District",
      state: "Madhya Pradesh",
      category: "Primary Healthcare",
      urgency: "Medium Demand",
      requests: "756",
      population: "26,300",
      trend: "+8%",
      gapLevel: "Moderate"
    }
  ];

  const prioritisedProjects = [
    {
      id: "PRJ-204",
      name: "Rural Water Supply Improvement Scheme",
      category: "Drinking Water",
      location: "Coimbatore District",
      demandScore: 92,
      gapScore: 94,
      populationScore: 88,
      urgencyScore: 86,
      compositeScore: 90,
      serviceAvailability: "42% → 89%",
      estimatedImpact: "91,200 beneficiaries",
      status: "Recommended for Immediate Sanction",
      statusTone: "success"
    },
    {
      id: "PRJ-198",
      name: "Last-mile Rural Road Restoration",
      category: "Road Infrastructure",
      location: "Madurai District",
      demandScore: 78,
      gapScore: 82,
      populationScore: 65,
      urgencyScore: 74,
      compositeScore: 75,
      serviceAvailability: "56% → 94%",
      estimatedImpact: "54,600 beneficiaries",
      status: "Approved for Tendering",
      statusTone: "info"
    },
    {
      id: "PRJ-176",
      name: "Mobile Primary Tele-Health Diagnostic Fleet",
      category: "Healthcare",
      location: "Bhopal District",
      demandScore: 84,
      gapScore: 88,
      populationScore: 72,
      urgencyScore: 81,
      compositeScore: 81,
      serviceAvailability: "35% → 82%",
      estimatedImpact: "26,300 beneficiaries",
      status: "Under Budgetary Allocation",
      statusTone: "warning"
    }
  ];

  const demandCategories = [
    { label: "Water Infrastructure", count: 32430, pct: 100, color: "#DFFF3F" },
    { label: "Road & Bridge Infrastructure", count: 28190, pct: 86, color: "#60a5fa" },
    { label: "Primary Healthcare Facilities", count: 21430, pct: 66, color: "#f59e0b" },
    { label: "School & Educational Labs", count: 17230, pct: 53, color: "#a78bfa" },
    { label: "Public Transport & Connectivity", count: 12890, pct: 40, color: "#fb923c" }
  ];

  return (
    <div className="gov-console-page">
      {/* Official Access Header Banner */}
      <div className="official-banner-strip">
        <div className="obs-left">
          <span className="official-shield-badge">
            <UiIcon name="shield" size={14} />
            <span>AUTHORISED OFFICIAL ACCESS</span>
          </span>
          <span className="demo-notice-tag">DEMO PROTOTYPE DATA</span>
        </div>
        <div className="obs-right">
          <span>Active Role: <strong>Government Official</strong></span>
          <button className="btn-role-switch-light" onClick={onToggleRole}>
            Return to Citizen Portal
          </button>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="gov-main-header">
        <div>
          <span className="page-eyebrow">POLICY &amp; INFRASTRUCTURE COMMAND</span>
          <h1 className="page-main-title">Governance Console</h1>
          <p className="page-lead-text">
            Advanced analytics, regional demand clustering, AI-assisted project prioritisation and post-delivery impact.
          </p>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="gov-kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`gov-kpi-card tone-${kpi.tone}`}>
            <span className="kpi-num">{kpi.val}</span>
            <span className="kpi-label">{kpi.label}</span>
            <small className="kpi-sub">{kpi.sub}</small>
          </div>
        ))}
      </div>

      {/* Internal Navigation Tabs */}
      <div className="gov-nav-tabs" role="tablist" aria-label="Governance sections">
        {[
          { id: "overview", label: "Demand Analysis" },
          { id: "hotspots", label: "Development Hotspots" },
          { id: "prioritisation", label: "AI Project Prioritisation" },
          { id: "impact", label: "Impact Measurement" },
          { id: "gaps", label: "Infrastructure Gaps" }
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`gov-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DEMAND ANALYSIS */}
      {activeTab === "overview" && (
        <div className="gov-tab-panel">
          <div className="panel-two-col-grid">
            <div className="gov-panel-card">
              <div className="panel-card-title">
                <div>
                  <span className="panel-eyebrow">REGIONAL VOLUME</span>
                  <h3>Top Development Demands</h3>
                </div>
                <span className="demo-badge">AGGREGATED</span>
              </div>
              <p className="panel-helper-text">
                Ranked by volume of verified multilingual citizen requests across district sub-divisions.
              </p>

              <div className="demand-bars-list">
                {demandCategories.map((item) => (
                  <div key={item.label} className="demand-metric-row">
                    <div className="metric-header-row">
                      <span className="metric-name">{item.label}</span>
                      <strong className="metric-val">{item.count.toLocaleString("en-IN")} reports</strong>
                    </div>
                    <div className="bar-track-back">
                      <div
                        className="bar-track-fill"
                        style={{ width: `${item.pct}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gov-panel-card">
              <div className="panel-card-title">
                <div>
                  <span className="panel-eyebrow">PORTFOLIO OVERVIEW</span>
                  <h3>Project Delivery Status</h3>
                </div>
              </div>

              <div className="donut-stat-wrapper">
                <div className="donut-center-metric">
                  <span className="d-num">2,183</span>
                  <span className="d-sub">Active Projects</span>
                </div>
              </div>

              <div className="project-status-legend">
                <div className="ps-item">
                  <span className="dot dot-green" />
                  <span>Completed: <strong>1,492</strong></span>
                </div>
                <div className="ps-item">
                  <span className="dot dot-blue" />
                  <span>In Progress: <strong>1,126</strong></span>
                </div>
                <div className="ps-item">
                  <span className="dot dot-amber" />
                  <span>Under Review: <strong>684</strong></span>
                </div>
              </div>

              <div className="data-fusion-note">
                <UiIcon name="shield" size={14} />
                <span>Citizen Voice + Demographics + Infrastructure Data → Governance Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVELOPMENT HOTSPOTS */}
      {activeTab === "hotspots" && (
        <div className="gov-tab-panel">
          <div className="gov-panel-card full-width">
            <div className="panel-card-title">
              <div>
                <span className="panel-eyebrow">REGIONAL HEATMAP</span>
                <h3>Development Demand Hotspots</h3>
              </div>
              <span className="demo-badge">LIVE CLUSTER FEED</span>
            </div>
            <p className="panel-helper-text">
              Multi-source signal fusion identifies recurring public service deficits before critical infrastructure failure.
            </p>

            <div className="hotspots-table-wrapper">
              <table className="gov-table" aria-label="Development hotspots">
                <thead>
                  <tr>
                    <th>District / Region</th>
                    <th>Core Issue</th>
                    <th>Citizen Demand</th>
                    <th>Affected Population</th>
                    <th>Demand Trend</th>
                    <th>Infrastructure Gap Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hotspots.map((hs) => (
                    <tr key={hs.city}>
                      <td>
                        <strong>{hs.city}</strong>
                        <small className="sub-cell">{hs.state}</small>
                      </td>
                      <td>
                        <span className="tag-category">{hs.category}</span>
                      </td>
                      <td>
                        <span className="bold-stat">{hs.requests}</span>
                        <small className="sub-cell">verified reports</small>
                      </td>
                      <td>{hs.population} citizens</td>
                      <td>
                        <span className="trend-stat">{hs.trend}</span>
                      </td>
                      <td>
                        <StatusBadge
                          status={hs.gapLevel}
                          tone={hs.gapLevel === "Critical" ? "danger" : hs.gapLevel === "High" ? "warning" : "info"}
                        />
                      </td>
                      <td>
                        <button
                          className="btn-table-action"
                          onClick={() => setActiveTab("prioritisation")}
                        >
                          View Prioritisation &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI PROJECT PRIORITISATION */}
      {activeTab === "prioritisation" && (
        <div className="gov-tab-panel">
          <div className="gov-panel-card full-width">
            <div className="panel-card-title">
              <div>
                <span className="panel-eyebrow">DECISION SUPPORT SYSTEM</span>
                <h3>AI-Assisted Project Prioritisation</h3>
              </div>
              <span className="demo-badge">OBJECTIVE SCORING</span>
            </div>

            <div className="prioritisation-notice-box">
              <UiIcon name="shield" size={16} />
              <div>
                <strong>Responsible AI Decision Support:</strong>
                <span>
                  The platform calculates a composite need score based on verified citizen demand, infrastructure deficit, population density and urgency.
                  Final budget allocation and executive sanction remain with authorised administrative officials.
                </span>
              </div>
            </div>

            <div className="prioritisation-cards-list">
              {prioritisedProjects.map((p) => (
                <div key={p.id} className="prioritised-project-card">
                  <div className="pp-header">
                    <div className="pp-id-block">
                      <span className="pp-id">{p.id}</span>
                      <h4>{p.name}</h4>
                      <span className="pp-loc">{p.location} · {p.category}</span>
                    </div>
                    <div className="pp-score-badge">
                      <span className="score-val">{p.compositeScore}/100</span>
                      <span className="score-label">Priority Index</span>
                    </div>
                  </div>

                  <div className="scoring-factors-grid">
                    <div className="factor-box">
                      <span className="f-title">Citizen Demand</span>
                      <div className="f-bar-row">
                        <strong className="f-num">{p.demandScore}/100</strong>
                        <div className="mini-track"><div className="mini-fill" style={{ width: `${p.demandScore}%` }} /></div>
                      </div>
                    </div>

                    <div className="factor-box">
                      <span className="f-title">Infrastructure Gap</span>
                      <div className="f-bar-row">
                        <strong className="f-num">{p.gapScore}/100</strong>
                        <div className="mini-track"><div className="mini-fill" style={{ width: `${p.gapScore}%` }} /></div>
                      </div>
                    </div>

                    <div className="factor-box">
                      <span className="f-title">Affected Population</span>
                      <div className="f-bar-row">
                        <strong className="f-num">{p.populationScore}/100</strong>
                        <div className="mini-track"><div className="mini-fill" style={{ width: `${p.populationScore}%` }} /></div>
                      </div>
                    </div>

                    <div className="factor-box">
                      <span className="f-title">Urgency Factor</span>
                      <div className="f-bar-row">
                        <strong className="f-num">{p.urgencyScore}/100</strong>
                        <div className="mini-track"><div className="mini-fill" style={{ width: `${p.urgencyScore}%` }} /></div>
                      </div>
                    </div>
                  </div>

                  <div className="pp-footer-row">
                    <div className="impact-projection">
                      <span>Projected Delivery Outcome:</span>
                      <strong>{p.serviceAvailability} availability ({p.estimatedImpact})</strong>
                    </div>
                    <StatusBadge status={p.status} tone={p.statusTone} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IMPACT DASHBOARD */}
      {activeTab === "impact" && (
        <div className="gov-tab-panel">
          <div className="gov-panel-card full-width">
            <div className="panel-card-title">
              <div>
                <span className="panel-eyebrow">CITIZEN FEEDBACK LOOP</span>
                <h3>Project Impact &amp; Delivery Outcomes</h3>
              </div>
              <span className="demo-badge">POST-COMPLETION AUDIT</span>
            </div>

            <div className="impact-hero-banner">
              <div className="ihb-text">
                <span className="ihb-tag">VERIFIED COMPLETED PROJECT</span>
                <h2>Rural Water Supply Improvement Scheme</h2>
                <p>Coimbatore District · 91,200 Verified Beneficiaries</p>
              </div>
              <div className="ihb-score-callout">
                <span className="score-big">89%</span>
                <span className="score-sub">Service Availability After Delivery</span>
              </div>
            </div>

            {/* Before vs After Grid */}
            <div className="before-after-grid">
              <div className="ba-card">
                <span className="ba-title">Citizen Grievances</span>
                <div className="ba-stat-compare">
                  <div className="ba-val before">
                    <span>Before</span>
                    <strong>2,843</strong>
                  </div>
                  <span className="ba-arrow">&rarr;</span>
                  <div className="ba-val after">
                    <span>After</span>
                    <strong>421</strong>
                  </div>
                </div>
                <span className="ba-result-note green-note">85% decrease in community complaints</span>
              </div>

              <div className="ba-card">
                <span className="ba-title">Service Availability</span>
                <div className="ba-stat-compare">
                  <div className="ba-val before">
                    <span>Before</span>
                    <strong>42%</strong>
                  </div>
                  <span className="ba-arrow">&rarr;</span>
                  <div className="ba-val after">
                    <span>After</span>
                    <strong>89%</strong>
                  </div>
                </div>
                <span className="ba-result-note green-note">+47% net availability increase</span>
              </div>

              <div className="ba-card">
                <span className="ba-title">Citizen Satisfaction</span>
                <div className="ba-stat-compare">
                  <div className="ba-val before">
                    <span>Baseline</span>
                    <strong>2.1/5</strong>
                  </div>
                  <span className="ba-arrow">&rarr;</span>
                  <div className="ba-val after">
                    <span>Post-Survey</span>
                    <strong>4.4/5</strong>
                  </div>
                </div>
                <span className="ba-result-note green-note">Based on 1,208 verified mobile responses</span>
              </div>
            </div>

            {/* Official Feedback Verification Box */}
            <div className="feedback-audit-box">
              <div className="fab-copy">
                <h4>Citizen Post-Completion Survey</h4>
                <p>Did the completed project resolve the community issue?</p>
              </div>
              <div className="fab-actions">
                <button
                  className={`gov-btn ${feedbackVote === "resolved" ? "primary" : "secondary"}`}
                  onClick={() => setFeedbackVote("resolved")}
                >
                  ✓ Yes, Resolved (88%)
                </button>
                <button
                  className={`gov-btn ${feedbackVote === "partial" ? "primary" : "secondary"}`}
                  onClick={() => setFeedbackVote("partial")}
                >
                  Partially (9%)
                </button>
                <button
                  className={`gov-btn ${feedbackVote === "unresolved" ? "primary" : "secondary"}`}
                  onClick={() => setFeedbackVote("unresolved")}
                >
                  No, Still an Issue (3%)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INFRASTRUCTURE GAPS */}
      {activeTab === "gaps" && (
        <div className="gov-tab-panel">
          <div className="gov-panel-card full-width">
            <div className="panel-card-title">
              <div>
                <span className="panel-eyebrow">STRUCTURAL AUDIT</span>
                <h3>Infrastructure Gap Registry</h3>
              </div>
              <span className="demo-badge">REGIONAL DEFICITS</span>
            </div>

            <div className="gaps-list">
              {[
                {
                  code: "GAP-104",
                  district: "Coimbatore",
                  sector: "Water Supply",
                  deficit: "Severe pipeline leakage and aged feeder mains in 8 ward clusters.",
                  severity: "Critical",
                  impact: "91,200 residents"
                },
                {
                  code: "GAP-108",
                  district: "Madurai",
                  sector: "Rural Roads",
                  deficit: "Unpaved link roads cutting off agrarian access during precipitation.",
                  severity: "High",
                  impact: "54,600 residents"
                },
                {
                  code: "GAP-112",
                  district: "Bhopal",
                  sector: "Healthcare Access",
                  deficit: "Travel distance to nearest primary healthcare exceeds 20 km.",
                  severity: "Moderate",
                  impact: "26,300 residents"
                }
              ].map((g) => (
                <div key={g.code} className="gap-item-card">
                  <div className="gic-top">
                    <span className="gic-code">{g.code}</span>
                    <span className="gic-loc">{g.district} · {g.sector}</span>
                    <StatusBadge
                      status={g.severity}
                      tone={g.severity === "Critical" ? "danger" : g.severity === "High" ? "warning" : "info"}
                    />
                  </div>
                  <p className="gic-desc">{g.deficit}</p>
                  <div className="gic-impact">
                    <span>Estimated Impact:</span>
                    <strong>{g.impact}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
