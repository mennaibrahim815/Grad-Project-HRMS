// import React, { useState, useEffect } from "react";
// import instance from "@/services/axios"; // رجعنا للـ instance النظيف والمظبوط بتاعك
// import BaseCard from "@/components/UI/Card.jsx";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { TrendingUp } from "lucide-react";

// const YearlyRequestsChart = () => {
//   const [yearlyData, setYearlyData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const fetchYearlyData = async () => {
//     try {
//       setLoading(true);
//       // الاندبوينت الصح حسب داتا الباكيند
//       const response = await instance.get(`/requests/yearly-chart`, {
//         params: { year: selectedYear }
//       });

//       // تفكيك الـ Object الداخلي المسمى yearlyOverview بناءً على ملف الـ JSON بتاعك
//       if (response.data && response.data.status === "success") {
//         const rawList = response.data.data?.yearlyOverview || [];
        
//         const formattedData = rawList.map(item => ({
//           month: item.monthName.substring(0, 3).toUpperCase(), // تحويل January لـ JAN
//           count: item.totalRequests // قراءة الـ totalRequests
//         }));
        
//         setYearlyData(formattedData);
//       }
//     } catch (error) {
//       console.error("Error fetching yearly requests chart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchYearlyData();
//   }, [selectedYear]);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-[#121E26] border border-slate-800 p-3 rounded-xl shadow-2xl text-left">
//           <p className="text-slate-500 text-[10px] font-bold tracking-wider font-mono">{payload[0].payload.month}</p>
//           <p className="text-[#0095ff] font-extrabold text-sm font-mono mt-0.5">
//             {payload[0].value} Requests
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <BaseCard padding="p-6" className="w-full mt-6 mb-10 text-left border border-slate-800/40 bg-[#0F1722]/30">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20 text-[#0095ff]">
//             <TrendingUp size={18} />
//           </div>
//           <div>
//             <h4 className="text-white font-bold text-base tracking-tight">Yearly Requests Analytics</h4>
//             <span className="text-[10px] text-slate-500 font-medium">Overview of employee requests volume per month</span>
//           </div>
//         </div>

//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(Number(e.target.value))}
//           className="bg-[#121E26] text-slate-300 text-xs border border-slate-800 font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer hover:border-slate-700 transition-colors"
//         >
//           <option value={2026}>2026</option>
//           <option value={2025}>2025</option>
//         </select>
//       </div>

//       {loading ? (
//         <div className="h-64 flex items-center justify-center text-slate-500 text-xs font-medium font-mono">
//           Loading analytics trend...
//         </div>
//       ) : (
//         <div className="w-full">
//           <ResponsiveContainer width="100%" height={260}>
//             <AreaChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="neonBlue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#0095ff" stopOpacity={0.25} />
//                   <stop offset="95%" stopColor="#0095ff" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} vertical={false} />
//               <XAxis 
//                 dataKey="month" 
//                 tick={{ fill: "#64748B", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis 
//                 tick={{ fill: "#64748B", fontSize: 10, fontFamily: "monospace" }}
//                 axisLine={false}
//                 tickLine={false}
//                 allowDecimals={false}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone" 
//                 dataKey="count"
//                 stroke="#0095ff"
//                 strokeWidth={2.5}
//                 fillOpacity={1}
//                 fill="url(#neonBlue)" 
//                 activeDot={{ r: 6, stroke: "#0B131A", strokeWidth: 2, fill: "#0095ff" }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </BaseCard>
//   );
// };

// export default YearlyRequestsChart;
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const YearlyRequestsChart = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchYearlyData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/requests/yearly-chart`, { params: { year: selectedYear } });
      if (response.data?.status === "success") {
        const rawList = response.data.data?.yearlyOverview || [];
        setYearlyData(rawList.map(item => ({
          month: item.monthName.substring(0, 3).toUpperCase(),
          count: item.totalRequests
        })));
      }
    } catch (error) {
      console.error("Error fetching yearly requests chart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchYearlyData(); }, [selectedYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl shadow-2xl text-left"
          style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-main)' }}>
          <p className="text-[10px] font-bold tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
            {payload[0].payload.month}
          </p>
          <p className="font-extrabold text-sm font-mono mt-0.5" style={{ color: '#0095ff' }}>
            {payload[0].value} Requests
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseCard padding="p-6" className="w-full mt-6 mb-10 text-left">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: '#0095ff' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <h4 className="font-bold text-base tracking-tight" style={{ color: 'var(--text-main)' }}>
              Yearly Requests Analytics
            </h4>
            <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Overview of employee requests volume per month
            </span>
          </div>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer transition-colors"
          style={{
            background: 'var(--input-bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-main)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs font-medium font-mono" style={{ color: 'var(--text-muted)' }}>
          Loading analytics trend...
        </div>
      ) : (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="neonBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0095ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0095ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false} tickLine={false} allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0095ff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#neonBlue)"
                activeDot={{ r: 6, stroke: "var(--bg-deep)", strokeWidth: 2, fill: "#0095ff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseCard>
  );
};

export default YearlyRequestsChart;