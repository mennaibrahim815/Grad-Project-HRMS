
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import BaseCard from "@/components/UI/Card.jsx";
import LeaveApplicationModel from "@/EmployeeComponents/MyleavesComponents/Leave ApplicationModel.jsx";
import { Calendar, ShieldAlert, Sparkles, Plus } from "lucide-react";

const EmployeeLeaveStatsHeader = ({ onStatsUpdated }) => {
  const [balances, setBalances] = useState({ annual: 0, sick: 0, casual: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaveBalances = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/leaves/my-balance");
      if (response.data?.status === "success") setBalances(response.data.data);
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaveBalances(); }, []);
  useEffect(() => { if (onStatsUpdated) onStatsUpdated(() => fetchLeaveBalances); }, [onStatsUpdated]);

  const statCards = [
    { title: "Annual Leave",  value: balances.annual  || 0, icon: <Calendar    size={20} style={{ color: "#0293FA" }} />, valueColor: "#35AAFD" },
    { title: "Sick Leave",    value: balances.sick    || 0, icon: <ShieldAlert  size={20} style={{ color: "#DF165A" }} />, valueColor: "#EC3A76" },
    { title: "Casual Leave",  value: balances.casual  || 0, icon: <Sparkles    size={20} style={{ color: "#F68018" }} />, valueColor: "#F89B49" },
  ];

  return (
    <div className="w-full px-6 pt-6 mb-10 space-y-6 text-left box-border">

      {/* Title + Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
            My Leaves
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Apply and Manage your leaves
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-200 text-sm"
          style={{ background: "#0293FA" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0282dd"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0293FA"; }}
        >
          <Plus size={18} />
          <span>Apply new leave</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {statCards.map((card, index) => (
          <BaseCard
            key={index}
            padding="p-5"
            className="flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--text-muted)" }}
              >
                {card.title}
              </span>
              <div
                className="p-2 rounded-xl"
                style={{ background: "var(--input-bg)", border: "1px solid var(--border-subtle)" }}
              >
                {card.icon}
              </div>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: card.valueColor }}>
                {loading ? "..." : card.value.toLocaleString()}
              </h2>
              <span className="text-[10px] font-medium italic" style={{ color: "var(--text-muted)" }}>
                days available
              </span>
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