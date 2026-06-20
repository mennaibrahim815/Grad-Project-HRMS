import PropTypes from "prop-types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { getPerformanceColors } from "../../EmployeeComponents/MyPerformanceComponents/performanceUtils";

const buildChartData = (previousPeriods = [], currentPeriod, overallPerformance, performanceStatus) => {
  const formattedPrevious = [...previousPeriods].reverse().map((item) => ({
    period: `${item.from.substring(5)} → ${item.to.substring(5)}`,
    fullPeriod: `${item.from} to ${item.to}`,
    Score: item.overallPerformance,
    status: item.performanceStatus,
  }));

  if (currentPeriod) {
    formattedPrevious.push({
      period: `${currentPeriod.from.substring(5)} → ${currentPeriod.to.substring(5)}`,
      fullPeriod: `${currentPeriod.from} to ${currentPeriod.to}`,
      Score: overallPerformance,
      status: performanceStatus,
      isCurrent: true,
    });
  }

  return formattedPrevious;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const colors = getPerformanceColors(d.status);

  return (
    <div
      className="p-3 rounded-xl shadow-2xl text-left"
      style={{ background: "var(--bg-deep)", border: "1px solid var(--border-main)" }}
    >
      <p className="text-[10px] font-bold tracking-wider font-mono" style={{ color: "var(--text-muted)" }}>
        {d.fullPeriod}
      </p>
      <p className="font-extrabold text-sm font-mono mt-0.5" style={{ color: "#0095ff" }}>
        Score: {payload[0].value}%
      </p>
      <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--text-muted)" }}>
        Status: <span style={{ color: colors.text }}>{d.status}</span>
      </p>
    </div>
  );
};

const PerformanceTrendChart = ({
  previousPeriods = [],
  currentPeriod,
  overallPerformance,
  performanceStatus,
  isLoading = false,
  title = "Performance History Trend",
  subtitle = "Overview of employee performance score evolution over the last 5 periods",
}) => {
  const chartData = buildChartData(previousPeriods, currentPeriod, overallPerformance, performanceStatus);

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
        borderColor: 'var(--card-border)',
      }}
      className="p-6 rounded-[2.5rem] border shadow-xl w-full h-full min-h-[420px] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-subtle)", color: "#0095ff" }}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <h4 className="font-bold text-base tracking-tight" style={{ color: "var(--text-main)" }}>
              {title}
            </h4>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs font-medium font-mono" style={{ color: "var(--text-muted)" }}>
            Loading analytics trend...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="neonBluePerformance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0095ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0095ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Score"
                stroke="#0095ff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#neonBluePerformance)"
                activeDot={{ r: 6, stroke: "var(--bg-deep)", strokeWidth: 2, fill: "#0095ff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

PerformanceTrendChart.propTypes = {
  previousPeriods: PropTypes.array,
  currentPeriod: PropTypes.object,
  overallPerformance: PropTypes.number,
  performanceStatus: PropTypes.string,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default PerformanceTrendChart;