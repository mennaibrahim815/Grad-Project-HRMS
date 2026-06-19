import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <circle cx={x} cy={y} r="25" fill="#374151" fillOpacity="0.9" />
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "11px", fontWeight: "bold" }}
      >
        {`${value}%`}
      </text>
    </g>
  );
};

const StatusPieChart = ({ data, totalCount, title, pieStripes }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div
        style={{ background: 'var(--bg-card)' }}
        className="p-8 rounded-[2.5rem] shadow-xl h-full flex items-center justify-center min-h-[420px]"
      >
        <div className="text-center" style={{ color: 'var(--text-muted)' }}>
          <i className="fas fa-chart-pie text-4xl mb-3 opacity-30"></i>
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
      }}
      className="p-[20px] rounded-[2.5rem] shadow-xl h-full flex flex-col relative min-h-[420px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{title}</h3>
        <button
          onClick={() => navigate("/employees")}
          style={{ background: 'var(--bg-deep)', color: 'var(--text-muted)' }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:text-blue-500 transition-all"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 flex-1">
        {/* Chart */}
        <div className="w-56 h-56 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <pattern id="pieStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                  <rect width="4" height="4" fill="#374151" />
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#4b5563" strokeWidth="1" />
                </pattern>
              </defs>
              <Pie
                data={data}
                innerRadius={52}
                outerRadius={88}
                dataKey="value"
                stroke="none"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.name === pieStripes ? "url(#pieStripes)" : entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-3xl font-black" style={{ color: 'var(--text-main)' }}>{totalCount}</span>
            <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-6 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <div>
                <p className="font-bold" style={{ color: 'var(--text-main)' }}>{item.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {item.value} {item.label || "Count"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusPieChart;