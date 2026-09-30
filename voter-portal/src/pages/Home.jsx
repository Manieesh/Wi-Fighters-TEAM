import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const ServiceCard = ({ title, description, icon, onClick, comingSoon }) => (
    <button
      onClick={onClick}
      disabled={comingSoon}
      style={{
        padding: '32px 24px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        cursor: comingSoon ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
        position: 'relative',
        opacity: comingSoon ? '0.65' : '1',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={(e) => {
        if (!comingSoon) {
          e.currentTarget.style.borderColor = '#0B1D3A'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(11, 29, 58, 0.15)'
          e.currentTarget.style.transform = 'translateY(-4px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!comingSoon) {
          e.currentTarget.style.borderColor = '#e5e7eb'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
      onFocus={(e) => {
        if (!comingSoon) {
          e.currentTarget.style.outline = '2px solid #1d4ed8'
          e.currentTarget.style.outlineOffset = '2px'
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
    >
      <div style={{
        fontSize: '40px',
        marginBottom: '16px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        backgroundColor: '#f0f4ff',
        borderRadius: '10px'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '700',
        color: '#0B1D3A',
        margin: '0 0 10px 0',
        lineHeight: '1.4'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#64748b',
        margin: '0',
        lineHeight: '1.6'
      }}>
        {description}
      </p>
      {comingSoon && (
        <div style={{
          marginTop: '14px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#f59e0b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ⏳ Coming Soon
        </div>
      )}
    </button>
  )

  return (
    <div style={{ padding: '0' }}>
      {/* Hero section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1D3A 0%, #1d4ed8 100%)',
        color: '#ffffff',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: '700',
            margin: '0 0 20px 0',
            color: '#ffffff',
            letterSpacing: '-0.5px'
          }}>
            Welcome to Voter Services Portal
          </h1>
          <p style={{
            fontSize: '18px',
            margin: '0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: '0.95',
            color: '#ffffff',
            fontWeight: '400',
            lineHeight: '1.6'
          }}>
            Register to vote, update your details, or track your application with the Election Commission of India
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <ServiceCard
            title="Apply for New Voter Registration"
            description="Start the voter registration process. Verify your identity and submit your details."
            icon="🗳️"
            onClick={() => navigate('/voter/login-step1')}
          />

          <ServiceCard
            title="Update My Details"
            description="Modify your voter registration information (name, address, contact details)."
            icon="✏️"
            comingSoon={true}
          />

          <ServiceCard
            title="Track My Application"
            description="Check the status of your voter registration application using your reference number."
            icon="📋"
            comingSoon={true}
          />

          <ServiceCard
            title="Download Voter Information"
            description="View and download your voter registration details and official documents."
            icon="📥"
            comingSoon={true}
          />

          <ServiceCard
            title="Help & FAQ"
            description="Find answers to common questions about voter registration and services."
            icon="❓"
            onClick={() => navigate('/faq')}
          />

          <ServiceCard
            title="Contact Support"
            description="Report issues or get assistance with your voter registration."
            icon="☎️"
            onClick={() => navigate('/grievance')}
          />
        </div>

        {/* Information section */}
        <div style={{
          backgroundColor: 'var(--primary-soft)',
          border: '1px solid var(--primary)',
          borderRadius: '8px',
          padding: '32px 24px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--navy)',
            margin: '0 0 16px 0'
          }}>
            About Voter Registration
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            color: 'var(--navy)',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '0', marginBottom: '8px' }}>
                Who Can Register?
              </h3>
              <p style={{ margin: '0' }}>
                You can register to vote if you are a citizen of India, at least 18 years old, and meet the residency requirements for your constituency.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '0', marginBottom: '8px' }}>
                Required Documents
              </h3>
              <p style={{ margin: '0' }}>
                You'll need a valid government-issued ID or proof of address. Digital identity documents are accepted for this demo.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '0', marginBottom: '8px' }}>
                Processing Time
              </h3>
              <p style={{ margin: '0' }}>
                Applications are typically processed within 7-10 business days. You'll be notified of approval via SMS.
              </p>
            </div>
          </div>
        </div>

        {/* Demo banner */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '20px 24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#856404',
            margin: '0',
            fontWeight: '600'
          }}>
            ⚠️ This is a demonstration prototype. No actual voter registration data is collected or stored.
          </p>
        </div>
      </div>
    </div>
  )
}
