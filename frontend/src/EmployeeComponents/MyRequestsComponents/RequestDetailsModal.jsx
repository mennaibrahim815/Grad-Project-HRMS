
import React, { useState, useEffect } from "react";
import instance from "@/services/axios";
import { X, FileText } from "lucide-react";

const RequestDetailsModal = ({ isOpen, requestId, onClose }) => {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;
      try {
        setLoading(true); setError("");
        const response = await instance.get(`/requests/${requestId}`);
        if (response.data?.status === "success") setRequestData(response.data.data.request);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) fetchRequestDetails();
  }, [isOpen, requestId]);

  if (!isOpen) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
      case "Rejected": return { background: 'rgba(244,63,94,0.1)',  color: '#fb7185', border: '1px solid rgba(244,63,94,0.2)'  };
      default:         return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="ltr">
      <div
        className="relative w-full max-w-xl rounded-[2rem] shadow-2xl p-6 text-left max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)', color: 'var(--text-main)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <FileText size={22} style={{ color: '#0293FA' }} />
            <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Request Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl transition-all hover:text-red-400"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-t-[#0293FA] rounded-full animate-spin" style={{ borderColor: 'rgba(2,147,250,0.3)', borderTopColor: '#0293FA' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading details...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="text-center py-8 text-sm" style={{ color: '#fb7185' }}>{error}</div>}

        {/* Content */}
        {!loading && !error && requestData && (
          <div className="space-y-6">

            {/* Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {requestData.type}
                </span>
                <h4 className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-main)' }}>{requestData.title}</h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={getStatusStyle(requestData.status)}>
                {requestData.status}
              </span>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                {
                  label: 'Priority',
                  value: requestData.priority,
                  valueStyle: { color: requestData.priority === 'High' ? '#fb7185' : 'var(--text-main)', fontWeight: 600 }
                },
                {
                  label: 'Submitted On',
                  value: new Date(requestData.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" }),
                  valueStyle: { color: 'var(--text-main)', fontWeight: 500 }
                },
              ].map(({ label, value, valueStyle }) => (
                <div key={label} className="p-3 rounded-xl"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={valueStyle}>{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Employee Description</span>
              <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)', color: 'var(--text-main)' }}>
                {requestData.description}
              </div>
            </div>

            {/* Attachments */}
            {requestData.attachments && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Attachments</span>
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}>
                  <span className="text-xs cursor-pointer hover:underline" style={{ color: '#0293FA' }}>
                    View attached file
                  </span>
                </div>
              </div>
            )}

            {/* HR Response */}
            <div className="pt-4 mt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>HR Response</span>
              {requestData.hrResponse?.text ? (
                <div className="rounded-xl p-4 text-sm leading-relaxed"
                  style={{ background: 'rgba(2,147,250,0.05)', border: '1px solid rgba(2,147,250,0.15)', color: 'var(--text-main)' }}>
                  {requestData.hrResponse.text}
                </div>
              ) : (
                <div className="text-xs italic text-center p-3 rounded-xl border border-dashed"
                  style={{ color: 'var(--text-muted)', background: 'var(--input-bg)', borderColor: 'var(--border-main)' }}>
                  No response from HR yet. This request is still under review.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-main)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--input-bg)'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;