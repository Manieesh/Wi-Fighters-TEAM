import { Check, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const consentFields = [
  { label: 'Name', value: true },
  { label: 'Date of Birth', value: true },
  { label: 'Address', value: true },
  { label: 'Gender', value: true },
  { label: 'Mobile Number', value: true },
]

function ConsentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const formData = location.state?.formData || {}
  const [denied, setDenied] = useState(false)

  const handleAllow = () => {
    navigate('/voter/submit', { state: { formData } })
  }

  const handleDeny = () => {
    setDenied(true)
  }

  return (
    <section className="voter-shell">
      <div className="container consent-card-wrap">
        <div className="consent-card">
          <span className="section-kicker">Consent</span>
          <h2>Consent for Data Sharing</h2>
          <p className="consent-text">The following information has been requested by the Voter Service.</p>

          {!denied ? (
            <>
              <div className="consent-table">
                <div className="consent-row header-row">
                  <span>Field</span>
                  <span>Access</span>
                </div>

                {consentFields.map((item) => (
                  <div key={item.label} className="consent-row">
                    <span>{item.label}</span>
                    <span className="access-check"><Check size={15} /></span>
                  </div>
                ))}
              </div>

              <div className="button-row">
                <button type="button" className="primary-btn" onClick={handleAllow}>Allow Access</button>
                <button type="button" className="secondary-btn dark-btn" onClick={handleDeny}>Deny Access</button>
              </div>
            </>
          ) : (
            <div className="denied-message">
              <ShieldAlert size={28} />
              <p>Data sharing was denied.</p>
              <button type="button" className="primary-btn" onClick={() => navigate('/voter')}>
                Return to Voter Services
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ConsentPage
