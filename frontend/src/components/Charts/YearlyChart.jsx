// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchYearlyPayroll, setPayrollYear } from "../../store/HrSlices/payroll/payrollSlice";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer
// } from "recharts";

// const YearlyChart = () => {
//   const dispatch = useDispatch();
//   const { yearlyData, yearlyLoading, selectedYear } = useSelector((state) => state.payroll);

//   useEffect(() => {
//     dispatch(fetchYearlyPayroll(selectedYear));
//   }, [dispatch, selectedYear]);

//   const currentYear = new Date().getFullYear();
//   const years = [currentYear - 2, currentYear - 1, currentYear];

//   return (
//     <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl w-full mb-8 min-h-[420px] h-full">
      
//       {/* Header -*/}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <h3 className="text-xl font-bold text-white mb-1">Payroll cost overview</h3>

//         <div className="flex items-center gap-6">
//           {/* Legend */}
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
//               <span className="text-slate-400 text-xs">Net Salaries</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
//               <span className="text-slate-400 text-xs">Deduction</span>
//             </div>
//           </div>

//           {/* Year Selector */}
//           <select
//             value={selectedYear}
//             onChange={(e) => dispatch(setPayrollYear(Number(e.target.value)))}
//             className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
//           >
//             {years.map((y) => (
//               <option key={y} value={y} className="bg-[#182731]">{y}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Chart Area */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="w-full lg:flex-1 h-[300px]">
//           {yearlyLoading ? (
//             <div className="h-full flex items-center justify-center">
//               <i className="fas fa-spinner fa-spin text-2xl text-cyan-700"></i>
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart 
//                 data={yearlyData} 
//                 margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
//                 barGap={6}
//               >
//                 <defs>
//                   <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#00c6ff" />
//                     <stop offset="100%" stopColor="#0072ff" />
//                   </linearGradient>
//                   <pattern id="deductionHatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45 2 2)">
//                     <path d="M-1,2 l6,0" stroke="#374151" strokeWidth="2" />
//                   </pattern>
//                 </defs>

//                 <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" opacity={0.3} />
                
//                 <XAxis 
//                   dataKey="monthName" 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: "#4b5563", fontSize: 11 }} 
//                   dy={15}
//                   tickFormatter={(val) => val.substring(0, 3)}
//                 />
                
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: "#4b5563", fontSize: 11 }}
//                   tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
//                 />

//                 <Tooltip
//                   cursor={{ fill: "rgba(255,255,255,0.02)" }}
//                   content={({ active, payload }) => {
//                     if (!active || !payload?.length) return null;
//                     const d = payload[0].payload;
//                     return (
//                       <div className="bg-[#0b141a] border border-gray-700 rounded-xl p-3 shadow-xl">
//                         <p className="text-xs text-gray-400 font-bold mb-2">{d.monthName} {selectedYear}</p>
//                         <div className="text-xs space-y-1">
//                           <p className="text-cyan-400">Net Salaries: ${d.netSalaries?.toLocaleString()}</p>
//                           <p className="text-slate-500">Deduction: ${d.deductions?.toLocaleString()}</p>
//                         </div>
//                       </div>
//                     );
//                   }}
//                 />

//                 <Bar 
//                   dataKey="netSalaries" 
//                   name="Income"
//                   fill="url(#incomeGrad)" 
//                   radius={[4, 4, 0, 0]} 
//                   barSize={30} 
//                 />
//                 <Bar 
//                   dataKey="deductions" 
//                   name="Expenses"
//                   fill="url(#deductionHatch)" 
//                   radius={[4, 4, 0, 0]} 
//                   barSize={30} 
//                   stroke="#374151"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YearlyChart;
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const YearlyChart = ({
  // Data & Loading
  data = [],
  isLoading = false,

  // Title
  title = "Yearly Overview",

  // Year selector
  selectedYear,
  onYearChange,

  // Bar 1 config
  bar1Key = "netSalaries",
  bar1Label = "Net Salaries",
  bar1Color = { start: "#00c6ff", end: "#0072ff" },

  // Bar 2 config
  bar2Key = "deductions",
  bar2Label = "Deduction",
}) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl w-full mb-8 min-h-[420px] h-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>

        <div className="flex items-center gap-6">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400 text-xs">{bar1Label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400 text-xs">{bar2Label}</span>
            </div>
          </div>

          {/* Year Selector */}
          {onYearChange && (
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#182731]">{y}</option>
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
                    <path d="M-1,2 l6,0" stroke="#374151" strokeWidth="2" />
                  </pattern>
                </defs>

                <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" opacity={0.3} />

                <XAxis
                  dataKey="monthName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                  dy={15}
                  tickFormatter={(val) => val.substring(0, 3)}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                  tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
                />

                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0b141a] border border-gray-700 rounded-xl p-3 shadow-xl">
                        <p className="text-xs text-gray-400 font-bold mb-2">
                          {d.monthName} {selectedYear}
                        </p>
                        <div className="text-xs space-y-1">
                          <p className="text-cyan-400">
                            {bar1Label}: {d[bar1Key]?.toLocaleString()}
                          </p>
                          <p className="text-slate-500">
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
                  stroke="#374151"
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