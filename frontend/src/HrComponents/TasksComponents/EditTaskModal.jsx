
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditTaskModal({ isOpen, onClose, task, onSave }) {
  const [formData, setFormData] = useState({ title: "", status: "Pending", priority: "Medium", deadline: "" });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        status: task.status || "Pending",
        priority: task.priority || "Medium",
        deadline: task.deadline ? task.deadline.split("T")[0] : ""
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => { e.preventDefault(); onSave(task._id, formData); };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-deep)',
    border: '1px solid var(--border-main)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    color: 'var(--text-main)',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    color: 'var(--text-muted)',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="max-w-lg w-full shadow-2xl overflow-hidden rounded-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-main)' }}>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Edit Task</h3>
          <button
            type="button" onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:text-red-400"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Title */}
          <div>
            <label style={labelStyle}>Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={inputStyle}
              className="focus:border-cyan-500 placeholder:text-[var(--text-muted)]"
              required
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={inputStyle}
                className="cursor-pointer focus:border-cyan-500"
              >
                <option value="Pending">Pending</option>
                <option value="On-going">On-going</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={inputStyle}
                className="cursor-pointer focus:border-cyan-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label style={labelStyle}>Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              style={inputStyle}
              className="focus:border-cyan-500 [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border-main)' }}>
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all"
              style={{ background: '#0891b2' }}
              onMouseEnter={e => e.currentTarget.style.background = '#06b6d4'}
              onMouseLeave={e => e.currentTarget.style.background = '#0891b2'}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}