
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '@/services/axios';
import BaseCard from '@/components/UI/Card';
import { ArrowLeft, Calendar, Clock, AlertCircle, FileText, Trash2, CheckCircle2, UserCheck } from 'lucide-react';

const EmployeeLeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaveDetails = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/leaves/${id}`);
      setLeave(response.data?.data);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaveDetails(); }, [id]);

  const handleCancelRequest = async () => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      try {
        await instance.delete(`/leaves/${id}`);
        alert("Leave request cancelled successfully.");
        navigate(-1);
      } catch (error) {
        console.error("Failed to cancel request:", error);
      }
    }
  };

  if (loading) return <div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading leave details...</div>;
  if (!leave)  return <div className="p-6 text-center" style={{ color: '#f87171' }}>Leave request not found.</div>;

  const hrUser = leave.hrApprovedBy;
  const hrName = hrUser?.firstName ? `${hrUser.firstName} ${hrUser.lastName || ""}` : "HR Manager";

  const statusStyle = {
    Approved: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.4)' },
    Rejected: { background: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(248,113,113,0.4)' },
    Pending:  { background: 'rgba(234,179,8,0.15)',  color: '#facc15', border: '1px solid rgba(250,204,21,0.4)'  },
  };
  const activeStatusStyle = statusStyle[leave.status] || statusStyle.Pending;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6" style={{ color: 'var(--text-main)' }}>

      {/* Back Button */}
      <button
        onClick={() => { navigate(-1); }}
        className="flex items-center gap-2 transition-colors text-sm hover:text-cyan-400"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={16} /> Back to My Leaves
      </button>

      <BaseCard>
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
              {leave.type || "Annual"} Leave
            </h2>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={activeStatusStyle}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {leave.status || "Pending"}
            </span>
          </div>

          <hr style={{ borderColor: 'var(--border-main)' }} />

          {/* Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Start Date', value: leave.startDate?.split('T')[0], icon: <Calendar size={14} style={{ color: '#35AAFD' }} /> },
              { label: 'End Date',   value: leave.endDate?.split('T')[0],   icon: <Calendar size={14} style={{ color: '#35AAFD' }} /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="p-3 rounded-xl flex flex-col justify-center"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
                <span className="text-xs flex items-center gap-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                  {icon} {label}
                </span>
                <span className="text-sm font-medium font-mono" style={{ color: 'var(--text-main)' }}>{value}</span>
              </div>
            ))}

            <div className="p-3 rounded-xl flex flex-col justify-center"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
              <span className="text-xs flex items-center gap-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                <Clock size={14} style={{ color: '#35AAFD' }} /> Total Duration
              </span>
              <span className="text-sm font-bold font-mono" style={{ color: '#35AAFD' }}>
                {leave.duration || 0} {leave.duration === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <FileText size={14} /> My Reason / Comments
            </label>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed min-h-[60px]"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)', color: 'var(--text-main)' }}
            >
              {leave.reason || "You didn't provide any specific reason for this request."}
            </div>
          </div>

          {/* Rejected */}
          {leave.status === "Rejected" && (
            <div
              className="p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2"
                style={{ borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#f87171' }}>
                  <AlertCircle size={14} /> Rejection Notice
                </span>
                <span
                  className="text-xs flex items-center gap-1 px-2.5 py-0.5 rounded-md"
                  style={{ color: 'rgba(252,165,165,0.8)', background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(239,68,68,0.1)' }}
                >
                  <UserCheck size={13} /> Processed by: <strong style={{ color: 'var(--text-main)' }}>{hrName}</strong>
                </span>
              </div>
              <div>
                <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>Reason for rejection:</span>
                <p className="text-sm mt-0.5" style={{ color: '#fca5a5' }}>
                  {leave.rejectReason || "No reason specified by HR."}
                </p>
              </div>
            </div>
          )}

          {/* Approved */}
          {leave.status === "Approved" && (
            <div
              className="p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2"
                style={{ borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
                <span className="text-sm flex items-center gap-1.5 font-medium" style={{ color: '#34d399' }}>
                  <CheckCircle2 size={16} /> Leave Request Approved
                </span>
                <span
                  className="text-xs flex items-center gap-1 px-2.5 py-0.5 rounded-md"
                  style={{ color: 'rgba(110,231,183,0.8)', background: 'rgba(6,78,59,0.4)', border: '1px solid rgba(16,185,129,0.1)' }}
                >
                  <UserCheck size={13} /> Approved by: <strong style={{ color: 'var(--text-main)' }}>{hrName}</strong>
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Your time off request is officially active. Enjoy your leave!
              </p>
            </div>
          )}

          {/* Cancel Button */}
          {leave.status === "Pending" && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCancelRequest}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white rounded-xl transition-all"
                style={{ background: '#dc2626' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; }}
              >
                <Trash2 size={14} /> Cancel & Delete Request
              </button>
            </div>
          )}

        </div>
      </BaseCard>
    </div>
  );
};

export default EmployeeLeaveDetails;