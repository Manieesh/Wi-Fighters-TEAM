import { ArrowUp } from 'lucide-react'

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button type="button" className="scroll-top-button" onClick={scrollToTop} aria-label="Scroll to top">
      <ArrowUp size={18} />
    </button>
  )
}

export default ScrollToTopButton