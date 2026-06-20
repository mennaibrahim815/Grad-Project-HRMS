
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