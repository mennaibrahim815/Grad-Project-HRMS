
// import React, { useState, useRef } from "react";
// import instance from "@/services/axios"; 
// import { X, Send, AlertCircle, Upload, Paperclip } from "lucide-react";

// const RequestApplicationModel = ({ isOpen, onClose, onRequestSubmitted }) => {
//   const [formData, setFormData] = useState({
//     type: "HR Letter",
//     title: "",
//     priority: "Medium",
//     description: "",
//   });
//   const [attachment, setAttachment] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const fileInputRef = useRef(null);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // التأكد من نوع الملف (PDF أو صورة)
//       if (file.type === "application/pdf" || file.type.startsWith("image/")) {
//         setAttachment(file);
//         setError("");
//       } else {
//         setError("Only Images or PDF files are allowed.");
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // التحقق من شروط الباك إند (Validation)
//     if (formData.title.length < 5 || formData.title.length > 100) {
//       setError("Title must be between 5 and 100 characters.");
//       return;
//     }
//     if (formData.description.length < 10) {
//       setError("Description must be at least 10 characters long.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // تحويل البيانات إلى FormData عشان الباك إند يستقبل الـ attachment
//       const data = new FormData();
//       data.append("type", formData.type);
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("priority", formData.priority);
      
//       if (attachment) {
//         data.append("attachment", attachment); // إرفاق الملف لو موجود
//       }

//       // إرسال الـ POST Request مع تحديد الـ Content-Type لـ multipart/form-data
//       const response = await instance.post("/requests/create", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data?.status === "success") {
//         // ريست كامل للفورم والملف
//         setFormData({ type: "HR Letter", title: "", priority: "Medium", description: "" });
//         setAttachment(null);
        
//         if (onRequestSubmitted) {
//           onRequestSubmitted(); // تحديث كروت الإحصائيات فوراً
//         }
//         onClose();
//       }
//     } catch (err) {
//       console.error("Error creating request:", err);
//       // معالجة الخطأ المطور اللي صلحناه سوا عشان الشاشة الموف متظهرش
//       const serverError = err.response?.data?.message;
//       if (serverError && typeof serverError === "object") {
//         setError(serverError.message || JSON.stringify(serverError));
//       } else {
//         setError(serverError || "Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm" dir="ltr">
//       <div className="relative w-full max-w-lg bg-[#182731] border border-slate-700/50 rounded-[2rem] shadow-2xl p-6 text-left text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        
//         {/* Modal Header */}
//         <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-700/40">
//           <h3 className="text-xl font-bold tracking-tight text-white">Create New Request</h3>
//           <button 
//             onClick={onClose} 
//             className="p-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 text-slate-400 hover:text-white transition-all"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="flex items-center gap-2 p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
//             <AlertCircle size={16} className="shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
//             {/* Request Type (المطابق للباك إند) */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-400">Request Type *</label>
//               <select 
//                 name="type" 
//                 value={formData.type} 
//                 onChange={handleChange} 
//                 className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0293FA]"
//               >
//                 <option value="HR Letter" className="bg-[#182731]">HR Letter</option>
//                 <option value="Payroll Inquiry" className="bg-[#182731]">Payroll Inquiry</option>
//                 <option value="Complaint" className="bg-[#182731]">Complaint</option>
//                 <option value="IT Support" className="bg-[#182731]">IT Support</option>
//                 <option value="Other" className="bg-[#182731]">Other</option>
//               </select>
//             </div>

//             {/* Priority */}
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-slate-400">Priority</label>
//               <select 
//                 name="priority" 
//                 value={formData.priority} 
//                 onChange={handleChange} 
//                 className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0293FA]"
//               >
//                 <option value="Low" className="bg-[#182731]">Low</option>
//                 <option value="Medium" className="bg-[#182731]">Medium</option>
//                 <option value="High" className="bg-[#182731]">High</option>
//               </select>
//             </div>
//           </div>

//           {/* Title */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-slate-400">Request Title * <span className="text-[10px] text-slate-500">(Min 5 chars)</span></label>
//             <input 
//               type="text" 
//               name="title" 
//               value={formData.title} 
//               onChange={handleChange} 
//               placeholder="e.g., Need bank letter" 
//               className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0293FA]" 
//               required 
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-slate-400">Description * <span className="text-[10px] text-slate-500">(Min 10 chars)</span></label>
//             <textarea 
//               name="description" 
//               value={formData.description} 
//               onChange={handleChange} 
//               rows="3" 
//               placeholder="Please provide your request details here..." 
//               className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0293FA] resize-none" 
//               required 
//             />
//           </div>

//           {/* Attachment Input (اختياري وديناميكي) */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-slate-400">Attachment <span className="text-[10px] text-slate-500">(Optional: Image or PDF)</span></label>
//             <div 
//               onClick={() => fileInputRef.current.click()}
//               className="flex items-center justify-center gap-2 w-full bg-slate-900/30 border border-dashed border-slate-700/60 hover:border-[#0293FA]/50 rounded-xl p-3 cursor-pointer transition-all"
//             >
//               <input 
//                 type="file" 
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*,application/pdf"
//                 className="hidden"
//               />
//               {attachment ? (
//                 <div className="flex items-center gap-2 text-sm text-[#34D399] font-medium">
//                   <Paperclip size={16} />
//                   <span className="truncate max-w-[250px]">{attachment.name}</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 text-sm text-slate-400">
//                   <Upload size={16} />
//                   <span>Choose file to upload</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-700/40">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               disabled={loading} 
//               className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm text-slate-300 transition-all"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={loading} 
//               className="flex items-center gap-2 bg-[#0293FA] hover:bg-[#0282dd] text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
//             >
//               {loading ? (
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               ) : (
//                 <Send size={16} />
//               )}
//               <span>Submit Request</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequestApplicationModel;
import React, { useState, useRef } from "react";
import instance from "@/services/axios";
import { X, Send, AlertCircle, Upload, Paperclip } from "lucide-react";

const RequestApplicationModel = ({ isOpen, onClose, onRequestSubmitted }) => {
  const [formData, setFormData] = useState({ type: "HR Letter", title: "", priority: "Medium", description: "" });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      setAttachment(file); setError("");
    } else {
      setError("Only Images or PDF files are allowed.");
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.title.length < 5 || formData.title.length > 100) { setError("Title must be between 5 and 100 characters."); return; }
    if (formData.description.length < 10) { setError("Description must be at least 10 characters long."); return; }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("type", formData.type);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priority", formData.priority);
      if (attachment) data.append("attachment", attachment);

      const response = await instance.post("/requests/create", data, { headers: { "Content-Type": "multipart/form-data" } });

      if (response.data?.status === "success") {
        setFormData({ type: "HR Letter", title: "", priority: "Medium", description: "" });
        setAttachment(null);
        if (onRequestSubmitted) onRequestSubmitted();
        onClose();
      }
    } catch (err) {
      const serverError = err.response?.data?.message;
      setError(typeof serverError === "object" ? (serverError.message || JSON.stringify(serverError)) : (serverError || "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-main)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '14px',
    color: 'var(--text-main)',
    outline: 'none',
  };

  const typeOptions = ["HR Letter", "Payroll Inquiry", "Complaint", "IT Support", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm" dir="ltr">
      <div
        className="relative w-full max-w-lg rounded-[2rem] shadow-2xl p-6 text-left max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)', color: 'var(--text-main)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Create New Request</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl transition-all hover:text-red-400"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 mb-4 rounded-xl text-sm"
            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185' }}>
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Type + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Request Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle} className="cursor-pointer focus:border-[#0293FA]">
                {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle} className="cursor-pointer focus:border-[#0293FA]">
                {["Low", "Medium", "High"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Request Title * <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>(Min 5 chars)</span>
            </label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g., Need bank letter"
              style={inputStyle}
              className="focus:border-[#0293FA] placeholder:text-[var(--text-muted)]"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Description * <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>(Min 10 chars)</span>
            </label>
            <textarea
              name="description" value={formData.description} onChange={handleChange}
              rows="3" placeholder="Please provide your request details here..."
              style={{ ...inputStyle, resize: 'none' }}
              className="focus:border-[#0293FA] placeholder:text-[var(--text-muted)]"
              required
            />
          </div>

          {/* Attachment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Attachment <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>(Optional: Image or PDF)</span>
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center gap-2 w-full rounded-xl p-3 cursor-pointer transition-all border border-dashed"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-main)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(2,147,250,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
              {attachment ? (
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#34D399' }}>
                  <Paperclip size={16} />
                  <span className="truncate max-w-[250px]">{attachment.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Upload size={16} />
                  <span>Choose file to upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button" onClick={onClose} disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm transition-all"
              style={{ border: '1px solid var(--border-main)', color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
              style={{ background: '#0293FA' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0282dd'}
              onMouseLeave={e => e.currentTarget.style.background = '#0293FA'}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={16} />
              }
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestApplicationModel;