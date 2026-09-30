import { Globe, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand-copy brand-footer">
            <strong>CivicConnect</strong>
            <small>Unified Digital Services for Citizens</small>
          </div>
          <p>
            Empowering citizens with secure access to public services, status tracking, and digital support from one trusted portal.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/voter">Voter Services</Link></li>
            <li><Link to="/track">Track Application</Link></li>
            <li><Link to="/grievance">Grievance</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/about">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3>Important Links</h3>
          <ul>
            <li><Link to="/about">Privacy Policy</Link></li>
            <li><Link to="/about">Terms</Link></li>
            <li><Link to="/help">Accessibility</Link></li>
            <li><Link to="/help">Help</Link></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="contact-list">
            <li><Phone size={15} /> +91 1800-123-4567</li>
            <li><MapPin size={15} /> Digital Services Centre, India</li>
          </ul>
          <div className="social-links footer-socials">
            <Link to="/news" aria-label="Global updates"><Globe size={14} /></Link>
            <Link to="/contact" aria-label="Messages"><MessageSquare size={14} /></Link>
            <Link to="/about" aria-label="Connect"><Send size={14} /></Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>SIH Prototype • Demo Website</span>
          <span>© 2026 CivicConnect</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
