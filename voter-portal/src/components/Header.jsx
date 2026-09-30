import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', items: [{ label: 'Voter Services', to: '/voter' }, { label: 'Register to Vote (Form 6)', to: '/voter/registration-form' }, { label: 'Identity Services', to: '/identity' }, { label: 'Driving Licence', to: '/driving' }, { label: 'Certificates', to: '/certificates' }, { label: 'Grievances', to: '/grievance' }] },
  { label: 'Applications', items: [{ label: 'Track Application', to: '/track' }, { label: 'My Applications', to: '/dashboard' }, { label: 'Notifications', to: '/notifications' }] },
  { label: 'Grievances', to: '/grievance' },
  { label: 'News & Updates', to: '/news' },
  { label: 'Help & Support', items: [{ label: 'Help & Support', to: '/help' }, { label: 'FAQs', to: '/faq' }, { label: 'Contact Us', to: '/contact' }] },
  { label: 'About', to: '/about' },
]

const searchableItems = [
  { label: 'Voter Services', type: 'Service', to: '/voter' },
  { label: 'Identity Services', type: 'Service', to: '/identity' },
  { label: 'Driving Licence', type: 'Service', to: '/driving' },
  { label: 'Certificates', type: 'Service', to: '/certificates' },
  { label: 'Track Application', type: 'Service', to: '/track' },
  { label: 'News & Updates', type: 'News', to: '/news' },
  { label: 'Frequently Asked Questions', type: 'FAQ', to: '/faq' },
]

function Header() {
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return normalized ? searchableItems.filter((item) => item.label.toLowerCase().includes(normalized)) : []
  }, [query])

  const handleSearch = (event) => {
    event.preventDefault()
    if (query.trim()) {
      navigate('/')
      setQuery('')
    }
  }

  const closeMobile = () => {
    setMobileOpen(false)
    setOpenMenu('')
  }

  return (
    <>
      <div className="brand-bar">
        <div className="container brand-bar-inner">
          <Link to="/" className="brand" aria-label="National Voters' Service Portal home">
            <div className="brand-mark" aria-hidden="true"><span>ECI</span></div>
            <div className="brand-copy"><strong>National Voters' Service Portal</strong><small>Election Commission of India · Prototype Service</small></div>
          </Link>
          <Link to="/login" className="brand-login">Voter Login</Link>
        </div>
      </div>

      <header className="main-header">
        <div className="container header-inner">
          <button type="button" className="mobile-menu-toggle" onClick={() => setMobileOpen((current) => !current)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={mobileOpen ? 'main-nav mobile-open' : 'main-nav'} aria-label="Main navigation">
            {navLinks.map((item) => item.items ? (
              <div className="nav-dropdown" key={item.label}>
                <button type="button" className="nav-link dropdown-trigger" onClick={() => setOpenMenu((current) => current === item.label ? '' : item.label)} aria-expanded={openMenu === item.label}>
                  {item.label}<ChevronDown size={14} />
                </button>
                {openMenu === item.label && <div className="dropdown-menu">{item.items.map((subItem) => <Link key={subItem.to} to={subItem.to} onClick={closeMobile} className="dropdown-item">{subItem.label}</Link>)}</div>}
              </div>
            ) : <Link key={item.to} to={item.to} onClick={closeMobile} className="nav-link">{item.label}</Link>)}
          </nav>

          <div className="header-actions">
            <form className="search-box" onSubmit={handleSearch}>
              <Search size={16} />
              <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, news..." aria-label="Search services and updates" />
              {results.length > 0 && <div className="search-results" role="listbox" aria-label="Search results">{results.slice(0, 5).map((item) => <Link key={`${item.label}-${item.type}`} to={item.to} className="search-result-item"><span>{item.label}</span><small>{item.type}</small></Link>)}</div>}
            </form>
            <button type="button" className="primary-btn header-search-btn" onClick={handleSearch}>Search<ArrowRight size={14} /></button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
