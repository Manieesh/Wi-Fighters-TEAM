const express = require("express");
const CitizenRequest = require("../models/CitizenRequest");

const router = express.Router();

// Preset Demo Officers for instant, professional governance login
const DEMO_OFFICERS = [
  {
    id: "OFF-101",
    username: "commissioner",
    name: "Dr. Rajesh Sharma, IAS",
    designation: "District Collector & Commissioner of Operations",
    department: "District Administration & Governance Command",
    jurisdiction: "Coimbatore & Western Districts",
    email: "rajesh.sharma@gov-ops.in",
    role: "government_officer",
    badgeNumber: "IAS-TN-2012-4821",
    avatar: "RS"
  },
  {
    id: "OFF-102",
    username: "pwd.engineer",
    name: "Er. P. Murugesan",
    designation: "Executive Engineer (Infrastructure)",
    department: "Public Works & Road Infrastructure",
    jurisdiction: "Coimbatore Metro & Highways",
    email: "p.murugesan@pwd.gov.in",
    role: "government_officer",
    badgeNumber: "PWD-SE-8839",
    avatar: "PM"
  },
  {
    id: "OFF-103",
    username: "health.officer",
    name: "Dr. K. Anitha",
    designation: "Chief Public Health Officer",
    department: "Health & Family Welfare Department",
    jurisdiction: "Coimbatore District",
    email: "dr.anitha@health.gov.in",
    role: "government_officer",
    badgeNumber: "DHO-TN-10492",
    avatar: "KA"
  }
];

// Baseline demonstration requests ensuring instant richness
const BASELINE_OFFICER_REQUESTS = [
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
    assignedOfficer: "S. Venkataraman (SE)",
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
    assignedOfficer: "S. Nagarajan (Sanitary Inspector)",
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

// Helper to merge DB requests with baseline demo data
async function getAllCombinedRequests() {
  try {
    const dbRequests = await CitizenRequest.find().sort({ createdAt: -1 }).lean();
    const existingIds = new Set(dbRequests.map((r) => r.requestId));
    const merged = [...dbRequests];

    for (const base of BASELINE_OFFICER_REQUESTS) {
      if (!existingIds.has(base.requestId)) {
        merged.push(base);
      }
    }
    return merged;
  } catch (err) {
    return BASELINE_OFFICER_REQUESTS;
  }
}

// =========================================================
// 1. OFFICER AUTHENTICATION & LOGIN
// =========================================================
router.post("/login", (req, res) => {
  const { username, password, officerId } = req.body;

  let officer = null;
  if (officerId) {
    officer = DEMO_OFFICERS.find((o) => o.id === officerId);
  } else if (username) {
    officer = DEMO_OFFICERS.find(
      (o) => o.username.toLowerCase() === username.toLowerCase() || o.email.toLowerCase() === username.toLowerCase()
    );
  }

  // Default to Commissioner if demo login without specific match
  if (!officer) {
    officer = DEMO_OFFICERS[0];
  }

  return res.json({
    success: true,
    message: "Officer authenticated successfully",
    token: `OFFICER-JWT-${officer.id}-${Date.now()}`,
    officer: {
      ...officer,
      lastLogin: new Date().toISOString()
    }
  });
});

router.get("/officers", (req, res) => {
  res.json({
    success: true,
    officers: DEMO_OFFICERS
  });
});

// =========================================================
// 2. DASHBOARD KPI STATS & AGGREGATIONS
// =========================================================
router.get("/stats", async (req, res) => {
  try {
    const all = await getAllCombinedRequests();

    const total = all.length;
    let pending = 0;
    let underReview = 0;
    let inProgress = 0;
    let resolved = 0;
    let highPriority = 0;

    const categoryCounts = {};
    const statusCounts = {};
    const priorityCounts = { High: 0, Medium: 0, Low: 0, Critical: 0 };
    const districtCounts = {};

    all.forEach((item) => {
      const st = item.status || "Submitted";
      const cat = item.category || "General";
      const pri = item.priority || item.analysis?.severity || "Medium";
      const dist = item.location?.district || "Other";

      statusCounts[st] = (statusCounts[st] || 0) + 1;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      priorityCounts[pri] = (priorityCounts[pri] || 0) + 1;
      districtCounts[dist] = (districtCounts[dist] || 0) + 1;

      if (st === "Submitted" || st === "AI Processing") pending++;
      else if (st === "Under Review" || st === "Verified") underReview++;
      else if (st === "In Progress" || st === "Assigned" || st === "Project Approved") inProgress++;
      else if (st === "Completed" || st === "Resolved") resolved++;

      if (pri === "High" || pri === "Critical") highPriority++;
    });

    const categoriesArray = Object.keys(categoryCounts).map((cat) => ({
      label: cat,
      count: categoryCounts[cat],
      percentage: Math.round((categoryCounts[cat] / (total || 1)) * 100)
    }));

    const statusArray = Object.keys(statusCounts).map((st) => ({
      status: st,
      count: statusCounts[st]
    }));

    const districtArray = Object.keys(districtCounts).map((dist) => ({
      district: dist,
      count: districtCounts[dist]
    }));

    res.json({
      success: true,
      stats: {
        totalRequests: total,
        pendingRequests: pending,
        underReviewRequests: underReview,
        inProgressRequests: inProgress,
        resolvedRequests: resolved,
        highPriorityRequests: highPriority,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        categoryDistribution: categoriesArray,
        statusDistribution: statusArray,
        priorityDistribution: priorityCounts,
        districtDistribution: districtArray
      }
    });
  } catch (err) {
    console.error("Officer stats error:", err);
    res.status(500).json({ success: false, message: "Failed to generate officer statistics" });
  }
});

// =========================================================
// 3. REQUESTS LISTING (SEARCH, FILTER, SORT)
// =========================================================
router.get("/requests", async (req, res) => {
  try {
    const { search, category, status, priority, district, department } = req.query;
    let list = await getAllCombinedRequests();

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          r.requestId?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.location?.city?.toLowerCase().includes(q) ||
          r.location?.district?.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      list = list.filter((r) => r.category === category);
    }

    if (status && status !== "All") {
      list = list.filter((r) => r.status === status);
    }

    if (priority && priority !== "All") {
      list = list.filter((r) => (r.priority || r.analysis?.severity) === priority);
    }

    if (district && district !== "All") {
      list = list.filter((r) => r.location?.district === district);
    }

    if (department && department !== "All") {
      list = list.filter((r) => r.assignedDepartment === department);
    }

    res.json({
      success: true,
      count: list.length,
      requests: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch officer requests" });
  }
});

// =========================================================
// 4. REQUEST DETAILS
// =========================================================
router.get("/requests/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    let request = await CitizenRequest.findOne({ requestId }).lean();

    if (!request) {
      request = BASELINE_OFFICER_REQUESTS.find((r) => r.requestId === requestId);
    }

    if (!request) {
      return res.status(404).json({ success: false, message: `Request ${requestId} not found` });
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch request details" });
  }
});

// =========================================================
// 5. UPDATE REQUEST STATUS & LOG TIMELINE
// =========================================================
router.patch("/requests/:requestId/status", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, officerName, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    let request = await CitizenRequest.findOne({ requestId });

    if (!request) {
      // Find in baseline and create in DB so changes persist
      const base = BASELINE_OFFICER_REQUESTS.find((r) => r.requestId === requestId);
      if (base) {
        request = await CitizenRequest.create({
          ...base,
          status,
          priority: base.priority || "Medium"
        });
      }
    }

    if (!request) {
      return res.status(404).json({ success: false, message: `Request ${requestId} not found` });
    }

    const previousStatus = request.status;
    request.status = status;

    // Append to timeline
    request.timeline = request.timeline || [];
    request.timeline.push({
      status,
      title: `Status updated to ${status}`,
      description: remarks || `Transitioned from ${previousStatus} to ${status}`,
      actor: officerName || "Government Officer",
      createdAt: new Date()
    });

    if (remarks) {
      request.officerRemarks = request.officerRemarks || [];
      request.officerRemarks.push({
        officerName: officerName || "Government Officer",
        remark: remarks,
        statusUpdate: status,
        createdAt: new Date()
      });
    }

    await request.save();
    res.json({ success: true, message: `Status updated to ${status}`, request });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ success: false, message: "Failed to update request status" });
  }
});

// =========================================================
// 6. ASSIGN DEPARTMENT & OFFICER
// =========================================================
router.post("/requests/:requestId/assign", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { department, officer, assignedBy, notes } = req.body;

    if (!department) {
      return res.status(400).json({ success: false, message: "Department is required" });
    }

    let request = await CitizenRequest.findOne({ requestId });
    if (!request) {
      const base = BASELINE_OFFICER_REQUESTS.find((r) => r.requestId === requestId);
      if (base) {
        request = await CitizenRequest.create({
          ...base,
          assignedDepartment: department,
          assignedOfficer: officer || "Unassigned"
        });
      }
    }

    if (!request) {
      return res.status(404).json({ success: false, message: `Request ${requestId} not found` });
    }

    request.assignedDepartment = department;
    if (officer) request.assignedOfficer = officer;
    if (request.status === "Submitted") request.status = "Assigned";

    request.timeline = request.timeline || [];
    request.timeline.push({
      status: "Assigned",
      title: `Assigned to ${department}`,
      description: `Assigned Officer: ${officer || "Department Triage"} - ${notes || "Priority execution mandated"}`,
      actor: assignedBy || "Operations Desk",
      createdAt: new Date()
    });

    await request.save();
    res.json({ success: true, message: "Assignment recorded successfully", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to assign request" });
  }
});

// =========================================================
// 7. ADD OFFICER REMARKS
// =========================================================
router.post("/requests/:requestId/remarks", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { remark, officerName, department, actionTaken } = req.body;

    if (!remark) {
      return res.status(400).json({ success: false, message: "Remark text is required" });
    }

    let request = await CitizenRequest.findOne({ requestId });
    if (!request) {
      const base = BASELINE_OFFICER_REQUESTS.find((r) => r.requestId === requestId);
      if (base) {
        request = await CitizenRequest.create({ ...base });
      }
    }

    if (!request) {
      return res.status(404).json({ success: false, message: `Request ${requestId} not found` });
    }

    request.officerRemarks = request.officerRemarks || [];
    request.officerRemarks.push({
      officerName: officerName || "Officer",
      department: department || request.assignedDepartment || "Operations",
      remark,
      actionTaken: actionTaken || "Reviewed",
      createdAt: new Date()
    });

    await request.save();
    res.json({ success: true, message: "Officer remark appended", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to append remark" });
  }
});

// =========================================================
// 8. DEPARTMENTS DIRECTORY & STATUS
// =========================================================
router.get("/departments", (req, res) => {
  const departments = [
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

  res.json({ success: true, count: departments.length, departments });
});

// =========================================================
// 9. ADVANCED ANALYTICS & REGIONAL CLUSTERS
// =========================================================
router.get("/analytics", (req, res) => {
  res.json({
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
  });
});

module.exports = router;
