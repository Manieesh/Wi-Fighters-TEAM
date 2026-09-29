const mongoose = require("mongoose");

const voterApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["SUBMITTED", "PROCESSING", "APPROVED", "REJECTED"],
      default: "SUBMITTED"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "VoterApplication",
  voterApplicationSchema
);