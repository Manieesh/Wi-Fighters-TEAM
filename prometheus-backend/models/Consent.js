const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema(
  {
    citizenId: {
      type: String,
      required: true,
      trim: true
    },

    service: {
      type: String,
      enum: ["voter", "rto", "welfare"],
      required: true
    },

    consent: {
      type: Boolean,
      required: true,
      default: false
    },

    dataFields: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

consentSchema.index(
  { citizenId: 1, service: 1 },
  { unique: true }
);

module.exports = mongoose.model("Consent", consentSchema);
