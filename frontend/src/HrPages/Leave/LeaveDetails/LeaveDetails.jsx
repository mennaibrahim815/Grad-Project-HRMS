
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/services/axios";
import { ArrowLeft, Calendar } from "lucide-react";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveById = async () => {
      try {
        const response = await API.get(`/leaves/${id}`);
        setLeave(response.data.data);
      } catch (error) {
        console.error("Error fetching leave details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveById();
  }, [id]);

  if (loading) return <div className="p-10 text-center" style={{ color: 'var(--text-main)' }}>Loading...</div>;
  if (!leave)  return <div className="p-10 text-center" style={{ color: 'var(--text-main)' }}>No data found.</div>;

  const empBalances = leave?.employee || {};

  const statusStyle = {
    Approved: { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' },
    Rejected: { background: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
    Pending:  { background: 'rgba(234,179,8,0.1)',  color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' },
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-4 mt-10">

        {/* Back Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-main)'; }}
          >
            <ArrowLeft size={18} />
            Back to Requests
          </button>
        </div>

        {/* Main Card */}
        <div
          className="backdrop-blur-sm rounded-[2rem]"
          style={{
            background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
            border: '1px solid var(--card-border)',
          }}
        >
          {/* Header */}
          <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between"
            style={{ borderBottom: '1px solid var(--border-main)' }}>
            <div className="flex items-center gap-6">
              <img
                src={leave.employee?.avatar || `https://ui-avatars.com/api/?name=${leave.employee?.firstName || 'User'}&background=0D8ABC&color=fff`}
                className="w-24 h-24 rounded-full object-cover shadow-lg"
                style={{ border: '4px solid var(--bg-card)' }}
                alt="avatar"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                  {leave.employee?.firstName} {leave.employee?.lastName}
                </h2>
                <p className="font-medium" style={{ color: 'var(--accent-cyan)' }}>{leave.employee?.jobTitle}</p>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{leave.employee?.email}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={statusStyle[leave.status] || statusStyle.Pending}>
                  {leave.status}
                </span>
              </div>
            </div>

            {/* Balances */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto pt-4 md:pt-0"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
              // remove border-t on md
            >
              {[
                { label: 'Annual',  value: empBalances.annualLeaveBalance  ?? 0, color: '#22d3ee', bg: 'rgba(6,182,212,0.05)',   border: 'rgba(6,182,212,0.2)'   },
                { label: 'Sick',    value: empBalances.sickLeaveBalance    ?? 0, color: '#34d399', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)' },
                { label: 'Casual',  value: empBalances.casualLeaveBalance  ?? 0, color: '#fbbf24', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.2)' },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} className="px-4 py-2.5 rounded-xl text-left min-w-[110px] flex-1 md:flex-none"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="text-lg font-black font-mono mt-0.5" style={{ color }}>
                    {value}<span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>d</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Leave Info */}
            <div className="space-y-4">
              <h3 className="uppercase text-xs font-bold tracking-widest text-left" style={{ color: 'var(--text-muted)' }}>
                Leave Information
              </h3>
              {[
                { label: 'Type',       value: leave.type },
                { label: 'Duration',   value: `${leave.duration} Days` },
                { label: 'Date Range', value: `${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl text-left"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Reason & Approval */}
            <div className="space-y-4">
              <h3 className="uppercase text-xs font-bold tracking-widest text-left" style={{ color: 'var(--text-muted)' }}>
                Reason & Approval
              </h3>
              <div className="p-4 rounded-xl min-h-[100px] text-left"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Reason</p>
                <p className="text-sm italic" style={{ color: 'var(--text-main)' }}>"{leave.reason}"</p>
              </div>
              {leave.hrApprovedBy && (
                <div className="p-4 rounded-r-xl text-left"
                  style={{ borderLeft: '4px solid var(--accent-cyan)', background: 'rgba(34,211,238,0.05)' }}>
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--accent-cyan)' }}>Action By HR</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                    {leave.hrApprovedBy.firstName} {leave.hrApprovedBy.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;