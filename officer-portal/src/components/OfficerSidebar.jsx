import Icon from "./Icon";

export default function OfficerSidebar({
  activeTab,
  onNavigate,
  currentOfficer,
  mobileOpen,
  onCloseMobile,
  onLogout
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", badge: null },
    { id: "applications", label: "Applications Queue", icon: "requests", badge: "DPI" },
    { id: "requests", label: "Civic Requests Queue", icon: "requests", badge: "Live" },
    { id: "gateway", label: "API Gateway Monitor", icon: "dashboard", badge: "Live" },
    { id: "translation", label: "Translation Analytics", icon: "analytics", badge: null },
    { id: "audit", label: "Audit Ledger", icon: "assigned", badge: "SHA-256" },
    { id: "assigned", label: "Assigned to Me", icon: "assigned", badge: "2" },
    { id: "map", label: "GIS Request Map", icon: "map", badge: null },
    { id: "analytics", label: "Civic Deficit Analytics", icon: "analytics", badge: null },
    { id: "departments", label: "Departments", icon: "departments", badge: null },
    { id: "profile", label: "Officer Profile", icon: "profile", badge: null }
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="officer-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`officer-sidebar ${mobileOpen ? "mobile-open" : ""}`} aria-label="Officer Navigation">
        {/* Brand Header */}
        <div className="officer-brand-header">
          <div className="officer-brand-emblem" aria-hidden="true">
            <span>P</span>
          </div>
          <div className="officer-brand-titles">
            <div className="brand-name-row">
              <span className="brand-name">PROMETHEUS</span>
              <span className="ops-tag">OPS</span>
            </div>
            <span className="brand-sub">Government Operations Command</span>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Officer Active Jurisdiction Pill */}
        <div className="officer-jurisdiction-card">
          <div className="jurisdiction-top">
            <span className="pulse-dot" />
            <span className="jurisdiction-label">COMMAND JURISDICTION</span>
          </div>
          <strong className="jurisdiction-title">
            {currentOfficer?.jurisdiction || "Coimbatore & Western Region"}
          </strong>
        </div>

        {/* Navigation Items */}
        <nav className="officer-nav-links" aria-label="Operations links">
          <span className="nav-group-heading">OPERATIONS MENU</span>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`officer-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleItemClick(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size={18} className="officer-nav-icon" />
                <span className="officer-nav-label">{item.label}</span>
                {item.badge && (
                  <span className={`officer-nav-chip ${item.badge === "Live" ? "chip-live" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer & User Profile */}
        <div className="officer-sidebar-footer">
          <div className="officer-user-compact">
            <div className="officer-avatar-badge">
              {currentOfficer?.avatar || "RS"}
            </div>
            <div className="officer-user-texts">
              <strong className="officer-display-name">
                {currentOfficer?.name || "Dr. Rajesh Sharma, IAS"}
              </strong>
              <span className="officer-dept-sub">
                {currentOfficer?.designation || "Commissioner of Operations"}
              </span>
            </div>
          </div>

          <div className="officer-footer-actions">
            <a
              href={import.meta.env.VITE_CITIZEN_PORTAL_URL || (import.meta.env.PROD ? "/" : "http://localhost:5173")}
              target="_blank"
              rel="noreferrer"
              className="officer-footer-link"
              title="Open Prometheus Citizen Portal in new tab"
            >
              <Icon name="external" size={14} />
              <span>Citizen Portal</span>
            </a>

            <button
              type="button"
              className="officer-footer-link logout"
              onClick={onLogout}
              title="End officer session"
            >
              <Icon name="logout" size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
