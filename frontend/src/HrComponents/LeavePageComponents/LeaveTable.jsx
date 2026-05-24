
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DataTable from "../../components/table/DataTable";
// import TableControls from "../../components/table/TableControls";
// import Pagination from "../../components/table/Pagination";
// import EditIcon from "@mui/icons-material/Edit";
// import RowActionMenu from "../../components/UI/RowActionMenu";
// import BaseCard from "../../components/UI/Card";
// import { Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// const LeaveStatusBadge = ({ status }) => {
//   const styles = {
//     Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
//     Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-400/40",
//     Rejected: "bg-red-500/15 text-red-400 border-red-400/40",
//   };
//   return (
//     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-500/20 text-slate-400 border-slate-400/40"}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//       {status || "Pending"}
//     </span>
//   );
// };

// const LeaveTable = ({ 
//   leaves, 
//   onStatusUpdate, 
//   searchName,      
//   setSearchName,   
//   searchDate,      
//   setSearchDate,   
//   statusFilter,    
//   setStatusFilter, 
//   pagination, 
//   onPageChange,
//   onLimitChange,
//   loading 
// }) => {
//   const navigate = useNavigate();
//   const [openMenuId, setOpenMenuId] = useState(null);
  
//   // State مُحدث لإدارة سبب الرفض
//   const [confirmModal, setConfirmModal] = useState({ 
//     show: false, 
//     id: null, 
//     status: "",
//     rejectReason: "" 
//   });

//   const handleOpenConfirm = (id, status) => {
//     setConfirmModal({ show: true, id, status, rejectReason: "" });
//     setOpenMenuId(null);
//   };

//   const handleConfirmAction = () => {
//     // التحقق من وجود سبب في حالة الرفض
//     if (confirmModal.status === "Rejected" && !confirmModal.rejectReason.trim()) {
//       alert("Please provide a reason for rejection");
//       return;
//     }
    
//     onStatusUpdate(confirmModal.id, confirmModal.status, confirmModal.rejectReason);
//     setConfirmModal({ show: false, id: null, status: "", rejectReason: "" });
//   };

//   const columns = [
//     {
//       header: "Employee",
//       render: (row) => {
//         const emp = row.employee || {};
//         const fullName = emp.firstName ? `${emp.firstName} ${emp.lastName}` : "Unknown User";
//         return (
//           <div className="flex items-center gap-3">
//             <img 
//               src={emp.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
//               className="w-10 h-10 rounded-full border border-slate-700"
//               alt="avatar"
//             />
//             <div>
//               <p className="text-sm font-medium text-slate-100">{fullName}</p>
//               <p className="text-xs text-slate-500">{emp.jobTitle || "Staff"}</p>
//             </div>
//           </div>
//         );
//       }
//     },
//     { header: "Type", render: (row) => row.type || "Annual" },
//     { 
//       header: "Start Date", 
//       render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"
//     },
//     { 
//       header: "End Date", 
//       render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"
//     },
//     { 
//       header: "Duration", 
//       render: (row) => (
//         <span className="font-semibold text-[#0095ff] font-mono">
//           {row.duration || 0} {row.duration === 1 ? "Day" : "Days"}
//         </span>
//       )
//     },
//     { header: "Status", render: (row) => <LeaveStatusBadge status={row.status} /> },
//     {
//       header: "Action",
//       render: (row) => {
//         const rowId = row._id || row.id;
//         const isProcessed = row.status !== "Pending";

//         return (
//           <div className="relative">
//             <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
//               <EditIcon />
//             </button>
//             <RowActionMenu
//               isOpen={openMenuId === rowId}
//               onClose={() => setOpenMenuId(null)}
//               actions={[
//                 { label: "See Details", icon: Eye, onClick: () => navigate(`/leave-details/${rowId}`) },
//                 { 
//                   label: "Approve", 
//                   icon: CheckCircle, 
//                   disabled: isProcessed, 
//                   onClick: () => {
//                    if (isProcessed) {
//                       alert("This request has already been processed and its status cannot be changed.");
//                       return;
//                       } 
//                       handleOpenConfirm(rowId, "Approved")
//                     }
//                 },
//                 { 
//                   label: "Reject", 
//                   icon: XCircle, 
//                   variant: "danger", 
//                   disabled: isProcessed, 
//                 onClick: () => {
//                    if (isProcessed) {
//                       alert("This request has already been processed and its status cannot be changed.");
//                       return;
//                       } 
//                         handleOpenConfirm(rowId, "Rejected")
//                     }
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
//       <TableControls
//         searchTerm={searchName} 
//         setSearchTerm={(val) => { setSearchName(val); onPageChange(1); }}
//         filterValue={statusFilter} 
//         setFilterValue={(val) => { setStatusFilter(val); onPageChange(1); }}
//         filterOptions={["All", "Pending", "Approved", "Rejected"]}
//         setCurrentPage={onPageChange}
//       />

//       <DataTable columns={columns} data={leaves} loading={loading} />

//       <Pagination
//         pagination={pagination}
//         handlePageChange={onPageChange}
//         handleRecordsPerPageChange={onLimitChange}
//         currentDataLength={leaves.length}
//         entityName="leaves"
//       />

//       {confirmModal.show && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
//           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
//             <div className="flex items-center gap-4 mb-4 text-cyan-400">
//               <AlertCircle size={32} />
//               <h3 className="text-xl font-bold text-white">Confirm Action</h3>
//             </div>
//             <p className="text-slate-400 mb-4">
//               Are you sure you want to <span className={confirmModal.status === "Approved" ? "text-emerald-400" : "text-red-400"}>
//                 {confirmModal.status.toLowerCase()}
//               </span> this leave request?
//             </p>

//             {confirmModal.status === "Rejected" && (
//               <div className="mb-4 animate-in fade-in slide-in-from-top-2">
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Rejection Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 min-h-[100px] resize-none"
//                   placeholder="Explain why this request is being rejected..."
//                   value={confirmModal.rejectReason}
//                   onChange={(e) => setConfirmModal({...confirmModal, rejectReason: e.target.value})}
//                 />
//               </div>
//             )}

//             <div className="flex justify-end gap-3">
//               <button 
//                 onClick={() => setConfirmModal({ show: false, id: null, status: "", rejectReason: "" })}
//                 className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
//                   confirmModal.status === "Approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
//                 }`}
//               >
//                 Confirm {confirmModal.status}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </BaseCard>
//   );
// };

// export default LeaveTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const LeaveStatusBadge = ({ status }) => {
  const styles = {
    Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-400/40",
    Rejected: "bg-red-500/15 text-red-400 border-red-400/40",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-500/20 text-slate-400 border-slate-400/40"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status || "Pending"}
    </span>
  );
};

const LeaveTable = ({ 
  leaves, 
  onStatusUpdate, 
  searchName,      
  setSearchName,   
  searchDate,      
  setSearchDate,   
  statusFilter,    
  setStatusFilter, 
  pagination, 
  onPageChange,
  onLimitChange,
  loading 
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // الـ State الخاص بطلب تأكيد الإجراء الإعتيادي
  const [confirmModal, setConfirmModal] = useState({ 
    show: false, 
    id: null, 
    status: "",
    rejectReason: "" 
  });

  // الـ State الجديد المخصص لنافذة منع التعديل (الخيار الثاني)
  const [alertModal, setAlertModal] = useState({
    show: false,
    message: ""
  });

  // تحديث دالة فتح التأكيد لفحص حالة الطلب الحالية أولاً
  const handleOpenConfirm = (id, targetStatus, currentStatus) => {
    setOpenMenuId(null);

    // إذا كان الطلب مقبولاً أو مرفوضاً بالفعل، نمنع الأكشن ونظهر نافذة التحذير المخصصة
    if (currentStatus !== "Pending") {
      setAlertModal({
        show: true,
        message: `This leave request has already been ${currentStatus.toLowerCase()}. You cannot change its status anymore.`
      });
      return;
    }

    // إذا كان معلقاً (Pending)، نفتح فورم التأكيد الطبيعي
    setConfirmModal({ show: true, id, status: targetStatus, rejectReason: "" });
  };

  const handleConfirmAction = () => {
    if (confirmModal.status === "Rejected" && !confirmModal.rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    onStatusUpdate(confirmModal.id, confirmModal.status, confirmModal.rejectReason);
    setConfirmModal({ show: false, id: null, status: "", rejectReason: "" });
  };

  const columns = [
    {
      header: "Employee",
      render: (row) => {
        const emp = row.employee || {};
        const fullName = emp.firstName ? `${emp.firstName} ${emp.lastName}` : "Unknown User";
        return (
          <div className="flex items-center gap-3">
            <img 
              src={emp.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
              className="w-10 h-10 rounded-full border border-slate-700"
              alt="avatar"
            />
            <div>
              <p className="text-sm font-medium text-slate-100">{fullName}</p>
              <p className="text-xs text-slate-500">{emp.jobTitle || "Staff"}</p>
            </div>
          </div>
        );
      }
    },
    { header: "Type", render: (row) => row.type || "Annual" },
    {
      header: "Start Date", 
      render: (row) => row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : "N/A"
    },
    { 
      header: "End Date", 
      render: (row) => row.endDate ? new Date(row.endDate).toISOString().split('T')[0] : "N/A"
    },
    
    { 
      header: "Duration", 
      render: (row) => (
        <span className="font-semibold text-[#0095ff] font-mono">
          {row.duration || 0} {row.duration === 1 ? "Day" : "Days"}
        </span>
      )
    },
    { header: "Status", render: (row) => <LeaveStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id || row.id;
        const isProcessed = row.status !== "Pending";

        return (
          <div className="relative">
            <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { label: "See Details", icon: Eye, onClick: () => navigate(`/leave-details/${rowId}`) },
                { 
                  label: "Approve", 
                  icon: CheckCircle, 
                  disabled: isProcessed, 
                  onClick: () => handleOpenConfirm(rowId, "Approved", row.status)
                },
                { 
                  label: "Reject", 
                  icon: XCircle, 
                  variant: "danger", 
                  disabled: isProcessed, 
                  onClick: () => handleOpenConfirm(rowId, "Rejected", row.status)
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
      <TableControls
        searchTerm={searchName} 
        setSearchTerm={(val) => { setSearchName(val); onPageChange(1); }}
        filterValue={statusFilter} 
        setFilterValue={(val) => { setStatusFilter(val); onPageChange(1); }}
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        setCurrentPage={onPageChange}
      />

      <DataTable columns={columns} data={leaves} loading={loading} />

      <Pagination
        pagination={pagination}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={leaves.length}
        entityName="leaves"
      />

      {/* 1. مودال تأكيد الإجراء للإجازات الـ Pending */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-cyan-400">
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold text-white">Confirm Action</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Are you sure you want to <span className={confirmModal.status === "Approved" ? "text-emerald-400" : "text-red-400"}>
                {confirmModal.status.toLowerCase()}
              </span> this leave request?
            </p>

            {confirmModal.status === "Rejected" && (
              <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 min-h-[100px] resize-none"
                  placeholder="Explain why this request is being rejected..."
                  value={confirmModal.rejectReason}
                  onChange={(e) => setConfirmModal({...confirmModal, rejectReason: e.target.value})}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ show: false, id: null, status: "", rejectReason: "" })}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                  confirmModal.status === "Approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {confirmModal.status}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. النافذة التحذيرية المخصصة (Form) للإجازات المقبولة/المرفوضة مسبقاً */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-4">
              <XCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Action Not Allowed</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {alertModal.message}
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setAlertModal({ show: false, message: "" })}
                className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-700/80 rounded-xl transition-colors border border-slate-700 w-full sm:w-auto shadow-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default LeaveTable;