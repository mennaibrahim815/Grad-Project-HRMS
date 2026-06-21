import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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



const EmployeeStatus = ({ pieStripes, title }) => {
  const navigate = useNavigate();
  const { analytics } = useSelector((state) => state.dashboard);

  const raw = analytics?.employeeStatus;

  // لو مفيش داتا
  if (!raw) {
    return (
      <div className="bg-[#142129] p-8 rounded-[2.5rem] border border-gray-800/50 shadow-xl h-full flex items-center justify-center min-h-[420px]">
        <div className="text-center text-gray-500">
          <i className="fas fa-users text-4xl mb-3 opacity-30"></i>
          <p className="text-sm">No employee status data available</p>
        </div>
      </div>
    );
  }

  const data = [
    {
      name: "Full Time",
      value: raw.fullTimePercentage || 0,
      color: "#3b82f6",
    },
    {
      name: "Part Time",
      value: raw.partTimePercentage || 0,
      color: "#4b5563",
    },
    {
      name: "Internship",
      value: raw.internshipPercentage || 0,
      color: "#10b981",
    },
    {
      name: "Contract",
      value: raw.contractPercentage || 0,
      color: "#ef4444",
    },
  ];

  const totalCount = raw.totalEmployee || 0;

  return (
    <div 
              style={{
            background:
              "linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)   ",
              borderColor: 'var(--border-main)'
          }}
          className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl h-full flex flex-col relative min-h-[420px] overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white" style={{ color: 'var(--text-main)' }}>{title}</h3>
        <button
         style={{ background: 'var(--tab-inactive-bg)' }}
          onClick={() => navigate("/employees")}
          className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 transition-all"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs"         style={{ color: 'var(--text-main)' }}
 ></i>
        </button>
      </div>

      <div className="flex justify-center lg:flex-row items-center gap-6 flex-1">

        {/* Chart */}
        <div className="w-56 h-56 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <pattern
                  id="pieStripes"
                  patternUnits="userSpaceOnUse"
                  width="4"
                  height="4"
                  patternTransform="rotate(45)"
                >
                  <rect width="4" height="4" fill="#374151" />
                  <path
                    d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                    stroke="#4b5563"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <Pie
                data={data}
                innerRadius={52}
                outerRadius={88}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.name === pieStripes
                        ? "url(#pieStripes)"
                        : entry.color
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none" >
            <span className="text-3xl font-black text-white" style={{ color: 'var(--text-main)' }}>
              {totalCount}
            </span>
            <span className="text-[13px] text-gray-400" style={{ color: 'var(--text-main)' }}>Employee</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-6 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <div>
                <p className="text-gray-200 font-bold" style={{ color: 'var(--text-main)' }}>{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.value}% Employees
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EmployeeStatus;
