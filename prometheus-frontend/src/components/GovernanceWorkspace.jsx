import { useMemo, useState } from "react";
import UiIcon from "./UiIcon";

const categories = [
  "Roads",
  "Drinking Water",
  "Electricity",
  "Healthcare",
  "Education",
  "Public Transport",
  "Sanitation",
  "Drainage",
  "Waste Management",
  "Housing",
  "Internet Connectivity",
  "Agriculture",
  "Public Safety",
  "Other"
];

const workflow = [
  "Submitted",
  "AI Processing",
  "Verified",
  "Assigned",
  "Under Review",
  "Project Proposed",
  "Project Approved",
  "In Progress",
  "Completed"
];

export const seedRequests = [
  {
    id: "REQ-1001",
    category: "Drinking Water",
    description: "Our village needs a reliable drinking water pipeline.",
    language: "Tamil",
    location: "Coimbatore District",
    status: "Under Review",
    severity: "High",
    similar: 2843,
    date: "18 Sep 2026"
  },
  {
    id: "REQ-1002",
    category: "Roads",
    description: "The main access road has deep potholes after the monsoon.",
    language: "English",
    location: "Madurai District",
    status: "In Progress",
    severity: "Medium",
    similar: 1189,
    date: "12 Sep 2026"
  },
  {
    id: "REQ-1003",
    category: "Healthcare",
    description: "The nearest primary health centre is more than 20 km away.",
    language: "Hindi",
    location: "Bhopal District",
    status: "Completed",
    severity: "High",
    similar: 756,
    date: "04 Sep 2026"
  }
];

const projects = [
  { id: "PRJ-204", name: "Rural Water Supply Improvement", category: "Drinking Water", location: "Coimbatore District", status: "In Progress", progress: 68, budget: "₹18.4 Cr", beneficiaries: "91,200" },
  { id: "PRJ-198", name: "Last-mile Road Restoration", category: "Roads", location: "Madurai District", status: "Approved", progress: 32, budget: "₹9.8 Cr", beneficiaries: "54,600" },
  { id: "PRJ-176", name: "Mobile Primary Health Unit", category: "Healthcare", location: "Bhopal District", status: "Completed", progress: 100, budget: "₹4.2 Cr", beneficiaries: "26,300" }
];

const hotspots = [
  { id: "HS-007", name: "Coimbatore District", category: "Drinking Water", requests: "2,843", population: "91,200", trend: "+24%", level: "Very high", x: 62, y: 60 },
  { id: "HS-004", name: "Madurai District", category: "Roads", requests: "1,189", population: "54,600", trend: "+12%", level: "High", x: 44, y: 71 },
  { id: "HS-011", name: "Bhopal District", category: "Healthcare", requests: "756", population: "26,300", trend: "+8%", level: "Medium", x: 72, y: 25 }
];

const formatDate = () => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());

function StatCard({ value, label, tone = "blue" }) {
  return <div className={`gov-stat-card ${tone}`}><strong>{value}</strong><span>{label}</span></div>;
}

function PageHeader({ eyebrow, title, children }) {
  return <div className="gov-page-header"><div><span className="gov-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}

function RequestForm({ onSubmitted }) {
  const [form, setForm] = useState({ category: "Drinking Water", description: "", language: "Tamil", location: "Coimbatore District", district: "Coimbatore", state: "Tamil Nadu", anonymous: false });
  const [recording, setRecording] = useState(false);
  const [locating, setLocating] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const useLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { update("location", `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };
  const speak = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      update("description", "Drinking water facilities are insufficient in our area.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = form.language === "Tamil" ? "ta-IN" : form.language === "Hindi" ? "hi-IN" : "en-IN";
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onresult = (event) => update("description", event.results[0][0].transcript);
    recognition.start();
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.description.trim()) return;
    const request = { ...form, id: `REQ-${Math.floor(1000 + Math.random() * 8999)}`, status: "AI Processing", severity: form.category === "Drinking Water" ? "High" : "Medium", similar: form.category === "Drinking Water" ? 2843 : 328, date: formatDate() };
    setSubmitted(request);
    onSubmitted(request);
  };

  if (submitted) return <div className="submission-receipt"><div className="receipt-icon"><UiIcon name="check" size={18} /></div><span className="gov-eyebrow">REQUEST RECEIVED</span><h3>{submitted.id}</h3><p>Your development request is now moving through AI analysis. Keep this ID to track progress.</p><div className="receipt-grid"><span>Category<strong>{submitted.category}</strong></span><span>Location<strong>{submitted.location}</strong></span><span>Detected language<strong>{submitted.language}</strong></span><span>Current status<strong>{submitted.status}</strong></span></div><button className="gov-btn secondary" onClick={() => setSubmitted(null)}>Raise another request</button></div>;

  return <form className="request-form" onSubmit={submit}>
    <div className="voice-banner"><div><span className="gov-eyebrow">MULTILINGUAL INPUT</span><strong>Speak your problem in your language</strong><p>English, Tamil and Hindi are supported in this prototype.</p></div><button type="button" className={`voice-btn ${recording ? "recording" : ""}`} onClick={speak}><UiIcon name="mic" size={14} /> {recording ? "Listening..." : "Speak Your Problem"}</button></div>
    <div className="form-grid">
      <label>Problem category<select value={form.category} onChange={(e) => update("category", e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Language<select value={form.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>Tamil</option><option>Hindi</option></select></label>
      <label className="span-2">Describe the problem<textarea rows="5" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell the administration what needs to improve..." required /></label>
      <label>District<input value={form.district} onChange={(e) => update("district", e.target.value)} /></label>
      <label>State / Province<input value={form.state} onChange={(e) => update("state", e.target.value)} /></label>
      <label className="span-2">Location<div className="location-input"><input value={form.location} onChange={(e) => update("location", e.target.value)} /><button type="button" onClick={useLocation}>{locating ? "Locating..." : "Use My Current Location"}</button></div></label>
      <label className="upload-field">Optional image or video<input type="file" accept="image/*,video/*" /></label>
      <label>Contact information<input placeholder="Mobile or email (optional)" /></label>
    </div>
    <label className="checkbox-row"><input type="checkbox" checked={form.anonymous} onChange={(e) => update("anonymous", e.target.checked)} /> Submit anonymously. Public analytics will only show aggregated information.</label>
    <div className="form-actions"><span>AI will classify, cluster and prioritize your request after submission.</span><button className="gov-btn primary" type="submit">Submit Development Request <UiIcon name="arrowRight" size={14} /></button></div>
  </form>;
}

function AnalysisPanel({ request }) {
  return <div className="analysis-panel"><div className="analysis-header"><div><span className="gov-eyebrow">AI REQUEST ANALYSIS</span><h3>Evidence, not an unquestionable decision</h3></div><span className="demo-badge">DEMO DATA</span></div><div className="analysis-grid"><span>Detected language<strong>{request?.language || "Tamil"}</strong></span><span>Category<strong>{request?.category || "Water Infrastructure"}</strong></span><span>Severity<strong className="high-text">{request?.severity || "High"}</strong></span><span>Urgency<strong className="high-text">High</strong></span><span>Location<strong>{request?.location || "Coimbatore District"}</strong></span><span>Similar requests<strong>{(request?.similar || 2843).toLocaleString("en-IN")}</strong></span></div><div className="translation-box"><span>Translated request</span><p>{request?.description || "Drinking water facilities are insufficient in our area."}</p></div><div className="priority-reason"><strong>Why this signal is high priority</strong><p>High request concentration, an identified water-service gap, and an increasing demand trend are contributing factors. Officers can review every factor before action.</p><div className="factor-row"><span>Citizen demand<b>92/100</b></span><span>Affected population<b>88/100</b></span><span>Infrastructure gap<b>94/100</b></span><span>Urgency<b>86/100</b></span></div></div></div>;
}

function RequestsPage({ requests, onSubmitted }) {
  const [selected, setSelected] = useState(requests[0]);
  return <div className="gov-page"><PageHeader eyebrow="CITIZEN DEVELOPMENT" title="Raise a Development Request"><span className="privacy-note"><UiIcon name="lock" size={13} /> Your personal data stays protected</span></PageHeader><div className="request-layout"><RequestForm onSubmitted={(request) => { onSubmitted(request); setSelected(request); }} /><AnalysisPanel request={selected} /></div></div>;
}

function MyRequests({ requests }) {
  return <div className="gov-page"><PageHeader eyebrow="CITIZEN DEVELOPMENT" title="My Requests"><button className="gov-btn secondary">Download activity</button></PageHeader><div className="request-list">{requests.map((request) => <div className="request-row" key={request.id}><div className="request-id">{request.id}<small>{request.date}</small></div><div><strong>{request.category}</strong><p>{request.description}</p></div><span className={`status-chip ${request.status.toLowerCase().replaceAll(" ", "-")}`}>{request.status}</span><span className={`severity-dot ${request.severity.toLowerCase()}`}>{request.severity}</span></div>)}</div><div className="timeline-card"><span className="gov-eyebrow">SELECTED REQUEST TIMELINE</span><h3>{requests[0]?.id || "REQ-1001"} · {requests[0]?.category}</h3><div className="request-timeline">{workflow.map((step, index) => <div className={`timeline-step ${index <= 4 ? "done" : ""}`} key={step}><span>{index <= 4 ? <UiIcon name="checkMark" size={12} /> : index + 1}</span><small>{step}</small></div>)}</div></div></div>;
}

function MapPage() {
  const [active, setActive] = useState(hotspots[0]);
  return <div className="gov-page"><PageHeader eyebrow="DEVELOPMENT INTELLIGENCE" title="GIS Demand Map"><div className="map-filters"><select><option>All categories</option>{categories.slice(0, 7).map((category) => <option key={category}>{category}</option>)}</select><select><option>India · Tamil Nadu</option><option>India · Madhya Pradesh</option></select></div></PageHeader><div className="map-layout"><div className="demand-map"><div className="map-grid-lines" /><div className="map-label">INDIA · DEMO HOTSPOT LAYER</div>{hotspots.map((hotspot) => <button key={hotspot.id} className={`map-hotspot ${active.id === hotspot.id ? "active" : ""}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} onClick={() => setActive(hotspot)}><span>{hotspot.requests}</span></button>)}<div className="map-legend"><span><i className="legend-red" /> Very high demand</span><span><i className="legend-orange" /> High demand</span><span><i className="legend-yellow" /> Medium demand</span></div></div><div className="hotspot-panel"><span className="gov-eyebrow">DEVELOPMENT HOTSPOT</span><h3>{active.id}</h3><p className="hotspot-location"><UiIcon name="pin" size={13} /> {active.name}</p><div className="hotspot-main"><strong>{active.requests}</strong><span>citizen requests</span></div><div className="hotspot-details"><span>Affected population<strong>{active.population}</strong></span><span>Main category<strong>{active.category}</strong></span><span>Demand trend<strong className="high-text">{active.trend}</strong></span><span>Infrastructure gap<strong className="high-text">{active.level}</strong></span></div><button className="gov-btn primary">View detailed analysis</button></div></div></div>;
}

function DashboardPage({ onNavigate }) {
  const demand = [{ label: "Water infrastructure", value: 32430, color: "#22c55e" }, { label: "Road infrastructure", value: 28190, color: "#3b82f6" }, { label: "Healthcare", value: 21430, color: "#f59e0b" }, { label: "Education", value: 17230, color: "#a78bfa" }, { label: "Public transport", value: 12890, color: "#f97316" }];
  return <div className="gov-page"><PageHeader eyebrow="GOVERNANCE INTELLIGENCE" title="Governance Dashboard"><span className="demo-badge">AGGREGATED · DEMO DATA</span></PageHeader><div className="stats-grid"><StatCard value="128,430" label="Total citizen requests" /><StatCard value="42" label="High-demand areas" tone="amber" /><StatCard value="2,183" label="Active projects" tone="green" /><StatCard value="1,492" label="Completed projects" tone="purple" /><StatCard value="4.8M" label="Affected citizens" tone="blue" /><StatCard value="318" label="Infrastructure gaps" tone="red" /></div><div className="dashboard-grid"><div className="dashboard-card"><div className="card-heading"><div><span className="gov-eyebrow">TOP DEVELOPMENT DEMANDS</span><h3>What citizens need most</h3></div><button className="text-btn" onClick={() => onNavigate("map")}>Open map &rarr;</button></div>{demand.map((item) => <div className="demand-bar-row" key={item.label}><div><span>{item.label}</span><strong>{item.value.toLocaleString("en-IN")}</strong></div><div className="bar-track"><i style={{ width: `${(item.value / 32430) * 100}%`, background: item.color }} /></div></div>)}</div><div className="dashboard-card"><div className="card-heading"><div><span className="gov-eyebrow">PROJECT STATUS</span><h3>Portfolio overview</h3></div></div><div className="donut"><div><strong>2,183</strong><span>active projects</span></div></div><div className="status-summary"><span><i className="dot green" /> Completed <b>1,492</b></span><span><i className="dot blue" /> In progress <b>1,126</b></span><span><i className="dot amber" /> Under review <b>684</b></span></div></div></div><div className="data-fusion-strip"><span>Citizen voice</span><b>+</b><span>Demographics</span><b>+</b><span>Infrastructure</span><b>+</b><span>Projects & investment</span><b>&rarr;</b><strong>Governance intelligence</strong></div></div>;
}

function ProjectsPage() {
  return <div className="gov-page"><PageHeader eyebrow="PROJECT DELIVERY" title="Government Project Tracker"><button className="gov-btn primary">+ Create project</button></PageHeader><div className="project-grid">{projects.map((project) => <div className="project-card" key={project.id}><div className="project-top"><span className="project-id">{project.id}</span><span className={`status-chip ${project.status.toLowerCase().replaceAll(" ", "-")}`}>{project.status}</span></div><h3>{project.name}</h3><p><UiIcon name="pin" size={13} /> {project.location} · {project.category}</p><div className="project-metrics"><span>Budget<strong>{project.budget}</strong></span><span>Beneficiaries<strong>{project.beneficiaries}</strong></span></div><div className="progress-label"><span>Delivery progress</span><strong>{project.progress}%</strong></div><div className="bar-track"><i style={{ width: `${project.progress}%` }} /></div><button className="text-btn">View project details &rarr;</button></div>)}</div><div className="impact-preview"><div><span className="gov-eyebrow">IMPACT MEASUREMENT</span><h3>Rural Water Supply Improvement</h3><p>Citizen feedback is connected to delivery outcomes so investment can be measured after completion.</p></div><div className="before-after"><span><small>Requests before</small><strong>2,843</strong></span><b>&rarr;</b><span><small>Requests after</small><strong className="green-text">421</strong></span></div></div></div>;
}

function ImpactPage() {
  return <div className="gov-page"><PageHeader eyebrow="CITIZEN FEEDBACK LOOP" title="Project Impact"><span className="demo-badge">AGGREGATED · DEMO DATA</span></PageHeader><div className="impact-hero"><div><span className="gov-eyebrow">PROJECT COMPLETED</span><h3>Rural Water Supply Improvement</h3><p>Coimbatore District · 91,200 beneficiaries</p></div><div className="impact-score"><strong>89%</strong><span>service availability after</span></div></div><div className="impact-grid"><div className="impact-card"><span>Citizen requests</span><div><strong>2,843</strong><b>&rarr;</b><strong className="green-text">421</strong></div><small>85% decrease after completion</small></div><div className="impact-card"><span>Service availability</span><div><strong>42%</strong><b>&rarr;</b><strong className="green-text">89%</strong></div><small>47 percentage point improvement</small></div><div className="impact-card"><span>Citizen satisfaction</span><div><strong>N/A</strong><b>&rarr;</b><strong className="green-text">4.4/5</strong></div><small>1,208 verified responses</small></div></div><div className="feedback-card"><div><span className="gov-eyebrow">YOUR VOICE MATTERS</span><h3>Was your problem resolved?</h3><p>Eligible citizens can rate the completed project and report any remaining issue.</p></div><div className="feedback-actions"><button className="gov-btn primary">Yes, resolved</button><button className="gov-btn secondary">Partially</button><button className="gov-btn secondary">No, still an issue</button></div></div></div>;
}

export default function GovernanceWorkspace({ page = "request", requests, onSubmitted, onNavigate }) {
  const content = useMemo(() => {
    if (page === "dashboard") return <DashboardPage onNavigate={onNavigate} />;
    if (page === "map") return <MapPage />;
    if (page === "requests") return <MyRequests requests={requests} />;
    if (page === "projects") return <ProjectsPage />;
    if (page === "impact") return <ImpactPage />;
    return <RequestsPage requests={requests} onSubmitted={onSubmitted} />;
  }, [page, requests, onSubmitted, onNavigate]);
  return content;
}
