const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true
    },

    citizenId: {
      type: String,
      required: true
    },

    service: {
      type: String,
      required: true,
      enum: ["voter", "rto", "welfare"]
    },

    status: {
      type: String,
      required: true,
      default: "SUBMITTED"
    },

    submittedData: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);