import { useEffect, useState } from 'react'
import { CheckCircle2, FileText, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");
const initialForm = { fullName: '', dateOfBirth: '', gender: 'Male', address: '', district: '', state: '', constituency: '', mobile: '' }
const fieldLabels = { fullName: 'Full name', dateOfBirth: 'Date of birth', gender: 'Gender', address: 'Residential address', district: 'District', state: 'State', constituency: 'Assembly constituency', mobile: 'Mobile number' }

export default function VoterRegistrationForm({ mobileNumber, onSubmit }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const citizenId = searchParams.get('citizenId') || 'CITIZEN-1001'
  const fromPrometheus = searchParams.get('source') === 'prometheus' || searchParams.has('citizenId')
  const [formData, setFormData] = useState({ ...initialForm, mobile: mobileNumber || '' })
  const [prefillLoaded, setPrefillLoaded] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serviceError, setServiceError] = useState('')

  useEffect(() => {
    const loadPrefill = async () => {
      if (!fromPrometheus) return
      try {
        const response = await fetch(`${API_BASE}/integrate/prefill/voter/${encodeURIComponent(citizenId)}`)
        const data = await response.json()
        if (!data.success || !data.prefilledData) throw new Error(data.message)
        const profile = data.prefilledData
        setFormData((current) => ({ ...current, fullName: profile.name || '', dateOfBirth: profile.dob || '', gender: profile.gender || 'Male', address: profile.address || '', district: profile.district || '', state: profile.state || '', constituency: profile.constituency || '', mobile: profile.mobile || '' }))
        setPrefillLoaded(true)
      } catch (error) {
        setServiceError('Prometheus data could not be loaded. You can complete this form manually.')
      }
    }
    loadPrefill()
  }, [citizenId, fromPrometheus])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    Object.entries(fieldLabels).forEach(([key, label]) => { if (!String(formData[key]).trim()) nextErrors[key] = `${label} is required.` })
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) nextErrors.mobile = 'Enter a valid 10-digit mobile number.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setServiceError('')
    try {
      const response = await fetch(`${API_BASE}/voter/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.fullName, dob: formData.dateOfBirth, address: formData.address, mobile: formData.mobile, citizenId }) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Application submission failed.')
      onSubmit(formData, result.application.applicationId)
      navigate('/voter/confirmation')
    } catch (error) {
      setServiceError(error.message || 'Application submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const input = (name, label, type = 'text', extra = {}) => <label className={`voter-registration-field ${extra.full ? 'full' : ''}`}><span>{label}<b aria-hidden="true">*</b></span><input type={type} name={name} value={formData[name]} onChange={updateField} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...extra} />{errors[name] && <small id={`${name}-error`} className="field-error">{errors[name]}</small>}</label>

  return <main className="voter-registration-page">
    <section className="registration-heading"><div className="container"><span className="service-label">FORM 6 · ELECTORAL ROLL REGISTRATION</span><h1>Register as a new voter</h1><p>Apply to enrol in the electoral roll. Review your details carefully before submitting.</p></div></section>
    <section className="container registration-layout">
      <form className="registration-card" onSubmit={submit} noValidate>
        <div className="registration-card-title"><div><h2>Applicant details</h2><p>Fields marked <b>*</b> are required.</p></div><span className="step-chip">Step 1 of 2</span></div>
        {prefillLoaded && <div className="prometheus-prefill-notice"><ShieldCheck size={22} /><div><strong>CONNECTED VIA PROMETHEUS · PROFILE PRE-FILLED</strong><span>Verified profile data for {citizenId} has been received. You may review and edit it before submission.</span></div><CheckCircle2 size={20} /></div>}
        {serviceError && <div className="registration-alert" role="alert">{serviceError}</div>}
        <div className="registration-grid">
          {input('fullName', 'Full name', 'text', { autoComplete: 'name', full: true })}
          {input('dateOfBirth', 'Date of birth', 'date')}
          <label className="voter-registration-field"><span>Gender<b aria-hidden="true">*</b></span><select name="gender" value={formData.gender} onChange={updateField}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select>{errors.gender && <small className="field-error">{errors.gender}</small>}</label>
          {input('address', 'Residential address', 'text', { autoComplete: 'street-address', full: true })}
          {input('district', 'District')}
          {input('state', 'State / Union Territory')}
          {input('constituency', 'Assembly constituency')}
          {input('mobile', 'Mobile number', 'tel', { inputMode: 'numeric', maxLength: 10 })}
        </div>
        <div className="declaration"><LockKeyhole size={18} /><span>This prototype uses simulated services. No real electoral registration is submitted.</span></div>
        <div className="registration-actions"><button type="button" className="secondary-action" onClick={() => navigate('/voter')}>Back to voter services</button><button type="submit" className="submit-voter" disabled={submitting}>{submitting ? 'Submitting application…' : 'Continue to review'}</button></div>
      </form>
      <aside className="registration-sidebar"><div className="sidebar-icon"><FileText size={26} /></div><h2>Before you apply</h2><ul><li>Keep your age and address proof ready.</li><li>Use a mobile number that can receive updates.</li><li>Check the selected constituency before submitting.</li></ul><hr /><h3>Need help?</h3><p>Call the voter helpline at <strong>1950</strong> or use the Help & Support section.</p></aside>
    </section>
  </main>
}
