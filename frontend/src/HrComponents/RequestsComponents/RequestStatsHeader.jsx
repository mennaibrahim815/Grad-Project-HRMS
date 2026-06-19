
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx"; 
import ReusableCalendar from "@/components/UI/ReusableCalendar.jsx"; 
import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";

const RequestStatsHeader = ({ onStatsUpdated, month, year, setMonth, setYear }) => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const calendarValue = `${year}-${String(month).padStart(2, "0")}`;

  const fetchMonthlyStats = async () => {
    try {
      setStatsLoading(true);
      // الاندبوينت الصح حسب رد الباكيند بتاعك
      const response = await instance.get(`/requests/monthly-stats`, {
        params: { month, year }
      });
      // قراءة الداتا مباشرة بنفس طريقة كود الإجازات
      setStats(response.data?.data);
    } catch (error) {
      console.error("Error fetching request stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyStats();
  }, [month, year]);

  useEffect(() => {
    if (onStatsUpdated) {
      onStatsUpdated(() => fetchMonthlyStats);
    }
  }, [onStatsUpdated]);

  const handleCalendarSave = (selectedMonthYear) => {
    if (selectedMonthYear && typeof selectedMonthYear === "string") {
      const [y, m] = selectedMonthYear.split("-");
      setYear(Number(y));
      setMonth(Number(m));
    }
  };

  const statCards = [
    { title: "Total Requests", value: stats?.totalRequests || 0, icon: <FileText className="text-slate-400" size={20} />, textColor: "text-white" },
    { title: "Approved Requests", value: stats?.approvedCount || 0, icon: <CheckCircle2 className="text-[#00E583]" size={20} />, textColor: "text-[#4BFFB2]" },
    { title: "Pending Requests", value: stats?.pendingCount || 0, icon: <Clock className="text-[#F68018]" size={20} />, textColor: "text-[#F89B49]" },
    { title: "Rejected Requests", value: stats?.rejectedCount || 0, icon: <XCircle className="text-[#DF165A]" size={20} />, textColor: "text-[#EC3A76]" }
  ];

  return (
    <div className="w-full space-y-8 mb-10 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-white text-2xl font-bold tracking-tight mt-10">Employee Requests</div>
          <p className="text-[#7E889A] text-xs mt-1">Review, filter, and respond to general employee requests and operations</p>
        </div>
        <div className="z-50">
          <ReusableCalendar mode="month" value={calendarValue} onSave={handleCalendarSave} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <BaseCard key={index} padding="p-5" className="flex flex-col justify-between min-h-[145px] hover:border-slate-600/50 transition-all duration-300 shadow-xl text-left">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7E889A]">{card.title}</span>
              <div className="p-2 bg-[#1B1E22] rounded-xl border border-[#383D47]/20">{card.icon}</div>
            </div>
            <div className="space-y-0.5">
              <h2 className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
                {statsLoading ? "..." : card.value.toLocaleString()}
              </h2>
              <span className="text-[10px] text-[#7E889A] font-medium italic">this month</span>
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};

export default RequestStatsHeader;