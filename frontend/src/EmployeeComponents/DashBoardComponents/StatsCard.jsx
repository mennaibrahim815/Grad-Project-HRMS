// import React from 'react';
// import { ArrowUpRight } from 'lucide-react';

// const StatsCard = ({ title, value, subValue, icon: Icon, colorClass, subColorClass }) => {
//   return (
//     <div className="bg-[#1a1c26] p-5 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-all">
//       <div className="flex justify-between items-start mb-4">
//         <div className={`p-2.5 rounded-xl ${colorClass}`}>
//           <Icon size={20} className="text-white" />
//         </div>
//         <button className="text-gray-500 hover:text-white transition-colors">
//           <ArrowUpRight size={18} />
//         </button>
//       </div>
//       <div className="space-y-1">
//         <p className="text-gray-400 text-xs font-medium">{title}</p>
//         // StatsCard.jsx تعديل جزء النقطة

// <div className="flex items-center gap-2">
//    <h3 className="text-white text-xl font-bold">{value}</h3>
   
//    {/* ✅ جعل لون النقطة يتبع لون الـ subColorClass المرسل */}
//    {value !== "N/A" && (
//      <div className={`w-2 h-2 rounded-full mt-1 shadow-lg ${
//        value === "On Time" ? "bg-green-500 shadow-green-500/50" : 
//        value === "Late" ? "bg-orange-500 shadow-orange-500/50" : 
//        "bg-red-500 shadow-red-500/50"
//      }`}></div>
//    )}
// </div>
//         <p className={`text-[11px] font-medium ${subColorClass || 'text-gray-500'}`}>
//           {subValue}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StatsCard = ({ title, value, subValue, icon: Icon, colorClass, subColorClass }) => {
  // دالة لتحديد لون النقطة بناءً على القيمة
  const getDotColor = (val) => {
    if (val === "On Time") return "bg-green-500 shadow-green-500/50";
    if (val === "Late") return "bg-orange-500 shadow-orange-500/50";
    if (val === "Absent") return "bg-red-500 shadow-red-500/50";
    return null;
  };

  return (
    <div className="bg-[#1a1c26] p-5 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon size={20} className="text-white" />
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </div>
      
      <div className="space-y-1">
        <p className="text-gray-400 text-xs font-medium">{title}</p>
        
        <div className="flex items-center gap-2">
          <h3 className="text-white text-xl font-bold">{value}</h3>
          {/* النقطة الملونة تظهر فقط إذا كانت هناك حالة (On Time, Late, etc) */}
          {getDotColor(value) && (
            <div className={`w-2 h-2 rounded-full mt-1 shadow-lg animate-pulse ${getDotColor(value)}`}></div>
          )}
        </div>

        <p className={`text-[11px] font-medium ${subColorClass || 'text-gray-500'}`}>
          {subValue}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;