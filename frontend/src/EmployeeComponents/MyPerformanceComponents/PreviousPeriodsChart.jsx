import PropTypes from "prop-types";
import {
  ComposedChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { getPerformanceColors } from "./performanceUtils";

const formatLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PreviousPeriodsChart = ({ previousPeriods = [], currentPeriod, overallPerformance, performanceStatus, isLoading = false }) => {
  const chartData = [
    ...[...previousPeriods].reverse().map((p) => ({
      label: formatLabel(p.to),
      value: p.overallPerformance,
      status: p.performanceStatus,
      from: p.from,
      to: p.to,
    })),
    ...(currentPeriod
      ? [{
          label: formatLabel(currentPeriod.to),
          value: overallPerformance,
          status: performanceStatus,
          from: currentPeriod.from,
          to: currentPeriod.to,
          isCurrent: true,
        }]
      : []),
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
      }}
      className="p-[20px] rounded-[2.5rem] shadow-xl w-full mb-8 min-h-[420px] h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>
            Performance Trend
          </h3>
          <p className="text-xs uppercase tracking-wide font-bold" style={{ color: 'var(--text-muted)' }}>
            Last 6 periods overview
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Excellent", color: "var(--pill-green-text)" },
            { label: "Good", color: "var(--pill-blue-text)" },
            { label: "Average", color: "var(--pill-orange-text)" },
            { label: "Poor", color: "var(--pill-red-text)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <i className="fas fa-spinner fa-spin text-2xl text-cyan-700"></i>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border-main)" strokeDasharray="3 3" opacity={0.3} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                dy={15}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />

              <Tooltip
                cursor={{ fill: "rgba(128,128,128,0.08)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  const colors = getPerformanceColors(d.status);
                  return (
                    <div
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
                      className="border rounded-xl p-3 shadow-xl"
                    >
                      <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                        {d.from} → {d.to}
                      </p>
                      <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                        {d.value}%
                      </p>
                      <span
                        style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      >
                        {d.status}
                      </span>
                    </div>
                  );
                }}
              />

              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPerformanceColors(entry.status).text}
                    opacity={entry.isCurrent ? 1 : 0.85}
                  />
                ))}
              </Bar>

              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--accent-cyan)", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

PreviousPeriodsChart.propTypes = {
  previousPeriods: PropTypes.array,
  currentPeriod: PropTypes.object,
  overallPerformance: PropTypes.number,
  performanceStatus: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default PreviousPeriodsChart;