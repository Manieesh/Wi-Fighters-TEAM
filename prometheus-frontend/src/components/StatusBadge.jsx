import UiIcon from "./UiIcon";

export default function StatusBadge({ status, tone, icon = true, className = "" }) {
  const normStatus = String(status || "").toLowerCase().trim();

  let resolvedTone = tone;
  let iconName = "check";

  if (!resolvedTone) {
    if (normStatus.includes("complete") || normStatus.includes("approved")) {
      resolvedTone = "success";
      iconName = "checkMark";
    } else if (normStatus.includes("review") || normStatus.includes("assigned")) {
      resolvedTone = "warning";
      iconName = "clock";
    } else if (normStatus.includes("action") || normStatus.includes("progress")) {
      resolvedTone = "info";
      iconName = "refresh";
    } else if (normStatus.includes("submit") || normStatus.includes("received")) {
      resolvedTone = "neutral";
      iconName = "document";
    } else if (normStatus.includes("high") || normStatus.includes("urgent")) {
      resolvedTone = "danger";
      iconName = "alert";
    } else {
      resolvedTone = "neutral";
      iconName = "document";
    }
  }

  return (
    <span className={`citizen-status-badge tone-${resolvedTone} ${className}`}>
      {icon && <UiIcon name={iconName} size={11} className="badge-icon" />}
      <span className="badge-label">{status}</span>
    </span>
  );
}
