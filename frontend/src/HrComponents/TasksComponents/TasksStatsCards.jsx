import React from "react";
import BaseCard from "@/components/UI/Card.jsx";
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function TasksStatsCards({ stats, loading }) {
  const getCardDetails = (title) => {
    switch (title) {
      case "All Tasks":   return { icon: ListTodo,    iconColor: '#60a5fa', iconBg: 'rgba(59,130,246,0.1)',  iconBorder: 'rgba(59,130,246,0.2)',  valueColor: '#60a5fa' };
      case "On-going":   return { icon: Clock,        iconColor: '#22d3ee', iconBg: 'rgba(6,182,212,0.1)',   iconBorder: 'rgba(6,182,212,0.2)',   valueColor: '#22d3ee' };
      case "Pending":    return { icon: AlertCircle,  iconColor: '#facc15', iconBg: 'rgba(234,179,8,0.1)',   iconBorder: 'rgba(234,179,8,0.2)',   valueColor: '#eab308' };
      case "Completed":  return { icon: CheckCircle2, iconColor: '#34d399', iconBg: 'rgba(16,185,129,0.1)',  iconBorder: 'rgba(16,185,129,0.2)',  valueColor: '#34d399' };
      default:           return { icon: ListTodo,     iconColor: 'var(--text-muted)', iconBg: 'var(--input-bg)', iconBorder: 'var(--border-main)', valueColor: 'var(--text-main)' };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full">
        {[1, 2, 3, 4].map((i) => (
          <BaseCard key={i} padding="p-6" className="animate-pulse min-h-[145px]">
            <div className="flex justify-between items-start">
              <div className="h-3 rounded w-2/3 mb-6" style={{ background: 'var(--input-bg)' }} />
              <div className="w-9 h-9 rounded-xl"      style={{ background: 'var(--input-bg)' }} />
            </div>
            <div className="h-8 rounded w-1/3" style={{ background: 'var(--input-bg)' }} />
          </BaseCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full">
      {stats.map((item, index) => {
        const { icon: Icon, iconColor, iconBg, iconBorder, valueColor } = getCardDetails(item.title);
        return (
          <BaseCard
            key={index} padding="p-6"
            className="w-full transition-all duration-300 hover:translate-y-[-2px] min-h-[145px] flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-start justify-between w-full mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider pt-1" style={{ color: 'var(--text-muted)' }}>
                {item.title}
              </span>
              <div className="p-2 rounded-xl flex items-center justify-center shrink-0"
                style={{ color: iconColor, background: iconBg, border: `1px solid ${iconBorder}` }}>
                <Icon size={16} />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-end justify-start w-full">
              <span className="text-3xl font-bold tracking-tight" style={{ color: valueColor }}>
                {item.value}
              </span>
            </div>
          </BaseCard>
        );
      })}
    </div>
  );
}