export default function RequestTimeline({ currentStatus = "Under Review" }) {
  const stages = [
    { id: "submitted", label: "Submitted" },
    { id: "under-review", label: "Under Review" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" }
  ];

  const getStageIndex = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("complete") || s.includes("resolved") || s.includes("closed")) return 3;
    if (s.includes("progress") || s.includes("action") || s.includes("assigned")) return 2;
    if (s.includes("review") || s.includes("proposed") || s.includes("verified") || s.includes("ai")) return 1;
    return 0; // submitted
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className="horizontal-timeline-wrap" role="progressbar" aria-valuenow={activeIndex + 1} aria-valuemin={1} aria-valuemax={4}>
      <div className="timeline-horizontal-track">
        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={stage.id}
              className={`timeline-step-point ${isCompleted ? "step-active" : "step-pending"} ${isCurrent ? "step-current" : ""}`}
            >
              {/* Connector line before (except first) */}
              {idx > 0 && (
                <div className={`timeline-line-segment ${idx <= activeIndex ? "line-filled" : "line-empty"}`} />
              )}

              {/* Node Circle */}
              <div className="timeline-dot-marker" aria-hidden="true">
                <span className="dot-inner" />
              </div>

              {/* Label */}
              <span className="timeline-step-label">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
