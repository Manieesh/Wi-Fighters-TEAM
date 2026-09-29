const express = require("express");
const CitizenRequest = require("../models/CitizenRequest");

const router = express.Router();

const categoryDefaults = {
  "Drinking Water": { severity: "High", urgency: "High", similarRequests: 2843, keywords: ["water shortage", "pipeline", "drinking water"] },
  Roads: { severity: "Medium", urgency: "High", similarRequests: 1189, keywords: ["road damage", "potholes", "access road"] },
  Healthcare: { severity: "High", urgency: "High", similarRequests: 756, keywords: ["healthcare access", "clinic", "distance"] }
};

function analyzeRequest({ category, description, language, location }) {
  const defaults = categoryDefaults[category] || { severity: "Medium", urgency: "Medium", similarRequests: 328, keywords: [category.toLowerCase()] };
  return {
    ...defaults,
    translatedText: description,
    clusterId: `CL-${String(category).slice(0, 3).toUpperCase()}-1042`,
    demandTrend: defaults.similarRequests > 1000 ? "Increasing" : "Stable",
    detectedLanguage: language,
    extractedLocation: location?.district || location?.label || ""
  };
}

router.post("/", async (req, res) => {
  try {
    const { category, description, language, location, citizenId, anonymous, subcategory, media } = req.body;
    if (!category || !description || !language) {
      return res.status(400).json({ success: false, message: "category, description and language are required" });
    }
    const request = await CitizenRequest.create({
      requestId: `REQ-${Date.now().toString().slice(-8)}`,
      citizenId: anonymous ? null : citizenId || null,
      category,
      description,
      language,
      location: location || {},
      anonymous: Boolean(anonymous),
      subcategory: subcategory || "",
      media: Array.isArray(media) ? media.slice(0, 5) : [],
      status: "AI Processing",
      analysis: analyzeRequest({ category, description, language, location })
    });
    res.status(201).json({ success: true, request });
  } catch (error) {
    console.error("Citizen request error:", error);
    res.status(500).json({ success: false, message: "Failed to create citizen request" });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.district) filter["location.district"] = req.query.district;
    if (req.query.status) filter.status = req.query.status;
    const requests = await CitizenRequest.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch citizen requests" });
  }
});

router.get("/:requestId", async (req, res) => {
  const request = await CitizenRequest.findOne({ requestId: req.params.requestId }).lean();
  if (!request) return res.status(404).json({ success: false, message: "Citizen request not found" });
  res.json({ success: true, request });
});

router.post("/:requestId/analyze", async (req, res) => {
  const request = await CitizenRequest.findOne({ requestId: req.params.requestId });
  if (!request) return res.status(404).json({ success: false, message: "Citizen request not found" });
  request.analysis = analyzeRequest(request);
  request.status = "Verified";
  await request.save();
  res.json({ success: true, analysis: request.analysis, request });
});

module.exports = router;
