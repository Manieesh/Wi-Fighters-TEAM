import { Car, ClipboardCheck, FileCheck2, RefreshCw } from 'lucide-react'
import DemoServicePage from '../components/DemoServicePage'

function Driving() {
  return <DemoServicePage
    eyebrow="Transport Services"
    title="Driving Licence Services"
    description="Explore common driving licence workflows using mock data for this SIH prototype."
    breadcrumbs={[{ label: 'Driving Licence' }]}
    services={[
      { title: 'Apply for Driving Licence', description: 'Start a guided demo application for a new licence.', icon: Car },
      { title: 'Renew Licence', description: 'Review renewal steps and supporting documents.', icon: RefreshCw },
      { title: 'Update Licence Details', description: 'Request a mock update to your licence information.', icon: FileCheck2 },
      { title: 'Check Application Status', description: 'See how licence applications move through review.', icon: ClipboardCheck, to: '/track' },
    ]}
  />
}

export default Driving
