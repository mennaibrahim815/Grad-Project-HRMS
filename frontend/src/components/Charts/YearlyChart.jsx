import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const YearlyChart = ({
  data = [],
  isLoading = false,
  title = "Yearly Overview",
  selectedYear,
  onYearChange,
  bar1Key = "netSalaries",
  bar1Label = "Net Salaries",
  bar1Color = { start: "#00c6ff", end: "#0072ff" },
  bar2Key = "deductions",
  bar2Label = "Deduction",
}) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
      }}
      className="p-[20px] rounded-[2.5rem] shadow-xl w-full mb-8 min-h-[420px] h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>{title}</h3>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{bar1Label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
              <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{bar2Label}</span>
            </div>
          </div>

          {/* Year Selector */}
          {onYearChange && (
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              style={{ background: 'var(--tab-inactive-bg)', borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer shrink-0"
            >
              {years.map((y) => (
                <option key={y} value={y} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{y}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:flex-1 h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-2xl text-cyan-700"></i>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                barGap={6}
              >
                <defs>
                  <linearGradient id="bar1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={bar1Color.start} />
                    <stop offset="100%" stopColor={bar1Color.end} />
                  </linearGradient>
                  <pattern id="deductionHatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45 2 2)">
                    <path d="M-1,2 l6,0" stroke="var(--border-main)" strokeWidth="2" />
                  </pattern>
                </defs>

                <CartesianGrid vertical={false} stroke="var(--border-main)" strokeDasharray="3 3" opacity={0.3} />

                <XAxis
                  dataKey="monthName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  dy={15}
                  tickFormatter={(val) => val.substring(0, 3)}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
                />

                <Tooltip
                  cursor={{ fill: "rgba(128,128,128,0.08)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
                        className="border rounded-xl p-3 shadow-xl"
                      >
                        <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                          {d.monthName} {selectedYear}
                        </p>
                        <div className="text-xs space-y-1">
                          <p className="text-cyan-400">
                            {bar1Label}: {d[bar1Key]?.toLocaleString()}
                          </p>
                          <p style={{ color: 'var(--text-muted)' }}>
                            {bar2Label}: {d[bar2Key]?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }}
                />

                <Bar
                  dataKey={bar1Key}
                  name={bar1Label}
                  fill="url(#bar1Grad)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey={bar2Key}
                  name={bar2Label}
                  fill="url(#deductionHatch)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  stroke="var(--border-main)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

YearlyChart.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  selectedYear: PropTypes.number,
  onYearChange: PropTypes.func,
  bar1Key: PropTypes.string,
  bar1Label: PropTypes.string,
  bar1Color: PropTypes.shape({ start: PropTypes.string, end: PropTypes.string }),
  bar2Key: PropTypes.string,
  bar2Label: PropTypes.string,
};

export default YearlyChart;