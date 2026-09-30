import { CheckCircle2, LoaderCircle } from 'lucide-react'

function PrometheusImport({ loading, success, receivedFields }) {
  return (
    <div className="prometheus-box">
      <div className="prometheus-header">
        <span className="demo-badge">Interoperability Demo</span>
      </div>

      <div className="prometheus-flow" aria-label="Prometheus data flow">
        <span>Citizen</span>
        <span>↓</span>
        <span>CivicConnect</span>
        <span>↓</span>
        <span>Prometheus</span>
        <span>↓</span>
        <span>Consent</span>
        <span>↓</span>
        <span>Voter Service</span>
        <span>↓</span>
        <span>Application ID</span>
        <span>↓</span>
        <span>Track Application</span>
      </div>

      {loading && (
        <div className="status-message info">
          <LoaderCircle size={16} className="spin" />
          Connecting to Prometheus...
        </div>
      )}

      {success && (
        <>
          <div className="status-message success">
            <CheckCircle2 size={16} />
            Citizen data received successfully
          </div>

          <div className="received-panel">
            <h4>Data received from Prometheus</h4>
            <ul>
              {receivedFields.map((field) => (
                <li key={field}><CheckCircle2 size={14} /> {field}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default PrometheusImport
