import React, { useState } from "react";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import RequestDetailsModal from "@/EmployeeComponents/MyRequestsComponents/RequestDetailsModal.jsx"; // تأكدي من مسار مودال التفاصيل
import { Eye, Trash2, AlertCircle, XCircle } from "lucide-react";

// الاستايل الخاص بحالة الطلب (متوافق مع ألوان السيستم عندك)
const RequestStatusBadge = ({ status }) => {
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

const MyRequestsTable = ({ 
  requests, 
  onRequestDelete,       // الدالة الممررة من الصفحة الأب لحذف الطلب من الباك إند
  statusFilter,    
  setStatusFilter, 
  pagination, 
  onPageChange,
  onLimitChange,
  loading 
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // التحكم في مودال تفاصيل الطلب (الـ API بتاع الـ ID)
  const [detailsModal, setDetailsModal] = useState({ show: false, id: null });

  // مودال تأكيد حذف الطلب (Pending فقط)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // مودال منع الحذف في حال معالجة الطلب مسبقاً من الـ HR
  const [alertModal, setAlertModal] = useState({ show: false, message: "" });

  // فحص حالة الطلب قبل فتح نافذة الحذف لحماية الـ Flow
  const handleOpenDelete = (id, currentStatus) => {
    setOpenMenuId(null);

    // حماية: إذا كان الطلب Approved أو Rejected نمنع الموظف من حذفه
    if (currentStatus !== "Pending") {
      setAlertModal({
        show: true,
        message: `This request has already been ${currentStatus.toLowerCase()} by HR. You cannot delete it anymore.`
      });
      return;
    }

    setDeleteModal({ show: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.id) {
      onRequestDelete(deleteModal.id);
    }
    setDeleteModal({ show: false, id: null });
  };

  // إعداد الأعمدة الخاصة بالـ Requests بناءً على مواصفات الباك إند بتاعك
  const columns = [
    { 
      header: "Title", 
      render: (row) => <span className="font-medium text-white truncate max-w-[180px] block">{row.title || "N/A"}</span> 
    },
    { header: "Type", render: (row) => row.type || "HR Letter" },
    { 
      header: "Priority", 
      render: (row) => {
        const priorityColors = {
          High: "text-rose-400 bg-rose-500/10",
          Medium: "text-amber-400 bg-amber-500/10",
          Low: "text-slate-400 bg-slate-500/10"
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[row.priority] || "text-slate-300"}`}>
            {row.priority || "Medium"}
          </span>
        );
      }
    },
    {
      header: "Created Date", 
      render: (row) => row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : "N/A"
    },
    { header: "Status", render: (row) => <RequestStatusBadge status={row.status} /> },
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
                // 1️⃣ الإجراء الأول: فتح تفاصيل الطلب بالـ ID في مودال منبثق
                { 
                  label: "See Details", 
                  icon: Eye, 
                  onClick: () => {
                    setOpenMenuId(null);
                    setDetailsModal({ show: true, id: rowId });
                  }
                },
                // 2️⃣ الإجراء الثاني: حذف الطلب (مع الحماية التامة)
                { 
                  label: "Delete", 
                  icon: Trash2, 
                  variant: "danger", 
                  disabled: isProcessed, // يتم تعطيله بصرياً لو الـ HR بت فيه
                  onClick: () => handleOpenDelete(rowId, row.status)
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
      {/* أدوات التحكم والفلترة بالحالة للطلبات */}
      <TableControls
        searchTerm={statusFilter} 
        setSearchTerm={() => {}} 
        filterValue={statusFilter} 
        setFilterValue={(val) => { setStatusFilter(val); onPageChange(1); }}
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        setCurrentPage={onPageChange}
      />

      {/* عرض داتا الجدول المستلمة من الـ API */}
      <DataTable columns={columns} data={requests} loading={loading} />

      {/* كود الـ Pagination الديناميكي */}
      <Pagination
        pagination={pagination}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={requests.length}
        entityName="requests"
      />

      {/* مودال تفاصيل الطلب اللي بيضرب الـ API بالـ ID المختار */}
      <RequestDetailsModal 
        isOpen={detailsModal.show}
        requestId={detailsModal.id}
        onClose={() => setDetailsModal({ show: false, id: null })}
      />

      {/* مودال تأكيد الحذف للطلبات المعلّقة */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" dir="ltr">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-center gap-4 mb-4 text-red-400">
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold text-white">Delete Request</h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete this request? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md shadow-red-900/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال التحذير من حذف طلب معالج مسبقاً */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" dir="ltr">
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

export default MyRequestsTable;