const crypto = require("crypto");

const handoffs = new Map();
const HANDOFF_TTL_MS = 10 * 60 * 1000;

function createHandoff({ citizenId, service, data }) {
  const token = crypto.randomBytes(24).toString("base64url");
  handoffs.set(token, {
    citizenId,
    service,
    data,
    expiresAt: Date.now() + HANDOFF_TTL_MS
  });
  return token;
}

function getHandoff(token) {
  const handoff = handoffs.get(token);
  if (!handoff) return null;
  if (handoff.expiresAt <= Date.now()) {
    handoffs.delete(token);
    return null;
  }
  return handoff;
}

module.exports = { createHandoff, getHandoff };
