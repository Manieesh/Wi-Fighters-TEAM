const express = require("express");
const { getProfile, saveProfile, getAllProfiles } = require("../services/profileService");

const router = express.Router();

// ==========================================
// GET ALL CITIZEN PROFILES
// ==========================================
router.get("/", (req, res) => {
  const profiles = getAllProfiles();
  res.json({
    success: true,
    count: profiles.length,
    profiles
  });
});

// ==========================================
// GET CITIZEN PROFILE BY ID
// ==========================================
router.get("/:citizenId", (req, res) => {
  const { citizenId } = req.params;
  const profile = getProfile(citizenId);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Citizen profile not found"
    });
  }

  res.json({
    success: true,
    profile
  });
});

// ==========================================
// DIGITAL DOCUMENT LOCKER METADATA
// ==========================================
router.get("/:citizenId/documents", (req, res) => {
  const profile = getProfile(req.params.citizenId);
  if (!profile) return res.status(404).json({ success: false, message: "Citizen profile not found" });
  const documents = Object.fromEntries(Object.entries(profile.documents || {}).map(([key, value]) => [
    key,
    typeof value === "object" ? value : { status: value ? "VERIFIED" : "PENDING", verified: Boolean(value) }
  ]));
  res.json({ success: true, citizenId: profile.citizenId, documents });
});

router.put("/:citizenId/documents", (req, res) => {
  try {
    const profile = getProfile(req.params.citizenId);
    if (!profile) return res.status(404).json({ success: false, message: "Citizen profile not found" });
    const updated = saveProfile({ ...profile, documents: req.body.documents || {} });
    res.json({ success: true, citizenId: updated.citizenId, documents: updated.documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save document metadata", error: error.message });
  }
});

// ==========================================
// CREATE / UPDATE CITIZEN PROFILE
// ==========================================
router.post("/", (req, res) => {
  try {
    const { citizenId } = req.body;

    if (!citizenId) {
      return res.status(400).json({
        success: false,
        message: "citizenId is required"
      });
    }

    const updatedProfile = saveProfile(req.body);

    res.status(201).json({
      success: true,
      message: "Citizen profile saved successfully",
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save citizen profile",
      error: error.message
    });
  }
});

module.exports = router;
