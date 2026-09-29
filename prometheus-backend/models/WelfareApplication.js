const mongoose = require("mongoose");

const welfareApplicationSchema = new mongoose.Schema(
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

    address: {
      type: String,
      required: true,
      trim: true
    },

    income: {
      type: Number,
      required: true,
      min: 0
    },

    schemeName: { type: String, default: "Jan Kalyan Welfare Scheme" },
    citizenId: { type: String, default: "CITIZEN-1001" },

    status: {
      type: String,
      enum: [
        "PROCESSING",
        "SUBMITTED",
        "UNDER_VERIFICATION",
        "DBT_INITIATED",
        "APPROVED",
        "REJECTED",
        "COMPLETED"
      ],
      default: "PROCESSING"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "WelfareApplication",
  welfareApplicationSchema
);
