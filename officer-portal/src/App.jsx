import { useState, useEffect } from "react";
import OfficerSidebar from "./components/OfficerSidebar";
import OfficerHeader from "./components/OfficerHeader";
import OfficerLoginModal from "./components/OfficerLoginModal";
import RequestDetailsModal from "./components/RequestDetailsModal";

// Pages
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Assignments from "./pages/Assignments";
import Map from "./pages/Map";
import Analytics from "./pages/Analytics";
import Departments from "./pages/Departments";
import OfficerProfile from "./pages/OfficerProfile";
import Applications from "./pages/Applications";
import GatewayMonitor from "./pages/GatewayMonitor";
import AuditTrail from "./pages/AuditTrail";
import TranslationAnalytics from "./pages/TranslationAnalytics";

// Services
import {
  loginOfficer,
  getOfficerStats,
  getOfficerRequests,
  getDepartments,
  updateRequestStatus,
  assignRequest,
  addOfficerRemark
} from "./services/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("prometheus_officer_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const [currentOfficer, setCurrentOfficer] = useState(() => {
    try {
      const stored = localStorage.getItem("prometheus_officer_data");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: "OFF-101",
      name: "Dr. Rajesh Sharma, IAS",
      designation: "District Collector & Commissioner of Operations",
      department: "District Administration & Governance Command",
      jurisdiction: "Coimbatore & Western Districts",
      email: "rajesh.sharma@gov-ops.in",
      role: "government_officer",
      badgeNumber: "IAS-TN-2012-4821",
      avatar: "RS"
    };
  });

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, requests, assigned, map, analytics, departments, profile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState(null);
  const [requestsList, setRequestsList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Initial Data Load
  useEffect(() => {
    loadData();
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, reqsRes, deptsRes] = await Promise.allSettled([
        getOfficerStats(),
        getOfficerRequests(),
        getDepartments()
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
      if (reqsRes.status === "fulfilled" && reqsRes.value?.requests) {
        setRequestsList(reqsRes.value.requests);
      }
      if (deptsRes.status === "fulfilled" && deptsRes.value?.departments) {
        setDepartmentsList(deptsRes.value.departments);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (officer) => {
    setCurrentOfficer(officer);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("prometheus_officer_logged_in", "true");
      localStorage.setItem("prometheus_officer_data", JSON.stringify(officer));
    } catch {}
    showToast(`Welcome, ${officer.name}. Operations session active.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("prometheus_officer_logged_in");
      localStorage.removeItem("prometheus_officer_data");
    } catch {}
    showToast("Signed out from Government Operations Console.");
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
  };

  const handleUpdateStatus = async (requestId, payload) => {
    const res = await updateRequestStatus(requestId, payload);
    if (res?.request) {
      setRequestsList((prev) =>
        prev.map((r) => (r.requestId === requestId ? { ...r, ...res.request } : r))
      );
      setSelectedRequest((prev) => (prev && prev.requestId === requestId ? { ...prev, ...res.request } : prev));
      showToast(`Status updated to ${payload.status}`);
      loadData();
    }
  };

  const handleAssign = async (requestId, payload) => {
    const res = await assignRequest(requestId, payload);
    if (res?.request) {
      setRequestsList((prev) =>
        prev.map((r) => (r.requestId === requestId ? { ...r, ...res.request } : r))
      );
      setSelectedRequest((prev) => (prev && prev.requestId === requestId ? { ...prev, ...res.request } : prev));
      showToast(`Assigned to ${payload.department}`);
      loadData();
    }
  };

  const handleAddRemark = async (requestId, payload) => {
    const res = await addOfficerRemark(requestId, payload);
    if (res?.request) {
      setRequestsList((prev) =>
        prev.map((r) => (r.requestId === requestId ? { ...r, ...res.request } : r))
      );
      setSelectedRequest((prev) => (prev && prev.requestId === requestId ? { ...prev, ...res.request } : prev));
      showToast("Remark recorded on case file");
    }
  };

  const handleGlobalSearch = (query) => {
    setGlobalSearchQuery(query);
    setActiveTab("requests");
  };

  return (
    <div className="officer-app-root">
      {/* Login Screen if not authenticated */}
      {!isLoggedIn ? (
        <OfficerLoginModal onLogin={handleLogin} />
      ) : (
        <div className="officer-app-layout">
          {/* Sidebar */}
          <OfficerSidebar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            currentOfficer={currentOfficer}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            onLogout={handleLogout}
          />

          {/* Main Area */}
          <div className="officer-main-viewport">
            <OfficerHeader
              activeTab={activeTab}
              onNavigate={handleNavigate}
              currentOfficer={currentOfficer}
              onToggleMobile={() => setMobileMenuOpen((v) => !v)}
              onLogout={handleLogout}
              onSearchGlobal={handleGlobalSearch}
              unreadCount={3}
            />

            {toastMessage && (
              <div className="officer-global-toast" role="alert">
                <span>{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage("")}
                  className="toast-close"
                  aria-label="Dismiss toast"
                >
                  ✕
                </button>
              </div>
            )}

            <main className="officer-content-body">
              {activeTab === "dashboard" && (
                <Dashboard
                  stats={stats}
                  requests={requestsList}
                  onNavigate={handleNavigate}
                  onSelectRequest={handleSelectRequest}
                  currentOfficer={currentOfficer}
                />
              )}

              {activeTab === "applications" && (
                <Applications />
              )}

              {activeTab === "gateway" && (
                <GatewayMonitor />
              )}

              {activeTab === "translation" && (
                <TranslationAnalytics />
              )}

              {activeTab === "audit" && (
                <AuditTrail />
              )}

              {activeTab === "requests" && (
                <Requests
                  requests={requestsList}
                  onSelectRequest={handleSelectRequest}
                  initialSearch={globalSearchQuery}
                />
              )}

              {activeTab === "assigned" && (
                <Assignments
                  requests={requestsList}
                  onSelectRequest={handleSelectRequest}
                  currentOfficer={currentOfficer}
                />
              )}

              {activeTab === "map" && (
                <Map
                  requests={requestsList}
                  onSelectRequest={handleSelectRequest}
                />
              )}

              {activeTab === "analytics" && (
                <Analytics stats={stats} />
              )}

              {activeTab === "departments" && (
                <Departments departments={departmentsList} />
              )}

              {activeTab === "profile" && (
                <OfficerProfile
                  currentOfficer={currentOfficer}
                  onLogout={handleLogout}
                />
              )}
            </main>
          </div>

          {/* Request Details Modal */}
          {selectedRequest && (
            <RequestDetailsModal
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              onUpdateStatus={handleUpdateStatus}
              onAssign={handleAssign}
              onAddRemark={handleAddRemark}
              currentOfficer={currentOfficer}
            />
          )}
        </div>
      )}
    </div>
  );
}
