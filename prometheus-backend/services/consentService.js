const Consent = require("../models/Consent");

// Add or update consent
async function addConsent(record) {
  const { citizenId, service, consent, dataFields = [] } = record;

  return await Consent.findOneAndUpdate(
    { citizenId, service },
    {
      citizenId,
      service,
      consent: consent === true,
      dataFields
    },
    {
      new: true,
      upsert: true
    }
  );
}

// Find consent
async function getConsent(citizenId, service) {
  return await Consent.findOne({
    citizenId,
    service,
    consent: true
  });
}

// Check consent
async function hasConsent(citizenId, service) {
  const record = await getConsent(citizenId, service);
  return !!record;
}

// Get all consent records
async function getAllConsents() {
  return await Consent.find().sort({ createdAt: -1 });
}

module.exports = {
  addConsent,
  getConsent,
  hasConsent,
  getAllConsents
};
