// // import React from 'react';
// // import { 
// //   FileText, 
// //   Home, 
// //   Monitor, 
// //   Activity, 
// //   DollarSign, 
// //   AlertCircle,
// //   ChevronRight
// // } from 'lucide-react';

// // const RecentRequestsTable = ({ requests, loading }) => {
// //   // 1. دالة لتحديد الأيقونة واللون بناءً على نوع الطلب
// //   const getTypeStyles = (type) => {
// //     switch (type) {
// //       case 'Sick Leave': return { icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/20' };
// //       case 'WFH Request': return { icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/20' };
// //       case 'New Equipment': return { icon: Monitor, color: 'text-purple-400', bg: 'bg-purple-500/20' };
// //       case 'HR Letter': return { icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/20' };
// //       case 'Payroll Inquiry': return { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
// //       default: return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-500/20' };
// //     }
// //   };

// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case 'Approved': return 'bg-green-500/10 text-green-500';
// //       case 'Pending': return 'bg-orange-500/10 text-orange-500';
// //       case 'Rejected': return 'bg-red-500/10 text-red-500';
// //       default: return 'bg-slate-500/10 text-slate-400';
// //     }
// //   };

// //   if (loading) return (
// //     <div className="bg-[#111c2a] rounded-[2rem] p-8 text-center border border-slate-800/50">
// //        <div className="animate-pulse text-slate-500">Loading requests...</div>
// //     </div>
// //   );

// //   return (
// //     <div className="bg-[#111c2a] rounded-[2rem] p-6 border border-slate-800/50 shadow-xl ">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <h3 className="text-white text-lg font-bold">Recent Requests</h3>
// //         {/* <button className="text-[#0293FA] text-xs font-bold hover:underline flex items-center gap-1">
// //           View All
// //         </button> */}
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="w-full text-left">
// //           <thead>
// //             <tr className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black">
// //               <th className="pb-6 font-black">Type</th>
// //               <th className="pb-6 font-black">Date</th>
// //               <th className="pb-6 font-black text-right">Status</th>
// //             </tr>
// //           </thead>
// //           <tbody className="space-y-4">
// //             {requests?.map((request) => {
// //               const typeStyle = getTypeStyles(request.type);
// //               const Icon = typeStyle.icon;

// //               return (
// //                 <tr key={request._id} className="group transition-all">
// //                   <td className="py-3">
// //                     <div className="flex items-center gap-4">
// //                       {/* Icon Container */}
// //                       <div className={`w-10 h-10 rounded-xl ${typeStyle.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
// //                         <Icon size={18} className={typeStyle.color} />
// //                       </div>
// //                       <span className="text-slate-200 text-sm font-semibold">{request.type}</span>
// //                     </div>
// //                   </td>
// //                   <td className="py-3">
// //                     <span className="text-slate-400 text-[13px]">
// //                       {new Date(request.createdAt).toLocaleDateString('en-US', { 
// //                         month: 'short', 
// //                         day: 'numeric', 
// //                         year: 'numeric' 
// //                       })}
// //                     </span>
// //                   </td>
// //                   <td className="py-3 text-right">
// //                     <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(request.status)}`}>
// //                       {request.status}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
        
// //         {(!requests || requests.length === 0) && (
// //           <div className="text-center py-10 text-slate-600 text-sm italic">
// //             No recent requests found
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default RecentRequestsTable;


// import React from 'react';
// import { 
//   FileText, 
//   Home, 
//   Monitor, 
//   Activity, 
//   DollarSign, 
//   AlertCircle,
//   ChevronRight
// } from 'lucide-react';

// const RecentRequestsTable = ({ requests, loading }) => {
//   // 1. دالة لتحديد الأيقونة والألوان باستخدام المتغيرات لتدعم الثيمين
//   const getTypeStyles = (type) => {
//     switch (type) {
//       case 'Sick Leave': 
//         return { icon: Activity, color: 'var(--pill-orange-text)', bg: 'var(--pill-orange-bg)' };
//       case 'WFH Request': 
//         return { icon: Home, color: 'var(--pill-blue-text)', bg: 'var(--pill-blue-bg)' };
//       case 'New Equipment': 
//         return { icon: Monitor, color: 'var(--pill-red-text)', bg: 'var(--pill-red-bg)' };
//       case 'HR Letter': 
//         return { icon: FileText, color: 'var(--icon-pink-color)', bg: 'var(--icon-pink-bg)' };
//       case 'Payroll Inquiry': 
//         return { icon: DollarSign, color: 'var(--pill-green-text)', bg: 'var(--pill-green-bg)' };
//       default: 
//         return { icon: AlertCircle, color: 'var(--text-muted)', bg: 'var(--tab-inactive-bg)' };
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'Approved': 
//         return { backgroundColor: 'var(--pill-green-bg)', color: 'var(--pill-green-text)', borderColor: 'var(--pill-green-border)' };
//       case 'Pending': 
//         return { backgroundColor: 'var(--pill-orange-bg)', color: 'var(--pill-orange-text)', borderColor: 'var(--pill-orange-border)' };
//       case 'Rejected': 
//         return { backgroundColor: 'var(--pill-red-bg)', color: 'var(--pill-red-text)', borderColor: 'var(--pill-red-border)' };
//       default: 
//         return { backgroundColor: 'var(--tab-inactive-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-main)' };
//     }
//   };

//   if (loading) return (
//     <div 
//       style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} 
//       className="rounded-[2rem] p-8 text-center border shadow-sm"
//     >
//        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading requests...</div>
//     </div>
//   );

//   return (
//     <div 
//       style={{ backgroundColor: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)', borderColor: 'var(--border-main)' }} 
//       className="rounded-[2rem] p-6 border shadow-xl transition-colors duration-300"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h3 style={{ color: 'var(--text-main)' }} className="text-lg font-bold">Recent Requests</h3>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead>
//             <tr style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-[0.15em] font-black opacity-80">
//               <th className="pb-6 font-black">Type</th>
//               <th className="pb-6 font-black">Date</th>
//               <th className="pb-6 font-black text-right">Status</th>
//             </tr>
//           </thead>
//           <tbody className="space-y-4">
//             {requests?.map((request) => {
//               const typeStyle = getTypeStyles(request.type);
//               const Icon = typeStyle.icon;
//               const statusStyle = getStatusStyle(request.status);

//               return (
//                 <tr key={request._id} className="group transition-all hover:bg-white/[0.01]">
//                   <td className="py-3">
//                     <div className="flex items-center gap-4">
//                       {/* Icon Container */}
//                       <div 
//                         style={{ backgroundColor: typeStyle.bg }}
//                         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}
//                       >
//                         <Icon size={18} style={{ color: typeStyle.color }} />
//                       </div>
//                       <span style={{ color: 'var(--text-main)' }} className="text-sm font-bold tracking-tight">{request.type}</span>
//                     </div>
//                   </td>
//                   <td className="py-3">
//                     <span style={{ color: 'var(--text-muted)' }} className="text-[13px] font-medium opacity-80">
//                       {new Date(request.createdAt).toLocaleDateString('en-US', { 
//                         month: 'short', 
//                         day: 'numeric', 
//                         year: 'numeric' 
//                       })}
//                     </span>
//                   </td>
//                   <td className="py-3 text-right">
//                     <span 
//                       style={statusStyle}
//                       className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all"
//                     >
//                       {request.status}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
        
//         {(!requests || requests.length === 0) && (
//           <div style={{ color: 'var(--text-muted)' }} className="text-center py-10 text-sm italic opacity-60">
//             No recent requests found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecentRequestsTable;


import React from 'react';
import { 
  FileText, 
  Home, 
  Monitor, 
  Activity, 
  DollarSign, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const RecentRequestsTable = ({ requests, loading }) => {
  // 1. دالة لتحديد الأيقونة والألوان باستخدام المتغيرات
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Sick Leave': 
        return { icon: Activity, color: 'var(--pill-orange-text)', bg: 'var(--pill-orange-bg)' };
      case 'WFH Request': 
        return { icon: Home, color: 'var(--pill-blue-text)', bg: 'var(--pill-blue-bg)' };
      case 'New Equipment': 
        return { icon: Monitor, color: 'var(--pill-red-text)', bg: 'var(--pill-red-bg)' };
      case 'HR Letter': 
        return { icon: FileText, color: 'var(--icon-pink-color)', bg: 'var(--icon-pink-bg)' };
      case 'Payroll Inquiry': 
        return { icon: DollarSign, color: 'var(--pill-green-text)', bg: 'var(--pill-green-bg)' };
      default: 
        return { icon: AlertCircle, color: 'var(--text-muted)', bg: 'var(--tab-inactive-bg)' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': 
        return { backgroundColor: 'var(--pill-green-bg)', color: 'var(--pill-green-text)', borderColor: 'var(--pill-green-border)' };
      case 'Pending': 
        return { backgroundColor: 'var(--pill-orange-bg)', color: 'var(--pill-orange-text)', borderColor: 'var(--pill-orange-border)' };
      case 'Rejected': 
        return { backgroundColor: 'var(--pill-red-bg)', color: 'var(--pill-red-text)', borderColor: 'var(--pill-red-border)' };
      default: 
        return { backgroundColor: 'var(--tab-inactive-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-main)' };
    }
  };

  // ستايل الكارت الموحد (الجرادينت)
  const luxuryCardStyle = {
    background: 'linear-gradient(to bottom right, var(--card-from) 20%, var(--card-to) 45%)',
    borderColor: 'var(--card-border)'
  };

  if (loading) return (
    <div 
      style={luxuryCardStyle} 
      className="rounded-[2.5rem] p-12 text-center border shadow-xl"
    >
       <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-gray-800 animate-spin"></div>
          <span style={{ color: 'var(--text-muted)' }} className="font-black uppercase text-xs tracking-widest">Processing Data...</span>
       </div>
    </div>
  );

  return (
    <div 
      style={luxuryCardStyle} 
      className="rounded-[2.5rem] p-8 border shadow-xl transition-all duration-500"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 style={{ color: 'var(--text-main)' }} className="text-xl font-black uppercase tracking-widest">Recent Requests</h3>
        <div style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--card-border)' }} className="p-2 rounded-xl border shadow-inner">
           <FileText size={18} style={{ color: 'var(--text-muted)' }} className="opacity-70" />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-[0.25em] font-black opacity-50">
              <th className="pb-4 px-2">Type</th>
              <th className="pb-4 px-2">Date</th>
              <th className="pb-4 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((request) => {
              const typeStyle = getTypeStyles(request.type);
              const Icon = typeStyle.icon;
              const statusStyle = getStatusStyle(request.status);

              return (
                <tr key={request._id} className="group transition-all">
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-4">
                      {/* Icon Container */}
                      <div 
                        style={{ backgroundColor: typeStyle.bg, borderColor: 'var(--card-border)' }}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3"
                      >
                        <Icon size={20} style={{ color: typeStyle.color }} />
                      </div>
                      <span style={{ color: 'var(--text-main)' }} className="text-sm font-black tracking-tight">{request.type}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[13px] font-bold opacity-70">
                      {new Date(request.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span 
                      style={statusStyle}
                      className="inline-block px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm transition-all group-hover:shadow-md"
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!requests || requests.length === 0) && (
          <div style={{ color: 'var(--text-muted)' }} className="text-center py-16 opacity-40">
            <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">No recent requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRequestsTable;