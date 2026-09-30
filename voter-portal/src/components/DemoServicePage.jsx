import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

function DemoServicePage({ eyebrow, title, description, services, breadcrumbs = [] }) {
  const [message, setMessage] = useState('')

  const showDemoMessage = (serviceName) => {
    setMessage(`${serviceName} is available as a frontend demo action.`)
  }

  return (
    <main className="page-shell">
      <Breadcrumbs items={breadcrumbs} />
      <div className="container simple-page service-page">
        <span className="section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="page-intro">{description}</p>
        {message && <div className="demo-action-message" role="status">{message}</div>}
        <div className="service-detail-grid">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article className="service-detail-card" key={service.title}>
                <div className="service-detail-icon"><Icon size={24} /></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-detail-actions">
                  {service.to ? (
                    <Link className="primary-btn small-btn" to={service.to}>View Service <ArrowRight size={14} /></Link>
                  ) : (
                    <button type="button" className="primary-btn small-btn" onClick={() => showDemoMessage(service.title)}>Apply Now <ArrowRight size={14} /></button>
                  )}
                  {!service.to && <button type="button" className="text-button" onClick={() => showDemoMessage(`Learn more about ${service.title}`)}>Learn More</button>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default DemoServicePage
