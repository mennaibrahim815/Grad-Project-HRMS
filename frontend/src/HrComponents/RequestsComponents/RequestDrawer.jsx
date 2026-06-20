
import React, { useState } from "react";
import { Check, X, XCircle, Upload, Send } from "lucide-react";

const RequestDrawer = ({ isOpen, req, onClose, onAction }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [hrComment, setHrComment] = useState("");
  const [hrName, setHrName] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  if (!isOpen || !req) return null;

  const firstName = req.employeeId?.general?.firstName || "Unknown";
  const lastName  = req.employeeId?.general?.lastName  || "Employee";
  const fullName  = `${firstName} ${lastName}`;
  const department = req.employeeId?.employee?.department;

  const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });

  const handleInitialAction = (actionType) => { setSelectedAction(actionType); setShowReplyForm(true); };
  const handleCancelReply   = () => { setShowReplyForm(false); setHrComment(""); setHrName(""); setAttachedFile(null); };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!hrName.trim()) { alert("Please enter HR Name"); return; }
    const formData = new FormData();
    formData.append("status", selectedAction);
    formData.append("text", hrComment);
    formData.append("handledBy", hrName);
    if (attachedFile) formData.append("attachments", attachedFile);
    onAction(req._id, formData);
    handleCancelReply();
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-deep)',
    border: '1px solid var(--border-main)',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '12px',
    color: 'var(--text-main)',
    outline: 'none',
    resize: 'none',
  };

  const labelStyle = { color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
        style={{ background: 'var(--bg-main)', borderLeft: '1px solid var(--border-main)' }}
      >
        <div className="space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center pb-5" style={{ borderBottom: '1px solid var(--border-main)' }}>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>Request Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:text-red-400"
              style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            >
              <XCircle size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 text-left">

            {/* Employee */}
            <div>
              <span style={labelStyle}>Employee</span>
              <div className="text-base font-bold" style={{ color: 'var(--text-main)' }}>{fullName}</div>
              {department && (
                <span className="text-xs font-mono block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Dept: {department}
                </span>
              )}
            </div>

            {/* Type + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span style={labelStyle}>Request Type</span>
                <div className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{req.type}</div>
              </div>
              <div>
                <span style={labelStyle}>Creation Date</span>
                <div className="text-sm font-medium font-mono" style={{ color: 'var(--text-main)' }}>{formattedDate}</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <span style={labelStyle}>Title</span>
              <div
                className="text-sm font-semibold p-3 rounded-xl font-mono"
                style={{ color: '#F89B49', background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}
              >
                {req.title}
              </div>
            </div>

            {/* Description */}
            <div>
              <span style={labelStyle}>Description / Reason</span>
              <div
                className="text-sm p-4 rounded-xl leading-relaxed max-h-40 overflow-y-auto"
                style={{ color: 'var(--text-muted)', background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}
              >
                {req.description}
              </div>
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="pt-5 space-y-4 text-left" style={{ borderTop: '1px solid var(--border-main)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${selectedAction === "Approved" ? "bg-emerald-500" : "bg-red-500"}`} />
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                  Responding as:{" "}
                  <span style={{ color: selectedAction === "Approved" ? '#00E583' : '#EC3A76' }}>
                    {selectedAction}
                  </span>
                </h4>
              </div>

              <div>
                <label style={labelStyle}>HR Response / Comment</label>
                <textarea
                  rows="3"
                  value={hrComment}
                  onChange={(e) => setHrComment(e.target.value)}
                  placeholder="Write your response or reason here..."
                  style={inputStyle}
                  className="placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label style={labelStyle}>By HR (Your Name) *</label>
                <input
                  type="text"
                  required
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                  placeholder="Enter your name"
                  style={inputStyle}
                  className="font-mono placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <label style={labelStyle}>Attachment (Optional)</label>
                <div
                  className="relative flex items-center justify-center w-full rounded-xl p-3 border border-dashed cursor-pointer group transition-colors"
                  style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-main)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
                >
                  <input type="file" onChange={(e) => setAttachedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Upload size={14} />
                    <span className="truncate max-w-[200px]">
                      {attachedFile ? attachedFile.name : "Upload document/letter"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                  style={{ background: selectedAction === "Approved" ? '#00E583' : '#dc2626' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Send size={12} /> Confirm Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancelReply}
                  className="px-4 text-xs font-bold py-2.5 rounded-xl transition-colors hover:text-red-400"
                  style={{ background: 'transparent', border: '1px solid var(--border-main)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {!showReplyForm && (
          <div className="mt-8">
            {req.status === "Pending" ? (
              <div className="pt-5 flex gap-4" style={{ borderTop: '1px solid var(--border-main)' }}>
                <button
                  onClick={() => handleInitialAction("Approved")}
                  className="flex-1 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-lg"
                  style={{ background: '#00E583' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4BFFB2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#00E583'}
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleInitialAction("Rejected")}
                  className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                  style={{ background: 'transparent', color: '#EC3A76', border: '1px solid rgba(153,27,27,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(223,22,90,0.1)'; e.currentTarget.style.borderColor = '#EC3A76'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(153,27,27,0.5)'; }}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            ) : (
              <div className="pt-5" style={{ borderTop: '1px solid var(--border-main)' }}>
                <div
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold font-mono text-sm border"
                  style={{
                    background: req.status === "Approved" ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color:      req.status === "Approved" ? '#00E583' : '#EC3A76',
                    border:     req.status === "Approved" ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  {req.status === "Approved" ? <Check size={16} /> : <X size={16} />}
                  This request has been {req.status}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDrawer;