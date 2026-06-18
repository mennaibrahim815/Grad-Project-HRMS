// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DataTable from "../../components/table/DataTable";
// import TableControls from "../../components/table/TableControls";
// import Pagination from "../../components/table/Pagination";
// import EditIcon from "@mui/icons-material/Edit";
// import RowActionMenu from "../../components/UI/RowActionMenu";
// import BaseCard from "../../components/UI/Card";
// import { Eye, TrendingUp, AlertCircle, Award } from "lucide-react";

// const PerformanceBadge = ({ score }) => {
//   let styles = "bg-red-500/15 text-red-400 border-red-400/40"; 
//   if (score >= 85) {
//     styles = "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"; 
//   } else if (score >= 65) {
//     styles = "bg-yellow-500/15 text-yellow-400 border-yellow-400/40"; 
//   }

//   return (
//     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//       {score}%
//     </span>
//   );
// };

// const PerformanceTable = ({ 
//   reportData = [],    
//   startDate,      
//   setStartDate,   
//   endDate,      
//   setEndDate,   
//   searchName,       // ستايت البحث المستلمة من الأب
//   setSearchName,    // دالة تحديث البحث المستلمة من الأب
//   pagination, 
//   onPageChange,
//   onLimitChange,
//   loading 
// }) => {
//   const navigate = useNavigate();
//   const [openMenuId, setOpenMenuId] = useState(null);
  
//   const [actionModal, setActionModal] = useState({ 
//     show: false, 
//     employeeId: null, 
//     employeeName: "",
//     type: "" 
//   });

//   const handleOpenAction = (id, name, type) => {
//     setOpenMenuId(null);
//     setActionModal({ show: true, employeeId: id, employeeName: name, type });
//   };

//   const handleConfirmAction = () => {
//     alert(`Action "${actionModal.type}" has been triggered for ${actionModal.employeeName}`);
//     setActionModal({ show: false, employeeId: null, employeeName: "", type: "" });
//   };

//   const columns = [
//     {
//       header: "Employee",
//       render: (row) => {
//         const fullName = row ? `${row.firstName} ${row.lastName}` : "Unknown User";
//         return (
//           <div className="flex items-center gap-3">
//             <img 
//               src={row?.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
//               className="w-10 h-10 rounded-full border border-slate-700 object-cover"
//               alt="avatar"
//             />
//             <div>
//               <p className="text-sm font-medium text-slate-100">{fullName}</p>
//               <p className="text-xs text-slate-500">{row?.email}</p>
//             </div>
//           </div>
//         );
//       }
//     },
//     { 
//       header: "Job Title", 
//       render: (row) => <span className="text-slate-300 text-sm">{row?.jobTitle || "N/A"}</span> 
//     },
//     {
//       header: "Attendance Score", 
//       render: (row) => (
//         <span className="font-mono text-slate-400 text-sm">
//           {row?.kpis?.attendanceScore ?? 0}%
//         </span>
//       )
//     },
//     { 
//       header: "Task Completion", 
//       render: (row) => (
//         <span className="font-mono text-slate-400 text-sm">
//           {row?.kpis?.taskScore ?? 0}%
//         </span>
//       )
//     },
//     { 
//       header: "Overall Performance", 
//       render: (row) => <PerformanceBadge score={row?.overallPerformance ?? 0} /> 
//     },
//     {
//       header: "Action",
//       render: (row) => {
//         const rowId = row?.employeeId;
//         const fullName = `${row?.firstName} ${row?.lastName}`;

//         return (
//           <div className="relative">
//             <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
//               <EditIcon />
//             </button>
//             <RowActionMenu
//               isOpen={openMenuId === rowId}
//               onClose={() => setOpenMenuId(null)}
//               actions={[
//                 { 
//                   label: "View Full Analytics", 
//                   icon: Eye, 
//                   onClick: () => navigate(`/performance-details/${rowId}`) 
//                 },
//                 { 
//                   label: "Send Appreciation", 
//                   icon: Award, 
//                   disabled: (row?.overallPerformance ?? 0) < 85, 
//                   onClick: () => handleOpenAction(rowId, fullName, "Reward")
//                 },
//                 { 
//                   label: "Request Performance Review", 
//                   icon: TrendingUp, 
//                   variant: "danger", 
//                   disabled: (row?.overallPerformance ?? 0) >= 50, 
//                   onClick: () => handleOpenAction(rowId, fullName, "Review")
//                 },
//               ]}
//             />
//           </div>
//         );
//       }
//     }
//   ];

//   return (
//     <BaseCard padding="p-0">
//       <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
//         {/* فلاتر التواريخ */}
//         <div className="flex items-center gap-3">
//           <div className="flex flex-col gap-1">
//             <label className="text-xs text-slate-400 font-medium">Start Date</label>
//             <input 
//               type="date" 
//               value={startDate} 
//               onChange={(e) => { setStartDate(e.target.value); onPageChange(1); }}
//               className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="text-xs text-slate-400 font-medium">End Date</label>
//             <input 
//               type="date" 
//               value={endDate} 
//               onChange={(e) => { setEndDate(e.target.value); onPageChange(1); }}
//               className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
//             />
//           </div>
//         </div>
        
//         {/* تفعيل السيرش بربطه بالـ props المستلمة */}
//         <TableControls
//           searchTerm={searchName}
//           setSearchTerm={(val) => { setSearchName(val); onPageChange(1); }}
//           filterValue="All"
//           setFilterValue={() => {}}
//           filterOptions={["All"]}
//           setCurrentPage={onPageChange}
//           showFilter={false} 
//         />
//       </div>

//       <DataTable columns={columns} data={reportData || []} loading={loading} />

//       <Pagination
//         pagination={pagination || { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 5 }}
//         handlePageChange={onPageChange}
//         handleRecordsPerPageChange={onLimitChange}
//         currentDataLength={reportData?.length || 0} 
//         entityName="performance reports"
//       />

//       {/* مودال تفاعلي لإجراءات الأداء */}
//       {actionModal.show && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
//             <div className="flex items-center gap-4 mb-4 text-cyan-400">
//               <AlertCircle size={32} />
//               <h3 className="text-xl font-bold text-white">Confirm Performance Action</h3>
//             </div>
//             <p className="text-slate-400 mb-6 leading-relaxed">
//               Are you sure you want to trigger a 
//               <span className={actionModal.type === "Reward" ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
//                 {" "}{actionModal.type === "Reward" ? "Appreciation Reward" : "Performance Review Request"}{" "}
//               </span>
//               for <span className="text-white font-medium">{actionModal.employeeName}</span>?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button 
//                 onClick={() => setActionModal({ show: false, employeeId: null, employeeName: "", type: "" })}
//                 className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
//                   actionModal.type === "Reward" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </BaseCard>
//   );
// };

// export default PerformanceTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import ReusableCalendar from "../../components/UI/ReusableCalendar";// اتأكدي من صحة المسار للملف
import { Eye, TrendingUp, AlertCircle, Award } from "lucide-react";

const PerformanceBadge = ({ score }) => {
  let styles = "bg-red-500/15 text-red-400 border-red-400/40"; 
  if (score >= 85) {
    styles = "bg-emerald-500/15 text-emerald-400 border-emerald-400/40"; 
  } else if (score >= 65) {
    styles = "bg-yellow-500/15 text-yellow-400 border-yellow-400/40"; 
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {score}%
    </span>
  );
};

const PerformanceTable = ({ 
  reportData = [],    
  startDate,          // تاريخ البدء المستلم من الأب
  setStartDate,       // دالة تحديث تاريخ البدء
  endDate,            // تاريخ الانتهاء المستلم من الأب
  setEndDate,         // دالة تحديث تاريخ الانتهاء
  searchName,       
  setSearchName,    
  pagination, 
  onPageChange,
  onLimitChange,
  loading 
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const [actionModal, setActionModal] = useState({ 
    show: false, 
    employeeId: null, 
    employeeName: "",
    type: "" 
  });

  const handleOpenAction = (id, name, type) => {
    setOpenMenuId(null);
    setActionModal({ show: true, employeeId: id, employeeName: name, type });
  };

  const handleConfirmAction = () => {
    alert(`Action "${actionModal.type}" has been triggered for ${actionModal.employeeName}`);
    setActionModal({ show: false, employeeId: null, employeeName: "", type: "" });
  };

  const columns = [
    {
      header: "Employee",
      render: (row) => {
        const fullName = row ? `${row.firstName} ${row.lastName}` : "Unknown User";
        return (
          <div className="flex items-center gap-3">
            <img 
              src={row?.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
              className="w-10 h-10 rounded-full border border-slate-700 object-cover"
              alt="avatar"
            />
            <div>
              <p className="text-sm font-medium text-slate-100">{fullName}</p>
              <p className="text-xs text-slate-500">{row?.email}</p>
            </div>
          </div>
        );
      }
    },
    { 
      header: "Job Title", 
      render: (row) => <span className="text-slate-300 text-sm">{row?.jobTitle || "N/A"}</span> 
    },
    {
      header: "Attendance Score", 
      render: (row) => (
        <span className="font-mono text-slate-400 text-sm">
          {row?.kpis?.attendanceScore ?? 0}%
        </span>
      )
    },
    { 
      header: "Task Completion", 
      render: (row) => (
        <span className="font-mono text-slate-400 text-sm">
          {row?.kpis?.taskScore ?? 0}%
        </span>
      )
    },
    { 
      header: "Overall Performance", 
      render: (row) => <PerformanceBadge score={row?.overallPerformance ?? 0} /> 
    },
    {
      header: "Action",
      render: (row) => {
        const rowId = row?.employeeId;
        const fullName = `${row?.firstName} ${row?.lastName}`;

        return (
          <div className="relative">
            <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { 
                  label: "View Full Analytics", 
                  icon: Eye, 
                  onClick: () => navigate(`/performance-details/${rowId}`) 
                },
                { 
                  label: "Send Appreciation", 
                  icon: Award, 
                  disabled: (row?.overallPerformance ?? 0) < 85, 
                  onClick: () => handleOpenAction(rowId, fullName, "Reward")
                },
                { 
                  label: "Request Performance Review", 
                  icon: TrendingUp, 
                  variant: "danger", 
                  disabled: (row?.overallPerformance ?? 0) >= 50, 
                  onClick: () => handleOpenAction(rowId, fullName, "Review")
                },
              ]}
            />
          </div>
        );
      }
    }
  ];

  return (
    <BaseCard padding="p-0">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* عرض اثنين كاليندر منفصلين بشكل شيك ومتناسق */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Start Date</label>
            <ReusableCalendar
              mode="single"
              value={startDate}
              align="left"
              onSave={(dateStr) => {
                setStartDate(dateStr);
                onPageChange(1); // يرجع لصفحة 1 فور تغيير التاريخ
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">End Date</label>
            <ReusableCalendar
              mode="single"
              value={endDate}
              align="left"
              onSave={(dateStr) => {
                setEndDate(dateStr);
                onPageChange(1); // يرجع لصفحة 1 فور تغيير التاريخ
              }}
            />
          </div>
        </div>
        
        {/* كاميرا البحث */}
        <TableControls
          searchTerm={searchName}
          setSearchTerm={(val) => { setSearchName(val); onPageChange(1); }}
          filterValue="All"
          setFilterValue={() => {}}
          filterOptions={["All"]}
          setCurrentPage={onPageChange}
          showFilter={false} 
        />
      </div>

      <DataTable columns={columns} data={reportData || []} loading={loading} />

      <Pagination
        pagination={pagination || { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 5 }}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={reportData?.length || 0} 
        entityName="performance reports"
      />

      {/* المودال */}
      {actionModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-cyan-400">
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold text-white">Confirm Performance Action</h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to trigger a 
              <span className={actionModal.type === "Reward" ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                {" "}{actionModal.type === "Reward" ? "Appreciation Reward" : "Performance Review Request"}{" "}
              </span>
              for <span className="text-white font-medium">{actionModal.employeeName}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setActionModal({ show: false, employeeId: null, employeeName: "", type: "" })}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                  actionModal.type === "Reward" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default PerformanceTable;