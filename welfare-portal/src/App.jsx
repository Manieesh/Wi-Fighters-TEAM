import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");
const STORAGE_KEY = "jan-kalyan-demo-applications";

const demoProfile = {
  citizenId: "CITIZEN-1001",
  fullName: "Manieesh Kumar R",
  dateOfBirth: "2004-05-12",
  mobileNumber: "9876543210",
  email: "manieesh@example.com",
  address: "Coimbatore",
  city: "Coimbatore",
  state: "Tamil Nadu",
  pincode: "641001",
  annualIncome: 180000,
  gender: "Male",
  employment: "Student",
  category: "General",
  documents: ["Identity document", "Address proof", "Photograph", "Income certificate"],
};

const demoSchemes = [
  { id: "education-support", name: "Education Support Scheme", department: "Social Welfare", category: "Education", benefit: "Educational financial assistance", eligibility: "Students from eligible low-income households", processingTime: "15–30 working days" },
  { id: "housing-assistance", name: "Housing Assistance", department: "Rural Development", category: "Housing", benefit: "Support for eligible households", eligibility: "Low-income rural or urban households", processingTime: "30–45 working days" },
  { id: "women-empowerment", name: "Women Empowerment Assistance", department: "Women & Child Development", category: "Women & Child", benefit: "Livelihood and skills assistance", eligibility: "Eligible adult women applicants", processingTime: "20–30 working days" },
  { id: "senior-support", name: "Senior Citizen Support", department: "Social Security", category: "Senior Citizens", benefit: "Monthly financial assistance", eligibility: "Citizens aged 60 years and above", processingTime: "15–30 working days" },
  { id: "health-assistance", name: "Family Health Assistance", department: "Health & Family Welfare", category: "Healthcare", benefit: "Support for essential healthcare expenses", eligibility: "Eligible low-income families", processingTime: "15–20 working days" },
  { id: "employment-support", name: "Skill & Employment Support", department: "Employment", category: "Employment", benefit: "Training and placement assistance", eligibility: "Working-age applicants seeking employment", processingTime: "20–40 working days" },
];

const blankForm = {
  name: "", dateOfBirth: "", gender: "", mobileNumber: "", email: "",
  address: "", city: "", state: "", pincode: "", income: "", employment: "", category: "",
  bankAccountStatus: "Verified", schemeName: demoSchemes[0].name,
};

const navItems = [
  ["home", "Home"], ["schemes", "Schemes"], ["eligibility", "Eligibility"],
  ["applications", "Applications"], ["dbt", "DBT Status"], ["notifications", "Notifications"],
  ["department", "Department"],
];

function readStoredApplications() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function App() {
  const citizenId = new URLSearchParams(window.location.search).get("citizenId") || demoProfile.citizenId;
  const [tab, setTab] = useState("home");
  const [schemes, setSchemes] = useState(demoSchemes);
  const [selected, setSelected] = useState(demoSchemes[0]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState(blankForm);
  const [profile, setProfile] = useState(demoProfile);
  const [prefilled, setPrefilled] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [applications, setApplications] = useState(readStoredApplications);
  const [eligibility, setEligibility] = useState(null);
  const [message, setMessage] = useState("");
  const [integrationLog, setIntegrationLog] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(""), 4500); };
  const saveApplications = (items) => {
    setApplications(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const loadApplications = async () => {
    try {
      const data = await getJson(`${API}/welfare/applications/citizen/${encodeURIComponent(citizenId)}`);
      if (Array.isArray(data.applications) && data.applications.length) saveApplications(data.applications);
    } catch { /* Local storage keeps the prototype usable without the backend. */ }
  };

  useEffect(() => {
    getJson(`${API}/welfare/schemes`).then((data) => {
      if (data.schemes?.length) setSchemes(data.schemes);
    }).catch(() => {});
    loadApplications();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("source") === "prometheus" || urlParams.get("autofill") === "true" || urlParams.has("citizenId")) {
      prefill();
    }
  }, []);

  const shownSchemes = useMemo(() => schemes.filter((scheme) => {
    const matchesText = `${scheme.name} ${scheme.department} ${scheme.category} ${scheme.benefit}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (category === "All" || scheme.category === category);
  }), [schemes, query, category]);

  const openScheme = (scheme) => {
    setSelected(scheme);
    updateForm("schemeName", scheme.name);
    setTab("details");
  };

  const prefill = async () => {
    let source = demoProfile;
    let translated = {};
    try {
      const data = await getJson(`${API}/integrate/prefill/welfare/${encodeURIComponent(citizenId)}`);
      source = data.profile || demoProfile;
      translated = data.prefilledData || {};
    } catch { /* The same demo profile is the standalone fallback. */ }
    setProfile(source);
    setForm((current) => ({
      ...current,
      name: translated.name || source.fullName || "",
      dateOfBirth: translated.dateOfBirth || source.dateOfBirth || "",
      mobileNumber: translated.mobileNumber || source.mobileNumber || "",
      email: source.email || "",
      address: translated.address || source.address || "",
      city: source.city || "",
      state: source.state || "",
      pincode: source.pincode || "",
      income: translated.income || source.annualIncome || "",
      gender: source.gender || "",
      employment: source.employment || "",
      category: source.category || "",
      schemeName: selected.name,
    }));
    setPrefilled(true);
    setConsent(false);
    setIntegrationLog([
      "10:42:15  Prometheus → Jan Kalyan  Citizen profile received",
      "10:42:16  Jan Kalyan  Data fields mapped",
      "10:42:17  Consent gate  Awaiting citizen review",
    ]);
    setTab("apply");
  };

  const checkEligibility = async (event) => {
    event.preventDefault();
    const values = { age: Number(event.target.age.value), income: Number(event.target.income.value) };
    try {
      setEligibility(await postJson(`${API}/welfare/eligibility`, values));
    } catch {
      const eligible = values.age >= 18 && values.income <= 500000;
      setEligibility({ eligible, reason: eligible ? "Age and income match the prototype eligibility rules." : "The prototype rules require an adult applicant with income up to ₹5,00,000." });
    }
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!consent) { setShowConsent(true); return; }
    const payload = { ...form, income: Number(form.income), citizenId };
    let created;
    try {
      const response = await fetch(`${API}/welfare/applications`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Application submission failed");
      created = data.application;
    } catch {
      created = {
        ...payload,
        applicationId: `WEL-2026-${String(Date.now()).slice(-5)}`,
        status: "SUBMITTED",
        createdAt: new Date().toISOString(),
      };
    }
    const next = [created, ...applications.filter((item) => item.applicationId !== created.applicationId)];
    saveApplications(next);
    setShowConsent(false);
    setSelectedApplication(created);
    setIntegrationLog((current) => [...current, "10:42:18  Jan Kalyan  Welfare application created"]);
    notify(`Application submitted successfully. Reference: ${created.applicationId}`);
    setTab("applications");
  };

  const updateStatus = async (application, status) => {
    let updated = { ...application, status };
    try {
      const response = await fetch(`${API}/welfare/applications/${application.applicationId}/status`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok && data.application) updated = data.application;
    } catch { /* Keep the department demo functional offline. */ }
    saveApplications(applications.map((item) => item.applicationId === application.applicationId ? updated : item));
    if (selectedApplication?.applicationId === application.applicationId) setSelectedApplication(updated);
    notify(`Application ${application.applicationId} updated to ${status.replaceAll("_", " ")}.`);
  };

  const statusLabel = (status) => (status || "SUBMITTED").replaceAll("_", " ");
  const categories = ["All", ...new Set(schemes.map((scheme) => scheme.category))];

  return (
    <div className="jk-app">
      <div className="prototype-bar">Prototype / Demonstration Portal <span>•</span> Simulated welfare and DBT services only</div>
      <header className="jk-header">
        <button className="brand-button" onClick={() => setTab("home")}><strong>JAN KALYAN</strong><span>National Social Welfare &amp; DBT Mission</span></button>
        <div className="header-tools"><span>Accessibility</span><span>English ▾</span><button className="login-button" onClick={() => notify("Citizen Login is simulated for this prototype.")}>Citizen Login</button></div>
      </header>
      <nav className="jk-nav" aria-label="Main navigation">{navItems.map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</nav>
      {message && <div className="jk-message" role="status">{message}<button onClick={() => setMessage("")}>×</button></div>}

      {tab === "home" && <Home onSchemes={() => setTab("schemes")} onTrack={() => setTab("applications")} onPrefill={prefill} />}

      {tab === "schemes" && <section className="jk-section"><SectionHeading eyebrow="DISCOVER SUPPORT" title="Find welfare schemes" /><div className="filters"><input placeholder="Search schemes..." value={query} onChange={(event) => setQuery(event.target.value)} />{categories.map((item) => <button key={item} className={category === item ? "selected-filter" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="scheme-grid">{shownSchemes.map((scheme) => <article className="scheme-card" key={scheme.id}><span className="eyebrow">{scheme.category}</span><h3>{scheme.name}</h3><p><b>{scheme.department}</b></p><p>{scheme.benefit}</p><small>{scheme.eligibility}</small><button onClick={() => openScheme(scheme)}>View details</button></article>)}</div>{!shownSchemes.length && <Empty text="No schemes match the selected filters." />}</section>}

      {tab === "details" && <section className="jk-section"><span className="eyebrow">PROTOTYPE SCHEME</span><h2>{selected.name}</h2><p className="muted">{selected.department} · {selected.category}</p><div className="detail-grid"><article><h3>Description</h3><p>{selected.eligibility}. This prototype demonstrates scheme discovery, deterministic eligibility checks and DBT-ready application tracking.</p><h3>Benefits</h3><p>{selected.benefit}</p><h3>Application process</h3><p>Review eligibility, provide documents, give consent, and submit your application for department verification.</p></article><article><h3>Required documents</h3><p className="check-list">✓ Identity proof<br />✓ Address proof<br />✓ Bank account<br />✓ Income certificate<br />✓ Photograph</p><h3>Processing time</h3><p>{selected.processingTime}</p><h3>Delivery method</h3><p>DBT to the verified bank account after approval.</p></article></div><button onClick={() => setTab("eligibility")}>Check eligibility</button><button className="outline dark" onClick={prefill}>Apply with Prometheus Profile</button></section>}

      {tab === "eligibility" && <section className="jk-section narrow"><SectionHeading eyebrow="DETERMINISTIC DEMO RULES" title="Eligibility checker" /><p className="muted">This checker uses transparent prototype rules; it does not make AI or official eligibility claims.</p><form onSubmit={checkEligibility} className="checker-form"><label>Age<input name="age" type="number" min="1" required /></label><label>Annual income<input name="income" type="number" min="0" required /></label><label>State<select name="state"><option>Tamil Nadu</option><option>Other state</option></select></label><button>Check eligibility</button></form>{eligibility && <div className={`result ${eligibility.eligible ? "good" : ""}`}><b>{eligibility.eligible ? "Eligible ✓" : "May not be eligible"}</b><span>{eligibility.reason}</span></div>}</section>}

      {tab === "apply" && <section className="jk-section application"><div className="section-title"><SectionHeading eyebrow="JAN KALYAN APPLICATION" title="Welfare scheme application" />{prefilled && <b className="prefilled">Citizen Profile Found ✓</b>}</div>{prefilled && <><div className="integration-callout"><b>Citizen information available from Prometheus</b><span>Prefilled from Citizen Connect. Review and edit before submission.</span></div><div className="mapping">PROMETHEUS CITIZEN PROFILE <i>↓</i> DATA MAPPING ENGINE <i>↓</i> JAN KALYAN SCHEMA</div></>}<form onSubmit={submitApplication} className="application-form"><h3>Personal information</h3><div className="form-grid">{[["name","Name"],["dateOfBirth","Date of birth"],["gender","Gender"],["mobileNumber","Mobile"],["email","Email"],["address","Address"],["city","City"],["state","State"],["pincode","Pincode"],["income","Annual income"],["employment","Employment status"],["category","Category"]].map(([key, label]) => <label key={key}>{label}<input required={["name","dateOfBirth","mobileNumber","address","state","pincode","income"].includes(key)} type={key === "dateOfBirth" ? "date" : key === "income" ? "number" : "text"} value={form[key]} onChange={(event) => updateForm(key, event.target.value)} /></label>)}</div><label>Selected scheme<select value={form.schemeName} onChange={(event) => updateForm("schemeName", event.target.value)}>{schemes.map((scheme) => <option key={scheme.id}>{scheme.name}</option>)}</select></label><div className="consent-box"><b>Consent Required</b><p>Please review the information that will be shared with the Jan Kalyan Welfare Portal.</p><span>Name ✓ · Date of birth ✓ · Address ✓ · Mobile ✓ · Income ✓ · Required documents ✓</span><label className="checkbox-label"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> I have reviewed and grant consent for this prototype application.</label></div><button>Submit application</button></form></section>}

      {tab === "applications" && <Applications applications={applications} onRefresh={loadApplications} onOpen={(application) => { setSelectedApplication(application); setTab("application-detail"); }} />}
      {tab === "application-detail" && <ApplicationDetail application={selectedApplication} onBack={() => setTab("applications")} />}
      {tab === "dbt" && <Dbt applications={applications} />}
      {tab === "notifications" && <Notifications />}
      {tab === "department" && <Department applications={applications} onUpdate={updateStatus} log={integrationLog} />}

      {showConsent && <div className="modal-backdrop"><div className="consent-modal"><span className="eyebrow">CITIZEN VERIFICATION</span><h2>Consent Required</h2><p>Please review the information that will be shared with the Jan Kalyan Welfare Portal.</p><ul><li>Name ✓</li><li>Date of birth ✓</li><li>Address ✓</li><li>Mobile ✓</li><li>Income ✓</li><li>Required documents ✓</li></ul><div><button onClick={() => { setConsent(true); setShowConsent(false); notify("Consent recorded. You can now submit the application."); }}>Grant consent</button><button className="outline dark" onClick={() => setShowConsent(false)}>Cancel</button></div></div></div>}
    </div>
  );
}

function Home({ onSchemes, onTrack, onPrefill }) {
  return <><section className="jk-hero"><div><span className="eyebrow">WELFARE SCHEME DISCOVERY &amp; BENEFIT DELIVERY</span><h1>Access Welfare.<br />Empower Lives.</h1><p>Discover eligible welfare schemes, submit applications, and track benefit delivery through a unified digital platform.</p><button onClick={onSchemes}>Find schemes</button><button className="outline" onClick={onTrack}>Track application</button></div><aside><span className="status-dot">● Connected</span><h3>Prometheus Citizen Connect</h3><p>Use your verified citizen profile to prefill an application, then review and give consent.</p><button onClick={onPrefill}>Apply with Prometheus Profile</button></aside></section><section className="jk-stats">{[["120+","Active schemes"],["24,680+","Applications submitted"],["18,420+","Benefits processed"],["₹12.8 Cr","DBT disbursed"]].map(([number, label]) => <article key={label}><b>{number}</b><span>{label}</span><small>DEMO DATA</small></article>)}</section><section className="jk-section home-lower"><div><span className="eyebrow">ONE PROFILE, MANY SERVICES</span><h2>From citizen consent to benefit delivery</h2><p className="muted">Prometheus shares only the information needed for the selected welfare service. Citizens stay in control at every step.</p></div><div className="security-grid">{["Consent required", "Data minimization", "Secure data transfer", "Citizen verification"].map((item) => <div key={item}>✓ <span>{item}</span></div>)}</div></section></>;
}

function SectionHeading({ eyebrow, title }) { return <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>; }
function Empty({ text }) { return <div className="empty-state">{text}</div>; }

function Applications({ applications, onRefresh, onOpen }) {
  return <section className="jk-section"><div className="section-title"><SectionHeading eyebrow="MY APPLICATIONS" title="Application tracking" /><button className="outline dark" onClick={onRefresh}>Refresh</button></div>{applications.length ? <div className="application-table"><div className="table-head"><span>Application ID</span><span>Scheme</span><span>Submitted date</span><span>Status</span><span>Action</span></div>{applications.map((application) => <div className="table-row" key={application.applicationId}><b>{application.applicationId}</b><span>{application.schemeName || "Jan Kalyan Welfare Scheme"}</span><span>{new Date(application.createdAt || Date.now()).toLocaleDateString("en-IN")}</span><em className={`badge ${String(application.status).toLowerCase()}`}>{String(application.status || "SUBMITTED").replaceAll("_", " ")}</em><button className="link-button" onClick={() => onOpen(application)}>View</button></div>)}</div> : <Empty text="No welfare applications yet. Select a scheme and apply to begin." />}</section>;
}

function ApplicationDetail({ application, onBack }) {
  if (!application) return <section className="jk-section"><Empty text="Select an application from My Applications." /></section>;
  const stages = ["Application submitted", "Documents validated", "Eligibility verified", "Department processing", "Benefit approved", "DBT initiated", "Benefit delivered"];
  const current = ["SUBMITTED", "UNDER_VERIFICATION", "PROCESSING", "APPROVED", "DBT_INITIATED", "COMPLETED"].indexOf(application.status);
  return <section className="jk-section"><button className="back-button" onClick={onBack}>← Back to applications</button><span className="eyebrow">APPLICATION DETAIL</span><h2>{application.applicationId}</h2><div className="detail-summary"><div><span>Scheme</span><b>{application.schemeName}</b></div><div><span>Applicant</span><b>{application.name}</b></div><div><span>Status</span><b>{String(application.status).replaceAll("_", " ")}</b></div></div><div className="timeline">{stages.map((stage, index) => <div className={index < current + 1 ? "done" : index === current + 1 ? "current" : ""} key={stage}><i>{index < current + 1 ? "✓" : index === current + 1 ? "●" : "○"}</i><span>{stage}</span></div>)}</div></section>;
}

function Dbt({ applications }) {
  return <section className="jk-section"><SectionHeading eyebrow="SIMULATED PAYMENT SERVICE" title="DBT status" /><p className="muted">All payment information below is demo/simulated data and does not represent a real transaction.</p>{applications.length ? <div className="dbt-grid">{applications.map((application) => <article className="dbt-card" key={application.applicationId}><span className="eyebrow">BENEFIT DELIVERY</span><h3>{application.schemeName}</h3><p>Beneficiary: <b>{application.name || "Manieesh Kumar R"}</b></p><p>Application ID: <b>{application.applicationId}</b></p><strong>₹15,000</strong><em>{["APPROVED", "DBT_INITIATED", "COMPLETED"].includes(application.status) ? "TRANSFER INITIATED" : "PENDING"}</em><small>Transaction ID: DBT-DEMO-{application.applicationId}</small></article>)}</div> : <Empty text="No DBT record available until an application has been submitted." />}</section>;
}

function Notifications() {
  return <section className="jk-section"><SectionHeading eyebrow="SERVICE UPDATES" title="Notifications" /><div className="notification-list">{["Application submitted successfully.", "Documents verified.", "Your application is under department review.", "Prototype DBT payment record is available."].map((text, index) => <article className="notice" key={text}><b>{index < 2 ? "✓" : "●"}</b><span><strong>{text}</strong><small>Jan Kalyan · 22 Sep 2026</small></span><em>{index < 2 ? "Read" : "Unread"}</em></article>)}</div></section>;
}

function Department({ applications, onUpdate, log }) {
  return <section className="jk-section"><SectionHeading eyebrow="OFFICER WORKSPACE" title="Jan Kalyan Department Portal" /><p className="prototype-copy">Prototype officer workspace. Status changes update the connected citizen tracking record.</p><div className="department-cards">{[["New applications", applications.filter((a) => a.status === "SUBMITTED").length], ["Under verification", applications.filter((a) => a.status === "UNDER_VERIFICATION").length], ["Approved", applications.filter((a) => a.status === "APPROVED").length], ["DBT pending", applications.filter((a) => a.status === "DBT_INITIATED").length]].map(([label, value]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div>{applications.length ? <div className="department-list">{applications.map((application) => <article key={application.applicationId}><div><b>{application.applicationId}</b><span>{application.name || "Citizen"} · {application.schemeName}</span></div><select value={application.status} onChange={(event) => onUpdate(application, event.target.value)}>{["SUBMITTED", "UNDER_VERIFICATION", "PROCESSING", "APPROVED", "REJECTED", "DBT_INITIATED", "COMPLETED"].map((status) => <option key={status}>{status}</option>)}</select></article>)}</div> : <Empty text="No applications available for department review." />}<div className="monitor"><div><span className="status-dot">● Connected</span><h3>Prometheus integration monitor</h3></div><div className="monitor-states"><span>Citizen data <b>● Received</b></span><span>Data translation <b>● Completed</b></span><span>Consent <b>● Verified</b></span><span>Welfare portal <b>● Connected</b></span></div><small>{(log.length ? log : ["10:42:15  Prometheus → Jan Kalyan  Citizen profile received", "10:42:16  Jan Kalyan  Data fields mapped", "10:42:17  Consent verified"]).map((item) => <span key={item}>{item}</span>)}</small></div></section>;
}
