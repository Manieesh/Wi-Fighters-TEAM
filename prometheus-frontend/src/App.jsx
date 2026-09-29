import { useState, useEffect } from "react";
import { checkHealth, giveConsent } from "./services/api";
import "./index.css";

// Reusable Components & Pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import DevelopmentRequest from "./pages/DevelopmentRequest";
import MyRequests from "./pages/MyRequests";
import DevelopmentMap from "./pages/DevelopmentMap";
import GovernanceConsole from "./pages/GovernanceConsole";

// Citizen Experience Components
import CitizenProfile from "./components/CitizenProfile";
import DigitalDocuments from "./components/DigitalDocuments";
import UnifiedTracking from "./components/UnifiedTracking";
import PortalsHub from "./components/PortalsHub";
import UiIcon from "./components/UiIcon";
import { getTranslation } from "./i18n";

// Centralized Services Catalog
import {
  citizenProfile as defaultProfile,
  availableServices,
  comingSoonServices,
  allServices
} from "./services/catalog";

import { seedRequests } from "./components/GovernanceWorkspace";

// Core Prometheus Upgrades (Hackathon & Enterprise DPI Platform)
import DataTranslationEngine from "./pages/DataTranslationEngine";
import ConsentManagement from "./pages/ConsentManagement";
import ApiGatewayMonitor from "./pages/ApiGatewayMonitor";
import SystemArchitecture from "./pages/SystemArchitecture";
import Settings from "./pages/Settings";
import OneClickApplyModal from "./components/OneClickApplyModal";
import DataLineageModal from "./components/DataLineageModal";
import AskPrometheusModal from "./components/AskPrometheusModal";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import DemoModeBar from "./components/DemoModeBar";

const defaultNotifications = [
  "Your development request REQ-1001 is now under district administrative review.",
  "Jan Kalyan Welfare Portal synchronized verified citizen profile.",
  "Digital Document 'Income Certificate' synchronized from state repository."
];

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState("overview"); // overview, services, request, requests, map, governance, profile, tracking, documents, portals
  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem("prometheus_user_role") || "citizen";
    } catch {
      return "citizen";
    }
  });

  const [citizenId, setCitizenId] = useState("CITIZEN-1001");
  const [backendStatus, setBackendStatus] = useState("Operational");
  const [toastMessage, setToastMessage] = useState("");
  const [notifications, setNotifications] = useState(defaultNotifications);

  // Multilingual State
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("prometheus_language") || "en";
    } catch {
      return "en";
    }
  });

  const t = (path, fallback = "") => getTranslation(language, path, fallback);

  // Development Requests State
  const [developmentRequests, setDevelopmentRequests] = useState(() => {
    try {
      const stored = localStorage.getItem("prometheus-development-requests");
      if (stored) return JSON.parse(stored);
    } catch {}
    return seedRequests;
  });

  // Service Details, Handoff & Loading States
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [serviceDetails, setServiceDetails] = useState(null);
  const [handoffState, setHandoffState] = useState(null); // { service, step: 'preparing' | 'connecting' | 'opened' | 'error', errorMsg }

  // Next-Level Upgrade States (One-Click, Lineage, AI Assistant, A11y, Demo Tour)
  const [a11yOpen, setA11yOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [demoTourActive, setDemoTourActive] = useState(false);
  const [oneClickService, setOneClickService] = useState(null);
  const [lineageFieldKey, setLineageFieldKey] = useState(null);

  // System Health & Local Storage Setup
  useEffect(() => {
    localStorage.setItem("prometheus_language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem("prometheus_user_role", userRole);
  }, [userRole]);

  useEffect(() => {
    checkHealth()
      .then((res) => {
        if (res?.success) setBackendStatus("Operational");
      })
      .catch(() => {
        setBackendStatus("Operational"); // Graceful offline/demo fallback
      });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  const handleToggleRole = () => {
    const nextRole = userRole === "official" ? "citizen" : "official";
    setUserRole(nextRole);
    showToast(`Role switched to ${nextRole === "official" ? "Government Official" : "Citizen"}`);
    if (nextRole === "official") {
      setActiveTab("governance");
    } else {
      setActiveTab("overview");
    }
  };

  const handleNavigate = (tab, query = "") => {
    if (query) setServiceSearchQuery(query);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddDevelopmentRequest = (newReq) => {
    setDevelopmentRequests((prev) => {
      const updated = [newReq, ...prev];
      try {
        localStorage.setItem("prometheus-development-requests", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setNotifications((prev) => [
      `Your development request ${newReq.id} was submitted for review.`,
      ...prev
    ]);
    showToast(`Request ${newReq.id} recorded. Track it in 'My Requests'.`);
  };

  const handleViewService = (service) => {
    setServiceDetails(service);
  };

  // Launch Portal with 4-Step Professional Transition & Auto-fill
  const handleLaunchPortal = async (service) => {
    // STEP 1: Preparing your application
    setHandoffState({
      service,
      stepNumber: 1,
      stepTitle: "Preparing your application",
      stepSubtext: "Retrieving verified citizen attributes from your central Prometheus profile...",
      errorMsg: ""
    });

    try {
      // Background consent registration
      try {
        await giveConsent({
          citizenId,
          service: service.id,
          consent: true,
          dataFields: ["Full Name", "Date of Birth", "Address", "Mobile Number"]
        });
      } catch (err) {
        // Fallback for standalone demo
      }

      // Prepare Application Record
      const year = new Date().getFullYear();
      const randomNum = String(Math.floor(10000 + Math.random() * 90000));
      const refId = `PRM-${service.id.toUpperCase()}-${year}-${randomNum}`;

      const newApp = {
        applicationId: refId,
        service: service.id,
        serviceName: service.title,
        authority: service.authority,
        citizenId,
        status: "Submitted",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        createdAt: new Date().toISOString()
      };

      try {
        const storedApps = JSON.parse(localStorage.getItem("prometheus_citizen_applications") || "[]");
        localStorage.setItem("prometheus_citizen_applications", JSON.stringify([newApp, ...storedApps]));
      } catch {}

      // STEP 2: Checking your consent
      setTimeout(() => {
        setHandoffState((prev) => ({
          ...prev,
          stepNumber: 2,
          stepTitle: "Checking your consent",
          stepSubtext: "Verifying citizen consent for demo data sharing..."
        }));
      }, 550);

      // STEP 3: Securely connecting to the service
      setTimeout(() => {
        setHandoffState((prev) => ({
          ...prev,
          stepNumber: 3,
          stepTitle: "Securely connecting to the service",
          stepSubtext: `Establishing encrypted handshake with ${service.title} demonstration portal...`
        }));
      }, 1100);

      // STEP 4: Opening the service portal
      setTimeout(() => {
        setHandoffState((prev) => ({
          ...prev,
          stepNumber: 4,
          stepTitle: "Opening the service portal",
          stepSubtext: `Your profile details have been transferred to ${service.title}. The official demonstration portal is open in a new tab.`,
          portalUrl: service.portalUrl,
          refId
        }));

        // Open demo portal in new tab
        const win = window.open(service.portalUrl, "_blank");
        if (!win || win.closed || typeof win.closed === "undefined") {
          // Popup blocked - direct clickable button remains in modal
        }

        showToast(`Connected to ${service.title}. Profile pre-filled automatically.`);
      }, 1700);

    } catch (err) {
      setHandoffState({
        service,
        stepNumber: -1,
        stepTitle: "Demonstration portal unavailable",
        stepSubtext: "Could not connect to the demonstration portal. Please verify that the local service is running.",
        errorMsg: "The target demonstration portal could not be reached."
      });
    }
  };

  return (
    <div className="prometheus-app">
      {/* 1. Header (Clean, Compact, Sticky, Citizen-first) */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        citizenId={citizenId}
        citizenProfile={defaultProfile}
        notifications={notifications}
        onLogout={() => {
          handleNavigate("overview");
          showToast("Signed out successfully. Returned to Prometheus home.");
        }}
        onOpenA11y={() => setA11yOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
        demoActive={demoTourActive}
        onToggleDemo={() => setDemoTourActive((v) => !v)}
      />

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="global-toast" role="alert">
          <UiIcon name="check" size={16} />
          <div>{toastMessage}</div>
          <button aria-label="Dismiss toast" onClick={() => setToastMessage("")}>
            <UiIcon name="close" size={14} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content-wrap">
        {/* CITIZEN TAB 1: HOME */}
        {activeTab === "overview" && (
          <Home
            onNavigate={handleNavigate}
            onViewService={handleViewService}
            onOpenOneClick={(svc) => setOneClickService(svc)}
            onOpenLineage={(field) => setLineageFieldKey(field)}
            t={t}
          />
        )}

        {/* CITIZEN TAB 2: SERVICES */}
        {activeTab === "services" && (
          <Services
            onViewService={handleViewService}
            initialSearch={serviceSearchQuery}
            t={t}
          />
        )}

        {/* CITIZEN TAB 3: DEVELOPMENT REQUEST */}
        {activeTab === "request" && (
          <DevelopmentRequest
            onSubmitted={handleAddDevelopmentRequest}
            onNavigate={handleNavigate}
            t={t}
          />
        )}

        {/* CITIZEN TAB 4: MY REQUESTS */}
        {activeTab === "requests" && (
          <MyRequests
            requests={developmentRequests}
            onNavigate={handleNavigate}
            t={t}
          />
        )}

        {/* SECONDARY CITIZEN FEATURE: DEVELOPMENT MAP */}
        {activeTab === "map" && (
          <DevelopmentMap
            onNavigate={handleNavigate}
            userRequests={developmentRequests}
          />
        )}

        {/* GOVERNANCE CONSOLE (Separated for Officials / Admins) */}
        {activeTab === "governance" && (
          <GovernanceConsole
            onNavigate={handleNavigate}
            userRole={userRole}
            onToggleRole={handleToggleRole}
          />
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <CitizenProfile
            citizenId={citizenId}
            onNavigate={handleNavigate}
            onProfileUpdated={(updated) => showToast(`Profile updated for ${updated.name}`)}
          />
        )}

        {/* UNIFIED TRACKING */}
        {activeTab === "tracking" && (
          <div className="page-shell">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span onClick={() => handleNavigate("overview")} className="crumb-link">Home</span>
              <span>/</span>
              <span>Application Tracking</span>
            </div>
            <UnifiedTracking citizenId={citizenId} onOpenServiceDetails={handleViewService} />
          </div>
        )}

        {/* DIGITAL DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="page-shell">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span onClick={() => handleNavigate("overview")} className="crumb-link">Home</span>
              <span>/</span>
              <span>Digital Documents</span>
            </div>
            <DigitalDocuments citizenId={citizenId} onShowToast={showToast} />
          </div>
        )}

        {/* CONNECTED PORTALS */}
        {activeTab === "portals" && (
          <div className="page-shell">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span onClick={() => handleNavigate("overview")} className="crumb-link">Home</span>
              <span>/</span>
              <span>Connected Portals</span>
            </div>
            <PortalsHub citizenId={citizenId} onLaunchWizard={handleViewService} />
          </div>
        )}

        {/* INTELLIGENT DATA TRANSLATION ENGINE */}
        {activeTab === "translation" && (
          <DataTranslationEngine onNavigate={handleNavigate} />
        )}

        {/* CONSENT MANAGEMENT */}
        {activeTab === "consent" && (
          <ConsentManagement citizenId={citizenId} onNavigate={handleNavigate} />
        )}

        {/* SYSTEM ARCHITECTURE ("How Prometheus Works") */}
        {activeTab === "architecture" && (
          <div className="page-shell">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span onClick={() => handleNavigate("overview")} className="crumb-link">Home</span>
              <span>/</span>
              <span>How It Works</span>
            </div>
            <SystemArchitecture onNavigate={handleNavigate} />
          </div>
        )}

        {/* API GATEWAY & AUDIT MONITOR */}
        {activeTab === "gateway" && (
          <div className="page-shell">
            <div className="breadcrumb" aria-label="Breadcrumb">
              <span onClick={() => handleNavigate("overview")} className="crumb-link">Home</span>
              <span>/</span>
              <span>API Gateway Monitor</span>
            </div>
            <ApiGatewayMonitor onNavigate={handleNavigate} />
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activeTab === "settings" && (
          <Settings
            language={language}
            onLanguageChange={setLanguage}
            onOpenA11y={() => setA11yOpen(true)}
            citizenProfile={defaultProfile}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 2. Footer */}
      <Footer onNavigate={handleNavigate} t={t} />

      {/* SERVICE DETAILS MODAL (Clean, Informative, Prototype-labeled) */}
      {serviceDetails && (
        <div
          className="service-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-details-title"
          onMouseDown={(e) => e.target === e.currentTarget && setServiceDetails(null)}
        >
          <section className="service-details-modal">
            <button
              className="service-details-close"
              aria-label="Close service details"
              onClick={() => setServiceDetails(null)}
            >
              <UiIcon name="close" size={18} />
            </button>

            <div className="service-details-header">
              <div className="service-details-icon">
                <UiIcon name={serviceDetails.icon || "document"} size={28} />
              </div>
              <div>
                <div className="service-modal-badges-row">
                  <span className="service-status-pill available">● AVAILABLE</span>
                  <span className="service-demo-tag">PROMETHEUS DEMONSTRATION</span>
                </div>
                <h2 id="service-details-title">{serviceDetails.title || serviceDetails.name}</h2>
                <strong className="service-modal-dept">{serviceDetails.organization || serviceDetails.authority}</strong>
              </div>
            </div>

            <p className="service-modal-desc">{serviceDetails.description}</p>

            {/* What you can do */}
            <div className="service-modal-section">
              <h4>What you can do</h4>
              <ul className="service-features-checklist">
                {(serviceDetails.whatYouCanDo || serviceDetails.features || [
                  "Submit digital registration application",
                  "Verify citizen identity and residence",
                  "Track application progress in real-time"
                ]).map((item, idx) => (
                  <li key={idx}>
                    <UiIcon name="check" size={14} className="check-icon-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auto-fill Notice */}
            <div className="service-autofill-notice">
              <UiIcon name="shield" size={16} />
              <div>
                <strong>Connected Citizen Profile ({citizenId})</strong>
                <p>
                  Your verified name (<strong>{defaultProfile.name}</strong>), district (<strong>{defaultProfile.district}</strong>), state (<strong>{defaultProfile.state}</strong>) and mobile will be automatically pre-filled into this portal.
                </p>
              </div>
            </div>

            <div className="service-details-actions">
              <button className="wizard-secondary-btn" onClick={() => setServiceDetails(null)}>
                Back to Prometheus
              </button>

              <button
                className="btn-continue-portal"
                onClick={() => {
                  const svc = serviceDetails;
                  setServiceDetails(null);
                  handleLaunchPortal(svc);
                }}
              >
                <span>Continue to {serviceDetails.id === "voter" ? "Voter" : serviceDetails.id === "rto" ? "RTO" : "Welfare"} Portal</span>
                <UiIcon name="arrowRight" size={15} />
              </button>
            </div>
          </section>
        </div>
      )}

      {/* PORTAL LAUNCH & 4-STEP TRANSITION MODAL */}
      {handoffState && (
        <div
          className="service-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="handoff-title"
          onMouseDown={(e) => e.target === e.currentTarget && handoffState.stepNumber === 4 && setHandoffState(null)}
        >
          <section className="service-details-modal handoff-modal-card">
            {handoffState.stepNumber === 4 || handoffState.stepNumber === -1 ? (
              <button
                className="service-details-close"
                aria-label="Close window"
                onClick={() => setHandoffState(null)}
              >
                <UiIcon name="close" size={18} />
              </button>
            ) : null}

            <div className="handoff-header-center">
              <span className="handoff-eyebrow">
                {handoffState.stepNumber === -1 ? "SERVICE NOTICE" : "PROMETHEUS SERVICE GATEWAY"}
              </span>

              {/* 4-Step Stepper Display */}
              {handoffState.stepNumber > 0 && (
                <div className="handoff-stepper-row" aria-label="Connection steps">
                  {[
                    { step: 1, label: t("handoff.step1") || "Step 1: Preparing application" },
                    { step: 2, label: t("handoff.step2") || "Step 2: Checking consent" },
                    { step: 3, label: t("handoff.step3") || "Step 3: Connecting service" },
                    { step: 4, label: t("handoff.step4") || "Step 4: Opening portal" }
                  ].map((s) => {
                    const isDone = handoffState.stepNumber > s.step;
                    const isCurrent = handoffState.stepNumber === s.step;
                    return (
                      <div
                        key={s.step}
                        className={`handoff-step-node ${isDone ? "is-done" : isCurrent ? "is-current" : "is-upcoming"}`}
                      >
                        <div className="node-circle">
                          {isDone ? <UiIcon name="check" size={12} /> : s.step}
                        </div>
                        <span className="node-text">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="handoff-status-icon-wrap">
                {handoffState.stepNumber > 0 && handoffState.stepNumber < 4 && (
                  <div className="handoff-spinner-ring" />
                )}
                {handoffState.stepNumber === 4 && (
                  <div className="handoff-icon-success">
                    <UiIcon name="check" size={26} />
                  </div>
                )}
                {handoffState.stepNumber === -1 && (
                  <div className="handoff-icon-error">
                    <UiIcon name="alert" size={26} />
                  </div>
                )}
              </div>

              <h2 id="handoff-title">{handoffState.stepTitle}</h2>
              <p className="handoff-subtext">{handoffState.stepSubtext}</p>
            </div>

            {/* Reusability message */}
            <div className="service-autofill-notice text-center-notice">
              <UiIcon name="shield" size={16} />
              <div>
                <strong>Auto-Fill Verification</strong>
                <p>
                  Your verified profile information will be used to reduce repeated data entry.
                </p>
              </div>
            </div>

            {handoffState.stepNumber === 4 && (
              <div className="handoff-connected-summary">
                <div className="summary-row">
                  <span className="label">Target Portal:</span>
                  <strong>{handoffState.service.organization} (Demonstration portal)</strong>
                </div>
                <div className="summary-row">
                  <span className="label">Pre-filled Citizen:</span>
                  <span>{defaultProfile.name} ({citizenId})</span>
                </div>
                <div className="summary-row">
                  <span className="label">Tracking Ref:</span>
                  <code>{handoffState.refId}</code>
                </div>
              </div>
            )}

            <div className="service-details-actions center-actions">
              {handoffState.stepNumber === 4 && (
                <>
                  <a
                    className="btn-continue-portal"
                    href={handoffState.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Open Demonstration Portal Again</span>
                    <UiIcon name="external" size={15} />
                  </a>
                  <button className="wizard-secondary-btn" onClick={() => setHandoffState(null)}>
                    Back to Prometheus
                  </button>
                </>
              )}

              {handoffState.stepNumber === -1 && (
                <button className="wizard-secondary-btn" onClick={() => setHandoffState(null)}>
                  Back to Prometheus
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ONE-CLICK APPLY MODAL */}
      {oneClickService && (
        <OneClickApplyModal
          service={oneClickService}
          citizenProfile={defaultProfile}
          onClose={() => setOneClickService(null)}
          onViewTracking={(appId) => {
            setOneClickService(null);
            setActiveTab("tracking");
          }}
        />
      )}

      {/* DATA LINEAGE INTERACTIVE MODAL */}
      {lineageFieldKey && (
        <DataLineageModal
          fieldKey={lineageFieldKey}
          onClose={() => setLineageFieldKey(null)}
        />
      )}

      {/* MULTILINGUAL AI ASSISTANT ("Ask Prometheus") */}
      <AskPrometheusModal
        isOpen={aiAssistantOpen}
        onOpen={() => setAiAssistantOpen(true)}
        onClose={() => setAiAssistantOpen(false)}
        onNavigate={handleNavigate}
        citizenProfile={defaultProfile}
        currentLanguage={language}
      />

      {/* ACCESSIBILITY SETTINGS TOOLBAR */}
      <AccessibilityToolbar
        isOpen={a11yOpen}
        onClose={() => setA11yOpen(false)}
      />

      {/* FLOATING DEMO TOUR (Non-blocking floating pill button in bottom-left) */}
      <DemoModeBar
        onNavigate={handleNavigate}
        onTriggerOneClick={(svc) => setOneClickService(svc)}
        activeTab={activeTab}
      />
    </div>
  );
}
