

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// مكون شارة الحالة (Badge)
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
  onDelete,
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
  
  // State لإدارة Modal التأكيد
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, status: "" });

  const handleOpenConfirm = (id, status) => {
    setConfirmModal({ show: true, id, status });
    setOpenMenuId(null); // قفل المنيو الصغير
  };

  const handleConfirmAction = () => {
    onStatusUpdate(confirmModal.id, confirmModal.status);
    setConfirmModal({ show: false, id: null, status: "" });
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
      header: "Duration", 
      render: (row) => (
        <span className="text-xs text-slate-300">
          {row.duration || 0} Days ({row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"})
        </span>
      )
    },
    { header: "Status", render: (row) => <LeaveStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id || row.id;
        const isProcessed = row.status !== "Pending"; // هل تم اتخاذ قرار مسبق؟

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
                    disabled: isProcessed, // تعطيل الزرار لو مش Pending
                    onClick: () => handleOpenConfirm(rowId, "Approved") 
                },
                { 
                    label: "Reject", 
                    icon: XCircle, 
                    variant: "danger", 
                    disabled: isProcessed, // تعطيل الزرار لو مش Pending
                    onClick: () => handleOpenConfirm(rowId, "Rejected") 
                },
                // { label: "Delete", variant: "danger", icon: Trash2, onClick: () => { onDelete(rowId); setOpenMenuId(null); } },
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

      {/* حقل اختيار التاريخ */}
      {/* <div className="px-6 pb-4 flex justify-start">
        <input 
          type="date" 
          value={searchDate} 
          onChange={(e) => { setSearchDate(e.target.value); onPageChange(1); }}
          className="bg-slate-800 text-white p-2 rounded-lg border border-slate-700 text-sm outline-none focus:border-cyan-500/50"
        />
      </div> */}

      <DataTable columns={columns} data={leaves} loading={loading} />

      <Pagination
        pagination={pagination}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={leaves.length}
      />

      {/* نافذة التأكيد المنبثقة (Confirm Modal) */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-cyan-400">
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold text-white">Confirm Action</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Are you sure you want to <span className={confirmModal.status === "Approved" ? "text-emerald-400" : "text-red-400"}>
                {confirmModal.status.toLowerCase()}
              </span> this leave request? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ show: false, id: null, status: "" })}
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
    </BaseCard>
  );
};

export default LeaveTable;