import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function ApplicationReview() {
  const location = useLocation()
  const navigate = useNavigate()
  const formData = location.state?.formData || {}
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState('')

  const handleSubmit = () => {
    const hasValidData = Object.values(formData).every((value) => String(value).trim() !== '')

    if (!hasValidData) {
      navigate('/voter/register')
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      const randomId = `VC-2026-${Math.floor(100000 + Math.random() * 900000)}`
      setApplicationId(randomId)
      setSubmitting(false)
      setSuccess(true)
    }, 1500)
  }

  return (
    <section className="voter-shell">
      <div className="container review-card-wrap">
        <div className="review-card">
          <span className="section-kicker">Application</span>
          <h2>Review Application</h2>

          {!success ? (
            <>
              <div className="review-grid">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="detail-card">
                    <span>{key.toUpperCase().replace(/_/g, ' ')}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="button-row">
                <button type="button" className="primary-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting application...' : 'Submit Application'}
                </button>
              </div>
            </>
          ) : (
            <div className="submission-success">
              <h3>Application Submitted Successfully</h3>
              <p>Application ID:</p>
              <strong>{applicationId}</strong>

              <div className="button-row center-actions">
                <button type="button" className="primary-btn" onClick={() => navigate('/track')}>
                  Track Application
                </button>
                <button type="button" className="secondary-btn dark-btn" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ApplicationReview
