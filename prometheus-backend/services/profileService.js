/**
 * Profile Service for Prometheus Central Platform
 * Manages verified citizen profiles with pre-seeded demo records.
 */

const profiles = new Map();

// Seed standard demo profiles
const seedProfiles = [
  {
    citizenId: "CITIZEN-1001",
    name: "Manieesh Kumar R",
    fullName: "Manieesh Kumar R",
    dateOfBirth: "2004-01-15",
    gender: "Male",
    mobile: "9876543210",
    mobileNumber: "9876543210",
    email: "manieesh.kumar@gov-citizen.in",
    address: "42, Anna Salai, Gandhipuram",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    district: "Coimbatore",
    aadhaarNumber: "•••• •••• 8912",
    annualIncome: 480000,
    occupation: "Software Professional",
    category: "General / OBC",
    vehicleClass: "LMV",
    documents: {
      identity: true,
      addressProof: true,
      photograph: true,
      incomeCertificate: true,
      ageProof: true
    },
    updatedAt: new Date().toISOString()
  },
  {
    citizenId: "CIT-20260001",
    name: "Rajesh Kumar Sharma",
    fullName: "Rajesh Kumar Sharma",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    mobile: "9876543210",
    mobileNumber: "9876543210",
    email: "rajesh.sharma@gov-citizen.in",
    address: "42, MG Road, Near City Mall",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    district: "Jaipur",
    aadhaarNumber: "•••• •••• 4120",
    annualIncome: 520000,
    occupation: "Professional",
    category: "General",
    vehicleClass: "LMV",
    documents: {
      identity: true,
      addressProof: true,
      photograph: true,
      incomeCertificate: true,
      ageProof: true
    },
    updatedAt: new Date().toISOString()
  }
];

seedProfiles.forEach((p) => profiles.set(p.citizenId, p));

function getProfile(citizenId) {
  if (!citizenId) return seedProfiles[0];
  if (profiles.has(citizenId)) return profiles.get(citizenId);

  // Fallback to primary seed if requested
  const normalized = citizenId.trim().toUpperCase();
  for (const [id, p] of profiles.entries()) {
    if (id.toUpperCase() === normalized) return p;
  }
  return null;
}

function saveProfile(data) {
  if (!data || !data.citizenId) {
    throw new Error("citizenId is required");
  }

  const existing = profiles.get(data.citizenId) || {};
  const updated = {
    ...existing,
    ...data,
    fullName: data.fullName || data.name || existing.fullName || existing.name,
    mobileNumber: data.mobileNumber || data.mobile || existing.mobileNumber || existing.mobile,
    updatedAt: new Date().toISOString()
  };

  profiles.set(data.citizenId, updated);
  return updated;
}

function getAllProfiles() {
  return Array.from(profiles.values());
}

module.exports = {
  getProfile,
  saveProfile,
  getAllProfiles,
  defaultProfile: seedProfiles[0]
};
