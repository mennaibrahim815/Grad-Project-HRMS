// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import instance from "@/services/axios";
// import BaseCard from "@/components/UI/Card.jsx";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { TrendingUp } from "lucide-react";

// const EmployeePerformanceChart = () => {
//   const { id } = useParams(); // جلب الـ ID تلقائيًا من الـ URL
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPerformanceChartData = async () => {
//       try {
//         setLoading(true);
//         const response = await instance.get(`/employeePerformance/${id}`);
//         if (response.data?.status === "success") {
//           const previousPeriods = response.data.data?.previousPeriods || [];
          
//           // عكس المصفوفة لترتيب زمني منطقي (من الأقدم للأحدث) وتنسيق التاريخ لـ MM-DD
//           const formattedData = [...previousPeriods].reverse().map(item => ({
//             period: `${item.from.substring(5)} → ${item.to.substring(5)}`,
//             fullPeriod: `${item.from} to ${item.to}`,
//             Score: item.overallPerformance,
//             status: item.performanceStatus
//           }));
          
//           setChartData(formattedData);
//         }
//       } catch (error) {
//         console.error("Error fetching employee performance chart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchPerformanceChartData();
//   }, [id]);

//   // الـ Tooltip المخصص المتطابق تماماً مع شارت الطلبات السنوية
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="p-3 rounded-xl shadow-2xl text-left"
//           style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-main)' }}>
//           <p className="text-[10px] font-bold tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
//             {payload[0].payload.fullPeriod}
//           </p>
//           <p className="font-extrabold text-sm font-mono mt-0.5" style={{ color: '#0095ff' }}>
//             Score: {payload[0].value}%
//           </p>
//           <p className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
//             Status: <span className="text-red-400">{payload[0].payload.status}</span>
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="h-64 flex items-center justify-center text-xs font-medium font-mono" style={{ color: 'var(--text-muted)' }}>
//         Loading analytics trend...
//       </div>
//     );
//   }

//   return (
//     <BaseCard padding="p-6" className="w-full mt-6 mb-10 text-left">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-2 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: '#0095ff' }}>
//             <TrendingUp size={18} />
//           </div>
//           <div>
//             <h4 className="font-bold text-base tracking-tight" style={{ color: 'var(--text-main)' }}>
//               Performance History Trend
//             </h4>
//             <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
//               Overview of employee performance score evolution over the last 5 periods
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="w-full">
//         <ResponsiveContainer width="100%" height={260}>
//           <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//             <defs>
//               <linearGradient id="neonBluePerformance" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#0095ff" stopOpacity={0.25} />
//                 <stop offset="95%" stopColor="#0095ff" stopOpacity={0} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" opacity={0.4} vertical={false} />
//             <XAxis
//               dataKey="period"
//               tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }}
//               axisLine={false} tickLine={false}
//             />
//             <YAxis
//               tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
//               axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 100]}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Area
//               type="monotone"
//               dataKey="Score"
//               stroke="#0095ff"
//               strokeWidth={2.5}
//               fillOpacity={1}
//               fill="url(#neonBluePerformance)"
//               activeDot={{ r: 6, stroke: "var(--bg-deep)", strokeWidth: 2, fill: "#0095ff" }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </BaseCard>
//   );
// };

// export default EmployeePerformanceChart;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const EmployeePerformanceChart = () => {
  const { id } = useParams();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceChartData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/employeePerformance/${id}`);
        if (response.data?.status === "success") {
          const previousPeriods = response.data.data?.previousPeriods || [];
          setChartData([...previousPeriods].reverse().map(item => ({
            period: `${item.from.substring(5)} → ${item.to.substring(5)}`,
            fullPeriod: `${item.from} to ${item.to}`,
            Score: item.overallPerformance,
            status: item.performanceStatus,
            percentageChange: item.percentageChange
          })));
        }
      } catch (error) {
        console.error("Error fetching employee performance chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPerformanceChartData();
  }, [id]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isPositive = (point.percentageChange ?? 0) >= 0;

      return (
        <div
          className="p-3 rounded-xl shadow-2xl text-left"
          style={{ background: "var(--bg-deep)", border: "1px solid var(--border-main)" }}
        >
          <p className="text-[10px] font-bold tracking-wider font-mono" style={{ color: "var(--text-muted)" }}>
            {point.fullPeriod}
          </p>
          <p className="font-extrabold text-sm font-mono mt-0.5" style={{ color: "#0095ff" }}>
            Score: {payload[0].value}%
          </p>

          {point.percentageChange !== undefined && (
            <p
              className="text-[10px] font-bold font-mono mt-0.5"
              style={{ color: isPositive ? "#34d399" : "#f87171" }}
            >
              Change: {isPositive ? "+" : ""}{point.percentageChange}%
            </p>
          )}

          <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--text-muted)" }}>
            Status: <span style={{ color: "#f87171" }}>{point.status}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-medium font-mono" style={{ color: "var(--text-muted)" }}>
        Loading analytics trend...
      </div>
    );
  }

  return (
    <BaseCard padding="p-6" className="w-full mt-6 mb-10 text-left">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-subtle)", color: "#0095ff" }}
          >
            <TrendingUp size={18} />
          </div>
          <div>
            <h4 className="font-bold text-base tracking-tight" style={{ color: "var(--text-main)" }}>
              Performance History Trend
            </h4>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
              Overview of employee performance score evolution over the last 5 periods
            </span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="neonBluePerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0095ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0095ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 100]}
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
      </div>
    </BaseCard>
  );
};

export default EmployeePerformanceChart;