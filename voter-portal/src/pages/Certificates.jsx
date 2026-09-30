import { Award, FileBadge, FileText, Home, Landmark } from 'lucide-react'
import DemoServicePage from '../components/DemoServicePage'

function Certificates() {
  return <DemoServicePage
    eyebrow="Certificates"
    title="Certificate Services"
    description="Discover certificate workflows and access guidance through a single citizen-friendly portal."
    breadcrumbs={[{ label: 'Certificates' }]}
    services={[
      { title: 'Birth Certificate', description: 'Request a mock birth certificate service.', icon: FileBadge },
      { title: 'Income Certificate', description: 'Explore income certificate application requirements.', icon: FileText },
      { title: 'Community Certificate', description: 'Review a guided community certificate workflow.', icon: Award },
      { title: 'Residence Certificate', description: 'Submit a demo residence certificate request.', icon: Home },
      { title: 'Other Certificates', description: 'Browse additional certificate service categories.', icon: Landmark },
    ]}
  />
}

export default Certificates
