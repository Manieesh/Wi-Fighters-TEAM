import { CheckCircle2 } from 'lucide-react'

function ProgressTracker({ status }) {
  const steps = ['Submitted', 'Under Verification', 'Approved']

  const safeStatus = status || 'Submitted'

  return (
    <div className="progress-tracker">
      <div className="status-flow">
        {steps.map((step, index) => {
          const isComplete =
            index === 0 && ['Submitted', 'Under Verification', 'Approved'].includes(safeStatus) ||
            index === 1 && ['Under Verification', 'Approved'].includes(safeStatus) ||
            index === 2 && safeStatus === 'Approved'

          return (
            <div key={step} className="status-step">
              <span className={isComplete ? 'status-bullet complete' : 'status-bullet'}>
                {isComplete ? <CheckCircle2 size={13} /> : index + 1}
              </span>
              <span>{step}</span>
            </div>
          )
        })}
      </div>

      <div className="status-meta">
        <p className="status-bold">Current Status: {safeStatus}</p>
        <p>Last Updated: 12 September 2026</p>
      </div>
    </div>
  )
}

export default ProgressTracker
