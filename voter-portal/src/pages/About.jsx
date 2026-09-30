import Breadcrumbs from '../components/Breadcrumbs'

function About() {
  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'About CivicConnect' }]} />
      <div className="container simple-page">
        <span className="section-kicker">About CivicConnect</span>
        <h1>Unified Digital Services</h1>
        <div className="info-list">
          <div className="info-card"><h3>Our Mission</h3><p>Build a connected digital experience that makes public services accessible, transparent, and user-friendly.</p></div>
          <div className="info-card"><h3>Citizen First</h3><p>We aim to simplify service access and reduce delays through clear process visibility and digital support.</p></div>
          <div className="info-card"><h3>Prototype Note</h3><p>This is a mock SIH demo website created for concept presentation and UI design exploration.</p></div>
        </div>
        <div className="architecture-flow"><span>Citizen</span><b>↓</b><span>CivicConnect</span><b>↓</b><span>Interoperability Layer</span><b>↓</b><span>Multiple Government Services</span></div>
        <div className="feature-list"><h2>Key Features</h2><p>Unified Services · Consent-Based Data Sharing · Application Tracking · API-Based Integration · Notifications · Grievance Management</p></div>
        <div className="prototype-note"><strong>SIH Prototype / Demonstration</strong><span>Not an official government website</span></div>
      </div>
    </main>
  )
}

export default About
