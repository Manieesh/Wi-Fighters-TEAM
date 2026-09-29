const mongoose = require("mongoose");
const crypto = require("crypto");

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CONSENT_GRANTED",
        "CONSENT_REVOKED",
        "IDENTITY_VERIFIED",
        "SCHEMA_VALIDATED",
        "DATA_TRANSLATED",
        "DESTINATION_PAYLOAD_GENERATED",
        "REQUEST_DISPATCHED",
        "APPLICATION_STATUS_UPDATED",
        "GATEWAY_HEALTH_CHECK",
        "RETRY_ATTEMPTED",
        "RETRY_RECOVERED",
        "SECURITY_AUDIT_LOGGED"
      ]
    },
    citizenId: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
    actor: {
      type: String,
      default: "Prometheus Sovereign Gateway"
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ["SUCCESS", "WARNING", "FAILED", "QUEUED"],
      default: "SUCCESS"
    },
    sha256Hash: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Generate immutable SHA-256 cryptographic hash (Mongoose 9 compatible)
auditLogSchema.pre("save", function () {
  if (!this.sha256Hash) {
    const payload = `${this.timestamp || new Date()}_${this.action}_${this.citizenId}_${this.service}_${JSON.stringify(this.details || {})}`;
    this.sha256Hash = "SHA256:" + crypto.createHash("sha256").update(payload).digest("hex");
  }
});

auditLogSchema.index({ citizenId: 1, timestamp: -1 });
auditLogSchema.index({ service: 1, timestamp: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
