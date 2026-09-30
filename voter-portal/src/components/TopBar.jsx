import { Globe, Home, Languages, Menu, MessageSquare, Phone, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function TopBar() {
  const navigate = useNavigate()

  return (
    <>
      <div className="topbar-accent-line" />
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <button type="button" className="icon-button" onClick={() => navigate('/voter')} aria-label="Open services menu"><Menu size={16} /></button>
            <button type="button" className="icon-button" onClick={() => navigate('/')} aria-label="Home"><Home size={15} /></button>
            <span className="topbar-item"><Phone size={14} /><span className="topbar-item-text">Toll Free – 1950</span></span>
          </div>
          <div className="topbar-right">
            <div className="social-links" aria-label="Social media links"><a href="/news" aria-label="Updates"><Globe size={14} /></a><a href="/contact" aria-label="Messages"><MessageSquare size={14} /></a><a href="/about" aria-label="Connect"><Send size={14} /></a></div>
            <a href="/help" className="topbar-link"><Globe size={14} /> Screen Reader Access</a>
            <a href="#main-content" className="topbar-link">Skip to Main Content</a>
            <button type="button" className="language-button" onClick={() => window.alert('Hindi language preview is available in the demo.')}><Languages size={15} /> हिंदी में देखें</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TopBar
