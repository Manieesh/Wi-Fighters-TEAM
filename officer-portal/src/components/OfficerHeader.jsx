import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export default function OfficerHeader({
  activeTab,
  onNavigate,
  currentOfficer,
  onToggleMobile,
  onLogout,
  onSearchGlobal,
  unreadCount = 3
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case "dashboard":
        return { section: "Government Operations", page: "Command Overview & KPIs" };
      case "requests":
        return { section: "Operations Command", page: "Citizen Requests Queue" };
      case "assigned":
        return { section: "Officer Desk", page: "Assigned Action Items" };
      case "map":
        return { section: "GIS Intelligence", page: "Infrastructure Requests Map" };
      case "analytics":
        return { section: "Policy & Planning", page: "Analytics & Deficit Clustering" };
      case "departments":
        return { section: "Inter-Agency Oversight", page: "Departments & Agencies" };
      case "profile":
        return { section: "Identity & Credentials", page: "Officer Profile" };
      default:
        return { section: "Government Operations", page: "Dashboard" };
    }
  };

  const breadcrumb = getBreadcrumb();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchGlobal && searchTerm.trim()) {
      onSearchGlobal(searchTerm.trim());
      onNavigate("requests");
    }
  };

  return (
    <header className="officer-top-header" role="banner">
      <div className="header-left-group">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="officer-mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Page Title & Breadcrumb */}
        <div className="header-breadcrumb-block">
          <div className="breadcrumb-path">
            <span className="breadcrumb-root">{breadcrumb.section}</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-leaf">{breadcrumb.page}</span>
          </div>
          <h1 className="header-main-title">{breadcrumb.page}</h1>
        </div>
      </div>

      {/* Global Quick Search Bar */}
      <form className="officer-search-form" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <Icon name="search" size={15} className="search-input-icon" />
          <input
            type="search"
            placeholder="Search Request ID (REQ-1001), district or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="officer-search-field"
            aria-label="Search citizen requests"
          />
        </div>
      </form>

      {/* Header Right Controls */}
      <div className="header-right-group">
        {/* System Health / Status Indicator */}
        <div className="system-health-tag">
          <span className="live-dot" />
          <span>OPS CONNECTED (PORT 5000)</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="header-notif-wrap" ref={notifRef}>
          <button
            type="button"
            className={`header-icon-btn ${notifDropdownOpen ? "active" : ""}`}
            onClick={() => {
              setNotifDropdownOpen((v) => !v);
              setProfileDropdownOpen(false);
            }}
            aria-label={`Officer notifications, ${unreadCount} unread`}
            aria-expanded={notifDropdownOpen}
          >
            <Icon name="bell" size={17} />
            {unreadCount > 0 && (
              <span className="officer-badge-count">{unreadCount}</span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="officer-dropdown-card notif-dropdown" role="dialog" aria-label="Officer Notifications">
              <div className="notif-dropdown-header">
                <strong>Officer Operational Alerts</strong>
                <span className="notif-pill">{unreadCount} High Priority</span>
              </div>
              <div className="notif-dropdown-list">
                <div className="notif-row high-priority">
                  <Icon name="alert" size={16} className="alert-red" />
                  <div>
                    <p className="notif-text">REQ-1001 (Drinking Water): High severity cluster mapped in Coimbatore.</p>
                    <span className="notif-time">10 mins ago</span>
                  </div>
                </div>
                <div className="notif-row">
                  <Icon name="check" size={16} className="alert-blue" />
                  <div>
                    <p className="notif-text">PRJ-198 Bitumen laying started by PWD Madurai division.</p>
                    <span className="notif-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notif-row">
                  <Icon name="document" size={16} className="alert-purple" />
                  <div>
                    <p className="notif-text">New citizen development request registered in Ambattur Sector 3.</p>
                    <span className="notif-time">4 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="notif-dropdown-footer">
                <button
                  type="button"
                  className="view-all-queue-btn"
                  onClick={() => {
                    onNavigate("requests");
                    setNotifDropdownOpen(false);
                  }}
                >
                  View All in Requests Queue &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Dropdown */}
        <div className="header-profile-wrap" ref={profileRef}>
          <button
            type="button"
            className={`officer-profile-btn ${profileDropdownOpen ? "active" : ""}`}
            onClick={() => {
              setProfileDropdownOpen((v) => !v);
              setNotifDropdownOpen(false);
            }}
            aria-expanded={profileDropdownOpen}
            aria-label="Officer account menu"
          >
            <div className="officer-avatar-circle">
              {currentOfficer?.avatar || "RS"}
            </div>
            <div className="officer-name-dept">
              <strong className="officer-name">{currentOfficer?.name || "Dr. Rajesh Sharma, IAS"}</strong>
              <span className="officer-dept-short">{currentOfficer?.department?.split("&")[0] || "District Admin"}</span>
            </div>
            <Icon name="chevronDown" size={14} className="dropdown-arrow" />
          </button>

          {profileDropdownOpen && (
            <div className="officer-dropdown-card profile-dropdown" role="menu">
              <div className="profile-summary-header">
                <div className="summary-avatar">
                  {currentOfficer?.avatar || "RS"}
                </div>
                <div>
                  <strong className="summary-name">{currentOfficer?.name || "Dr. Rajesh Sharma, IAS"}</strong>
                  <div className="summary-badge-id">Badge: <code>{currentOfficer?.badgeNumber || "IAS-TN-2012"}</code></div>
                  <span className="summary-dept-full">{currentOfficer?.department}</span>
                </div>
              </div>

              <div className="profile-menu-body">
                <button
                  type="button"
                  className="profile-menu-row"
                  onClick={() => {
                    onNavigate("profile");
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Icon name="user" size={15} />
                  <span>View Officer Profile</span>
                </button>

                <button
                  type="button"
                  className="profile-menu-row"
                  onClick={() => {
                    onNavigate("assigned");
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Icon name="assigned" size={15} />
                  <span>My Assigned Tasks</span>
                </button>

                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="profile-menu-row"
                >
                  <Icon name="external" size={15} />
                  <span>Open Citizen Portal</span>
                </a>
              </div>

              <div className="profile-menu-divider" />

              <div className="profile-menu-footer">
                <button
                  type="button"
                  className="officer-signout-btn"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <Icon name="logout" size={15} />
                  <span>Log Out of Operations</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
