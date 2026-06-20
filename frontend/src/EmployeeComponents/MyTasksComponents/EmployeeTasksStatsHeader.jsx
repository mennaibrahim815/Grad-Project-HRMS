
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
      if (response.data?.status === "success") setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTaskStats(); }, []);
  useEffect(() => { if (onStatsUpdated) onStatsUpdated(() => fetchTaskStats); }, [onStatsUpdated]);

  const statCards = [
    {
      title: "Due Today",
      value: stats.dueToday || 0,
      icon: <Calendar size={20} style={{ color: "#DF165A" }} />,
      valueColor: "#EC3A76",
      subText: "requires urgent action",
      hasBadge: false,
    },
    {
      title: "Pending Review",
      value: stats.pendingReview || 0,
      icon: <Clock size={20} style={{ color: "#F68018" }} />,
      valueColor: "#F89B49",
      subText: "awaiting manager approval",
      hasBadge: false,
    },
    {
      title: "Completed",
      value: stats.completed?.total || 0,
      icon: <CheckCircle2 size={20} style={{ color: "#10B981" }} />,
      valueColor: "var(--text-main)",
      subText: "",
      hasBadge: true,
      badgeValue: stats.completed?.thisWeek || 0,
    },
  ];

  return (
    <div className="w-full flex flex-col mb-10 gap-6 text-left box-border">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mt-10 items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
            My Tasks
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Manage, update, and track your active project assignments
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {statCards.map((card, index) => (
          <BaseCard
            key={index}
            padding="p-5"
            className="flex flex-col justify-between min-h-[140px] transition-all duration-300 shadow-xl"
          >
            {/* Top */}
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

            {/* Bottom */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-3">
                <h2
                  className="text-4xl font-extrabold tracking-tight"
                  style={{ color: card.valueColor }}
                >
                  {loading ? "..." : card.value.toLocaleString()}
                </h2>
                {card.hasBadge && !loading && (
                  <span className="text-sm font-semibold flex items-center mb-0.5" style={{ color: "#10B981" }}>
                    +{card.badgeValue} this week
                  </span>
                )}
              </div>
              {card.subText && (
                <span className="text-[10px] font-medium italic" style={{ color: "var(--text-muted)" }}>
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