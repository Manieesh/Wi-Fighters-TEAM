import { Bell, CheckCircle2, Info, Megaphone } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'

const notifications = [
  { title: 'Application submitted', date: '12 September 2026', description: 'Your voter registration application was received successfully.', icon: CheckCircle2 },
  { title: 'Application verification completed', date: '12 September 2026', description: 'Document verification has moved to the next review stage.', icon: CheckCircle2 },
  { title: 'Service update', date: '10 September 2026', description: 'New progress milestones are now visible in the application tracker.', icon: Info },
  { title: 'System announcement', date: '08 September 2026', description: 'Scheduled maintenance will take place during the weekend window.', icon: Megaphone },
]

function Notifications() {
  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Applications', to: '/dashboard' }, { label: 'Notifications' }]} />
      <div className="container simple-page">
        <span className="section-kicker">Applications</span>
        <h1>Notifications</h1>
        <div className="notification-list">
          {notifications.map((item) => {
            const Icon = item.icon
            return <article className="notification-card" key={item.title}>
              <div className="notification-icon"><Icon size={20} /></div>
              <div><h3>{item.title}</h3><p>{item.description}</p><small><Bell size={13} /> {item.date}</small></div>
            </article>
          })}
        </div>
      </div>
    </main>
  )
}

export default Notifications
