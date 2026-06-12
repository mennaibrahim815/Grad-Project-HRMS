
import React from "react";
import BaseCard from "@/components/UI/Card.jsx";
import { ArrowRight, Calendar } from "lucide-react";

const RequestCard = ({ req, onClick }) => {
  const firstName = req.employeeId?.general?.firstName || "Unknown";
  const lastName = req.employeeId?.general?.lastName || "Employee";
  const fullName = `${firstName} ${lastName}`;
  const avatarUrl = req.employeeId?.general?.avatar;
  
  const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <BaseCard
      padding="p-6"
      // تأكدي من وجود onClick هنا مباشرة على الكارد الأب
      onClick={onClick} 
      className="hover:border-slate-700/80 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[190px] border border-slate-800/40 bg-[#0F1722]/30"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            {req.type || "General Request"}
          </span>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Calendar size={12} /> {formattedDate}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[11px] text-slate-400 font-bold border border-slate-700/50">
              {firstName[0]}
            </div>
          )}
          <h4 className="text-white font-bold text-base group-hover:text-yellow-400 transition-colors">
            {fullName}
          </h4>
        </div>

        <div className="text-slate-300 font-semibold text-xs mb-1 font-mono text-left">{req.title}</div>
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed text-left">
          {req.description}
        </p>
      </div>

      {/* حطينا الـ onClick هنا كمان احتياطي لو الـ BaseCard مبيسمحش بـ onClick خارجية */}
      <div 
        onClick={(e) => {
          e.stopPropagation(); // يمنع تضارب الضغطات
          onClick();
        }}
        className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs cursor-pointer select-none"
      >
        <span className="text-slate-500">
          Priority: <strong className={`font-mono ${req.priority === "High" ? "text-red-400 font-bold" : "text-slate-300"}`}>{req.priority || "Normal"}</strong>
        </span>
        <span className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-1">
          View Details <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </BaseCard>
  );
};

export default RequestCard;