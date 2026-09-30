import { ChevronDown, FileText, IdCard, Car, BadgeCheck, BellRing, Building2 } from 'lucide-react'

const services = [
  { name: 'Voter Services', icon: IdCard, accent: 'blue' },
  { name: 'Identity Services', icon: BadgeCheck, accent: 'purple' },
  { name: 'Driving Licence', icon: Car, accent: 'orange' },
  { name: 'Certificates', icon: FileText, accent: 'pink' },
  { name: 'Grievances', icon: BellRing, accent: 'red' },
  { name: 'Other Government Services', icon: Building2, accent: 'green' },
]

function ServiceCards() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">Popular Services</span>
          <h2>Citizen Services at a Glance</h2>
        </div>

        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <div key={service.name} className="service-card">
                <div className={`service-icon ${service.accent}`}>
                  <Icon size={28} />
                </div>
                <span className="service-name">{service.name}</span>
                <span className="service-arrow" aria-label={`Open ${service.name}`}>
                  <ChevronDown size={16} />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServiceCards
