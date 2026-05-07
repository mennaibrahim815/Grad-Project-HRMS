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

const PayrollStatus = ({ data,pieStripes }) => {
  const navigate = useNavigate();

  const { analytics } = useSelector((state) => state.dashboard);
  const totalCount = data?.total_employees|| "0";

  // Error Handling
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#142129] p-8 rounded-[2.5rem] border border-gray-800/50 shadow-xl h-full flex items-center justify-center min-h-[420px]">
        <div className="text-center text-gray-500">
          <i className="fas fa-users text-4xl mb-3 opacity-30"></i>
          <p className="text-sm">No employee status data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl h-full flex flex-col relative min-h-[420px] overflow-hidden">
      {/* الهيدر */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Employee status</h3>
        <button
          onClick={() => navigate("/employees")}
          className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/30"
          title="Go to Employees"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 flex-1">
        {/* الرسم البياني (Donut Chart) */}
        <div className="w-56 h-56 relative flex-shrink-0">
          <ResponsiveContainer w-70 h-72>
            <PieChart>
              {/* Pattern للخطوط المائلة (Part-time) */}
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
                    key={`status-cell-${index}`}
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

          {/* الرقم في منتصف الدائرة */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none translate-y-[-2px]">
            <span className="text-3xl font-black text-white tracking-tight leading-none">
              {totalCount}
            </span>
            <span className="text-[13px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
              Employee
            </span>
          </div>
        </div>

        {/* القائمة الجانبية (Legend) */}
        <div className="space-y-6 flex-1 min-w-0">
          {data.map((item, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-lg"
                style={{
                  background:
                    item.name === pieStripes
                      ? "#4b5563"
                      : item.color || "#fff",
                }}
              ></span>
              <div className="flex-1">
                <p className="text-l font-bold text-gray-200 leading-none mb-1">
                  {item.name}
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
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

export default PayrollStatus;


