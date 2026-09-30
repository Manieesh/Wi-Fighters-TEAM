import { BadgeCheck, FileCheck2, MapPin, Smartphone } from 'lucide-react'
import DemoServicePage from '../components/DemoServicePage'

function Identity() {
  return <DemoServicePage
    eyebrow="Identity Services"
    title="Identity Services"
    description="Manage demo identity requests through one clear, consent-aware service experience."
    breadcrumbs={[{ label: 'Identity Services' }]}
    services={[
      { title: 'Identity Details Update', description: 'Review and request changes to your identity details.', icon: BadgeCheck },
      { title: 'Address Update', description: 'Submit a new address for a mock verification workflow.', icon: MapPin },
      { title: 'Mobile Number Update', description: 'Keep your citizen contact information up to date.', icon: Smartphone },
      { title: 'Document Verification', description: 'Check the documents required for service processing.', icon: FileCheck2 },
    ]}
  />
}

export default Identity
