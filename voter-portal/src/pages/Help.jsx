import { BookOpen, Headphones, LifeBuoy, MessageCircleQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

function Help() {
  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Help & Support' }]} />
      <div className="container simple-page">
        <span className="section-kicker">Support Centre</span>
        <h1>Help & Support</h1>
        <div className="support-grid">
          <div className="support-card"><BookOpen size={26} /><h3>User Guide</h3><p>Learn how to discover services, submit forms, and manage your application journey.</p><Link to="/faq" className="text-button">View FAQs</Link></div>
          <div className="support-card"><LifeBuoy size={26} /><h3>Application Help</h3><p>Get help with application IDs, document verification, and status updates.</p><Link to="/track" className="text-button">Track Application</Link></div>
          <div className="support-card"><Headphones size={26} /><h3>Technical Support</h3><p>Find assistance for portal access, form issues, and demo service errors.</p><Link to="/contact" className="text-button">Contact Support</Link></div>
          <div className="support-card"><MessageCircleQuestion size={26} /><h3>Contact Support</h3><p>Send a message or raise a grievance for a service concern.</p><Link to="/grievance" className="primary-btn small-btn">Raise a Grievance</Link></div>
        </div>
      </div>
    </main>
  )
}

export default Help
