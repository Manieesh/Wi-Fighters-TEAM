import { Activity, AlertCircle, CheckCircle2, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

function Dashboard() {
  const stats = [
    { label: 'Active Applications', value: '01', icon: Activity },
    { label: 'Completed Services', value: '03', icon: CheckCircle2 },
    { label: 'Pending Actions', value: '01', icon: Clock3 },
    { label: 'Grievances', value: '00', icon: AlertCircle },
  ]

  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Applications', to: '/dashboard' }, { label: 'Dashboard' }]} />
      <div className="container simple-page dashboard-page">
        <span className="section-kicker">Citizen Account</span>
        <h1>Welcome to CivicConnect</h1>
        <div className="dashboard-stats">{stats.map((stat) => { const Icon = stat.icon; return <div className="dashboard-stat" key={stat.label}><Icon size={22} /><strong>{stat.value}</strong><span>{stat.label}</span></div> })}</div>
        <div className="dashboard-section"><div className="section-title-row"><h2>Recent Applications</h2><Link to="/track" className="text-button">View all</Link></div><div className="recent-application"><div><h3>Voter Registration</h3><p>Application ID: VC-2026-483921</p><span className="status-tag">Under Verification</span></div><div className="button-row"><Link to="/track" className="primary-btn small-btn">Track</Link><button type="button" className="secondary-btn dark-btn small-btn" onClick={() => window.alert('Demo application details')}>View Details</button></div></div></div>
      </div>
    </main>
  )
}

export default Dashboard
