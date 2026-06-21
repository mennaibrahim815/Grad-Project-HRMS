
import React from "react";
import BaseCard from "@/components/UI/Card.jsx";
import { X, Check, Calendar, Download } from "lucide-react";

export default function HrTaskCard({ task, onAction }) {
  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":   return { background: "rgba(239,68,68,0.1)",  color: "#f87171", border: "1px solid rgba(239,68,68,0.2)"  };
      case "medium": return { background: "rgba(234,179,8,0.1)",  color: "#facc15", border: "1px solid rgba(234,179,8,0.2)"  };
      default:       return { background: "rgba(6,182,212,0.1)",  color: "#22d3ee", border: "1px solid rgba(6,182,212,0.2)"  };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <BaseCard padding="p-5" className="w-full transition-all duration-300 hover:translate-y-[-2px] flex flex-col justify-between shadow-xl">
      <div className="space-y-3">

        {/* Title + Priority */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-base line-clamp-2" style={{ color: "var(--text-main)" }}>
            {task.title}
          </h3>
          <span
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex-shrink-0"
            style={priorityStyle}
          >
            {task.priority || "Medium"}
          </span>
        </div>

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <Calendar size={13} style={{ color: "var(--text-muted)" }} />
            <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        )}

        {/* Assigned Employee */}
        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="rounded-xl p-3 space-y-2"
            style={{ background: "var(--input-bg)", border: "1px solid var(--border-subtle)" }}>
            <span className="text-[10px] uppercase tracking-wider font-bold block" style={{ color: "var(--text-muted)" }}>
              Assigned Employee:
            </span>
            {task.assignedTo.map((emp) => {
              const fullName = `${emp.general?.firstName || ""} ${emp.general?.lastName || ""}`.trim() || "Unknown Employee";
              return (
                <div key={emp._id} className="flex items-center gap-2.5">
                  <img
                    src={emp.general?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`}
                    alt={fullName}
                    className="w-7 h-7 rounded-full object-cover"
                    style={{ border: "1px solid var(--border-main)" }}
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`; }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>{fullName}</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{emp.employee?.jobTitle || "Developer"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Document Link */}
        <div className="pt-2">
          <span className="text-[11px] font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
            Submitted Deliverable:
          </span>
          
          <a
            href={task.document}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl p-2.5 text-xs font-medium transition-colors"
            style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#22d3ee" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(6,182,212,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(6,182,212,0.1)"; }}
          >
            <span className="truncate max-w-[200px]">Download Attached File</span>
            <Download size={14} className="flex-shrink-0" />
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4 mt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => { onAction(task._id, task.title, "reject"); }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
          style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <X size={14} /> Reject
        </button>
        <button
          onClick={() => { onAction(task._id, task.title, "accept"); }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white text-xs font-semibold transition-all"
          style={{ background: "#059669" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#059669"; }}
        >
          <Check size={14} /> Accept
        </button>
      </div>
    </BaseCard>
  );
}