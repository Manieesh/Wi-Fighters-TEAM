import Icon from "../components/Icon";

export default function Departments({ departments = [] }) {
  const deptsList = departments.length > 0 ? departments : [
    {
      id: "DEP-PWD",
      name: "Public Works & Road Infrastructure",
      code: "PWD",
      ministerialHead: "Minister for Highways & Minor Ports",
      chiefEngineer: "Er. P. Murugesan",
      activeProjects: 48,
      allocatedRequests: 1189,
      resolvedRequests: 742,
      resolutionRate: "62%",
      budgetAllocated: "₹142.5 Cr",
      slaCompliance: "91%"
    },
    {
      id: "DEP-TWAD",
      name: "Water Supply & Drainage Board",
      code: "TWAD",
      ministerialHead: "Municipal Administration & Water Supply",
      chiefEngineer: "S. Venkataraman",
      activeProjects: 64,
      allocatedRequests: 2843,
      resolvedRequests: 1620,
      resolutionRate: "57%",
      budgetAllocated: "₹218.0 Cr",
      slaCompliance: "88%"
    },
    {
      id: "DEP-HEALTH",
      name: "Health & Family Welfare Department",
      code: "HEALTH",
      ministerialHead: "Health & Family Welfare Directorate",
      chiefEngineer: "Dr. K. Anitha",
      activeProjects: 32,
      allocatedRequests: 756,
      resolvedRequests: 588,
      resolutionRate: "78%",
      budgetAllocated: "₹88.4 Cr",
      slaCompliance: "96%"
    },
    {
      id: "DEP-ELEC",
      name: "Electricity & Energy Distribution (TANGEDCO)",
      code: "TANGEDCO",
      ministerialHead: "Ministry of Power & Renewable Energy",
      chiefEngineer: "M. Soundararajan",
      activeProjects: 29,
      allocatedRequests: 940,
      resolvedRequests: 610,
      resolutionRate: "65%",
      budgetAllocated: "₹72.0 Cr",
      slaCompliance: "89%"
    },
    {
      id: "DEP-SAN",
      name: "Municipal Solid Waste & Sanitation",
      code: "SAN",
      ministerialHead: "Urban Local Bodies & Sanitation Mission",
      chiefEngineer: "S. Nagarajan",
      activeProjects: 41,
      allocatedRequests: 920,
      resolvedRequests: 680,
      resolutionRate: "74%",
      budgetAllocated: "₹45.2 Cr",
      slaCompliance: "93%"
    }
  ];

  return (
    <div className="officer-page-view departments-view">
      <div className="dept-header-strip">
        <div>
          <span className="banner-eyebrow">INTER-AGENCY DIRECTORY &amp; SLA BENCHMARKS</span>
          <h2>Government Departments &amp; Civic Authorities</h2>
          <p>
            Real-time inter-agency resolution rates, capital budget allocations, and chief nodal officers for public works execution.
          </p>
        </div>
      </div>

      <div className="departments-grid">
        {deptsList.map((dept) => (
          <div key={dept.id} className="dept-profile-card">
            <div className="dept-card-top">
              <div className="dept-code-tag">{dept.code}</div>
              <span className="dept-sla-badge">SLA: {dept.slaCompliance}</span>
            </div>

            <h3 className="dept-name-heading">{dept.name}</h3>
            <span className="dept-ministerial">{dept.ministerialHead}</span>

            <div className="dept-lead-box">
              <Icon name="user" size={14} />
              <span>Nodal Officer: <strong>{dept.chiefEngineer}</strong></span>
            </div>

            <div className="dept-metrics-cluster">
              <div className="metric-box">
                <span className="m-label">Allocated Requests</span>
                <strong className="m-val">{dept.allocatedRequests.toLocaleString()}</strong>
              </div>
              <div className="metric-box">
                <span className="m-label">Delivered Projects</span>
                <strong className="m-val">{dept.resolvedRequests.toLocaleString()}</strong>
              </div>
              <div className="metric-box">
                <span className="m-label">Resolution Rate</span>
                <strong className="m-val text-green">{dept.resolutionRate}</strong>
              </div>
              <div className="metric-box">
                <span className="m-label">Budget Allocated</span>
                <strong className="m-val">{dept.budgetAllocated}</strong>
              </div>
            </div>

            <div className="dept-footer-bar">
              <span className="active-proj-count">{dept.activeProjects} Live Capital Schemes</span>
              <button type="button" className="btn-dept-audit">
                <span>View Division Audit</span>
                <Icon name="arrowRight" size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
