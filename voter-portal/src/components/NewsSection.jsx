import { CheckCircle2, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const newsData = {
  'Current Issues': [
    { title: 'Updated guidelines for digital document submission', date: '12 Sep 2026', info: 'Citizen verification window extended for smoother processing.' },
    { title: 'Service request review cycle simplified', date: '10 Sep 2026', info: 'Applicants can now track status with fewer manual steps.' },
    { title: 'Regional help desks activated for assistance', date: '08 Sep 2026', info: 'Support teams provide guided assistance in local language.' },
  ],
  'Press Releases': [
    { title: 'New digital service launch for certificate requests', date: '11 Sep 2026', info: 'Additional service channels introduced for faster access.' },
    { title: 'Inter-department coordination update', date: '06 Sep 2026', info: 'Improved process flow reduces duplicate submissions.' },
    { title: 'Pilot program for grievance redressal improvement', date: '03 Sep 2026', info: 'Public improvements to ensure faster case resolution.' },
  ],
  Instructions: [
    { title: 'How to complete identity verification online', date: '09 Sep 2026', info: 'Upload required documents and verify account details.' },
    { title: 'Checklist before applying for voter services', date: '04 Sep 2026', info: 'Prepare correct personal details to avoid re-submission.' },
    { title: 'Document acceptance standards', date: '01 Sep 2026', info: 'Clear guidelines on accepted formats and file sizes.' },
  ],
  'Notices & Vacancies': [
    { title: 'Temporary support roles available for service desks', date: '12 Sep 2026', info: 'Open positions for citizen support and assistance work.' },
    { title: 'Public notice for service center operations', date: '07 Sep 2026', info: 'Schedule updates for regional offices and help desks.' },
    { title: 'Recruitment drive for field monitoring teams', date: '05 Sep 2026', info: 'Applications invited from eligible candidates.' },
  ],
  'Service Updates': [
    { title: 'Application tracker now shows milestone status', date: '13 Sep 2026', info: 'Users can see each step of their request in real time.' },
    { title: 'Certificate renewal module under improvement', date: '09 Sep 2026', info: 'A new version enhances review and response flow.' },
    { title: 'New grievance escalation path enabled', date: '02 Sep 2026', info: 'High-priority requests are now routed faster.' },
  ],
  FAQs: [
    { title: 'Can I edit service details after submission?', date: '11 Sep 2026', info: 'Yes, limited corrections are allowed before final approval.' },
    { title: 'How can I check application progress?', date: '08 Sep 2026', info: 'Use the application tracker and enter your reference ID.' },
    { title: 'When will document verification be completed?', date: '06 Sep 2026', info: 'Verification timing depends on the service type and submission quality.' },
  ],
  'Important Information': [
    { title: 'Public advisory for secure digital submissions', date: '12 Sep 2026', info: 'Use only official portals to submit documents and forms.' },
    { title: 'Service portal maintenance this weekend', date: '10 Sep 2026', info: 'Downtime window announced for scheduled system maintenance.' },
    { title: 'Citizen awareness campaign is live', date: '02 Sep 2026', info: 'Information materials are now available in local language.' },
  ],
}

const tabs = Object.keys(newsData)

function NewsSection() {
  const [activeTab, setActiveTab] = useState('Current Issues')

  return (
    <section className="news-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">Updates & Information</span>
          <h2>Latest Government Notices</h2>
        </div>

        <div className="news-tabs" role="tablist" aria-label="News tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === activeTab ? 'news-tab active' : 'news-tab'}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={tab === activeTab}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="news-panel">
          {newsData[activeTab].map((item) => (
            <div key={`${item.title}-${item.date}`} className="news-item">
              <div className="news-icon">
                <CheckCircle2 size={16} />
              </div>
              <div className="news-copy">
                <h3>{item.title}</h3>
                <p>
                  {item.date} | {item.info}
                </p>
              </div>
            </div>
          ))}

          <Link to="/news" className="view-more-link">
            View More
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
