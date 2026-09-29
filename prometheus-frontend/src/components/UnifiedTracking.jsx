import React, { useState, useEffect } from "react";
import { getCitizenApplications } from "../services/api";
import UiIcon from "./UiIcon";

export default function UnifiedTracking({ citizenId = "CITIZEN-1001", onOpenServiceDetails }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Default seed applications for realistic demonstration
  const defaultDemoApplications = [
    {
      applicationId: "RTO-2026-28690",
      service: "rto",
      serviceName: "Learner's Driving Licence (LMV)",
      authority: "Ministry of Road Transport & Highways (Parivahan)",
      status: "IN REVIEW",
      stageIndex: 4, // 0 to 5
      date: "25 Sep 2026",
      createdAt: "2026-09-25T10:30:00.000Z",
      citizenId: "CITIZEN-1001",
      submittedData: {
        applicantName: "Manieesh Kumar R",
        dateOfBirth: "2004-01-15",
        vehicleClass: "Light Motor Vehicle (LMV)",
        residentialAddress: "42, Anna Salai, Gandhipuram, Coimbatore - 641001",
        stateRto: "TN-38 Coimbatore North"
      }
    },
    {
      applicationId: "ECI-2026-90412",
      service: "voter",
      serviceName: "National Electoral Roll Registration (Form 6)",
      authority: "Election Commission of India",
      status: "COMPLETED",
      stageIndex: 5, // All completed
      date: "20 Sep 2026",
      createdAt: "2026-09-20T14:15:00.000Z",
      citizenId: "CITIZEN-1001",
      submittedData: {
        voterName: "Manieesh Kumar R",
        dateOfBirth: "2004-01-15",
        assemblyConstituency: "118 - Coimbatore North",
        epicNumber: "TN-CBE-908129"
      }
    },
    {
      applicationId: "PMAY-2026-55104",
      service: "welfare",
      serviceName: "Pradhan Mantri Awas Yojana (PMAY-G)",
      authority: "Ministry of Social Justice & Empowerment",
      status: "PROCESSING",
      stageIndex: 4,
      date: "22 Sep 2026",
      createdAt: "2026-09-22T09:00:00.000Z",
      citizenId: "CITIZEN-1001",
      submittedData: {
        beneficiaryName: "Manieesh Kumar R",
        verifiedIncome: "₹4,80,000 / annum",
        schemeType: "Affordable Housing Subsidized Credit",
        dbtVerification: "Aadhaar Linked Bank Account Verified"
      }
    }
  ];

  useEffect(() => {
    fetchApplications();
  }, [citizenId]);

  const fetchApplications = async () => {
    let localApps = [];
    try {
      localApps = JSON.parse(localStorage.getItem("prometheus_citizen_applications") || "[]");
    } catch {}

    try {
      setLoading(true);
      const res = await getCitizenApplications(citizenId);
      if (res?.success && Array.isArray(res.applications) && res.applications.length > 0) {
        const combined = [
          ...localApps,
          ...res.applications.filter((a) => !localApps.some((l) => l.applicationId === a.applicationId))
        ];
        setApplications(combined.length > 0 ? combined : defaultDemoApplications);
      } else if (localApps.length > 0) {
        setApplications(localApps);
      } else {
        setApplications(defaultDemoApplications);
      }
    } catch (err) {
      setApplications(localApps.length > 0 ? localApps : defaultDemoApplications);
    } finally {
      setLoading(false);
    }
  };

  // Section 7 Requirement: The 6-Stage Universal Timeline
  const TIMELINE_STAGES = [
    {
      title: "Application Submitted",
      desc: "Application registered via Prometheus"
    },
    {
      title: "Identity Verified",
      desc: "Level-3 identity verification completed"
    },
    {
      title: "Data Translated",
      desc: "Schema converted by Translation Engine"
    },
    {
      title: "Consent Verified",
      desc: "Purpose-bound consent validated"
    },
    {
      title: "Processing",
      desc: "Under administrative review"
    },
    {
      title: "Completed",
      desc: "Official certificate / licence issued"
    }
  ];

  const getStageIndex = (status) => {
    const s = (status || "").toUpperCase();
    if (s.includes("COMPLETED") || s.includes("APPROVED") || s.includes("ISSUED")) return 5;
    if (s.includes("ACTION")) return 3;
    if (s.includes("REVIEW") || s.includes("PROCESSING")) return 4;
    return 3;
  };

  const getStatusBadge = (status, stageIdx) => {
    const s = (status || "").toUpperCase();
    if (s.includes("COMPLETED") || stageIdx >= 5) {
      return { text: "COMPLETED", className: "badge-completed" };
    }
    if (s.includes("ACTION")) {
      return { text: "ACTION REQUIRED", className: "badge-action" };
    }
    if (s.includes("PROCESSING")) {
      return { text: "PROCESSING", className: "badge-processing" };
    }
    return { text: "IN REVIEW", className: "badge-review" };
  };

  const getServiceMeta = (serviceKey) => {
    switch (serviceKey) {
      case "voter":
        return {
          label: "VOTER",
          badgeClass: "badge-voter",
          authority: "Election Commission of India",
          icon: "identity"
        };
      case "welfare":
        return {
          label: "WELFARE",
          badgeClass: "badge-welfare",
          authority: "Ministry of Social Justice & Empowerment",
          icon: "welfare"
        };
      case "rto":
      default:
        return {
          label: "RTO",
          badgeClass: "badge-rto",
          authority: "Ministry of Road Transport & Highways",
          icon: "transport"
        };
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchFilter = selectedFilter === "all" || app.service?.toLowerCase() === selectedFilter.toLowerCase();
    const matchSearch =
      !searchQuery ||
      app.applicationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.authority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="unified-tracking-container">
      {/* Header */}
      <div className="tracking-header-strip">
        <span className="tracking-eyebrow">CROSS-DEPARTMENTAL APPLICATION LEDGER</span>
        <h1 className="tracking-main-title">Unified Application Tracking</h1>
        <p className="tracking-subtitle">
          Track all your government applications across connected departments from a single real-time timeline.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="tracking-toolbar-card">
          <div className="tracking-search-bar">
            <UiIcon name="search" size={18} className="tracking-search-icon" />
            <input
              type="text"
              placeholder="Search applications by ID (e.g. RTO-2026-28690), department or scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tracking-search-field"
            />
            {searchQuery && (
              <button
                type="button"
                className="tracking-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <UiIcon name="close" size={14} />
              </button>
            )}
          </div>

          <div className="tracking-filters-row">
            <span className="tracking-filters-label">Filter:</span>
            {[
              { id: "all", label: "All Services" },
              { id: "voter", label: "Voter" },
              { id: "rto", label: "RTO" },
              { id: "welfare", label: "Welfare" }
            ].map((f) => {
              const count = f.id === "all"
                ? applications.length
                : applications.filter((a) => a.service?.toLowerCase() === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`tracking-filter-btn ${selectedFilter === f.id ? "active" : ""}`}
                  onClick={() => setSelectedFilter(f.id)}
                >
                  <span>{f.label}</span>
                  {count > 0 && <span className="filter-count-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="tracking-cards-grid">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const serviceKey = app.service?.toLowerCase() || "rto";
            const meta = getServiceMeta(serviceKey);
            const currentStageIdx = app.stageIndex !== undefined ? app.stageIndex : getStageIndex(app.status);
            const statusBadge = getStatusBadge(app.status, currentStageIdx);
            const isExpanded = expandedAppId === app.applicationId;
            const subDate = app.date || (app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "25 Sep 2026");

            return (
              <div key={app.applicationId} className="tracking-app-card">
                {/* Card Top Row: Service & Status */}
                <div className="card-top-row">
                  <div className="card-service-badge-wrap">
                    <span className={`service-dept-badge ${meta.badgeClass}`}>{meta.label}</span>
                    <strong className="tracking-card-app-id">{app.applicationId}</strong>
                  </div>
                  <span className={`status-pill-badge ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                </div>

                {/* Authority & Date Row */}
                <div className="card-authority-row">
                  <span className="card-authority-title">{app.authority || meta.authority}</span>
                  <span className="card-submitted-date">Submitted: {subDate}</span>
                </div>

                {/* Service Application Name */}
                {app.serviceName && (
                  <div className="card-service-name">
                    <span>{app.serviceName}</span>
                  </div>
                )}

                {/* Vertical Timeline */}
                <div className="vertical-timeline-box" aria-label="Application Progress Timeline">
                  {TIMELINE_STAGES.map((stg, idx) => {
                    const isCompleted = idx < currentStageIdx;
                    const isCurrent = idx === currentStageIdx;
                    const isPending = idx > currentStageIdx;
                    const isLast = idx === TIMELINE_STAGES.length - 1;

                    return (
                      <div
                        key={idx}
                        className={`timeline-stage-row ${isCompleted ? "is-completed" : ""} ${isCurrent ? "is-current" : ""} ${isPending ? "is-pending" : ""}`}
                      >
                        {/* Indicator & Connector Line */}
                        <div className="timeline-marker-col">
                          <div className="timeline-node-circle">
                            {isCompleted ? (
                              <UiIcon name="check" size={13} className="check-svg-green" />
                            ) : isCurrent ? (
                              <span className="current-dot-blue" />
                            ) : (
                              <span className="pending-circle-gray" />
                            )}
                          </div>
                          {!isLast && <div className="timeline-connector-line" />}
                        </div>

                        {/* Title and Description */}
                        <div className="timeline-content-col">
                          <h4 className="timeline-stage-title">{stg.title}</h4>
                          <p className="timeline-stage-desc">{stg.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Action Footer */}
                <div className="card-action-footer">
                  <button
                    type="button"
                    className="view-details-toggle-btn"
                    onClick={() => setExpandedAppId(isExpanded ? null : app.applicationId)}
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    <UiIcon name={isExpanded ? "chevronUp" : "chevronDown"} size={14} />
                  </button>
                </div>

                {/* Expanded Accordion: Technical Provenance & Data Payload */}
                {isExpanded && (
                  <div className="card-expanded-drawer">
                    <div className="expanded-details-grid">
                      <div className="expanded-detail-section">
                        <h5>Application Metadata</h5>
                        <div className="detail-kv-row">
                          <span className="kv-label">CITIZEN ID:</span>
                          <strong className="kv-val font-mono">{app.citizenId || citizenId}</strong>
                        </div>
                        <div className="detail-kv-row">
                          <span className="kv-label">TARGET JURISDICTION:</span>
                          <span className="kv-val">Coimbatore North District</span>
                        </div>
                        <div className="detail-kv-row">
                          <span className="kv-label">TRANSLATION STATUS:</span>
                          <span className="kv-val text-green font-semibold">✓ Schema Converted</span>
                        </div>
                        <div className="detail-kv-row">
                          <span className="kv-label">CONSENT RECORD ID:</span>
                          <code className="kv-val font-mono text-xs">PRM-CNS-7F83B1</code>
                        </div>
                      </div>

                      <div className="expanded-detail-section">
                        <h5>Submitted Payload</h5>
                        <pre className="payload-json-box">
                          {JSON.stringify(
                            app.submittedData || {
                              applicantName: "Manieesh Kumar R",
                              dateOfBirth: "2004-01-15",
                              residentialAddress: "42, Anna Salai, Gandhipuram, Coimbatore - 641001",
                              status: "Synchronized"
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-tracking-card">
            <div className="empty-icon-wrap">
              <UiIcon name="applications" size={32} />
            </div>
            <h3>No matching applications found</h3>
            <p>Applications submitted through Prometheus will automatically appear here with real-time tracking.</p>
            <button
              type="button"
              className="gov-btn primary"
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
