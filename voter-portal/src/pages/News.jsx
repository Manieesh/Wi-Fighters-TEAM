import Breadcrumbs from '../components/Breadcrumbs'

function News() {
  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'News & Updates' }]} />
      <div className="container simple-page">
        <span className="section-kicker">News & Updates</span>
        <h1>Latest Public Updates</h1>
        <div className="info-list">
          <div className="info-card"><h3>Current Issues</h3><p>Citizen services continue to expand with simplified review steps and improved processing.</p></div>
          <div className="info-card"><h3>Press Releases</h3><p>Department coordination improvements are helping reduce delays across digital channels.</p></div>
          <div className="info-card"><h3>Service Updates</h3><p>New application milestones and request visibility features are now available.</p></div>
        </div>
      </div>
    </main>
  )
}

export default News
