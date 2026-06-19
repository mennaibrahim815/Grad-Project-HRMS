// import BaseCard from "@/components/UI/Card.jsx"; // تأكدي من مسار الملف الصح عندك
// import { Calendar, Download } from "lucide-react";

// export default function HrTaskCard({ task, onActionClick }) {
//   const getPriorityColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
//       case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
//       default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
//     }
//   };

//   // تجهيز اسم وبيانات الموظف
//   const emp = task.assignedTo?.[0];
//   const fullName = `${emp?.general?.firstName || ""} ${emp?.general?.lastName || ""}`.trim() || "Unknown Employee";

//   return (
//     <BaseCard className="hover:border-slate-700/60 transition-all flex flex-col justify-between shadow-xl h-full">
//       <div className="space-y-4">
//         {/* Header Card */}
//         <div className="flex justify-between items-start gap-2">
//           <h3 className="text-slate-100 font-bold text-base line-clamp-2">{task.title}</h3>
//           <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${getPriorityColor(task.priority)}`}>
//             {task.priority || "Medium"}
//           </span>
//         </div>

//         {/* Deadline */}
//         {task.deadline && (
//           <div className="flex items-center gap-1.5 text-xs text-slate-400">
//             <Calendar size={13} className="text-slate-500" />
//             <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
//           </div>
//         )}

//         {/* Assigned Employee Info */}
//         {emp && (
//           <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-3 space-y-2">
//             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Assigned Employee:</span>
//             <div className="flex items-center gap-2.5">
//               <img 
//                 src={emp.general?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`} 
//                 alt={fullName}
//                 className="w-7 h-7 rounded-full object-cover border border-slate-700"
//                 onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`; }}
//               />
//               <div className="flex flex-col">
//                 <span className="text-xs font-semibold text-slate-200">{fullName}</span>
//                 <span className="text-[10px] text-slate-400">{emp.employee?.jobTitle || "Developer"}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Document Link */}
//         {task.document && (
//           <div className="pt-1">
//             <span className="text-[11px] text-slate-500 block mb-1 font-medium">Submitted Deliverable:</span>
//             <a
//               href={task.document}
//               target="_blank"
//               rel="noreferrer"
//               className="flex items-center justify-between bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl p-2.5 text-xs text-cyan-400 font-medium transition-colors"
//             >
//               <span className="truncate max-w-[180px]">Download Attached File</span>
//               <Download size={14} className="flex-shrink-0" />
//             </a>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60 mt-5">
//         <button
//           onClick={() => onActionClick(task, "reject")}
//           className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all"
//         >
//           Reject
//         </button>
//         <button
//           onClick={() => onActionClick(task, "accept")}
//           className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold transition-all shadow-md"
//         >
//           Accept
//         </button>
//       </div>
//     </BaseCard>
//   );
// }