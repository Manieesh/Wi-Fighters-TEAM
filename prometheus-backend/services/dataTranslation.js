/**
 * Intelligent Data Translation Engine for Prometheus
 * Maps unified citizen profile data into department-specific schemas.
 */

function extractField(data, keys, fallback = "") {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
  }
  return fallback;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

function composeAddress(address, district, state, pincode) {
  const normalizedAddress = String(address || "").toLowerCase();
  const additions = [district, state, pincode].filter((part) => part && !normalizedAddress.includes(String(part).toLowerCase()));
  return [address, ...additions].filter(Boolean).join(", ");
}

function getStateRto(state, district) {
  if (district && String(district).toLowerCase().includes("coimbatore")) {
    return "TN-38 Coimbatore";
  }
  const knownRtos = {
    "Tamil Nadu": "TN-38 Coimbatore",
    Rajasthan: "RJ-14 Jaipur",
    Gujarat: "GJ-01 Ahmedabad",
    Maharashtra: "MH-01 Mumbai",
    Karnataka: "KA-01 Bangalore",
    Kerala: "KL-01 Trivandrum",
    Delhi: "DL-01 Delhi"
  };
  return knownRtos[state] || `${String(state || "IN").slice(0, 2).toUpperCase()}-01 ${district}`;
}

function translateData(citizenData, service) {
  if (!citizenData) {
    throw new Error("Citizen data is required for translation");
  }

  const fullName = extractField(citizenData, ["fullName", "name", "applicantName", "beneficiaryName"]);
  const dateOfBirth = formatDate(extractField(citizenData, ["dateOfBirth", "dob", "birthDate"]));
  const address = extractField(citizenData, ["address", "residentialAddress", "permanentAddress"]);
  const mobile = extractField(citizenData, ["mobileNumber", "mobile", "phone", "contactNumber"]);
  const income = extractField(citizenData, ["annualIncome", "income", "salary"], 480000);
  const vehicleClass = extractField(citizenData, ["vehicleClass", "vehClass"], "LMV");
  const gender = extractField(citizenData, ["gender", "sex"], "Male");
  const district = extractField(citizenData, ["district", "city"], "Coimbatore");
  const state = extractField(citizenData, ["state"], "Tamil Nadu");
  const pincode = extractField(citizenData, ["pincode", "postalCode"], "641001");
  const schemeName = extractField(citizenData, ["schemeName", "scheme"], "Pradhan Mantri Awas Yojana");

  switch (service.toLowerCase()) {
    case "voter":
      return {
        name: fullName,
        dob: dateOfBirth,
        gender: gender,
        address: composeAddress(address, district, state, pincode),
        mobile: mobile,
        district: district,
        state: state,
        constituency: `${district} North`
      };

    case "rto":
      return {
        applicantName: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        address: composeAddress(address, district, state, pincode),
        mobileNumber: mobile,
        email: extractField(citizenData, ["email", "emailAddress"]),
        vehicleClass: vehicleClass,
        stateRto: getStateRto(state, district)
      };

    case "welfare":
      return {
        name: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        address: composeAddress(address, district, state, pincode),
        income: Number(income) || 480000,
        mobileNumber: mobile,
        schemeName: schemeName
      };

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}

module.exports = {
  translateData
};
