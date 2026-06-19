
// import React from "react";
// import BaseCard from "@/components/UI/Card.jsx";
// import { ArrowRight, Calendar } from "lucide-react";

// const RequestCard = ({ req, onClick }) => {
//   const firstName = req.employeeId?.general?.firstName || "Unknown";
//   const lastName = req.employeeId?.general?.lastName || "Employee";
//   const fullName = `${firstName} ${lastName}`;
//   const avatarUrl = req.employeeId?.general?.avatar;
  
//   const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric"
//   });

//   return (
//     <BaseCard
//       padding="p-6"
//       // تأكدي من وجود onClick هنا مباشرة على الكارد الأب
//       onClick={onClick} 
//       className="hover:border-[#7E889A]/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[190px] border border-[#383D47]/40 bg-[#1B1E22]/30"
//     >
//       <div>
//         <div className="flex justify-between items-start mb-4">
//           <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#F89B49]/10 text-[#F89B49] border border-[#F89B49]/20">
//             {req.type || "General Request"}
//           </span>
//           <span className="text-xs text-[#7E889A] font-mono flex items-center gap-1">
//             <Calendar size={12} /> {formattedDate}
//           </span>
//         </div>
        
//         <div className="flex items-center gap-3 mb-3">
//           {avatarUrl ? (
//             <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
//           ) : (
//             <div className="w-8 h-8 rounded-full bg-[#1B1E22] flex items-center justify-center text-[11px] text-slate-400 font-bold border border-slate-700/50">
//               {firstName[0]}
//             </div>
//           )}
//           <h4 className="text-white font-bold text-base group-hover:text-[#F89B49] transition-colors">
//             {fullName}
//           </h4>
//         </div>

//         <div className="text-slate-300 font-semibold text-xs mb-1 font-mono text-left">{req.title}</div>
//         <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed text-left">
//           {req.description}
//         </p>
//       </div>

//       {/* حطينا الـ onClick هنا كمان احتياطي لو الـ BaseCard مبيسمحش بـ onClick خارجية */}
//       <div 
//         onClick={(e) => {
//           e.stopPropagation(); // يمنع تضارب الضغطات
//           onClick();
//         }}
//         className="mt-4 pt-3 border-t border-[#383D47]/60 flex justify-between items-center text-xs cursor-pointer select-none"
//       >
//         <span className="text-[#7E889A]">
//           Priority: <strong className={`font-mono ${req.priority === "High" ? "text-[#EC3A76] font-bold" : "text-slate-300"}`}>{req.priority || "Normal"}</strong>
//         </span>
//         <span className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-1">
//           View Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
//         </span>
//       </div>
//     </BaseCard>
//   );
// };

// export default RequestCard;
import React from "react";
import BaseCard from "@/components/UI/Card.jsx";
import { ArrowRight, Calendar } from "lucide-react";

const RequestCard = ({ req, onClick }) => {
  const firstName = req.employeeId?.general?.firstName || "Unknown";
  const lastName = req.employeeId?.general?.lastName || "Employee";
  const fullName = `${firstName} ${lastName}`;
  const avatarUrl = req.employeeId?.general?.avatar;

  const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <BaseCard padding="p-6" onClick={onClick}
      className="transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[190px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md"
            style={{ background: 'rgba(248,155,73,0.1)', color: '#F89B49', border: '1px solid rgba(248,155,73,0.2)' }}>
            {req.type || "General Request"}
          </span>
          <span className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={12} /> {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full object-cover"
              style={{ border: '1px solid var(--border-main)' }} />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-main)' }}>
              {firstName[0]}
            </div>
          )}
          <h4 className="font-bold text-base group-hover:text-[#F89B49] transition-colors"
            style={{ color: 'var(--text-main)' }}>
            {fullName}
          </h4>
        </div>

        <div className="font-semibold text-xs mb-1 font-mono" style={{ color: 'var(--text-main)' }}>{req.title}</div>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{req.description}</p>
      </div>

      <div onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="mt-4 pt-3 flex justify-between items-center text-xs cursor-pointer select-none"
        style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          Priority: <strong className="font-mono"
            style={{ color: req.priority === "High" ? '#EC3A76' : 'var(--text-main)' }}>
            {req.priority || "Normal"}
          </strong>
        </span>
        <span className="flex items-center gap-1 group-hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
          View Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </BaseCard>
  );
};

export default RequestCard;