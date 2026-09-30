import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VoterLoginStep1({ onMobileNumber, initialMobile = '' }) {
  const [mobile, setMobile] = useState(initialMobile)
  const navigate = useNavigate()

  const handleSendOTP = (e) => {
    e.preventDefault()
    if (mobile.trim()) {
      onMobileNumber(mobile)
      navigate('/voter/login-otp')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: 'var(--navy)', 
          margin: '0 0 8px 0' 
        }}>
          Voter Registration
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0', fontSize: '14px' }}>
          Step 1 of 3 — Verify your mobile number
        </p>
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '40px',
        justifyContent: 'center'
      }}>
        {[1, 2, 3].map(step => (
          <div key={step} style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: step === 1 ? 'var(--primary)' : 'var(--border)',
            color: step === 1 ? 'white' : 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {step}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendOTP}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--navy)',
            fontSize: '14px'
          }}>
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter any 10-digit number (demo)"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid var(--border)',
              borderRadius: '6px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <p style={{
            fontSize: '12px',
            color: '#f59e0b',
            marginTop: '6px',
            margin: '6px 0 0 0'
          }}>
            ℹ️ DEMO FIELD: Enter any 10-digit number for testing purposes only
          </p>
        </div>

        <button
          type="submit"
          disabled={!mobile.trim()}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: mobile.trim() ? 'var(--primary)' : '#cbd5e1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: mobile.trim() ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            if (mobile.trim()) e.target.style.backgroundColor = 'var(--primary-dark)'
          }}
          onMouseLeave={(e) => {
            if (mobile.trim()) e.target.style.backgroundColor = 'var(--primary)'
          }}
          onFocus={(e) => {
            e.target.style.outline = '2px solid var(--primary)'
            e.target.style.outlineOffset = '2px'
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none'
          }}
        >
          Send OTP
        </button>
      </form>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: 'var(--primary-soft)',
        borderRadius: '6px',
        fontSize: '13px',
        color: 'var(--navy)'
      }}>
        <strong>Demo Info:</strong> Any mobile number is accepted. You'll proceed to OTP verification next.
      </div>
    </div>
  )
}
