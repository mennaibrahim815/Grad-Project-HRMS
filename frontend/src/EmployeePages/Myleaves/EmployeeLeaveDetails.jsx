// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import instance from '@/services/axios';
// import BaseCard from '@/components/UI/Card'; 
// import { ArrowLeft, Calendar, Clock, AlertCircle, FileText, Trash2 } from 'lucide-react';

// const EmployeeLeaveDetails = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const [leave, setLeave] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // دالة جلب تفاصيل الإجازة
//   const fetchLeaveDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await instance.get(`/leaves/${id}`);
//       setLeave(response.data?.data);
//     } catch (error) {
//       console.error("Error fetching leave details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveDetails();
//   }, [id]);

//   // دالة إلغاء/حذف الطلب لو لسه Pending مباشرة من صفحة التفاصيل
//   const handleCancelRequest = async () => {
//     if (window.confirm("Are you sure you want to cancel this leave request?")) {
//       try {
//         await instance.delete(`/leaves/${id}`);
//         alert("Leave request cancelled successfully.");
//         navigate(-1); // الرجوع للجدول بعد الحذف
//       } catch (error) {
//         console.error("Failed to cancel request:", error);
//       }
//     }
//   };

//   if (loading) return <div className="p-6 text-slate-400 text-center">Loading leave details...</div>;
//   if (!leave) return <div className="p-6 text-red-400 text-center">Leave request not found.</div>;

//   return (
//     <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 text-slate-100">
      
//       {/* زرار الرجوع خلفاً */}
//       <button 
//         onClick={() => navigate(-1)} 
//         className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
//       >
//         <ArrowLeft size={16} /> Back to My Leaves
//       </button>

//       {/* الكرت الرئيسي للتفاصيل */}
//       <BaseCard>
//         <div className="p-6 space-y-6">
          
//           {/* الرأس: نوع الإجازة والحالة */}
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-white">{leave.type || "Annual"} Leave</h2>
//             </div>
            
//             {/* شارة الحالة اللامعة المتوافقة مع ألوان ستايلك */}
//             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
//               leave.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40' :
//               leave.status === 'Rejected' ? 'bg-red-500/15 text-red-400 border-red-400/40' :
//               'bg-yellow-500/15 text-yellow-400 border-yellow-400/40'
//             }`}>
//               <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//               {leave.status || "Pending"}
//             </span>
//           </div>

//           <hr className="border-slate-800" />

//           {/* بوكس المدة والأيام */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
//               <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={14} className="text-[#35AAFD]"/> Start Date</span>
//               <span className="text-sm font-medium font-mono">{leave.startDate?.split('T')[0]}</span>
//             </div>
            
//             <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
//               <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={14} className="text-[#35AAFD]"/> End Date</span>
//               <span className="text-sm font-medium font-mono">{leave.endDate?.split('T')[0]}</span>
//             </div>

//             <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
//               <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Clock size={14} className="text-[#35AAFD]"/> Total Duration</span>
//               <span className="text-sm font-bold text-[#35AAFD] font-mono">
//                 {leave.duration || 0} {leave.duration === 1 ? "Day" : "Days"}
//               </span>
//             </div>
//           </div>

//           {/* السبب المكتوب من قِبل الموظف */}
//           <div className="space-y-2">
//             <label className="text-xs text-slate-400 flex items-center gap-1">
//               <FileText size={14} /> My Reason / Comments
//             </label>
//             <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed min-h-[60px]">
//               {leave.reason || "You didn't provide any specific reason for this request."}
//             </div>
//           </div>

//           {/* قسم التغذية الراجعة من الإدارة (HR Feedback) */}
//           {leave.status === "Rejected" && leave.rejectReason && (
//             <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-xl space-y-1 animate-in fade-in">
//               <span className="text-xs font-bold text-red-400 flex items-center gap-1">
//                 <AlertCircle size={14} /> Rejection Reason from HR:
//               </span>
//               <p className="text-sm text-red-300 pl-5">{leave.rejectReason}</p>
//             </div>
//           )}

//           {leave.status === "Approved" && (
//             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
//                Your leave request has been officially approved. Enjoy your time off!
//             </div>
//           )}

//           {/* أزرار تفاعلية أسفل الكارت: يظهر زر الإلغاء فقط إذا كان الطلب Pending */}
//           {leave.status === "Pending" && (
//             <div className="pt-2 flex justify-end">
//               <button
//                 onClick={handleCancelRequest}
//                 className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-red-600/90 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-950/20"
//               >
//                 <Trash2 size={14} /> Cancel & Delete Request
//               </button>
//             </div>
//           )}

//         </div>
//       </BaseCard>
//     </div>
//   );
// };

// export default EmployeeLeaveDetails;
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

  useEffect(() => {
    fetchLeaveDetails();
  }, [id]);

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

  if (loading) return <div className="p-6 text-slate-400 text-center">Loading leave details...</div>;
  if (!leave) return <div className="p-6 text-red-400 text-center">Leave request not found.</div>;

  // 💡 قراءة كائن الـ hrApprovedBy الممرر من الباك إند وتركيب الاسم بالكامل
  const hrUser = leave.hrApprovedBy;
  const hrName = hrUser && hrUser.firstName ? `${hrUser.firstName} ${hrUser.lastName || ""}` : "HR Manager";

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 text-slate-100">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to My Leaves
      </button>

      <BaseCard>
        <div className="p-6 space-y-6">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{leave.type || "Annual"} Leave</h2>
            
            </div>
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              leave.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40' :
              leave.status === 'Rejected' ? 'bg-red-500/15 text-red-400 border-red-400/40' :
              'bg-yellow-500/15 text-yellow-400 border-yellow-400/40'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {leave.status || "Pending"}
            </span>
          </div>

          <hr className="border-slate-800" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={14} className="text-[#35AAFD]"/> Start Date</span>
              <span className="text-sm font-medium font-mono">{leave.startDate?.split('T')[0]}</span>
            </div>
            
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={14} className="text-[#35AAFD]"/> End Date</span>
              <span className="text-sm font-medium font-mono">{leave.endDate?.split('T')[0]}</span>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Clock size={14} className="text-[#35AAFD]"/> Total Duration</span>
              <span className="text-sm font-bold text-[#35AAFD] font-mono">
                {leave.duration || 0} {leave.duration === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 flex items-center gap-1">
              <FileText size={14} /> My Reason / Comments
            </label>
            <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed min-h-[60px]">
              {leave.reason || "You didn't provide any specific reason for this request."}
            </div>
          </div>

          {/* 🔴 في حالة الرفض */}
          {leave.status === "Rejected" && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-500/20 pb-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> Rejection Notice
                </span>
                <span className="text-xs text-red-300/80 flex items-center gap-1 bg-red-950/40 px-2.5 py-0.5 rounded-md border border-red-500/10">
                  <UserCheck size={13} /> Processed by: <strong className="text-white">{hrName}</strong>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Reason for rejection:</span>
                <p className="text-sm text-red-300 mt-0.5">{leave.rejectReason || "No reason specified by HR."}</p>
              </div>
            </div>
          )}

          {/* 🟢 في حالة القبول */}
          {leave.status === "Approved" && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/10 pb-2">
                <span className="text-sm text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={16} /> Leave Request Approved
                </span>
                <span className="text-xs text-emerald-300/80 flex items-center gap-1 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-500/10">
                  <UserCheck size={13} /> Approved by: <strong className="text-white">{hrName}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your time off request is officially active. Enjoy your leave!
              </p>
            </div>
          )}

          {leave.status === "Pending" && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCancelRequest}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-red-600/90 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-950/20"
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