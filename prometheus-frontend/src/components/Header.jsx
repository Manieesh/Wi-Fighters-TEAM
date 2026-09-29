import { useState, useRef, useEffect, useCallback } from "react";
import UiIcon from "./UiIcon";
import PrometheusLogo from "./PrometheusLogo";

const LANGUAGES = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "ta", label: "தமிழ்", nativeName: "Tamil" },
  { code: "hi", label: "हिन्दी", nativeName: "Hindi" }
];

export default function Header({
  activeTab,
  onNavigate,
  language = "en",
  onLanguageChange,
  t,
  userRole = "citizen",
  onToggleRole,
  citizenId = "CITIZEN-1001",
  citizenProfile = null,
  notifications = [],
  onLogout,
  onOpenA11y,
  onOpenAiAssistant,
  demoActive = true,
  onToggleDemo
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readNotifIndices, setReadNotifIndices] = useState(() => new Set());

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerBtnRef = useRef(null);

  // User display info
  const fullName = citizenProfile?.name || citizenProfile?.fullName || "Manieesh Kumar R";
  const firstName = fullName.split(" ")[0] || "Manieesh";
  const userDistrict = citizenProfile?.district ? `${citizenProfile.district}, ${citizenProfile.state || "TN"}` : "Coimbatore, Tamil Nadu";

  // Notifications calculation
  const totalNotifs = notifications.length;
  const unreadCount = Math.max(0, totalNotifs - readNotifIndices.size);

  const formatTimestamp = (index) => {
    if (index === 0) return "Just now";
    if (index === 1) return "2 hours ago";
    if (index === 2) return "1 day ago";
    return `${index + 1} days ago`;
  };

  const getNotifCategoryIcon = (text = "") => {
    const lower = text.toLowerCase();
    if (lower.includes("welfare") || lower.includes("jan kalyan")) return "welfare";
    if (lower.includes("document") || lower.includes("certificate")) return "document";
    if (lower.includes("request") || lower.includes("review")) return "request";
    if (lower.includes("voter") || lower.includes("rto")) return "identity";
    return "bell";
  };

  // Close all open menus
  const closeAllMenus = useCallback(() => {
    setProfileOpen(false);
    setNotifOpen(false);
    setLangOpen(false);
    setMobileMenuOpen(false);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Click outside and Escape key handler - single stable listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen((prev) => (prev ? false : prev));
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen((prev) => (prev ? false : prev));
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen((prev) => (prev ? false : prev));
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(event.target)
      ) {
        setMobileMenuOpen((prev) => (prev ? false : prev));
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileOpen((prev) => (prev ? false : prev));
        setNotifOpen((prev) => (prev ? false : prev));
        setLangOpen((prev) => (prev ? false : prev));
        setMobileMenuOpen((prev) => (prev ? false : prev));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Clean citizen navigation items
  const navItems = [
    { id: "overview", label: t("nav.home", "Home"), icon: "home" },
    { id: "services", label: t("nav.services", "Services"), icon: "document" },
    { id: "requests", label: t("nav.myRequests", "My Requests"), icon: "clipboard" },
    { id: "tracking", label: t("nav.tracking", "Tracking"), icon: "applications" },
    { id: "architecture", label: t("nav.howItWorks", "How It Works"), icon: "folder" }
  ];

  // If role is official, add Governance Console to navigation
  if (userRole === "official") {
    navItems.push({
      id: "governance",
      label: t("nav.governanceConsole") || "Governance Console",
      icon: "insights"
    });
  }

  const handleNav = (tabId) => {
    if (onNavigate) {
      onNavigate(tabId);
    }
    closeAllMenus();
  };

  const handleSelectLanguage = (code) => {
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    setLangOpen(false);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    const all = new Set(notifications.map((_, i) => i));
    setReadNotifIndices(all);
  };

  const handleLogoutClick = () => {
    closeAllMenus();
    if (onLogout) {
      onLogout();
    } else {
      handleNav("overview");
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="prometheus-navbar" role="banner">
      {/* Top subtle national governance accent stripe */}
      <div className="navbar-top-accent" aria-hidden="true" />

      <div className="nav-container">
        {/* ================= LEFT: PROMETHEUS BRAND ================= */}
        <div
          className="nav-brand"
          onClick={() => handleNav("overview")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNav("overview")}
          aria-label="Prometheus - Unified Digital Governance Platform, Home"
        >
          <div className="brand-logo-mark" aria-hidden="true">
            <PrometheusLogo size="md" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-title">PROMETHEUS</span>
              <span className="brand-gov-tag">GOV</span>
            </div>
            <span className="brand-subtitle">
              {t("appSubtitle") || "Unified Digital Governance Platform"}
            </span>
          </div>
        </div>

        {/* ================= CENTER: MAIN CITIZEN NAVIGATION ================= */}
        <nav className="nav-menu" aria-label="Citizen Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <UiIcon name={item.icon} size={16} className="nav-item-icon" />
                <span className="nav-item-label">{item.label}</span>
                {isActive && <span className="nav-active-indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        {/* ================= RIGHT: CONTROLS (A11Y, LANGUAGE, NOTIFICATIONS, PROFILE) ================= */}
        <div className="nav-right-controls">
          {/* Settings & System Preferences */}
          <button
            type="button"
            className={`nav-control-btn icon-circle-btn a11y-trigger-btn ${activeTab === "settings" ? "open" : ""}`}
            onClick={() => handleNav("settings")}
            title="Account & System Settings"
            aria-label="Open Settings"
          >
            <UiIcon name="settings" size={16} />
          </button>

          {/* 1. Language Selector Dropdown */}
          <div className="nav-dropdown-wrap" ref={langRef}>
            <button
              type="button"
              className={`nav-control-btn lang-trigger-btn ${langOpen ? "open" : ""}`}
              onClick={() => {
                setLangOpen((v) => !v);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              aria-label={`Language selector. Current language: ${currentLangObj.label}`}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <UiIcon name="globe" size={15} className="lang-globe-icon" />
              <span className="lang-current-label">{currentLangObj.label}</span>
              <UiIcon
                name={langOpen ? "chevronUp" : "chevronDown"}
                size={13}
                className="dropdown-chevron-icon"
              />
            </button>

            {langOpen && (
              <div
                className="nav-dropdown-panel lang-dropdown-panel"
                role="listbox"
                aria-label="Select Language"
              >
                <div className="dropdown-panel-title">
                  <UiIcon name="globe" size={13} />
                  <span>{t("nav.language") || "Language"}</span>
                </div>
                <div className="lang-options-list">
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        className={`lang-option-item ${isSelected ? "selected" : ""}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectLanguage(lang.code)}
                      >
                        <div className="lang-option-text">
                          <span className="lang-native-text">{lang.label}</span>
                          {lang.code !== "en" && (
                            <span className="lang-sub-text">({lang.nativeName})</span>
                          )}
                        </div>
                        {isSelected && (
                          <UiIcon name="check" size={15} className="lang-selected-check" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Notifications Dropdown */}
          <div className="nav-dropdown-wrap" ref={notifRef}>
            <button
              type="button"
              className={`nav-control-btn icon-circle-btn notif-trigger-btn ${notifOpen ? "open" : ""}`}
              onClick={() => {
                setNotifOpen((v) => !v);
                setLangOpen(false);
                setProfileOpen(false);
              }}
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={notifOpen}
              aria-haspopup="dialog"
            >
              <UiIcon name="bell" size={17} />
              {unreadCount > 0 && (
                <span className="nav-notif-badge" aria-label={`${unreadCount} unread`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="nav-dropdown-panel notif-dropdown-panel"
                role="dialog"
                aria-label="Official Notifications"
              >
                <div className="dropdown-panel-header">
                  <div className="dropdown-title-with-badge">
                    <span className="dropdown-heading">{t("nav.notifications") || "Notifications"}</span>
                    {unreadCount > 0 ? (
                      <span className="notif-count-pill">{unreadCount} unread</span>
                    ) : (
                      <span className="notif-count-pill subtle">All read</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="btn-mark-all-read"
                      onClick={handleMarkAllRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="notif-items-list" role="list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty-state">
                      <UiIcon name="badgeCheck" size={24} className="notif-empty-icon" />
                      <p>No new notifications at this time.</p>
                    </div>
                  ) : (
                    notifications.map((notifText, idx) => {
                      const isRead = readNotifIndices.has(idx);
                      const iconName = getNotifCategoryIcon(notifText);
                      return (
                        <div
                          key={idx}
                          role="listitem"
                          className={`notif-card-item ${isRead ? "read" : "unread"}`}
                          onClick={() => {
                            setReadNotifIndices((prev) => new Set([...prev, idx]));
                          }}
                        >
                          <div className={`notif-icon-bubble ${iconName}`}>
                            <UiIcon name={iconName} size={15} />
                          </div>
                          <div className="notif-content-block">
                            <p className="notif-message-text">{notifText}</p>
                            <span className="notif-timestamp">{formatTimestamp(idx)}</span>
                          </div>
                          {!isRead && (
                            <span
                              className="notif-unread-dot"
                              title="Unread notification"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="dropdown-panel-footer">
                  <button
                    type="button"
                    className="btn-view-all-link"
                    onClick={() => handleNav("tracking")}
                  >
                    <span>{t("hero.trackApplication") || "View All Applications & Updates"}</span>
                    <UiIcon name="arrowRight" size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Citizen Profile Menu */}
          <div className="nav-dropdown-wrap" ref={profileRef}>
            <button
              type="button"
              className={`nav-control-btn profile-trigger-btn ${profileOpen ? "open" : ""}`}
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
                setLangOpen(false);
              }}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label={`Citizen profile menu for ${fullName}`}
            >
              <div className="profile-avatar-circle" aria-hidden="true">
                <UiIcon name="user" size={15} />
              </div>
              <div className="profile-btn-info">
                <span className="profile-btn-name">{firstName}</span>
                <span className="profile-btn-role-tag">Citizen</span>
              </div>
              <UiIcon
                name={profileOpen ? "chevronUp" : "chevronDown"}
                size={13}
                className="dropdown-chevron-icon"
              />
            </button>

            {profileOpen && (
              <div
                className="nav-dropdown-panel profile-dropdown-panel"
                role="menu"
                aria-label="Profile and account options"
              >
                {/* 1. Profile Header Summary */}
                <div className="profile-card-header">
                  <div className="profile-header-avatar" aria-hidden="true">
                    <span>{firstName.charAt(0) || "M"}</span>
                  </div>
                  <div className="profile-header-details">
                    <strong className="profile-display-name">{fullName}</strong>
                    <div className="profile-id-code">
                      <span className="profile-id-label">Citizen ID:</span>
                      <code>{citizenId}</code>
                    </div>
                    <span className="profile-location-text">{userDistrict}</span>
                  </div>
                </div>

                {/* 2. Access Section */}
                <div className="profile-access-strip">
                  <span className="profile-access-label">Access Mode</span>
                  <span className="profile-access-badge">CITIZEN</span>
                </div>

                {/* 3. Dropdown Menu Links */}
                <div className="profile-menu-links">
                  <button
                    type="button"
                    className={`profile-menu-item ${activeTab === "profile" ? "active-item" : ""}`}
                    role="menuitem"
                    onClick={() => handleNav("profile")}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="user" size={17} />
                    </span>
                    <span className="profile-menu-text">{t("nav.profile") || "Profile"}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-menu-item ${activeTab === "requests" ? "active-item" : ""}`}
                    role="menuitem"
                    onClick={() => handleNav("requests")}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="clipboard" size={17} />
                    </span>
                    <span className="profile-menu-text">{t("nav.myRequests") || "My Requests"}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-menu-item ${activeTab === "tracking" ? "active-item" : ""}`}
                    role="menuitem"
                    onClick={() => handleNav("tracking")}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="applications" size={17} />
                    </span>
                    <span className="profile-menu-text">{t("nav.applications") || "My Applications"}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-menu-item ${activeTab === "documents" ? "active-item" : ""}`}
                    role="menuitem"
                    onClick={() => handleNav("documents")}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="document" size={17} />
                    </span>
                    <span className="profile-menu-text">{t("nav.documents") || "Digital Documents"}</span>
                  </button>

                  <button
                    type="button"
                    className={`profile-menu-item ${activeTab === "settings" ? "active-item" : ""}`}
                    role="menuitem"
                    onClick={() => handleNav("settings")}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="settings" size={17} />
                    </span>
                    <span className="profile-menu-text">Settings &amp; Preferences</span>
                  </button>
                </div>

                <div className="nav-dropdown-divider" />

                {/* 4. Logout Action */}
                <div className="profile-menu-footer">
                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    role="menuitem"
                    onClick={handleLogoutClick}
                  >
                    <span className="profile-menu-icon" aria-hidden="true">
                      <UiIcon name="logout" size={17} />
                    </span>
                    <span className="profile-menu-text">{t("nav.logout") || "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= MOBILE HAMBURGER BUTTON ================= */}
          <button
            ref={hamburgerBtnRef}
            type="button"
            className={`mobile-hamburger-btn ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <UiIcon name={mobileMenuOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE NAVIGATION DRAWER & BACKDROP ================= */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <aside
            id="mobile-nav-drawer"
            className="mobile-drawer-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Mobile Drawer User Card */}
            <div className="mobile-drawer-user-card">
              <div className="mobile-user-avatar">
                <span>{firstName.charAt(0)}</span>
              </div>
              <div className="mobile-user-info">
                <span className="mobile-user-name">{fullName}</span>
                <span className="mobile-user-id">{citizenId}</span>
                <div className="mobile-user-badge-row">
                  <span className={`role-badge ${userRole === "official" ? "official" : "citizen"}`}>
                    {userRole === "official" ? "GOV OFFICER" : "CITIZEN"}
                  </span>
                  <span className="mobile-district-tag">{citizenProfile?.district || "Coimbatore"}</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mobile-drawer-section-label">Main Navigation</div>
            <nav className="mobile-nav-links">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-nav-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="mobile-nav-icon-wrap">
                      <UiIcon name={item.icon} size={18} />
                    </div>
                    <span className="mobile-nav-title">{item.label}</span>
                    {isActive && (
                      <span className="mobile-active-chip">Active</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mobile-drawer-divider" />

            {/* Secondary Services & Applications */}
            <div className="mobile-drawer-section-label">Citizen Services &amp; Vault</div>
            <nav className="mobile-nav-links">
              <button
                type="button"
                className={`mobile-nav-link ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => handleNav("profile")}
              >
                <div className="mobile-nav-icon-wrap">
                  <UiIcon name="user" size={18} />
                </div>
                <span className="mobile-nav-title">{t("nav.profile") || "Citizen Profile"}</span>
              </button>

              <button
                type="button"
                className={`mobile-nav-link ${activeTab === "tracking" ? "active" : ""}`}
                onClick={() => handleNav("tracking")}
              >
                <div className="mobile-nav-icon-wrap">
                  <UiIcon name="clipboard" size={18} />
                </div>
                <span className="mobile-nav-title">{t("nav.applications") || "Application Tracking"}</span>
              </button>

              <button
                type="button"
                className={`mobile-nav-link ${activeTab === "documents" ? "active" : ""}`}
                onClick={() => handleNav("documents")}
              >
                <div className="mobile-nav-icon-wrap">
                  <UiIcon name="document" size={18} />
                </div>
                <span className="mobile-nav-title">{t("nav.documents") || "Digital Documents"}</span>
              </button>

              <button
                type="button"
                className={`mobile-nav-link ${activeTab === "portals" ? "active" : ""}`}
                onClick={() => handleNav("portals")}
              >
                <div className="mobile-nav-icon-wrap">
                  <UiIcon name="building" size={18} />
                </div>
                <span className="mobile-nav-title">{t("nav.portals") || "Connected Portals"}</span>
              </button>
            </nav>

            <div className="mobile-drawer-divider" />

            {/* Language Selector in Mobile Drawer */}
            <div className="mobile-drawer-lang-section">
              <div className="mobile-drawer-section-label">
                <UiIcon name="globe" size={14} />
                <span>{t("nav.language") || "Language"}</span>
              </div>
              <div className="mobile-lang-pills-row" role="group" aria-label="Select website language">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      className={`mobile-lang-pill ${isSelected ? "active" : ""}`}
                      onClick={() => handleSelectLanguage(lang.code)}
                      aria-pressed={isSelected}
                    >
                      <span className="mobile-lang-name">{lang.label}</span>
                      {isSelected && <UiIcon name="check" size={13} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mobile-drawer-divider" />

            {/* Logout in Mobile Drawer */}
            <div className="mobile-drawer-actions">

              <button
                type="button"
                className="mobile-action-btn logout-btn"
                onClick={handleLogoutClick}
              >
                <UiIcon name="logout" size={16} />
                <span>{t("nav.logout") || "Logout"}</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
