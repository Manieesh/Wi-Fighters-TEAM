const mongoose = require("mongoose");

const rtoApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      required: true
    },

    applicantName: {
      type: String,
      required: true,
      trim: true
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true
    },

    stateRto: {
      type: String,
      trim: true
    },

    applicationType: {
      type: String,
      enum: ["learners", "permanent"],
      default: "permanent"
    },

    citizenId: {
      type: String,
      default: "CITIZEN-1001"
    },

    vehicleClass: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_VERIFICATION",
        "APPROVED",
        "REJECTED",
        "COMPLETED"
      ],
      default: "UNDER_VERIFICATION"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "RtoApplication",
  rtoApplicationSchema
);