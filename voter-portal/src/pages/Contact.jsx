import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'

function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      <div className="container contact-layout">
        <div className="simple-page contact-info">
          <span className="section-kicker">Get in Touch</span>
          <h1>Contact Us</h1>
          <h3>CivicConnect Support</h3>
          <p className="page-intro">Our demo support team can help you understand the prototype workflow.</p>
          <ul className="contact-detail-list">
            <li><Mail size={18} /> support@civicconnect.demo</li>
            <li><Phone size={18} /> +91 1800-123-4567</li>
            <li><MapPin size={18} /> Digital Services Centre, India</li>
            <li>Working Hours: Monday to Friday, 9:00 AM to 6:00 PM</li>
          </ul>
        </div>
        <div className="simple-page">
          <h2>Send a Message</h2>
          {!sent ? <form className="gov-form" onSubmit={handleSubmit}>
            <div className="form-field"><label htmlFor="contact-name">Name</label><input id="contact-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
            <div className="form-field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="form-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" required rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></div>
            <button type="submit" className="primary-btn">Send Message</button>
          </form> : <div className="demo-action-message success">Message sent successfully.</div>}
        </div>
      </div>
    </main>
  )
}

export default Contact
