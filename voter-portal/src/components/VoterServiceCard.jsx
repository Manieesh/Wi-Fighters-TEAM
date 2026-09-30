import { ArrowRight } from 'lucide-react'

function VoterServiceCard({ title, description, icon: Icon, onClick }) {
  return (
    <div className="voter-service-card">
      <div className="voter-service-icon-wrap">
        <div className="voter-service-icon">
          <Icon size={28} />
        </div>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <button type="button" className="primary-btn voter-card-btn" onClick={onClick}>
        Continue
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export default VoterServiceCard
