

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StatsCard = ({ title, value, subValue, icon: Icon, colorClass, subColorClass }) => {
  const getDotColor = (val) => {
    if (val === "On Time") return "bg-green-500 shadow-green-500/50";
    if (val === "Late") return "bg-orange-500 shadow-orange-500/50";
    if (val === "Absent") return "bg-red-500 shadow-red-500/50";
    return null;
  };

  return (
    <div 
      style={{ 
        background: 'linear-gradient(to bottom right, var(--card-from) 0%, var(--card-to) 100%)',
        borderColor: 'var(--card-border)' 
      }}
      className="p-5 rounded-[2rem] border transition-all hover:shadow-xl group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass} shadow-lg shadow-current/10`}>
          <Icon size={20} className="text-white" />
        </div>
        <button 
          style={{ color: 'var(--text-muted)' }} 
          className="hover:text-blue-500 transition-colors"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
      
      <div className="space-y-1">
        <p 
          style={{ color: 'var(--text-muted)' }} 
          className="text-[10px] font-bold uppercase tracking-widest opacity-80"
        >
          {title}
        </p>
        
        <div className="flex items-center gap-2">
          <h3 
            style={{ color: 'var(--text-main)' }} 
            className="text-xl font-black tracking-tight"
          >
            {value}
          </h3>
          
          {getDotColor(value) && (
            <div className={`w-2.5 h-2.5 rounded-full mt-1 shadow-lg animate-pulse ${getDotColor(value)}`}></div>
          )}
        </div>

        <p 
          className={`text-[11px] font-bold ${subColorClass || ''}`}
          style={{ color: !subColorClass ? 'var(--text-muted)' : undefined }}
        >
          {subValue}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;