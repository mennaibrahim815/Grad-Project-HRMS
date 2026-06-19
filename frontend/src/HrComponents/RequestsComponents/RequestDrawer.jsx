
import React, { useState } from "react";
import { Check, X, XCircle, Upload, Send } from "lucide-react";

const RequestDrawer = ({ isOpen, req, onClose, onAction }) => {
  // 1. تعريف الـ States في بداية المكون تماماً (قبل أي Early Return)
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(""); 
  const [hrComment, setHrComment] = useState("");
  const [hrName, setHrName] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  // 2. نقرأ أو نشيك على الشرط هنا بعد تعريف الـ Hooks لعدم كسر قواعد الـ React
  if (!isOpen || !req) return null;

  const firstName = req.employeeId?.general?.firstName || "Unknown";
  const lastName = req.employeeId?.general?.lastName || "Employee";
  const fullName = `${firstName} ${lastName}`;
  
  // الاحتفاظ بالـ department الأصلي لفحصه ديناميكياً في الـ UI
  const department = req.employeeId?.employee?.department;
  
  const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const handleInitialAction = (actionType) => {
    setSelectedAction(actionType);
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setHrComment("");
    setHrName("");
    setAttachedFile(null);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!hrName.trim()) {
      alert("Please enter HR Name");
      return;
    }

    const formData = new FormData();
    
    // 1. تمرير الحالة كابيتال زي ما هي (Approved / Rejected) طالما الباكيند شغال بيها كدة
    formData.append("status", selectedAction);
    
    // 2. المفتاح هنا لازم يكون "text" عشان الباكيند يسكنه جوه hrResponse.text
    formData.append("text", hrComment); 
    
    // 3. اسم الـ HR المسؤول عن العملية
    formData.append("handledBy", hrName); 
    
    // 4. رفع الملف للملف المرفق
    if (attachedFile) {
      formData.append("attachments", attachedFile); 
    }

    // تمرير الـ formData للأب
    onAction(req._id, formData);
    handleCancelReply();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0F171E] border-l border-[#383D47]/80 h-full p-6 shadow-2xl flex flex-col justify-between animate-[slideLeft_0.3s_ease-out] overflow-y-auto">
        
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-5 border-b border-[#383D47]">
            <h3 className="text-lg font-bold text-white">Request Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-[#1B1E22] text-slate-400 hover:text-white border border-[#383D47]/30 transition-colors">
              <XCircle size={18} />
            </button>
          </div>

          <div className="space-y-5 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Employee</span>
              <div className="text-base font-bold text-white">{fullName}</div>
              
              {/* تأمين الـ UI: السطر هيظهر بشكل نظيف جداً فقط لو القسم موجود ومبعوت من الباكيند */}
              {department && (
                <span className="text-xs text-slate-400 font-mono block mt-0.5">
                  Dept: {department}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Request Type</span>
                <div className="text-sm font-medium text-slate-300">{req.type}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Creation Date</span>
                <div className="text-sm font-medium text-slate-300 font-mono">{formattedDate}</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Title</span>
              <div className="text-sm font-semibold text-[#F89B49] bg-slate-800/30 p-3 rounded-xl border border-[#383D47] font-mono">
                {req.title}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Description / Reason</span>
              <div className="text-sm text-slate-400 bg-slate-800/30 p-4 rounded-xl border border-[#383D47] leading-relaxed max-h-40 overflow-y-auto font-sans">
                {req.description}
              </div>
            </div>
          </div>

          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="border-t border-[#383D47] pt-5 space-y-4 text-left animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${selectedAction === "Approved" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                <h4 className="text-sm font-bold text-white">Responding as: <span className={selectedAction === "Approved" ? "text-[#00E583]" : "text-[#EC3A76]"}>{selectedAction}</span></h4>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">HR Response / Comment</label>
                <textarea
                  rows="3"
                  value={hrComment}
                  onChange={(e) => setHrComment(e.target.value)}
                  placeholder="Write your response or reason here..."
                  className="w-full bg-[#0B131A] border border-[#383D47] rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-[#383D47] placeholder:text-slate-600 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">By HR (Your Name) *</label>
                <input
                  type="text"
                  required
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#0B131A] border border-[#383D47] rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-[#383D47] placeholder:text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E889A] block mb-1">Attachment (Optional)</label>
                <div className="relative flex items-center justify-center w-full border border-dashed border-[#383D47] hover:border-[#383D47] rounded-xl p-3 bg-[#0B131A]/50 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    onChange={(e) => setAttachedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-xs text-[#7E889A] group-hover:text-slate-400">
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
                  className={`flex-1 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    selectedAction === "Approved" ? "bg-[#00E583] hover:bg-[#4BFFB2]" : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  <Send size={12} /> Confirm Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancelReply}
                  className="px-4 bg-transparent border border-[#383D47] text-slate-400 hover:text-white hover:border-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {!showReplyForm && (
          <div className="mt-8">
            {req.status === "Pending" ? (
              <div className="pt-5 border-t border-[#383D47] flex gap-4">
                <button
                  onClick={() => handleInitialAction("Approved")}
                  className="flex-1 bg-[#00E583] hover:bg-[#4BFFB2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-lg"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => handleInitialAction("Rejected")}
                  className="flex-1 bg-transparent hover:bg-[#DF165A]/10 text-[#EC3A76] border border-red-900/50 hover:border-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            ) : (
              <div className="pt-5 border-t border-[#383D47] text-center">
                <div className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold font-mono text-sm border ${
                  req.status === "Approved" 
                    ? "bg-emerald-500/10 text-[#00E583] border-emerald-500/20" 
                    : "bg-red-500/10 text-[#EC3A76] border-red-500/20"
                }`}>
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