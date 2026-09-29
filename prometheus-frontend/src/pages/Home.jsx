import { useState } from "react";
import UiIcon from "../components/UiIcon";
import ServiceCard from "../components/ServiceCard";
import { availableServices, comingSoonServices } from "../services/catalog";

export default function Home({ onNavigate, onViewService, onOpenOneClick, t }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate("services", searchInput);
  };

  // Recent applications preview for citizen overview
  const recentApplications = [
    {
      id: "PROM-2026-00124",
      service: "RTO Transport Service",
      type: "Learner's License (LLR)",
      status: "Processing",
      date: "27 Sep 2026"
    },
    {
      id: "PROM-2026-00125",
      service: "Voter Service Portal",
      type: "Form 6 Electoral Registration",
      status: "Completed",
      date: "26 Sep 2026"
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. System Status Bar */}
      <div className="system-status-ribbon" role="status" aria-label="System Status">
        <div className="status-indicator-dot" />
        <span className="status-ribbon-text">
          {t?.("systemStatus.operational") || "All connected services are operational"}
        </span>
        <span className="status-separator">•</span>
        <span className="status-trust-tag">
          Prometheus Digital Public Infrastructure Prototype
        </span>
      </div>

      {/* 2. Hero Section */}
      <section className="citizen-hero-section" aria-labelledby="hero-title">
        <div className="citizen-hero-inner">
          <div className="hero-trust-badge">
            <UiIcon name="shield" size={14} />
            <span>Unified Digital Governance Gateway</span>
          </div>

          <h1 id="hero-title" className="hero-main-title">
            {t?.("hero.title") || "Unified Digital Governance Platform"}
          </h1>

          <p className="hero-body-tagline">
            {t?.("hero.subtitle") ||
              "A human-centered, responsive, and secure digital platform connecting citizens directly with state infrastructure and public welfare services."}
          </p>

          {/* Search Bar */}
          <form className="hero-search-wrapper" onSubmit={handleSearchSubmit} role="search">
            <UiIcon name="search" size={18} className="search-icon" />
            <input
              type="text"
              className="hero-search-input"
              placeholder={t?.("searchPlaceholder") || "Search services, schemes or applications..."}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search government services or schemes"
            />
            <button type="submit" className="hero-search-submit-btn">
              Search
            </button>
          </form>

          {/* Primary CTA Buttons */}
          <div className="hero-actions-group">
            <button
              className="gov-btn primary hero-action-btn"
              onClick={() => onNavigate("services")}
            >
              <UiIcon name="document" size={16} />
              <span>{t?.("hero.exploreServices") || "Explore Services"}</span>
            </button>

            <button
              className="gov-btn secondary hero-action-btn"
              onClick={() => onNavigate("request")}
            >
              <UiIcon name="request" size={16} />
              <span>{t?.("hero.raiseRequest") || "Raise a Development Request"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Quick Services (Voter, RTO, Welfare) */}
      <section className="integrated-services-section" aria-labelledby="quick-services-title">
        <div className="section-header-compact">
          <div className="header-split-row">
            <div>
              <span className="section-eyebrow">
                CONNECTED SERVICES
              </span>
              <h2 id="quick-services-title">Quick Services</h2>
              <p className="section-sublead">
                Integrated services with single-click profile pre-fill to eliminate duplicate data entry.
              </p>
            </div>
            <span className="connected-count-badge">
              <span className="dot-available-pulse" />
              <span>3 Services Available Now</span>
            </span>
          </div>
        </div>

        <div className="integrated-services-grid">
          {availableServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onView={onViewService}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* 4. My Applications (Recent summary) */}
      <section className="recent-applications-section" aria-labelledby="recent-apps-title">
        <div className="section-header-compact">
          <div className="header-split-row">
            <div>
              <span className="section-eyebrow">APPLICATION TRACKING</span>
              <h2 id="recent-apps-title">My Recent Applications</h2>
              <p className="section-sublead">
                Monitor status updates and departmental review timelines.
              </p>
            </div>
            <button
              type="button"
              className="gov-btn outline"
              onClick={() => onNavigate("tracking")}
            >
              <span>Track All Applications</span>
              <UiIcon name="arrowRight" size={14} />
            </button>
          </div>
        </div>

        <div className="recent-apps-cards-grid">
          {recentApplications.map((app) => (
            <div key={app.id} className="recent-app-card" onClick={() => onNavigate("tracking")}>
              <div className="recent-app-header">
                <code className="app-ref-code">{app.id}</code>
                <span className={`status-pill ${app.status.toLowerCase()}`}>
                  ● {app.status}
                </span>
              </div>
              <strong className="recent-app-title">{app.service}</strong>
              <span className="recent-app-sub">{app.type}</span>
              <div className="recent-app-footer">
                <span className="recent-app-date">Submitted: {app.date}</span>
                <span className="recent-app-link">View Timeline &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How PROMETHEUS Helps */}
      <section className="citizen-journey-section" aria-labelledby="how-it-works-title">
        <div className="section-header-compact center-header">
          <span className="section-eyebrow">HOW PROMETHEUS HELPS</span>
          <h2 id="how-it-works-title">
            Simple, Transparent Public Service Delivery
          </h2>
          <p className="journey-sublead">
            Eliminating paperwork and duplicate forms through secure citizen data translation.
          </p>
        </div>

        <div className="journey-steps-grid">
          <div className="journey-step-card">
            <div className="step-num-circle">1</div>
            <h4>1. Select Service</h4>
            <p>
              Choose from connected public services such as Voter ID, Driver Licensing, or Welfare schemes.
            </p>
          </div>

          <div className="journey-step-card">
            <div className="step-num-circle">2</div>
            <h4>2. Verified Auto-Fill</h4>
            <p>
              Your verified citizen profile automatically pre-populates required fields. No retyping names or addresses.
            </p>
          </div>

          <div className="journey-step-card">
            <div className="step-num-circle">3</div>
            <h4>3. Explicit Consent</h4>
            <p>
              Review the exact fields being shared. Prometheus never transfers personal information without your authorization.
            </p>
          </div>

          <div className="journey-step-card">
            <div className="step-num-circle">4</div>
            <h4>4. Universal Tracking</h4>
            <p>
              Receive a unified application reference ID to track progress from submission to departmental completion.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Security & Consent Notice */}
      <section className="citizen-security-notice" aria-labelledby="security-notice-title">
        <div className="security-notice-card">
          <div className="notice-icon-circle">
            <UiIcon name="shield" size={24} />
          </div>
          <div className="notice-text-content">
            <h3 id="security-notice-title">Consent-Governed Data Sharing</h3>
            <p>
              Prometheus adheres to strict data minimization. We only share information required for your specific application after you grant consent. You can inspect data sources and active authorizations at any time.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Coming Soon Services (Clearly Labeled, Non-Clickable) */}
      <section className="coming-soon-section" aria-labelledby="coming-soon-title">
        <div className="section-header-compact">
          <span className="section-eyebrow">PLANNED INTEGRATIONS</span>
          <h2 id="coming-soon-title">
            More Services Coming Soon
          </h2>
          <p className="section-sublead">
            These services are planned for future integration phases and are currently not active.
          </p>
        </div>

        <div className="coming-soon-grid">
          {comingSoonServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onView={() => {}}
              t={t}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
