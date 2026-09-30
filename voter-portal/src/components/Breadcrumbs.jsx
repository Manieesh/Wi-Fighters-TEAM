import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function Breadcrumbs({ items = [] }) {
  const navigate = useNavigate()

  return (
    <div className="page-tools container">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {items.map((item) => (
          <span key={item.label} className="breadcrumb-item">
            <ChevronRight size={14} />
            {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
          </span>
        ))}
      </nav>
    </div>
  )
}

export default Breadcrumbs
