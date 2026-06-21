import BaseCard from "../../components/UI/Card";
import {
  getPerformanceColors,
  getPerformanceIconColors,
  getPerformanceMessage,
} from "./performanceUtils";

function OverallPerformanceCard({ overallPerformance = 0, performanceStatus = "Poor" }) {
  const colors = getPerformanceColors(performanceStatus);
  const iconColors = getPerformanceIconColors(performanceStatus);
  const message = getPerformanceMessage(performanceStatus);

  return (
    <BaseCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          Overall Performance
        </p>
        <div
          style={{ background: iconColors.bg, color: iconColors.color }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        >
          <i className="fas fa-chart-line text-base"></i>
        </div>
      </div>

      <div className="flex items-end justify-between flex-wrap gap-3">
        <span className="text-5xl font-extrabold" style={{ color: colors.text }}>
          {overallPerformance}%
        </span>

        <span
          style={{
            background: colors.bg,
            borderColor: colors.border,
            color: colors.text,
          }}
          className="px-4 py-1.5 rounded-full text-xs font-bold border"
        >
          {performanceStatus}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(overallPerformance, 100)}%`,
            background: colors.text,
          }}
        />
      </div>

      {/* Contextual message */}
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </BaseCard>
  );
}

export default OverallPerformanceCard;