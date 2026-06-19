// import React, { useState, useEffect } from "react";
// import instance from "@/services/axios";
// import BaseCard from "@/components/UI/Card.jsx"; 
// import { 
//   Calendar, 
//   ShieldAlert, 
//   Sparkles 
// } from "lucide-react";

// const EmployeeLeaveStatsHeader = ({ onStatsUpdated }) => {
//   const [balances, setBalances] = useState({ annual: 0, sick: 0, casual: 0 });
//   const [loading, setLoading] = useState(true);

//   // 1. جلب أرصدة الإجازات الثلاثة للموظف
//   const fetchLeaveBalances = async () => {
//     try {
//       setLoading(true);
//       const response = await instance.get("/leaves/my-balance");
//       if (response.data?.status === "success") {
//         setBalances(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching leave balances:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveBalances();
//   }, []);

//   // لإعادة جلب الأرصدة فوراً لو تم تحديثها من المكون الأب
//   useEffect(() => {
//     if (onStatsUpdated) {
//       onStatsUpdated(() => fetchLeaveBalances);
//     }
//   }, [onStatsUpdated]);

//   // 2. مصفوفة الكاردز الثلاثة فقط (Annual, Sick, Casual)
//   const statCards = [
//     {
//       title: "Annual Leave",
//       value: balances.annual || 0,
//       icon: <Calendar className="text-[#0293FA]" size={20} />,
//       textColor: "text-[#35AAFD]",
//       hoverColor: "hover:border-[#0293FA]/40"
//     },
//     {
//       title: "Sick Leave",
//       value: balances.sick || 0,
//       icon: <ShieldAlert className="text-[#DF165A]" size={20} />,
//       textColor: "text-[#EC3A76]",
//       hoverColor: "hover:border-[#DF165A]/40"
//     },
//     {
//       title: "Casual Leave",
//       value: balances.casual || 0,
//       icon: <Sparkles className="text-[#F68018]" size={20} />,
//       textColor: "text-[#F89B49]",
//       hoverColor: "hover:border-[#F68018]/40"
//     }
//   ];

//   return (
//     <div className="w-full space-y-8 mb-10 pl-64 pr-6">
//       {/* العناوين الأساسية */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
//         <div>
//           <div className="text-white text-2xl font-bold tracking-tight mt-10">My Leave Balances</div>
//           <p className="text-slate-500 text-xs mt-1">Track your remaining available leave balances for this year</p>
//         </div>
//       </div>

//       {/* الـ 3 كاردز المتبقية في الـ Grid تلقائياً */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//         {statCards.map((card, index) => (
//           <BaseCard 
//             key={index} 
//             padding="p-5" 
//             className={`flex flex-col justify-between min-h-[145px] transition-all duration-300 shadow-xl border border-gray-800/50 ${card.hoverColor}`}
//           >
//             <div className="flex justify-between items-start mb-3">
//               <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
//                 {card.title}
//               </span>
//               <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20">
//                 {card.icon}
//               </div>
//             </div>
            
//             <div className="space-y-0.5 text-left">
//               <h2 className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
//                 {loading ? "..." : card.value.toLocaleString()}
//               </h2>
//               <span className="text-[10px] text-slate-500 font-medium italic">days available</span>
//             </div>
//           </BaseCard>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EmployeeLeaveStatsHeader;

import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx"; 
import LeaveApplicationModel from "@/EmployeeComponents/MyleavesComponents/Leave ApplicationModel.jsx"; //
import { Calendar, ShieldAlert, Sparkles, Plus } from "lucide-react";

const EmployeeLeaveStatsHeader = ({ onStatsUpdated }) => {
  const [balances, setBalances] = useState({ annual: 0, sick: 0, casual: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaveBalances = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/leaves/my-balance");
      if (response.data?.status === "success") {
        setBalances(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  useEffect(() => {
    if (onStatsUpdated) {
      onStatsUpdated(() => fetchLeaveBalances);
    }
  }, [onStatsUpdated]);

  const statCards = [
    {
      title: "Annual Leave",
      value: balances.annual || 0,
      icon: <Calendar className="text-[#0293FA]" size={20} />,
      textColor: "text-[#35AAFD]",
      hoverColor: "hover:border-[#0293FA]/40"
    },
    {
      title: "Sick Leave",
      value: balances.sick || 0,
      icon: <ShieldAlert className="text-[#DF165A]" size={20} />,
      textColor: "text-[#EC3A76]",
      hoverColor: "hover:border-[#DF165A]/40"
    },
    {
      title: "Casual Leave",
      value: balances.casual || 0,
      icon: <Sparkles className="text-[#F68018]" size={20} />,
      textColor: "text-[#F89B49]",
      hoverColor: "hover:border-[#F68018]/40"
    }
  ];

  return (
    // استخدام px-6 و pt-6 لضبط الهوامش الداخلية والابتعاد عن حواف السايد بار العلوية والجانبية تلقائياً
    <div className="w-full px-6 pt-6  mb-10 space-y-6 text-left box-border">
      
      {/* قسم العنوان والزر الحركي */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-white text-2xl font-bold tracking-tight">My Leaves</h2>
          <p className="text-slate-500 text-xs mt-1"> Apply and Manage your leaves </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0293FA] hover:bg-[#0282dd] text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all duration-200 text-sm"
        >
          <Plus size={18} />
          <span>Apply new leave</span>
        </button>
      </div>

      {/* قسم الكاردز المستجيب للشاشات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {statCards.map((card, index) => (
          <BaseCard 
            key={index} 
            padding="p-5" 
            className={`flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl border border-gray-800/50 ${card.hoverColor}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {card.title}
              </span>
              <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20">
                {card.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <h2 className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
                {loading ? "..." : card.value.toLocaleString()}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium italic">days available</span>
            </div>
          </BaseCard>
        ))}
      </div>

      <LeaveApplicationModel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLeaveSubmitted={fetchLeaveBalances} 
      />
    </div>
  );
};

export default EmployeeLeaveStatsHeader;