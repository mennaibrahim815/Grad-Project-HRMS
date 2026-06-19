

// import React, { useState, useEffect } from "react";
// import instance from "@/services/axios";
// import BaseCard from "@/components/UI/Card.jsx"; 
// import RequestApplicationModel from "@/EmployeeComponents/MyRequestsComponents/RequestsApplicationModel.jsx"; 
// import { FileText, Clock, CheckCircle2, XCircle, Plus } from "lucide-react";

// const EmployeeRequestsStatsHeader = ({ onStatsUpdated }) => {
//   const [stats, setStats] = useState({ totalRequests: 0, approvedCount: 0, pendingCount: 0, rejectedCount: 0 });
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchRequestStats = async () => {
//   try {
//     setLoading(true);
    
//     // جلب الشهر والسنة الحاليين ديناميكياً بناءً على تاريخ اليوم
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1; // getMonth يبدأ من 0 إلى 11
//     const currentYear = currentDate.getFullYear();

//     // تمرير الشهر والسنة الحاليين للـ API
//     const response = await instance.get(`/requests/monthly-stats/me?month=${currentMonth}&year=${currentYear}`);
    
//     if (response.data?.status === "success") {
//       setStats(response.data.data);
//     }
//   } catch (error) {
//     console.error("Error fetching request stats:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchRequestStats();
//   }, []);

//   useEffect(() => {
//     if (onStatsUpdated) {
//       onStatsUpdated(() => fetchRequestStats);
//     }
//   }, [onStatsUpdated]);

//   const statCards = [
//     {
//       title: "Total Requests",
//       value: stats.totalRequests || 0,
//       icon: <FileText className="text-[#0293FA]" size={20} />,
//       textColor: "text-[#35AAFD]",
//       hoverColor: "hover:border-[#0293FA]/40",
//       subText: "requests submitted"
//     },
//     {
//       title: "Pending Requests",
//       value: stats.pendingCount || 0,
//       icon: <Clock className="text-[#F68018]" size={20} />,
//       textColor: "text-[#F89B49]",
//       hoverColor: "hover:border-[#F68018]/40",
//       subText: "awaiting review"
//     },
//     {
//       title: "Approved Requests",
//       value: stats.approvedCount || 0,
//       icon: <CheckCircle2 className="text-[#10B981]" size={20} />,
//       textColor: "text-[#34D399]",
//       hoverColor: "hover:border-[#10B981]/40",
//       subText: "successfully approved"
//     },
//     {
//       title: "Rejected Requests",
//       value: stats.rejectedCount || 0,
//       icon: <XCircle className="text-[#DF165A]" size={20} />,
//       textColor: "text-[#EC3A76]",
//       hoverColor: "hover:border-[#DF165A]/40",
//       subText: "declined requests"
//     }
//   ];

//   return (
//     // ضفنا هنا flex و flex-col و gap-6 عشان نعمل مسافة متناسقة بين العنوان والكروت
//     <div className="w-full flex flex-col gap-6 text-left box-border">
      
//       {/* قسم العنوان والزر الحركي لإضافة طلب جديد */}
//       <div className="flex flex-col sm:flex-row justify-between  mt-10 items-start sm:items-center gap-4 w-full">
//         <div>
//           <h2 className="text-white text-2xl font-bold tracking-tight">My Requests</h2>
//           <p className="text-slate-500 text-xs mt-1">Track and manage your submitted requests</p>
//         </div>
        
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-[#0293FA] hover:bg-[#0282dd] text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all duration-200 text-sm"
//         >
//           <Plus size={18} />
//           <span>Create new request</span>
//         </button>
//       </div>

//       {/* قسم الكروت المستجيب للشاشات */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
//         {statCards.map((card, index) => (
//           <BaseCard 
//             key={index} 
//             padding="p-5" 
//             className={`flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl border border-gray-800/50 ${card.hoverColor}`}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
//                 {card.title}
//               </span>
//               <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20">
//                 {card.icon}
//               </div>
//             </div>
            
//             <div className="space-y-0.5">
//               <h2 className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
//                 {loading ? "..." : card.value.toLocaleString()}
//               </h2>
//               <span className="text-[10px] text-slate-500 font-medium italic">
//                 {card.subText}
//               </span>
//             </div>
//           </BaseCard>
//         ))}
//       </div>

//       {/* المودال الخاص بإضافة طلب جديد باللغة الإنجليزية ومربوط بالباك إند */}
//       <RequestApplicationModel 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onRequestSubmitted={fetchRequestStats} 
//       /> 
     
//     </div>
//   );
// };

// export default EmployeeRequestsStatsHeader;
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx";
import RequestApplicationModel from "@/EmployeeComponents/MyRequestsComponents/RequestsApplicationModel.jsx";
import { FileText, Clock, CheckCircle2, XCircle, Plus } from "lucide-react";

const EmployeeRequestsStatsHeader = ({ onStatsUpdated }) => {
  const [stats, setStats] = useState({ totalRequests: 0, approvedCount: 0, pendingCount: 0, rejectedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequestStats = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const response = await instance.get(
        `/requests/monthly-stats/me?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`
      );
      if (response.data?.status === "success") setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching request stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequestStats(); }, []);
  useEffect(() => { if (onStatsUpdated) onStatsUpdated(() => fetchRequestStats); }, [onStatsUpdated]);

  const statCards = [
    { title: "Total Requests",    value: stats.totalRequests || 0, icon: <FileText    size={20} style={{ color: '#0293FA' }} />, valueColor: '#35AAFD', subText: "requests submitted"   },
    { title: "Pending Requests",  value: stats.pendingCount  || 0, icon: <Clock       size={20} style={{ color: '#F68018' }} />, valueColor: '#F89B49', subText: "awaiting review"      },
    { title: "Approved Requests", value: stats.approvedCount || 0, icon: <CheckCircle2 size={20} style={{ color: '#10B981' }} />, valueColor: '#34D399', subText: "successfully approved" },
    { title: "Rejected Requests", value: stats.rejectedCount || 0, icon: <XCircle     size={20} style={{ color: '#DF165A' }} />, valueColor: '#EC3A76', subText: "declined requests"     },
  ];

  return (
    <div className="w-full flex flex-col gap-6 text-left box-border">

      {/* Title + Button */}
      <div className="flex flex-col sm:flex-row justify-between mt-10 items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>My Requests</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Track and manage your submitted requests</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-200 text-sm"
          style={{ background: '#0293FA' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0282dd'}
          onMouseLeave={e => e.currentTarget.style.background = '#0293FA'}
        >
          <Plus size={18} />
          <span>Create new request</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {statCards.map((card, index) => (
          <BaseCard key={index} padding="p-5"
            className="flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                {card.title}
              </span>
              <div className="p-2 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
                {card.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: card.valueColor }}>
                {loading ? "..." : card.value.toLocaleString()}
              </h2>
              <span className="text-[10px] font-medium italic" style={{ color: 'var(--text-muted)' }}>
                {card.subText}
              </span>
            </div>
          </BaseCard>
        ))}
      </div>

      <RequestApplicationModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestSubmitted={fetchRequestStats}
      />
    </div>
  );
};

export default EmployeeRequestsStatsHeader;