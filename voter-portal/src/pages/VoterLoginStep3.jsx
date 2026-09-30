import { useNavigate } from 'react-router-dom'

export default function VoterLoginStep3({ mobileNumber }) {
  const navigate = useNavigate()

  const maskMobile = (mobile) => {
    if (!mobile) return ''
    return mobile.slice(0, 2) + '****' + mobile.slice(-2)
  }

  const handleContinue = () => {
    navigate('/voter/registration-form')
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
          Verification Successful
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0', fontSize: '14px' }}>
          Step 3 of 3 — Ready to register
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
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {step === 3 ? '✓' : step}
          </div>
        ))}
      </div>

      {/* Success card */}
      <div style={{
        backgroundColor: '#ecfdf5',
        border: '2px solid #10b981',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          ✓
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#047857',
          margin: '0 0 12px 0'
        }}>
          Mobile Number Verified
        </h2>
        <p style={{
          color: '#10b981',
          margin: '0',
          fontSize: '15px'
        }}>
          {maskMobile(mobileNumber)}
        </p>
      </div>

      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid var(--primary-soft)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '32px',
        fontSize: '14px',
        color: 'var(--navy)',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Next steps:</strong>
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Complete your voter registration form</li>
          <li>Review and submit your application</li>
          <li>Receive your application reference number</li>
        </ul>
      </div>

      <button
        onClick={handleContinue}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
        onFocus={(e) => {
          e.target.style.outline = '2px solid var(--primary)'
          e.target.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none'
        }}
      >
        Continue to Registration Form
      </button>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: 'var(--primary-soft)',
        borderRadius: '6px',
        fontSize: '13px',
        color: 'var(--navy)'
      }}>
        <strong>Demo Info:</strong> Your mobile number has been verified in this demo. You can now proceed to fill in your registration details.
      </div>
    </div>
  )
}
