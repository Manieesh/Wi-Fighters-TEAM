import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VoterLoginStep2({ onOTPVerified }) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length === 4) {
      onOTPVerified(otpString)
      navigate('/voter/login-confirm')
    } else {
      setError('Please enter all 4 digits')
    }
  }

  const otpFilled = otp.join('').length === 4

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: 'var(--navy)', 
          margin: '0 0 8px 0' 
        }}>
          Enter Verification Code
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0', fontSize: '14px' }}>
          Step 2 of 3 — Verify your OTP
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
            backgroundColor: step <= 2 ? 'var(--primary)' : 'var(--border)',
            color: step <= 2 ? 'white' : 'var(--muted)',
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

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--navy)',
            fontSize: '14px'
          }}>
            Enter the 4-digit verification code
          </label>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '56px',
                  height: '56px',
                  fontSize: '24px',
                  fontWeight: '600',
                  border: `2px solid ${error ? '#ef4444' : 'var(--border)'}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  transition: 'border-color 0.2s',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => {
                  if (!error) e.target.style.borderColor = 'var(--primary)'
                }}
                onBlur={(e) => {
                  if (!error) e.target.style.borderColor = 'var(--border)'
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <p style={{
            fontSize: '12px',
            color: '#f59e0b',
            marginTop: '12px',
            textAlign: 'center',
            margin: '12px 0 0 0'
          }}>
            ℹ️ DEMO MODE: Enter any 4 digits to proceed
          </p>
        </div>

        <button
          type="submit"
          disabled={!otpFilled}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: otpFilled ? 'var(--primary)' : '#cbd5e1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: otpFilled ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            if (otpFilled) e.target.style.backgroundColor = '#1e40af'
          }}
          onMouseLeave={(e) => {
            if (otpFilled) e.target.style.backgroundColor = 'var(--primary)'
          }}
          onFocus={(e) => {
            e.target.style.outline = '2px solid var(--primary)'
            e.target.style.outlineOffset = '2px'
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none'
          }}
        >
          Verify
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '16px'
        }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid var(--primary)'
              e.target.style.outlineOffset = '2px'
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none'
            }}
          >
            Didn't receive code? Resend OTP
          </button>
        </div>
      </form>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: 'var(--primary-soft)',
        borderRadius: '6px',
        fontSize: '13px',
        color: 'var(--navy)'
      }}>
        <strong>Demo Info:</strong> In a real system, an OTP would be sent via SMS. Here, any 4-digit code is accepted.
      </div>
    </div>
  )
}
