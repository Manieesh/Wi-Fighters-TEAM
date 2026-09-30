import { useNavigate } from 'react-router-dom'

export default function VoterConfirmation({ applicationData, applicationId }) {
  const navigate = useNavigate()

  const generateAppId = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `DEMO-VOTER-${randomId}`
  }

  const appId = applicationId || generateAppId()
  const submissionDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: 'var(--navy)', 
          margin: '0 0 8px 0' 
        }}>
          Application Submitted
        </h1>
        <p style={{ color: 'var(--muted)', margin: '0', fontSize: '14px' }}>
          Your voter registration application has been successfully submitted
        </p>
      </div>

      {/* Success card */}
      <div style={{
        backgroundColor: '#ecfdf5',
        border: '2px solid #10b981',
        borderRadius: '8px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '56px',
          marginBottom: '16px'
        }}>
          ✓
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#047857',
          margin: '0 0 8px 0'
        }}>
          Registration Successful
        </h2>
        <p style={{
          color: '#10b981',
          margin: '0',
          fontSize: '14px'
        }}>
          Submitted on {submissionDate}
        </p>
      </div>

      {/* Application ID */}
      <div style={{
        backgroundColor: 'var(--primary-soft)',
        border: '2px solid var(--primary)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--muted)',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Application Reference Number
        </p>
        <p style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--primary)',
          margin: '0',
          fontFamily: 'monospace',
          letterSpacing: '1px'
        }}>
          {appId}
        </p>
        <p style={{
          fontSize: '11px',
          color: 'var(--muted)',
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          Save this reference number for tracking your application
        </p>
      </div>

      {/* Status information */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid var(--primary-soft)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: 'var(--navy)',
          margin: '0 0 16px 0'
        }}>
          Application Status
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: '4px',
              letterSpacing: '0.5px'
            }}>
              Current Status
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              Submitted
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: '4px',
              letterSpacing: '0.5px'
            }}>
              Next Steps
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--navy)',
              lineHeight: '1.5'
            }}>
              Your application will be reviewed. You'll receive updates via SMS to your registered mobile number.
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: '4px',
              letterSpacing: '0.5px'
            }}>
              Tracking
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--navy)',
              lineHeight: '1.5'
            }}>
              Use your reference number to track your application anytime.
            </div>
          </div>
        </div>
      </div>

      {/* Application details */}
      {applicationData && (
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--navy)',
            margin: '0 0 16px 0'
          }}>
            Submitted Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontSize: '13px'
          }}>
            {[
              { label: 'Name', value: applicationData.fullName },
              { label: 'Gender', value: applicationData.gender },
              { label: 'Date of Birth', value: applicationData.dateOfBirth },
              { label: 'District', value: applicationData.district },
              { label: 'State', value: applicationData.state },
              { label: 'Constituency', value: applicationData.constituency }
            ].map((field, idx) => (
              <div key={idx}>
                <div style={{
                  fontWeight: '600',
                  color: 'var(--muted)',
                  marginBottom: '4px',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}>
                  {field.label}
                </div>
                <div style={{ color: 'var(--navy)' }}>
                  {field.value}
                </div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{
                fontWeight: '600',
                color: 'var(--muted)',
                marginBottom: '4px',
                fontSize: '11px',
                textTransform: 'uppercase'
              }}>
                Address
              </div>
              <div style={{ color: 'var(--navy)' }}>
                {applicationData.address}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            flex: 1,
            minWidth: '200px',
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
          Return to Home
        </button>

        <button
          onClick={() => window.print()}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 16px',
            backgroundColor: 'white',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--primary-soft)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white'
          }}
          onFocus={(e) => {
            e.target.style.outline = '2px solid var(--primary)'
            e.target.style.outlineOffset = '2px'
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none'
          }}
        >
          Print Receipt
        </button>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#856404'
      }}>
        <strong>Demo Information:</strong> This is a demonstration prototype. No real voter registration has occurred. All data is simulated and not stored.
      </div>
    </div>
  )
}
