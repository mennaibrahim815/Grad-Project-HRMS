import BaseCard from "../../components/UI/Card";
import { getScoreColor } from "./performanceUtils";

function KpiStatItem({ icon, label, score }) {
  const color = getScoreColor(score);

  return (
    <BaseCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <div
          style={{ background: "var(--input-bg)", color }}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        >
          <i className={`${icon} text-sm`}></i>
        </div>
      </div>

      <span className="text-3xl font-extrabold" style={{ color: "var(--text-stat)" }}>
        {score}%
      </span>

      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(score, 100)}%`,
            background: color,
          }}
        />
      </div>
    </BaseCard>
  );
}

function KpiStats({ attendanceScore = 0, taskScore = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <KpiStatItem
        icon="fas fa-calendar-check"
        label="Attendance Score"
        score={attendanceScore}
      />
      <KpiStatItem
        icon="fas fa-check-circle"
        label="Task Score"
        score={taskScore}
      />
    </div>
  );
}

export default KpiStats;