import { useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'

function Grievance() {
  const [submitted, setSubmitted] = useState(false)
  const [grievanceId, setGrievanceId] = useState('')
  const [form, setForm] = useState({ name: '', mobile: '', applicationId: '', category: 'Service Issue', description: '' })

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = (event) => {
    event.preventDefault()
    setGrievanceId(`GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`)
    setSubmitted(true)
  }

  return <main className="page-shell">
    <Breadcrumbs items={[{ label: 'Grievance & Complaints' }]} />
    <div className="container simple-page form-page">
      <span className="section-kicker">Citizen Support</span>
      <h1>Grievance & Complaints</h1>
      {!submitted ? <form className="gov-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field"><label htmlFor="grievance-name">Name</label><input id="grievance-name" name="name" required value={form.name} onChange={updateField} /></div>
          <div className="form-field"><label htmlFor="grievance-mobile">Mobile Number</label><input id="grievance-mobile" name="mobile" required value={form.mobile} onChange={updateField} /></div>
          <div className="form-field"><label htmlFor="grievance-application">Application ID</label><input id="grievance-application" name="applicationId" value={form.applicationId} onChange={updateField} placeholder="Optional" /></div>
          <div className="form-field"><label htmlFor="grievance-category">Category</label><select id="grievance-category" name="category" value={form.category} onChange={updateField}><option>Service Issue</option><option>Application Delay</option><option>Data Issue</option><option>Technical Issue</option><option>Other</option></select></div>
          <div className="form-field full-width"><label htmlFor="grievance-description">Description</label><textarea id="grievance-description" name="description" required rows="6" value={form.description} onChange={updateField} /></div>
        </div>
        <button type="submit" className="primary-btn">Submit Grievance</button>
      </form> : <div className="submission-success"><h3>Grievance Submitted Successfully</h3><p>Your demo grievance ID is:</p><strong>{grievanceId}</strong></div>}
    </div>
  </main>
}

export default Grievance
