// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import instance from "@/services/axios"; 
// import BaseCard from "@/components/UI/Card.jsx";
// import { ArrowLeft, Calendar, Clock, CheckSquare } from "lucide-react";
// import EmployeePerformanceChart from "@/HrComponents/PerformanceComponents/EmployeePerformanceChart.jsx"; 

// const PerformanceDetails = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSpecificPerformance = async () => {
//       try {
//         const response = await instance.get(`/employeePerformance/${id}`);
//         if (response.data?.status === "success") {
//           setData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching specific performance:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSpecificPerformance();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="h-64 flex items-center justify-center text-xs font-medium font-mono" style={{ color: 'var(--text-muted)' }}>
//         Loading details...
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="p-6 text-center text-xs font-medium font-mono text-red-400">
//         No performance data found for this employee.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6 text-left" dir="ltr">
      
//       {/* زرار الرجوع والعنوان الرئيسي */}
//       <div className="flex items-center justify-between mb-4">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-sm transition-colors"
//           style={{ color: 'var(--text-muted)' }}
//           onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
//           onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
//         >
//           <ArrowLeft size={16} /> Back to Dashboard
//         </button>
//         <h1 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Employee Performance Analytics</h1>
//       </div>

//       {/* الجزء العلوي: الكروت الذكية للأداء الحالي */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* كارد النتيجة الإجمالية */}
//         <BaseCard padding="p-6" className="flex flex-col items-center justify-center text-center">
//           <span className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Overall Performance</span>
//           <h2 className="text-5xl font-black" style={{ color: '#0095ff' }}>{data.overallPerformance}%</h2>
//           <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold" 
//                 style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
//             Status: {data.performanceStatus}
//           </span>
//         </BaseCard>

//         {/* كارد تفاصيل مؤشرات الأداء (KPIs) */}
//         <BaseCard padding="p-6" className="md:col-span-2 space-y-6">
//           <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-main)' }}>
//             <h3 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Current Period KPIs</h3>
//             <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
//               <Calendar size={12} /> {data.currentPeriod.from} to {data.currentPeriod.to}
//             </span>
//           </div>

//           {/* شريط نسبة الحضور */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}><Clock size={16} /> Attendance Score</span>
//               <span className="font-mono font-bold" style={{ color: 'var(--text-main)' }}>{data.kpis.attendanceScore}%</span>
//             </div>
//             <div className="w-full rounded-full h-2" style={{ background: 'var(--input-bg)' }}>
//               <div className="h-2 rounded-full transition-all" style={{ width: `${data.kpis.attendanceScore}%`, background: '#0095ff' }}></div>
//             </div>
//           </div>

//           {/* شريط نسبة إتمام المهام */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}><CheckSquare size={16} /> Task Completion Score</span>
//               <span className="font-mono font-bold" style={{ color: 'var(--text-main)' }}>{data.kpis.taskScore}%</span>
//             </div>
//             <div className="w-full rounded-full h-2" style={{ background: 'var(--input-bg)' }}>
//               <div className="h-2 rounded-full transition-all" style={{ width: `${data.kpis.taskScore}%`, background: '#818cf8' }}></div>
//             </div>
//           </div>
//         </BaseCard>
//       </div>

//       {/* 👇 استدعاء الكومبونانت المنفصل هنا لعرض الشارت بالكامل */}
//       <EmployeePerformanceChart />

//     </div>
//   );
// };

// export default PerformanceDetails;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx";
import { ArrowLeft, Calendar, Clock, CheckSquare, TrendingUp, TrendingDown } from "lucide-react";
import EmployeePerformanceChart from "@/HrComponents/PerformanceComponents/EmployeePerformanceChart.jsx";

const PerformanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecificPerformance = async () => {
      try {
        const response = await instance.get(`/employeePerformance/${id}`);
        if (response.data?.status === "success") setData(response.data.data);
      } catch (error) {
        console.error("Error fetching specific performance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecificPerformance();
  }, [id]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-medium font-mono" style={{ color: "var(--text-muted)" }}>
        Loading details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-xs font-medium font-mono" style={{ color: "#f87171" }}>
        No performance data found for this employee.
      </div>
    );
  }

  const isPeriodPositive = (data.percentageChange ?? 0) >= 0;

  const trendStyle = isPeriodPositive
    ? { color: "#34d399", background: "rgba(16,185,129,0.1)" }
    : { color: "#f87171", background: "rgba(239,68,68,0.1)" };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-left" dir="ltr">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { navigate(-1); }}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-main)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-main)" }}>
          Employee Performance Analytics
        </h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Overall Score Card */}
        <BaseCard padding="p-6" className="flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            Overall Performance
          </span>
          <h2 className="text-5xl font-black" style={{ color: "#0095ff" }}>
            {data.overallPerformance}%
          </h2>

          {data.percentageChange !== undefined && (
            <div
              className="mt-2 flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              style={trendStyle}
            >
              {isPeriodPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPeriodPositive ? "+" : ""}{data.percentageChange}% vs Last Period
            </div>
          )}

          <span
            className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-subtle)", color: "var(--text-main)" }}
          >
            Status: {data.performanceStatus}
          </span>
        </BaseCard>

        {/* KPIs Card */}
        <BaseCard padding="p-6" className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-main)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              Current Period KPIs
            </h3>
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> {data.currentPeriod.from} to {data.currentPeriod.to}
            </span>
          </div>

          {/* Attendance Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                <Clock size={16} /> Attendance Score
              </span>
              <span className="font-mono font-bold" style={{ color: "var(--text-main)" }}>
                {data.kpis.attendanceScore}%
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: "var(--input-bg)" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${data.kpis.attendanceScore}%`, background: "#0095ff" }}
              />
            </div>
          </div>

          {/* Task Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                <CheckSquare size={16} /> Task Completion Score
              </span>
              <span className="font-mono font-bold" style={{ color: "var(--text-main)" }}>
                {data.kpis.taskScore}%
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: "var(--input-bg)" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${data.kpis.taskScore}%`, background: "#818cf8" }}
              />
            </div>
          </div>
        </BaseCard>
      </div>

      <EmployeePerformanceChart />
    </div>
  );
};

export default PerformanceDetails;