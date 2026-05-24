import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx"; // تأكدي من مسار الـ BaseCard عندك
import ReusableCalendar from "@/components/UI/ReusableCalendar.jsx"; // تأكدي من مسار الكالندر عندك
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CalendarDays 
} from "lucide-react";

const LeaveStatsHeader = ({ onStatsUpdated }) => {
  const [statsMonth, setStatsMonth] = useState(new Date().getMonth() + 1);
  const [statsYear, setStatsYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const calendarValue = `${statsYear}-${String(statsMonth).padStart(2, "0")}`;

  const fetchMonthlyStats = async () => {
    try {
      setStatsLoading(true);
      const response = await instance.get(`/leaves/stats/monthly`, {
        params: { month: statsMonth, year: statsYear }
      });
      setStats(response.data?.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
  }, [statsMonth, statsYear]);

  // دي عشان نخلي الصفحة الأب ترفع الإشارة للـ Header عشان يعيد الجلب لو حصل تغيير (زي قبول/رفض إجازة)
  useEffect(() => {
    if (onStatsUpdated) {
      onStatsUpdated(() => fetchMonthlyStats);
    }
  }, [onStatsUpdated]);

  const handleCalendarSave = (selectedMonthYear) => {
    if (selectedMonthYear && typeof selectedMonthYear === "string") {
      const [y, m] = selectedMonthYear.split("-");
      setStatsYear(Number(y));
      setStatsMonth(Number(m));
    }
  };

  const statCards = [
    {
      title: "Total Requests",
      value: stats?.totalRequests || 0,
      icon: <FileText className="text-slate-400" size={20} />,
      textColor: "text-white"
    },
    {
      title: "Approved Requests",
      value: stats?.approvedCount || 0,
      icon: <CheckCircle2 className="text-emerald-500" size={20} />,
      textColor: "text-emerald-400"
    },
    {
      title: "Pending Requests",
      value: stats?.pendingCount || 0,
      icon: <Clock className="text-yellow-500" size={20} />,
      textColor: "text-yellow-400"
    },
    {
      title: "Rejected Requests",
      value: stats?.rejectedCount || 0,
      icon: <XCircle className="text-red-500" size={20} />,
      textColor: "text-red-400"
    },
    {
      title: "Approved Days",
      value: stats?.totalApprovedDays || 0,
      icon: <CalendarDays className="text-[#0095ff]" size={20} />,
      textColor: "text-[#0095ff]"
    }
  ];

  return (
    <div className="w-full space-y-8 mb-10">
      {/* العنوان والكاليندر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <div className="text-white text-2xl font-bold tracking-tight mt-10">Leave Requests</div>
          <p className="text-slate-500 text-xs mt-1">Manage and track employee leave logs and analytics</p>
        </div>
        
        <div className="z-50">
          <ReusableCalendar 
            mode="month"
            value={calendarValue}
            onSave={handleCalendarSave}
          />
        </div>
      </div>

      {/* الـ 5 كاردز */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card, index) => (
          <BaseCard 
            key={index} 
            padding="p-5" 
            className="flex flex-col justify-between min-h-[145px] hover:border-slate-600/50 transition-all duration-300 shadow-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {card.title}
              </span>
              <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/20">
                {card.icon}
              </div>
            </div>
            
            <div className="space-y-0.5 text-left">
              <h2 className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
                {statsLoading ? "..." : card.value.toLocaleString()}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium italic">this month</span>
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};

export default LeaveStatsHeader;