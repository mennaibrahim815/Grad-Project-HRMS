// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { fetchYearlyPayroll, setPayrollYear } from "../../../../store/HrSlices/payroll/payrollSlice";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, Legend
// } from "recharts";
// import BaseCard from "../../../../components/UI/Card";

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-slate-800/95 border border-slate-600/50 rounded-xl p-3 shadow-xl">
//         <p className="text-white text-sm font-semibold mb-2">{label}</p>
//         {payload.map((entry) => (
//           <div key={entry.name} className="flex items-center gap-2 text-xs">
//             <span style={{ color: entry.color }}>{entry.name}:</span>
//             <span className="text-white font-medium">
//               ${entry.value?.toLocaleString()}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// const PayrollChart = () => {
//   const dispatch = useDispatch();
//   const { yearlyData, yearlyLoading, selectedYear } = useSelector((state) => state.payroll);
//   const [activeBar, setActiveBar] = useState("both"); // "income" | "expenses" | "both"

//   useEffect(() => {
//     dispatch(fetchYearlyPayroll(selectedYear));
//   }, [dispatch, selectedYear]);

//   const currentYear = new Date().getFullYear();
//   const years = [currentYear - 2, currentYear - 1, currentYear];

//   return (
//     <BaseCard>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <h2 className="text-white font-semibold text-lg">Payroll cost overview</h2>

    //     <div className="flex items-center gap-4">
    //       {/* Legend */}
    //       <div className="flex items-center gap-3">
    //         <div className="flex items-center gap-1.5">
    //           <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
    //           <span className="text-slate-400 text-xs">Income</span>
    //         </div>
    //         <div className="flex items-center gap-1.5">
    //           <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
    //           <span className="text-slate-400 text-xs">Expenses</span>
    //         </div>
    //       </div>

    //       {/* Year Selector */}
    //       <select
    //         value={selectedYear}
    //         onChange={(e) => dispatch(setPayrollYear(Number(e.target.value)))}
    //         className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
    //       >
    //         {years.map((y) => (
    //           <option key={y} value={y}>{y}</option>
    //         ))}
    //       </select>
    //     </div>
    //   </div>

//       {yearlyLoading ? (
        
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
//       </div>

//       ) : (
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={yearlyData} barGap={4} barCategoryGap="30%">
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#1e293b"
//               vertical={false}
//             />
//             <XAxis
//               dataKey="monthName"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#64748b", fontSize: 12 }}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: "#64748b", fontSize: 12 }}
//               tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
//             />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

//             {/* Income - Net Salaries */}
//             <Bar
//               dataKey="netSalaries"
//               name="Income"
//               fill="url(#incomeGradient)"
//               radius={[4, 4, 0, 0]}
//             />

//             {/* Expenses - Deductions */}
//             <Bar
//               dataKey="deductions"
//               name="Expenses"
//               fill="#334155"
//               radius={[4, 4, 0, 0]}
//             />

//             {/* Gradient للـ Income */}
//             <defs>
//               <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor="#06b6d4" />
//                 <stop offset="100%" stopColor="#0ea5e9" />
//               </linearGradient>
//             </defs>
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </BaseCard>
//   );
// };

// export default PayrollChart;
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchYearlyPayroll, setPayrollYear } from "../../../../store/HrSlices/payroll/payrollSlice";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer
// } from "recharts";

// const PayrollChart = () => {
//   const dispatch = useDispatch();
//   const { yearlyData, yearlyLoading, selectedYear } = useSelector((state) => state.payroll);

//   useEffect(() => {
//     dispatch(fetchYearlyPayroll(selectedYear));
//   }, [dispatch, selectedYear]);

//   const currentYear = new Date().getFullYear();
//   const years = [currentYear - 2, currentYear - 1, currentYear];

//   // حساب الإجماليات لعرضها في الـ Stats الجانبية (بافتراض آخر شهر متاح أو متوسط)
//   const latestData = yearlyData?.[yearlyData.length - 1] || { netSalaries: 0, deductions: 0 };
  
//   return (
//     <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl w-full mb-8 min-h-[420px]">
      
//       {/* Header */}
//       {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
//         <div>
//           <h3 className="text-xl font-bold text-white mb-1">Payroll cost overview</h3>
//           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Yearly Financial Analysis</p>
//         </div>
        
        
       
//       </div> */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <h2 className="text-white font-semibold text-lg">Payroll cost overview</h2>

//         <div className="flex items-center gap-4">
//           {/* Legend */}
//          <div className="flex items-center gap-3">
//            <div className="flex items-center gap-1.5">
//              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
//               <span className="text-slate-400 text-xs">Income</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
//               <span className="text-slate-400 text-xs">Expenses</span>
//             </div>
//           </div>

//            {/* Year Selector */}
//           <select
//             value={selectedYear}
//             onChange={(e) => dispatch(setPayrollYear(Number(e.target.value)))}
//             className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
//           >
//            {years.map((y) => (
//               <option key={y} value={y}>{y}</option>
//             ))}
//           </select>
//         </div>
//       </div>


//       <div className="flex flex-col lg:flex-row gap-8">
        

//         {/* Chart Area */}
//         <div className="w-full lg:flex-1 h-[280px]">
//           {yearlyLoading ? (
//             <div className="h-full flex items-center justify-center">
//               <i className="fas fa-spinner fa-spin text-2xl text-cyan-500"></i>
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
//                           <p className="text-cyan-700">Net Salaries: ${d.netSalaries?.toLocaleString()}</p>
//                           <p className="text-gray-400">Deductions: ${d.deductions?.toLocaleString()}</p>
//                         </div>
//                       </div>
//                     );
//                   }}
//                 />

//                 <Bar 
//                   dataKey="netSalaries" 
//                   fill="url(#incomeGrad)" 
//                   radius={[4, 4, 0, 0]} 
//                   barSize={20} 
//                 />
//                 <Bar 
//                   dataKey="deductions" 
//                   fill="url(#deductionHatch)" 
//                   radius={[4, 4, 0, 0]} 
//                   barSize={20} 
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

// const StatItem = ({ label, value, color }) => (
//   <div className="space-y-0.5">
//     <div className="text-3xl font-black text-white tracking-tighter">
//       {value}
//     </div>
//     <div className="flex items-center gap-2">
//       <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
//       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">
//         {label}
//       </span>
//     </div>
//   </div>
// );

// export default PayrollChart;
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchYearlyPayroll, setPayrollYear } from "../../../../store/HrSlices/payroll/payrollSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const PayrollChart = () => {
  const dispatch = useDispatch();
  const { yearlyData, yearlyLoading, selectedYear } = useSelector((state) => state.payroll);

  useEffect(() => {
    dispatch(fetchYearlyPayroll(selectedYear));
  }, [dispatch, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl w-full mb-8 min-h-[420px]">
      
      {/* Header -*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-white mb-1">Payroll cost overview</h3>

        <div className="flex items-center gap-6">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400 text-xs">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400 text-xs">Expenses</span>
            </div>
          </div>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => dispatch(setPayrollYear(Number(e.target.value)))}
            className="px-3 py-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-[#182731]">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:flex-1 h-[300px]">
          {yearlyLoading ? (
            <div className="h-full flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-2xl text-cyan-500"></i>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={yearlyData} 
                margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                barGap={6}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c6ff" />
                    <stop offset="100%" stopColor="#0072ff" />
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
                        <p className="text-xs text-gray-400 font-bold mb-2">{d.monthName} {selectedYear}</p>
                        <div className="text-xs space-y-1">
                          <p className="text-cyan-400">Income: ${d.netSalaries?.toLocaleString()}</p>
                          <p className="text-slate-500">Expenses: ${d.deductions?.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  }}
                />

                <Bar 
                  dataKey="netSalaries" 
                  name="Income"
                  fill="url(#incomeGrad)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={18} 
                />
                <Bar 
                  dataKey="deductions" 
                  name="Expenses"
                  fill="url(#deductionHatch)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={18} 
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

export default PayrollChart;