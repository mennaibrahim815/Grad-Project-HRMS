
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // ضفنا useNavigate
// import API from "@/services/axios";
// import { ArrowLeft } from "lucide-react"; // أيقونة السهم

// const LeaveDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate(); // تعريف الـ navigate
//   const [leave, setLeave] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLeaveById = async () => {
//       try {
//         const response = await API.get(`/leaves/${id}`);
//         setLeave(response.data.data);
//       } catch (error) {
//         console.error("Error fetching leave details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLeaveById();
//   }, [id]);

//   if (loading) return <div className="text-white p-10 text-center">Loading...</div>;
//   if (!leave) return <div className="text-white p-10 text-center">No data found.</div>;

//   return (
//     <div className="p-6 bg-[#0f172a] min-h-screen text-slate-200">
//       <div className="max-w-4xl mx-auto space-y-4">
        
//         {/* زرار العودة */}
//         <button 
//           onClick={() => navigate(-1)} // -1 يعني ارجع لآخر صفحة كنت فيها
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-500 w-fit"
//         >
//           <ArrowLeft size={18} />
//           Back to Requests
//         </button>

//         <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
//           {/* Header: Employee Info */}
//           <div className="p-8 border-b border-slate-800 flex items-center gap-6">
//             <img 
//               src={leave.employee?.avatar || `https://ui-avatars.com/api/?name=${leave.employee?.firstName}&background=0D8ABC&color=fff`} 
//               className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg"
//               alt="avatar"
//             />
//             <div>
//               <h2 className="text-2xl font-bold text-white">
//                 {leave.employee?.firstName} {leave.employee?.lastName}
//               </h2>
//               <p className="text-cyan-400 font-medium">{leave.employee?.jobTitle}</p>
//               <p className="text-slate-500 text-sm">{leave.employee?.email}</p>
//             </div>
            
//             <div className="ml-auto text-right">
//               <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
//                 leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
//               }`}>
//                 {leave.status}
//               </span>
//             </div>
//           </div>

//           {/* Content: Leave Details */}
//           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest">Leave Information</h3>
//               <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
//                 <p className="text-sm text-slate-500">Type</p>
//                 <p className="text-lg font-semibold text-white">{leave.type}</p>
//               </div>
//               <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
//                 <p className="text-sm text-slate-500">Duration</p>
//                 <p className="text-lg font-semibold text-white">{leave.duration} Days</p>
//               </div>
//               <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
//                 <p className="text-sm text-slate-500">Date Range</p>
//                 <p className="text-sm font-medium">
//                   {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest">Reason & Approval</h3>
//               <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 min-h-[100px]">
//                 <p className="text-sm text-slate-500">Reason</p>
//                 <p className="text-sm italic text-slate-300">"{leave.reason}"</p>
//               </div>
//               {leave.hrApprovedBy && (
//                 <div className="p-4 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl">
//                   <p className="text-xs text-cyan-500 font-bold uppercase"> By HR</p>
//                   <p className="text-sm text-white font-medium">
//                     {leave.hrApprovedBy.firstName} {leave.hrApprovedBy.lastName}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/services/axios";
import { ArrowLeft, History, Calendar, CheckCircle2, Clock, XCircle, Activity, AlertCircle } from "lucide-react";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State لإدارة سجل الإجازات
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  // دالة جلب سجل إجازات الموظف
  const fetchEmployeeHistory = async () => {
    console.log("Full Leave Object:", leave);

    const empId = 
      leave?.employeeId || 
      leave?.employee?._id || 
      (typeof leave?.employee === 'string' ? leave?.employee : null);

    console.log("Extracted Employee ID:", empId);

    if (!empId) {
      alert("Error: Employee ID not found in this leave request.");
      return;
    }

    if (showHistory) {
      setShowHistory(false);
      return;
    }

    try {
      setHistoryLoading(true);
      setShowHistory(true);
      const response = await API.get(`/leaves/employee/${empId}`); 
      setHistory(response.data.data || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <div className="text-white p-10 text-center">Loading...</div>;
  if (!leave) return <div className="text-white p-10 text-center">No data found.</div>;

  const empBalances = leave?.employee || {};

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-4 mt-10">
        
        <div className="flex justify-between items-center">
          {/* زرار العودة */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-500 w-fit"
          >
            <ArrowLeft size={18} />
            Back to Requests
          </button>

          {/* زرار السجل التاريخي */}
          <button 
            onClick={fetchEmployeeHistory}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg border shadow-lg ${
              showHistory 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-white"
            }`}
          >
            <History size={18} />
            {showHistory ? "Hide History" : "Employee Leaves History"}
          </button>
        </div>

        {/*الكارد الأساسي للتفاصيلة) */}
        <div className="
        bg-gradient-to-br from-transparent/20 to-45% to-[#182731]
        backdrop-blur-sm
        rounded-[2rem] border border-slate-700/50">
          
          {/* الهيدر المطور: يجمع بين بيانات الموظف والـ Balances */}
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <img 
                src={leave.employee?.avatar || `https://ui-avatars.com/api/?name=${leave.employee?.firstName || 'User'}&background=0D8ABC&color=fff`} 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg"
                alt="avatar"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">
                  {leave.employee?.firstName} {leave.employee?.lastName}
                </h2>
                <p className="text-cyan-400 font-medium">{leave.employee?.jobTitle}</p>
                <p className="text-slate-500 text-sm mb-2">{leave.employee?.email}</p>
                
                {/* حقل الـ Status تم نقله هنا بشكل أنيق تحت البيانات */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                  leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {leave.status}
                </span>
              </div>
            </div>
            
            {/* الأرصدة الثلاثة مدمجة داخل نفس الهيدر على اليمين */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto border-t border-slate-800/60 md:border-t-0 pt-4 md:pt-0">
              {/* Annual Balance */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 px-4 py-2.5 rounded-xl text-left min-w-[110px] flex-1 md:flex-none">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Annual</p>
                <p className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                  {empBalances.annualLeaveBalance ?? 0}<span className="text-xs font-normal text-slate-500 ml-1">d</span>
                </p>
              </div>

              {/* Sick Balance */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-left min-w-[110px] flex-1 md:flex-none">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sick</p>
                <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                  {empBalances.sickLeaveBalance ?? 0}<span className="text-xs font-normal text-slate-500 ml-1">d</span>
                </p>
              </div>

              {/* Casual Balance */}
              <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-2.5 rounded-xl text-left min-w-[110px] flex-1 md:flex-none">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Casual</p>
                <p className="text-lg font-black text-amber-400 font-mono mt-0.5">
                  {empBalances.casualLeaveBalance ?? 0}<span className="text-xs font-normal text-slate-500 ml-1">d</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest text-left">Leave Information</h3>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-left">
                <p className="text-sm text-slate-500">Type</p>
                <p className="text-lg font-semibold text-white">{leave.type}</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-left">
                <p className="text-sm text-slate-500">Duration</p>
                <p className="text-lg font-semibold text-white">{leave.duration} Days</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-left">
                <p className="text-sm text-slate-500">Date Range</p>
                <p className="text-sm font-medium text-white">
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest text-left">Reason & Approval</h3>
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 min-h-[100px] text-left">
                <p className="text-sm text-slate-500">Reason</p>
                <p className="text-sm italic text-slate-300">"{leave.reason}"</p>
              </div>
              {leave.hrApprovedBy && (
                <div className="p-4 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl text-left">
                  <p className="text-xs text-cyan-500 font-bold uppercase">Action By HR</p>
                  <p className="text-sm text-white font-medium">
                    {leave.hrApprovedBy.firstName} {leave.hrApprovedBy.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* قسم سجل الإجازات التاريخي */}
        {showHistory && (
          <div className="mt-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Calendar className="text-cyan-400" size={20} />
              <h3 className="text-lg font-bold text-white">Previous Leaves History</h3>
            </div>

            {historyLoading ? (
              <div className="flex flex-col items-center py-10 space-y-4">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm italic">Fetching employee records...</p>
              </div>
            ) : history.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-2 rounded-lg ${
                        item.status === 'Approved' ? 'bg-emerald-500/10' : 
                        item.status === 'Rejected' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      }`}>
                        <Calendar size={18} className={
                          item.status === 'Approved' ? 'text-emerald-500' : 
                          item.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                        } />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.type} Leave</p>
                        <p className="text-xs text-slate-500">
                          {new Date(item.startDate).toLocaleDateString()} • {item.duration} Days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${
                        item.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/5' : 
                        item.status === 'Rejected' ? 'text-red-400 bg-red-400/5' : 
                        'text-yellow-400 bg-yellow-400/5'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                <p>No previous leave requests found for this employee.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;