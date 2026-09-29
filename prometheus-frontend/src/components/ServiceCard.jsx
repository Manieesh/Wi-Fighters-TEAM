import UiIcon from "./UiIcon";

export default function ServiceCard({ service, onView, t }) {
  const isAvailable = service.status === "available" || service.isAvailable;

  const featuresList = service.features || [
    "Digital application submission",
    "Verified identity linkage",
    "Real-time status tracking"
  ];

  return (
    <div className={`citizen-service-card ${isAvailable ? "card-available" : "card-coming-soon"}`}>
      <div className="service-card-top">
        <div className={`service-icon-box ${isAvailable ? "icon-active" : "icon-muted"}`}>
          <UiIcon name={service.icon || "document"} size={22} />
        </div>
        <div className={`service-status-indicator ${isAvailable ? "status-available" : "status-coming-soon"}`}>
          {isAvailable ? (
            <>
              <span className="dot-available-pulse" />
              <span>Available Now</span>
            </>
          ) : (
            <span className="tag-coming-soon">Coming Soon</span>
          )}
        </div>
      </div>

      <div className="service-card-content">
        <span className="service-dept">{service.organization || service.authority}</span>
        <h3 className="service-name">{service.name || service.title}</h3>
        <p className="service-desc">{service.description}</p>

        {/* Process steps / Key features */}
        <div className="service-card-features">
          <span className="features-header-label">Process steps &amp; features:</span>
          <ul className="service-features-mini-list">
            {featuresList.slice(0, 3).map((feat, idx) => (
              <li key={idx}>
                <UiIcon name={isAvailable ? "check" : "clock"} size={13} className={isAvailable ? "text-success" : "text-muted"} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {isAvailable && service.eligibility && (
          <div className="service-eligibility-block">
            <span className="block-label">Eligibility:</span>
            <span className="block-val">{service.eligibility}</span>
          </div>
        )}
      </div>

      <div className="service-card-footer">
        {isAvailable ? (
          <button
            className="btn-open-portal"
            onClick={() => onView && onView(service)}
            aria-label={`Continue to ${service.name || service.title} Service`}
          >
            <span>Continue to Service</span>
            <UiIcon name="arrowRight" size={15} />
          </button>
        ) : (
          <button
            className="btn-coming-soon"
            disabled
            aria-disabled="true"
            title="This service is under technical integration and not yet available."
          >
            <span>Coming Soon</span>
          </button>
        )}
      </div>
    </div>
  );
}
