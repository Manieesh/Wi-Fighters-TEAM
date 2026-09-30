import { useState } from 'react'
import { Check, Search } from 'lucide-react'
import Breadcrumbs from './Breadcrumbs'

const steps = ['Application Submitted', 'Document Verification', 'Department Processing', 'Approved', 'Service Completed']

function ApplicationTracker() {
  const [applicationId, setApplicationId] = useState('')
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Approved')

  const handleSearch = (event) => {
    event.preventDefault()
    if (!applicationId.trim()) {
      setError('Enter an application ID to continue.')
      setSearched(false)
      return
    }

    setError('')
    setSearched(true)
  }

  return (
    <section className="tracker-section page-shell">
      <Breadcrumbs items={[{ label: 'Track Application' }]} />
      <div className="container tracker-wrap">
        <div className="section-heading left">
          <span className="section-kicker">Track Progress</span>
          <h2>Track Application</h2>
          <p className="page-intro">Enter the demo application ID VC-2026-483921 or any reference to view mock progress.</p>
        </div>

        <div className="tracker-box">
          <form className="tracker-search" onSubmit={handleSearch}>
            <label htmlFor="applicationId">Application ID</label>
            <div className="tracker-input-row">
              <input
                id="applicationId"
                type="text"
                value={applicationId}
                onChange={(event) => setApplicationId(event.target.value)}
                placeholder="VC-2026-483921"
              />
              <button type="submit" className="primary-btn">
                <Search size={15} />
                Track Application
              </button>
            </div>
            {error && <span className="error-text">{error}</span>}
          </form>

          {searched && (
            <div className="tracking-result" aria-live="polite">
              <div className="application-meta-grid">
                <div><span>Application ID</span><strong>{applicationId.toUpperCase()}</strong></div>
                <div><span>Service</span><strong>Voter Registration</strong></div>
                <div><span>Submitted Date</span><strong>12 September 2026</strong></div>
                <div><span>Last Updated</span><strong>12 September 2026</strong></div>
              </div>
              <div className="status-select-row"><label htmlFor="demo-status">Demo status</label><select id="demo-status" value={status} onChange={(event) => setStatus(event.target.value)}><option>Submitted</option><option>Under Verification</option><option>Approved</option><option>Rejected</option></select></div>
              <div className="progress-track detailed-progress">
                {steps.map((step, index) => <div key={step} className="progress-step"><div className="step-dot-wrap"><span className="step-dot complete"><Check size={12} /></span>{index < steps.length - 1 && <span className="step-line" />}</div><span className="step-label">{step}</span></div>)}
              </div>
              <p className="current-status">Current Status: <strong>{status}</strong></p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ApplicationTracker
