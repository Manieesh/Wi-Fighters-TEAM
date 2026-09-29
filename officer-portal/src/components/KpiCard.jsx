import Icon from "./Icon";

export default function KpiCard({
  label,
  value,
  subtext,
  icon,
  tone = "blue",
  trend,
  onClick
}) {
  return (
    <div
      className={`kpi-metric-card tone-${tone} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="kpi-top-row">
        <span className="kpi-label-text">{label}</span>
        {icon && (
          <div className="kpi-icon-bubble">
            <Icon name={icon} size={18} />
          </div>
        )}
      </div>

      <div className="kpi-main-number-row">
        <span className="kpi-big-number">{value}</span>
        {trend && (
          <span className={`kpi-trend-pill ${trend.startsWith("+") ? "positive" : "neutral"}`}>
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="kpi-subtext-note">{subtext}</p>}
    </div>
  );
}
