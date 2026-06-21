import DataTable from "../../components/table/DataTable";
import BaseCard from "../../components/UI/Card";
import { getPerformanceColors } from "./performanceUtils";

const PerformanceBadge = ({ status }) => {
  const colors = getPerformanceColors(status);
  return (
    <span
      style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const ChangeIndicator = ({ value }) => {
  if (value === null || value === undefined || isNaN(value)) {
    return <span style={{ color: "var(--text-muted)" }}>—</span>;
  }
  const isPositive = value > 0;
  const isZero = value === 0;
  const color = isZero
    ? "var(--text-muted)"
    : isPositive
    ? "var(--pill-green-text)"
    : "var(--pill-red-text)";
  const icon = isZero ? "fa-minus" : isPositive ? "fa-arrow-up" : "fa-arrow-down";

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color }}>
      <i className={`fas ${icon} text-[10px]`}></i>
      {Math.abs(value)}%
    </span>
  );
};

function PreviousPeriodsTable({ previousPeriods = [], isLoading = false }) {
  const columns = [
    {
      header: "Period",
      accessor: "from",
      render: (row) => (
        <span className="font-medium" style={{ color: "var(--text-main)" }}>
          {row.from} → {row.to}
        </span>
      ),
    },
    {
      header: "Overall Performance",
      accessor: "overallPerformance",
      render: (row) => (
        <span className="font-bold" style={{ color: "var(--text-stat)" }}>
          {row.overallPerformance}%
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "performanceStatus",
      render: (row) => <PerformanceBadge status={row.performanceStatus} />,
    },
    {
      header: "Change",
      accessor: "percentageChange",
      render: (row) => <ChangeIndicator value={row.percentageChange} />,
    },
  ];

  if (isLoading) {
    return (
      <BaseCard padding="p-0">
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
      </BaseCard>
    );
  }

  if (!previousPeriods.length) {
    return (
      <BaseCard className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="font-semibold text-sm" style={{ color: "var(--text-main)" }}>
          No previous periods available
        </p>
      </BaseCard>
    );
  }

  return (
    <BaseCard padding="p-0">
      <DataTable columns={columns} data={previousPeriods} />
    </BaseCard>
  );
}

export default PreviousPeriodsTable;