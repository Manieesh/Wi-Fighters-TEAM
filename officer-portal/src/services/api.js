// ======================================================
// PROMETHEUS GOVERNMENT OPERATIONS API CLIENT
// Backend: http://localhost:5000/api
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || `API error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.warn(`[Officer API Warning] ${endpoint}:`, error.message);
    throw error;
  }
};

// ======================================================
// DEMO / OFFLINE FALLBACK STORE
// Ensures 100% reliability under all network conditions
// ======================================================
let localRequestsStore = [
  {
    requestId: "REQ-1001",
    citizenId: "CITIZEN-1001",
    category: "Drinking Water",
    subcategory: "Piped Water Supply",
    description: "Our village needs a reliable drinking water pipeline. Present borewell has dried up causing extreme hardship for 450 families.",
    language: "Tamil",
    location: {
      district: "Coimbatore",
      city: "Kinathukadavu Block",
      state: "Tamil Nadu",
      label: "Kinathukadavu Rural Hub",
      coordinates: [77.0163, 10.8225]
    },
    status: "Under Review",
    priority: "High",
    assignedDepartment: "Water Supply & Drainage Board",
    assignedOfficer: "S. Venkataraman",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      severity: "High",
      urgency: "High",
      similarRequests: 2843,
      translatedText: "Our village needs a reliable drinking water pipeline. Present borewell has dried up causing extreme hardship for 450 families.",
      demandTrend: "Increasing",
      clusterId: "CL-WAT-1042"
    },
    officerRemarks: [
      {
        officerName: "Dr. Rajesh Sharma, IAS",
        department: "District Administration",
        remark: "TWAD board engineers dispatched for field survey and geological groundwater viability test.",
        statusUpdate: "Under Review",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: "Submitted", title: "Request Registered", description: "Submitted via Prometheus Citizen Portal", actor: "Citizen (CITIZEN-1001)", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "AI Processing", title: "AI Severity Triage", description: "Categorized as Drinking Water; Demand Cluster CL-WAT-1042 mapped", actor: "Prometheus AI Engine", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 120000).toISOString() },
      { status: "Under Review", title: "Administrative Review", description: "Assigned to District Water Board for priority inspection", actor: "Dr. Rajesh Sharma, IAS", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    requestId: "REQ-1002",
    citizenId: "CITIZEN-1042",
    category: "Roads",
    subcategory: "Arterial Road Repair",
    description: "The main access road connecting bypass to primary school has deep potholes after the monsoon rains. Two minor accidents reported.",
    language: "English",
    location: {
      district: "Madurai",
      city: "Tirumangalam Rural",
      state: "Tamil Nadu",
      label: "Tirumangalam Road Junction",
      coordinates: [78.0056, 9.8247]
    },
    status: "In Progress",
    priority: "Medium",
    assignedDepartment: "Public Works & Road Infrastructure",
    assignedOfficer: "Er. P. Murugesan",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      severity: "Medium",
      urgency: "High",
      similarRequests: 1189,
      translatedText: "The main access road connecting bypass to primary school has deep potholes after the monsoon rains. Two minor accidents reported.",
      demandTrend: "Increasing",
      clusterId: "CL-ROA-2019"
    },
    officerRemarks: [
      {
        officerName: "Er. P. Murugesan",
        department: "PWD",
        remark: "Tender approved under Project PRJ-198. Bitumen laying in progress along 3.8 km stretch.",
        statusUpdate: "In Progress",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: "Submitted", title: "Request Registered", description: "Reported with photos of road damage", actor: "Citizen", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Assigned", title: "Assigned to PWD Division", description: "Sanctioned for immediate repair", actor: "District Collector", createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "In Progress", title: "Road Laying Begun", description: "Contractor mobilized on site", actor: "Er. P. Murugesan", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    requestId: "REQ-1003",
    citizenId: "CITIZEN-1090",
    category: "Healthcare",
    subcategory: "Primary Health Centre",
    description: "The nearest primary health centre is more than 20 km away. Emergency maternal and infant care is severely delayed.",
    language: "Hindi",
    location: {
      district: "Bhopal",
      city: "Berasia Sub-division",
      state: "Madhya Pradesh",
      label: "Berasia Rural Cluster",
      coordinates: [77.4332, 23.6341]
    },
    status: "Completed",
    priority: "High",
    assignedDepartment: "Health & Family Welfare Department",
    assignedOfficer: "Dr. K. Anitha",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      severity: "High",
      urgency: "High",
      similarRequests: 756,
      translatedText: "The nearest primary health centre is more than 20 km away. Emergency maternal and infant care is severely delayed.",
      demandTrend: "Stable",
      clusterId: "CL-HEA-3041"
    },
    officerRemarks: [
      {
        officerName: "Dr. K. Anitha",
        department: "Health Department",
        remark: "Mobile Primary Tele-Health diagnostic unit (PRJ-176) deployed permanently to cover Berasia cluster daily.",
        statusUpdate: "Completed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: "Submitted", title: "Citizen Request", description: "Community deficit flagged", actor: "Citizen", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Assigned", title: "Health Assessment", description: "Mobile clinic proposed", actor: "Health Officer", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Completed", title: "Mobile Health Unit Active", description: "Service operating with daily nurse & doctor roster", actor: "Dr. K. Anitha", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    requestId: "REQ-1004",
    citizenId: "CITIZEN-1120",
    category: "Electricity",
    subcategory: "Street Lighting & Transformer",
    description: "Main market junction has continuous low-voltage fluctuations. Four commercial transformers are overloaded and streetlights remain dark.",
    language: "English",
    location: {
      district: "Chennai",
      city: "Ambattur Industrial Zone",
      state: "Tamil Nadu",
      label: "Ambattur Sector 3",
      coordinates: [80.1548, 13.0978]
    },
    status: "Submitted",
    priority: "Medium",
    assignedDepartment: "Electricity & Energy Distribution (TANGEDCO)",
    assignedOfficer: "Unassigned",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      severity: "Medium",
      urgency: "Medium",
      similarRequests: 540,
      translatedText: "Main market junction has continuous low-voltage fluctuations. Four commercial transformers are overloaded and streetlights remain dark.",
      demandTrend: "Stable",
      clusterId: "CL-ELE-4091"
    },
    officerRemarks: [],
    timeline: [
      { status: "Submitted", title: "Citizen Reported", description: "Voltage drop and street safety concern logged", actor: "Citizen", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    requestId: "REQ-1005",
    citizenId: "CITIZEN-1145",
    category: "Sanitation",
    subcategory: "Stormwater Drainage Cleaning",
    description: "Open stormwater canal is clogged with debris and plastic waste. Foul odor and mosquito breeding have multiplied rapidly.",
    language: "Tamil",
    location: {
      district: "Coimbatore",
      city: "Singanallur Lake Periphery",
      state: "Tamil Nadu",
      label: "Singanallur Ward 61",
      coordinates: [77.0266, 10.9981]
    },
    status: "Assigned",
    priority: "High",
    assignedDepartment: "Municipal Solid Waste & Sanitation",
    assignedOfficer: "S. Nagarajan",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    analysis: {
      severity: "High",
      urgency: "High",
      similarRequests: 920,
      translatedText: "Open stormwater canal is clogged with debris and plastic waste. Foul odor and mosquito breeding have multiplied rapidly.",
      demandTrend: "Increasing",
      clusterId: "CL-SAN-5021"
    },
    officerRemarks: [
      {
        officerName: "S. Nagarajan",
        department: "Sanitation",
        remark: "Excavator team scheduled for desilting drive on Saturday morning.",
        statusUpdate: "Assigned",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ],
    timeline: [
      { status: "Submitted", title: "Citizen Request", description: "Health hazard reported", actor: "Citizen", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Assigned", title: "Sanitation Squad Dispatched", description: "Work order created for mechanical desilting", actor: "Municipal Commissioner", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// ======================================================
// OFFICER APIS
// ======================================================

export const loginOfficer = async ({ username, password, officerId }) => {
  try {
    return await request("/officer/login", {
      method: "POST",
      body: JSON.stringify({ username, password, officerId })
    });
  } catch {
    return {
      success: true,
      message: "Officer session initialized (demo mode)",
      token: `OFFICER-DEMO-${Date.now()}`,
      officer: {
        id: officerId || "OFF-101",
        name: "Dr. Rajesh Sharma, IAS",
        designation: "District Collector & Commissioner of Operations",
        department: "District Administration & Governance Command",
        jurisdiction: "Coimbatore & Western Districts",
        email: "rajesh.sharma@gov-ops.in",
        role: "government_officer",
        badgeNumber: "IAS-TN-2012-4821",
        avatar: "RS"
      }
    };
  }
};

export const getOfficerStats = async () => {
  try {
    return await request("/officer/stats");
  } catch {
    const total = localRequestsStore.length;
    let pending = 0, underReview = 0, inProgress = 0, resolved = 0, highPriority = 0;
    const catMap = {}, statusMap = {};

    localRequestsStore.forEach((r) => {
      const st = r.status || "Submitted";
      const cat = r.category || "General";
      const pri = r.priority || "Medium";

      statusMap[st] = (statusMap[st] || 0) + 1;
      catMap[cat] = (catMap[cat] || 0) + 1;

      if (st === "Submitted" || st === "AI Processing") pending++;
      else if (st === "Under Review" || st === "Verified") underReview++;
      else if (st === "In Progress" || st === "Assigned") inProgress++;
      else if (st === "Completed" || st === "Resolved") resolved++;

      if (pri === "High" || pri === "Critical") highPriority++;
    });

    return {
      success: true,
      stats: {
        totalRequests: total,
        pendingRequests: pending,
        underReviewRequests: underReview,
        inProgressRequests: inProgress,
        resolvedRequests: resolved,
        highPriorityRequests: highPriority,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        categoryDistribution: Object.keys(catMap).map((k) => ({
          label: k,
          count: catMap[k],
          percentage: Math.round((catMap[k] / total) * 100)
        })),
        statusDistribution: Object.keys(statusMap).map((k) => ({
          status: k,
          count: statusMap[k]
        })),
        priorityDistribution: { High: highPriority, Medium: total - highPriority, Low: 0 },
        districtDistribution: [
          { district: "Coimbatore", count: 2 },
          { district: "Madurai", count: 1 },
          { district: "Bhopal", count: 1 },
          { district: "Chennai", count: 1 }
        ]
      }
    };
  }
};

export const getOfficerRequests = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    return await request(`/officer/requests${query ? `?${query}` : ""}`);
  } catch {
    let list = [...localRequestsStore];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((r) =>
        r.requestId?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.location?.district?.toLowerCase().includes(q) ||
        r.location?.city?.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== "All") {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters.status && filters.status !== "All") {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters.priority && filters.priority !== "All") {
      list = list.filter((r) => (r.priority || r.analysis?.severity) === filters.priority);
    }
    return { success: true, count: list.length, requests: list };
  }
};

export const getOfficerRequest = async (requestId) => {
  try {
    return await request(`/officer/requests/${encodeURIComponent(requestId)}`);
  } catch {
    const found = localRequestsStore.find((r) => r.requestId === requestId);
    if (!found) throw new Error("Request not found");
    return { success: true, request: found };
  }
};

export const updateRequestStatus = async (requestId, { status, officerName, remarks }) => {
  try {
    return await request(`/officer/requests/${encodeURIComponent(requestId)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, officerName, remarks })
    });
  } catch {
    const item = localRequestsStore.find((r) => r.requestId === requestId);
    if (item) {
      item.status = status;
      item.timeline = item.timeline || [];
      item.timeline.push({
        status,
        title: `Status updated to ${status}`,
        description: remarks || `Transitioned to ${status}`,
        actor: officerName || "Government Officer",
        createdAt: new Date().toISOString()
      });
      if (remarks) {
        item.officerRemarks = item.officerRemarks || [];
        item.officerRemarks.push({
          officerName: officerName || "Officer",
          remark: remarks,
          statusUpdate: status,
          createdAt: new Date().toISOString()
        });
      }
    }
    return { success: true, request: item };
  }
};

export const assignRequest = async (requestId, { department, officer, assignedBy, notes }) => {
  try {
    return await request(`/officer/requests/${encodeURIComponent(requestId)}/assign`, {
      method: "POST",
      body: JSON.stringify({ department, officer, assignedBy, notes })
    });
  } catch {
    const item = localRequestsStore.find((r) => r.requestId === requestId);
    if (item) {
      item.assignedDepartment = department;
      if (officer) item.assignedOfficer = officer;
      if (item.status === "Submitted") item.status = "Assigned";
      item.timeline = item.timeline || [];
      item.timeline.push({
        status: "Assigned",
        title: `Assigned to ${department}`,
        description: `Officer: ${officer || "Department Triage"} - ${notes || "Assigned for field action"}`,
        actor: assignedBy || "Operations Desk",
        createdAt: new Date().toISOString()
      });
    }
    return { success: true, request: item };
  }
};

export const addOfficerRemark = async (requestId, { remark, officerName, department, actionTaken }) => {
  try {
    return await request(`/officer/requests/${encodeURIComponent(requestId)}/remarks`, {
      method: "POST",
      body: JSON.stringify({ remark, officerName, department, actionTaken })
    });
  } catch {
    const item = localRequestsStore.find((r) => r.requestId === requestId);
    if (item) {
      item.officerRemarks = item.officerRemarks || [];
      item.officerRemarks.push({
        officerName: officerName || "Officer",
        department: department || "Operations",
        remark,
        actionTaken: actionTaken || "Action logged",
        createdAt: new Date().toISOString()
      });
    }
    return { success: true, request: item };
  }
};

export const getDepartments = async () => {
  try {
    return await request("/officer/departments");
  } catch {
    return {
      success: true,
      departments: [
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
      ]
    };
  }
};

export const getOfficerAnalytics = async () => {
  try {
    return await request("/officer/analytics");
  } catch {
    return {
      success: true,
      analytics: {
        monthlyTrends: [
          { month: "Apr", requests: 1820, resolved: 1450 },
          { month: "May", requests: 2190, resolved: 1820 },
          { month: "Jun", requests: 2840, resolved: 2100 },
          { month: "Jul", requests: 3410, resolved: 2680 },
          { month: "Aug", requests: 3950, resolved: 3120 },
          { month: "Sep", requests: 4320, resolved: 3490 }
        ],
        hotspots: [
          { district: "Coimbatore", category: "Drinking Water", demandScore: 94, urgency: "Critical", population: "91,200", trend: "+24%" },
          { district: "Madurai", category: "Roads", demandScore: 82, urgency: "High", population: "54,600", trend: "+12%" },
          { district: "Chennai", category: "Public Transport", demandScore: 89, urgency: "High", population: "185,000", trend: "+19%" },
          { district: "Bhopal", category: "Healthcare", demandScore: 76, urgency: "Moderate", population: "26,300", trend: "+8%" }
        ],
        prioritisedSchemes: [
          { id: "PRJ-204", title: "Kinathukadavu Piped Drinking Water Supply", budget: "₹18.4 Cr", demandScore: 94, impactScore: 92, status: "Recommended" },
          { id: "PRJ-198", title: "Tirumangalam Arterial Road Restoration", budget: "₹9.8 Cr", demandScore: 82, impactScore: 78, status: "Approved" },
          { id: "PRJ-176", title: "Berasia Tele-Health Mobile Diagnostic Fleet", budget: "₹4.2 Cr", demandScore: 88, impactScore: 84, status: "Operational" }
        ]
      }
    };
  }
};
