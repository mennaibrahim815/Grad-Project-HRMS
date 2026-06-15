import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx"; 
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

const EmployeeTasksStatsHeader = ({ onStatsUpdated }) => {
  const [stats, setStats] = useState({ dueToday: 0, pendingReview: 0, completed: { total: 0, thisWeek: 0 } });
  const [loading, setLoading] = useState(true);

  const fetchTaskStats = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/tasks/task-stats");
      
      if (response.data?.status === "success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching task stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, []);

  useEffect(() => {
    if (onStatsUpdated) {
      onStatsUpdated(() => fetchTaskStats);
    }
  }, [onStatsUpdated]);

  // هنا قسّمنا الكروت لـ 3 كروت ودمجنا الأسبوعي مع الإجمالي
  const statCards = [
    {
      title: "Due Today",
      value: stats.dueToday || 0,
      icon: <Calendar className="text-[#DF165A]" size={20} />,
      textColor: "text-[#EC3A76]",
      hoverColor: "hover:border-[#DF165A]/40",
      subText: "requires urgent action",
      hasBadge: false
    },
    {
      title: "Pending Review",
      value: stats.pendingReview || 0,
      icon: <Clock className="text-[#F68018]" size={20} />,
      textColor: "text-[#F89B49]",
      hoverColor: "hover:border-[#F68018]/40",
      subText: "awaiting manager approval",
      hasBadge: false
    },
    {
      title: "Completed",
      value: stats.completed?.total || 0,
      icon: <CheckCircle2 className="text-[#10B981]" size={20} />,
      textColor: "text-white", // خلينا الرقم الأساسي أبيض زي الصورة
      hoverColor: "hover:border-[#10B981]/40",
      subText: "", // مش محتاجين نص فرعي هنا لأن البادج واضحة
      hasBadge: true,
      badgeValue: stats.completed?.thisWeek || 0
    }
  ];

  return (
    <div className="w-full flex flex-col mb-10 gap-6 text-left box-border">
      
      {/* Header text */}
      <div className="flex flex-col sm:flex-row justify-between mt-10 items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-white text-2xl font-bold tracking-tight">My Tasks</h2>
          <p className="text-slate-500 text-xs mt-1">Manage, update, and track your active project assignments</p>
        </div>
      </div>

      {/* Grid Layout - اتعدل لـ ليكون 3 أعمدة على الشاشات الكبيرة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {statCards.map((card, index) => (
          <BaseCard 
            key={index} 
            padding="p-5" 
            className={`flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl border border-gray-800/50 ${card.hoverColor}`}
          >
            {/* الجزء العلوي: العنوان والأيقونة */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {card.title}
              </span>
              <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20">
                {card.icon}
              </div>
            </div>
            
            {/* الجزء السفلي: الأرقام والبادج */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-3">
                {/* الرقم الرئيسي الاجمالي */}
                <h2 className={`text-4xl font-extrabold tracking-tight ${card.textColor}`}>
                  {loading ? "..." : card.value.toLocaleString()}
                </h2>
                
                {/* بادج الزيادة الأسبوعية الخضراء تظهر فقط في كارد المكتمل */}
                {card.hasBadge && !loading && (
                  <span className="text-sm font-semibold text-[#10B981] flex items-center mb-0.5">
                    +{card.badgeValue} this week
                  </span>
                )}
              </div>
              
              {/* النص الفرعي يظهر فقط للكروت العادية */}
              {card.subText && (
                <span className="text-[10px] text-slate-500 font-medium italic">
                  {card.subText}
                </span>
              )}
            </div>
          </BaseCard>
        ))}
      </div>
     
    </div>
  );
};

export default EmployeeTasksStatsHeader;