const mongoose = require("mongoose");

const citizenRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    citizenId: { type: String, default: null, index: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    language: { type: String, required: true, default: "English" },
    location: {
      country: { type: String, default: "India" },
      state: { type: String, default: "" },
      district: { type: String, default: "" },
      city: { type: String, default: "" },
      label: { type: String, default: "" },
      coordinates: { type: [Number], default: undefined }
    },
    anonymous: { type: Boolean, default: false },
    media: [{ type: String }],
    status: {
      type: String,
      enum: ["Submitted", "AI Processing", "Verified", "Assigned", "Under Review", "Project Proposed", "Project Approved", "In Progress", "Completed", "Resolved", "Closed"],
      default: "Submitted"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },
    assignedDepartment: { type: String, default: "" },
    assignedOfficer: { type: String, default: "" },
    officerRemarks: [
      {
        officerName: { type: String, default: "" },
        department: { type: String, default: "" },
        remark: { type: String, required: true },
        statusUpdate: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    timeline: [
      {
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        actor: { type: String, default: "System" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    analysis: {
      severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
      keywords: { type: [String], default: [] },
      translatedText: { type: String, default: "" },
      similarRequests: { type: Number, default: 0 },
      clusterId: { type: String, default: null },
      demandTrend: { type: String, default: "Stable" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenRequest", citizenRequestSchema);
