import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrometheusImport from './PrometheusImport'

const initialForm = {
  name: '',
  dob: '',
  gender: '',
  address: '',
  state: '',
  district: '',
  constituency: '',
  mobile: '',
}

const prometheusData = {
  name: 'Demo Citizen',
  dob: '15/08/2000',
  gender: 'Female',
  address: 'Demo Address, Sector 12',
  state: 'Tamil Nadu',
  district: 'Coimbatore',
  constituency: 'Coimbatore',
  mobile: '9876543210',
}

const fieldLabels = {
  name: 'Name',
  dob: 'Date of Birth',
  gender: 'Gender',
  address: 'Address',
  state: 'State',
  district: 'District',
  constituency: 'Constituency',
  mobile: 'Mobile Number',
}

function VoterRegistrationForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    Object.entries(fieldLabels).forEach(([key, label]) => {
      if (!formData[key].trim()) {
        nextErrors[key] = `${label} is required.`
      }
    })

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      nextErrors.mobile = 'Mobile number should contain 10 digits.'
    }

    return nextErrors
  }

  const handleFetch = () => {
    setLoading(true)
    setSuccess(false)

    setTimeout(() => {
      setFormData({ ...prometheusData })
      setLoading(false)
      setSuccess(true)
      setErrors({})
    }, 1400)
  }

  const handleContinue = (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    navigate('/voter/consent', { state: { formData } })
  }

  return (
    <section className="voter-shell">
      <div className="container voter-layout">
        <div className="voter-form-card">
          <div className="section-heading left compact-heading">
            <span className="section-kicker">Citizen Registration</span>
            <h2>New Voter Registration</h2>
          </div>

          <form className="gov-form" onSubmit={handleContinue} noValidate>
            <div className="form-grid">
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div className="form-field" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    name={key}
                    type={key === 'dob' ? 'text' : 'text'}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={key === 'mobile' ? '9876543210' : `Enter ${label.toLowerCase()}`}
                  />
                  {errors[key] && <span className="error-text">{errors[key]}</span>}
                </div>
              ))}
            </div>

            <div className="button-row">
              <button type="button" className="primary-btn" onClick={handleFetch}>
                Fetch from Prometheus
              </button>
              <button type="submit" className="secondary-btn dark-btn">
                Continue
              </button>
            </div>
          </form>
        </div>

        <PrometheusImport
          loading={loading}
          success={success}
          receivedFields={Object.keys(prometheusData).map((key) => fieldLabels[key])}
        />
      </div>
    </section>
  )
}

export default VoterRegistrationForm
