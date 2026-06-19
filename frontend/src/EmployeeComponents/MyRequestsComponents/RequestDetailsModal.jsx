// import React, { useState, useEffect } from "react";
// import instance from "@/services/axios";
// import { X, Calendar, Shield, Info, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

// const RequestDetailsModal = ({ isOpen, requestId, onClose }) => {
//   const [requestData, setRequestData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRequestDetails = async () => {
//       if (!requestId) return;
      
//       try {
//         setLoading(true);
//         setError("");
//         // مناداة الـ API بالـ ID بتاع الطلب المختار
//         const response = await instance.get(`/requests/${requestId}`);
//         if (response.data?.status === "success") {
//           setRequestData(response.data.data.request);
//         }
//       } catch (err) {
//         console.error("Error fetching request details:", err);
//         setError("Failed to load request details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isOpen) {
//       fetchRequestDetails();
//     }
//   }, [isOpen, requestId]);

//   if (!isOpen) return null;

//   // دالة لتحديد لون وحالة الطلب بشكل جمالي
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
//       case "Rejected": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
//       default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="ltr">
//       <div className="relative w-full max-w-xl bg-[#182731] border border-slate-700/50 rounded-[2rem] shadow-2xl p-6 text-left text-white max-h-[90vh] overflow-y-auto">
        
//         {/* Header */}
//         <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-700/40">
//           <div className="flex items-center gap-2">
//             <FileText className="text-[#0293FA]" size={22} />
//             <h3 className="text-xl font-bold tracking-tight text-white">Request Details</h3>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 text-slate-400 hover:text-white transition-all"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12 gap-3">
//             <div className="w-8 h-8 border-2 border-[#0293FA]/30 border-t-[#0293FA] rounded-full animate-spin"></div>
//             <p className="text-slate-400 text-sm">Loading details...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-8 text-rose-400 text-sm">{error}</div>
//         ) : requestData ? (
//           <div className="space-y-6">
            
//             {/* Title & Status Badge */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-800">
//               <div>
//                 <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{requestData.type}</span>
//                 <h4 className="text-lg font-bold text-white mt-0.5">{requestData.title}</h4>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(requestData.status)}`}>
//                 {requestData.status}
//               </span>
//             </div>

//             {/* Meta Info Grid */}
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div className="bg-slate-900/20 p-3 rounded-xl border border-slate-800/50">
//                 <span className="text-xs text-slate-500 block mb-1">Priority</span>
//                 <span className={`font-semibold ${requestData.priority === 'High' ? 'text-rose-400' : 'text-slate-300'}`}>
//                   {requestData.priority}
//                 </span>
//               </div>
//               <div className="bg-slate-900/20 p-3 rounded-xl border border-slate-800/50">
//                 <span className="text-xs text-slate-500 block mb-1">Submitted On</span>
//                 <span className="text-slate-300 font-medium">
//                   {new Date(requestData.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
//                 </span>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="space-y-1.5">
//               <span className="text-xs font-semibold text-slate-400">Employee Description</span>
//               <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
//                 {requestData.description}
//               </div>
//             </div>

//             {/* Attachments Section if exists */}
//             {requestData.attachments && (
//               <div className="space-y-1.5">
//                 <span className="text-xs font-semibold text-slate-400">Attachments</span>
//                 <div className="flex items-center gap-2 p-3 bg-slate-900/20 border border-slate-800 rounded-xl">
//                   <span className="text-xs text-[#0293FA] hover:underline cursor-pointer">
//                     View attached file
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* HR Response Section (بيظهر لما الـ HR يرد على الطلب) */}
//             <div className="border-t border-slate-700/40 pt-4 mt-6">
//               <span className="text-xs font-semibold text-slate-400 block mb-2">HR Response</span>
//               {requestData.hrResponse?.text ? (
//                 <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4 text-sm text-slate-300">
//                   <p className="leading-relaxed">{requestData.hrResponse.text}</p>
//                 </div>
//               ) : (
//                 <div className="text-xs italic text-slate-500 bg-slate-900/10 p-3 rounded-xl border border-dashed border-slate-800 text-center">
//                   No response from HR yet. This request is still under review.
//                 </div>
//               )}
//             </div>

//           </div>
//         ) : null}

//         {/* Footer Action */}
//         <div className="flex justify-end pt-4 mt-6 border-t border-slate-700/40">
//           <button 
//             onClick={onClose} 
//             className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-all"
//           >
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default RequestDetailsModal;
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