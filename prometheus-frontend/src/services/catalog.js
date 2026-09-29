const VOTER_BASE = import.meta.env.VITE_VOTER_PORTAL_URL || (import.meta.env.PROD ? "/voter" : "http://localhost:5174");
const RTO_BASE = import.meta.env.VITE_RTO_PORTAL_URL || (import.meta.env.PROD ? "/rto" : "http://localhost:5175");
const WELFARE_BASE = import.meta.env.VITE_WELFARE_PORTAL_URL || (import.meta.env.PROD ? "/welfare" : "http://localhost:5176");

export const citizenProfile = {
  citizenId: "CITIZEN-1001",
  name: "Manieesh Kumar R",
  fullName: "Manieesh Kumar R",
  dateOfBirth: "2004-01-15",
  gender: "Male",
  mobile: "9876543210",
  email: "manieesh.kumar@gov-citizen.in",
  address: "42, Anna Salai, Gandhipuram",
  district: "Coimbatore",
  state: "Tamil Nadu",
  pincode: "641001"
};

export const availableServices = [
  {
    id: "voter",
    name: "Voter ID",
    title: "Voter ID",
    organization: "Election Commission of India",
    authority: "Election Commission of India",
    description: "Access voter registration, Form 6 electoral roll enrolment, and voter information.",
    category: "Identity",
    status: "available",
    route: "/services/voter",
    port: 5174,
    portalUrl: `${VOTER_BASE}/voter/registration-form?source=prometheus&citizenId=CITIZEN-1001`,
    icon: "identity",
    features: [
      "Voter Registration (Form 6)",
      "EPIC Card Services",
      "Electoral Roll Verification"
    ],
    eligibility: "Indian citizens aged 18 years or older as on the qualifying roll date.",
    whatYouCanDo: [
      "New Voter registration (Form 6)",
      "Update electoral details & address",
      "Access digital EPIC voter slip",
      "Track polling station & booth officer"
    ]
  },
  {
    id: "rto",
    name: "Driving Licence (RTO)",
    title: "Driving Licence (RTO)",
    organization: "Ministry of Road Transport & Highways",
    authority: "Ministry of Road Transport & Highways",
    description: "Apply for learner's licence, permanent driving licence, vehicle endorsements, and test appointments.",
    category: "Transport",
    status: "available",
    route: "/services/rto",
    port: 5175,
    portalUrl: `${RTO_BASE}/apply?source=prometheus&citizenId=CITIZEN-1001`,
    icon: "transport",
    features: [
      "Learner & Permanent Licence",
      "Vehicle Class Endorsements (LMV/MCWG)",
      "Slot Booking & Verification"
    ],
    eligibility: "Applicants meeting statutory minimum age (18+ for LMV) and licensing fitness criteria.",
    whatYouCanDo: [
      "Apply for Learner's Licence (LL)",
      "Apply for Permanent Driving Licence (DL)",
      "Book driving skill test slot",
      "Automatic address & identity verification"
    ]
  },
  {
    id: "welfare",
    name: "Jan Kalyan Welfare Schemes",
    title: "Jan Kalyan Welfare Schemes",
    organization: "National Social Welfare & DBT Mission",
    authority: "National Social Welfare & DBT Mission",
    description: "Discover central and state welfare benefits, direct benefit transfer (DBT), and financial grants.",
    category: "Welfare",
    status: "available",
    route: "/services/welfare",
    port: 5176,
    portalUrl: `${WELFARE_BASE}?source=prometheus&citizenId=CITIZEN-1001&autofill=true`,
    icon: "welfare",
    features: [
      "Housing Assistance & Farmer Aid",
      "Education & Student Scholarships",
      "Direct Benefit Transfer (DBT)"
    ],
    eligibility: "Subject to scheme criteria, income thresholds, and social category verification.",
    whatYouCanDo: [
      "Discover eligible central & state schemes",
      "Pre-fill application using verified profile",
      "Submit with explicit purpose-bound consent",
      "Track Direct Benefit Transfer (DBT) disbursements"
    ]
  }
];

export const comingSoonServices = [
  {
    id: "passport",
    name: "Passport Services",
    title: "Passport Services",
    organization: "Ministry of External Affairs",
    authority: "Ministry of External Affairs",
    description: "Fresh passport issuance, tatkaal services, renewals, and police verification status.",
    category: "Identity",
    status: "coming-soon",
    icon: "identity"
  },
  {
    id: "income-certificate",
    name: "Income Certificate",
    title: "Income Certificate",
    organization: "Revenue & Land Administration Department",
    authority: "Revenue & Land Administration Department",
    description: "Digitally signed state income certificate for academic quotas and welfare eligibility.",
    category: "Certificates",
    status: "coming-soon",
    icon: "document"
  },
  {
    id: "birth-certificate",
    name: "Birth Certificate",
    title: "Birth Certificate",
    organization: "Civil Registration System (CRS)",
    authority: "Civil Registration System (CRS)",
    description: "Official civil registration and digitally verified municipal birth records.",
    category: "Certificates",
    status: "coming-soon",
    icon: "document"
  },
  {
    id: "property",
    name: "Property Registration",
    title: "Property Registration",
    organization: "Department of Registration & Stamps",
    authority: "Department of Registration & Stamps",
    description: "Online deed registration, encumbrance certificate verification, and stamp duty valuation.",
    category: "Certificates",
    status: "coming-soon",
    icon: "folder"
  },
  {
    id: "electricity",
    name: "Electricity Services",
    title: "Electricity Services",
    organization: "State Electricity Distribution Board",
    authority: "State Electricity Distribution Board",
    description: "New electricity connection, load change requests, and solar net metering.",
    category: "Other",
    status: "coming-soon",
    icon: "building"
  },
  {
    id: "water",
    name: "Water Supply Services",
    title: "Water Supply Services",
    organization: "Municipal Corporation & Water Board",
    authority: "Municipal Corporation & Water Board",
    description: "Municipal water connection, meter reading, quality reports, and billing grievances.",
    category: "Other",
    status: "coming-soon",
    icon: "folder"
  }
];

export const allServices = [...availableServices, ...comingSoonServices];
