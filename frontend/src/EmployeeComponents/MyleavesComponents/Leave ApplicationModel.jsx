// import React, { useState } from "react";
// import instance from "@/services/axios";
// import { X, Upload, AlertCircle, RotateCcw } from "lucide-react";

// const LeaveApplicationModel = ({ isOpen, onClose, onLeaveSubmitted }) => {
//   const initialFormState = { type: "Annual", startDate: "", endDate: "", reason: "" };
//   const [formData, setFormData] = useState(initialFormState);
//   const [attachment, setAttachment] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [formError, setFormError] = useState("");

//   if (!isOpen) return null;

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setFormError("");
//   };

//   const handleFileChange = (e) => {
//     setAttachment(e.target.files[0]);
//     setFormError("");
//   };

//   // دالة تفريغ الحقول (Reset)
//   const handleReset = () => {
//     setFormData(initialFormState);
//     setAttachment(null);
//     setFormError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.type === "Sick" && !attachment) {
//       setFormError("Attachment is required for Sick leaves!");
//       return;
//     }

//     try {
//       setSubmitLoading(true);
//       setFormError("");

//       const data = new FormData();
//       data.append("type", formData.type);
//       data.append("startDate", new Date(formData.startDate).toISOString());
//       data.append("endDate", new Date(formData.endDate).toISOString());
//       data.append("reason", formData.reason);
//       if (attachment) data.append("attachment", attachment);

//       const response = await instance.post("/leaves/create", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data?.status === "success") {
//         handleReset();
//         onLeaveSubmitted();
//         onClose();
//       }
//     } catch (err) {
//       setFormError(err.response?.data?.message || "Failed to submit request.");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//       <div 
//         className="w-full max-w-md bg-[#0c1922] border border-slate-800/80 rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
//         style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//       >
//         <style>{`
//           div::-webkit-scrollbar {
//             display: none;
//           }
//         `}</style>
        
//         <button type="button" onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
//           <X size={20} />
//         </button>

//         <h3 className="text-white text-xl font-bold mb-1">New Leave Application</h3>
//         <p className="text-slate-500 text-xs mb-6">Fill out the form below to request time off.</p>

//         {formError && (
//           <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
//             <AlertCircle size={16} />
//             <span>{formError}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5 text-sm text-slate-300">
//           <div>
//             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leave Type *</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleInputChange}
//               className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700"
//             >
//               <option value="Annual">Annual</option>
//               <option value="Sick">Sick</option>
//               <option value="Casual">Casual</option>
//               <option value="Unpaid">Unpaid</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date *</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700 text-center"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date *</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700 text-center"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason for Leave *</label>
//             <textarea
//               name="reason"
//               value={formData.reason}
//               onChange={handleInputChange}
//               rows="3"
//               required
//               placeholder="Type your reason here..."
//               className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700 resize-none"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
//               Attachments {formData.type === "Sick" ? "*" : "(Optional)"}
//             </label>
//             <div className="relative flex items-center justify-center w-full bg-[#13222c] border border-dashed border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-700">
//               <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
//               <div className="flex flex-col items-center gap-1 text-center">
//                 <Upload size={18} className={attachment ? "text-blue-400" : "text-slate-500"} />
//                 <span className="text-xs text-slate-400">{attachment ? attachment.name : "Click to upload or drag and drop"}</span>
//                 <span className="text-[10px] text-slate-600">SVG, PNG, JPG OR PDF (MAX. 5MB)</span>
//               </div>
//             </div>
//           </div>

//           {/* أزرار التحكم السفليّة */}
//           <div className="flex flex-col gap-2 pt-2">
//             <button
//               type="submit"
//               disabled={submitLoading}
//               className="w-full bg-[#0293FA] hover:bg-[#0282dd] disabled:bg-blue-500/50 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
//             >
//               {submitLoading ? "Submitting Application..." : "Submit Application"}
//             </button>

//             {/* زر الـ Reset المضاف حديثاً */}
//             <button
//               type="button"
//               onClick={handleReset}
//               className="w-full bg-[#13222c] hover:bg-[#1b2e3b] text-slate-400 hover:text-white font-semibold py-3 rounded-xl border border-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
//             >
//               <RotateCcw size={16} />
//               <span>Reset</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LeaveApplicationModel;

import React, { useState } from "react";
import instance from "@/services/axios";
import { X, Upload, AlertCircle, RotateCcw } from "lucide-react";

const LeaveApplicationModel = ({ isOpen, onClose, onLeaveSubmitted }) => {
  const initialFormState = { type: "Annual", startDate: "", endDate: "", reason: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [attachment, setAttachment] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
    setFormError("");
  };

  // دالة تفريغ الحقول (Reset)
  const handleReset = () => {
    setFormData(initialFormState);
    setAttachment(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ حماية منع التواريخ المقلوبة (مثال: البداية 11/7 والنهاية 5/5)
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        setFormError("End date cannot be earlier than start date!");
        return; // إيقاف الدالة ومنع الإرسال للباك إند
      }
    }

    if (formData.type === "Sick" && !attachment) {
      setFormError("Attachment is required for Sick leaves!");
      return;
    }

    try {
      setSubmitLoading(true);
      setFormError("");

      const data = new FormData();
      data.append("type", formData.type);
      data.append("startDate", new Date(formData.startDate).toISOString());
      data.append("endDate", new Date(formData.endDate).toISOString());
      data.append("reason", formData.reason);
      if (attachment) data.append("attachment", attachment);

      const response = await instance.post("/leaves/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.status === "success") {
        handleReset();
        onLeaveSubmitted();
        onClose();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-[#0c1922] border border-slate-800/80 rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <button type="button" onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-white text-xl font-bold mb-1">New Leave Application</h3>
        <p className="text-slate-500 text-xs mb-6">Fill out the form below to request time off.</p>

        {formError && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl animate-in fade-in duration-200">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-sm text-slate-300">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leave Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700"
            >
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                // 2️⃣ خاصية الـ min لمنع اختيار يوم سابق لتاريخ البدء من الكاليندير نفسها
                min={formData.startDate} 
                required
                className={`w-full bg-[#13222c] border rounded-xl p-3 text-white focus:outline-none text-center transition-colors ${
                  formError && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-800/80 focus:border-slate-700"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason for Leave *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3"
              required
              placeholder="Type your reason here..."
              className="w-full bg-[#13222c] border border-slate-800/80 rounded-xl p-3 text-white focus:outline-none focus:border-slate-700 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Attachments {formData.type === "Sick" ? "*" : "(Optional)"}
            </label>
            <div className="relative flex items-center justify-center w-full bg-[#13222c] border border-dashed border-slate-800 rounded-xl p-4 cursor-pointer hover:border-slate-700">
              <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-1 text-center">
                <Upload size={18} className={attachment ? "text-blue-400" : "text-slate-500"} />
                <span className="text-xs text-slate-400">{attachment ? attachment.name : "Click to upload or drag and drop"}</span>
                <span className="text-[10px] text-slate-600">SVG, PNG, JPG OR PDF (MAX. 5MB)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-[#0293FA] hover:bg-[#0282dd] disabled:bg-blue-500/50 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {submitLoading ? "Submitting Application..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-[#13222c] hover:bg-[#1b2e3b] text-slate-400 hover:text-white font-semibold py-3 rounded-xl border border-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationModel;