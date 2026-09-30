import Breadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'

const faqs = [
  {
    question: 'How can I track my service request?',
    answer: 'Use the application tracker and enter your application or reference ID to view the current processing stage.',
  },
  {
    question: 'Can I update my details after submission?',
    answer: 'Yes, limited corrections are allowed before the final approval stage depending on the service type.',
  },
  {
    question: 'Where can I raise a grievance?',
    answer: 'You can visit the grievance section and complete the complaint form with service details and supporting information.',
  },
]

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState('')

  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />
      <div className="container simple-page">
        <span className="section-kicker">FAQs</span>
        <h1>Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqs.concat([
            { question: 'What is Prometheus?', answer: 'Prometheus is represented here as a mock interoperability source for this SIH demonstration.' },
            { question: 'How does consent-based data sharing work?', answer: 'Citizens review requested fields and choose whether to allow the demo service to continue.' },
            { question: 'Is CivicConnect connected to real government systems?', answer: 'No. CivicConnect is a frontend-only prototype using mock data and simulated integrations.' },
          ]).map((faq) => (
            <button type="button" key={faq.question} className={openQuestion === faq.question ? 'faq-item open' : 'faq-item'} onClick={() => setOpenQuestion((current) => current === faq.question ? '' : faq.question)}>
              <h3>{faq.question}</h3>
              {openQuestion === faq.question && <p>{faq.answer}</p>}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default FAQ
