import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    eyebrow: 'Citizen-first digital experience',
    title: 'One Platform for Citizen Services',
    description:
      'Access voter support, identity records, certificates, and grievance resolution through a single secure platform designed for citizens.',
    metrics: [
      { value: '2.6L+', label: 'Applications processed' },
      { value: '98%', label: 'Citizen satisfaction' },
    ],
  },
  {
    eyebrow: 'Fast and transparent',
    title: 'Faster Service Delivery for Every Citizen',
    description:
      'Track applications, update records, and discover schemes in one place with clear steps and live progress updates.',
    metrics: [
      { value: '12 min', label: 'Average resolution' },
      { value: '24/7', label: 'Online access' },
    ],
  },
  {
    eyebrow: 'Public service gateway',
    title: 'Connected Government Services at Your Fingertips',
    description:
      'Connect government records, notifications, and grievance channels to improve access, trust, and service quality for every resident.',
    metrics: [
      { value: '5K+', label: 'Daily requests' },
      { value: '40+', label: 'Service categories' },
    ],
  },
]

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPrevious = () => {
    setCurrentSlide((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  const goToNext = () => {
    setCurrentSlide((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  const activeSlide = slides[currentSlide]

  return (
    <section className="hero-section">
      <div className="yellow-shape shape-one" />
      <div className="yellow-shape shape-two" />
      <div className="container hero-wrap">
        <div className="hero-copy">
          <span className="eyebrow">{activeSlide.eyebrow}</span>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.description}</p>

          <div className="hero-actions">
            <Link to="/voter" className="primary-btn">
              Explore Services
              <ArrowRight size={16} />
            </Link>
            <Link to="/track" className="secondary-btn">
              Track Application
            </Link>
          </div>

          <div className="hero-metrics">
            {activeSlide.metrics.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Government service illustration">
          <div className="visual-panel main-panel">
            <div className="mini-title-row">
              <span className="status-pill">Live services</span>
              <span className="status-dot" />
            </div>

            <div className="visual-badges">
              <span>Voter ID</span>
              <span>DRIVING LICENCE</span>
              <span>CERTIFICATES</span>
            </div>

            <div className="chart-card">
              <div className="chart-bars">
                <span style={{ height: '35%' }} />
                <span style={{ height: '58%' }} />
                <span style={{ height: '72%' }} />
                <span style={{ height: '88%' }} />
                <span style={{ height: '66%' }} />
              </div>
            </div>
          </div>

          <div className="visual-panel floating-panel">
            <div className="floating-row">
              <span>Applications</span>
              <strong>3,420</strong>
            </div>
            <div className="floating-row muted">
              <span>Verified today</span>
              <strong>91%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-controls container">
        <button type="button" className="slide-button" onClick={goToPrevious} aria-label="Previous slide">
          <ArrowLeft size={18} />
        </button>

        <div className="slide-indicators" aria-label="Slide indicators">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={index === currentSlide ? 'indicator active' : 'indicator'}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button type="button" className="slide-button" onClick={goToNext} aria-label="Next slide">
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  )
}

export default Hero
