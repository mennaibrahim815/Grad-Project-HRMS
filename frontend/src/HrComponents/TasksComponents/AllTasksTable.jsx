import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, CheckCircle, Trash2, AlertCircle } from "lucide-react";

// مكوّن صغير لعرض حالة التاسك (Done / Active) بناءً على قيمة الباكيند boolean
const TaskStatusBadge = ({ done }) => {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
      done 
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/40" 
        : "bg-amber-500/15 text-amber-400 border-amber-400/40"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${done ? "bg-emerald-400" : "bg-amber-400"}`}></span>
      {done ? "Completed" : "Active"}
    </span>
  );
};

const TasksTable = ({
  tasks,
  onAcceptTask,   // الأكشن المقابل لـ PATCH /api/tasks/:id (قبول وتحديث لـ Completed)
  onDeleteTask,   // الأكشن المقابل لـ DELETE /api/tasks/:id
  searchTitle,
  setSearchTitle,
  statusFilter,
  setStatusFilter,
  pagination,
  onPageChange,
  onLimitChange,
  loading
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  // مودال تأكيد الأكاشن (حذف أو قبول)
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
    type: "", // "accept" أو "delete"
    taskTitle: ""
  });

  const handleOpenConfirm = (id, type, taskTitle) => {
    setOpenMenuId(null);
    setConfirmModal({ show: true, id, type, taskTitle });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "accept") {
      onAcceptTask(confirmModal.id);
    } else if (confirmModal.type === "delete") {
      onDeleteTask(confirmModal.id);
    }
    setConfirmModal({ show: false, id: null, type: "", taskTitle: "" });
  };

  const columns = [
    {
      header: "Task ID",
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">
          #{row._id ? row._id.slice(-6) : "N/A"}
        </span>
      )
    },
    {
      header: "Title",
      render: (row) => (
        <p className="text-sm font-medium text-slate-100 max-w-md truncate">
          {row.title || "No Title"}
        </p>
      )
    },
    {
      header: "Project ID",
      render: (row) => (
        <span className="font-mono text-xs text-slate-400">
          {row.projectId ? row.projectId.slice(-6) : "N/A"}
        </span>
      )
    },
    {
      header: "Created At",
      render: (row) => row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : "N/A"
    },
    {
      header: "Status",
      render: (row) => <TaskStatusBadge done={row.done} />
    },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id;
        const isCompleted = row.done === true;

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
                  label: "See Details", 
                  icon: Eye, 
                  onClick: () => navigate(`/task-details/${rowId}`) 
                },
                { 
                  label: "Accept & Complete", 
                  icon: CheckCircle, 
                  disabled: isCompleted, // لو معملولها Done من قبل كدا تتقفل
                  onClick: () => handleOpenConfirm(rowId, "accept", row.title)
                },
                { 
                  label: "Delete Task", 
                  icon: Trash2, 
                  variant: "danger", 
                  onClick: () => handleOpenConfirm(rowId, "delete", row.title)
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
        searchTerm={searchTitle}
        setSearchTerm={(val) => { setSearchTitle(val); onPageChange(1); }}
        filterValue={statusFilter}
        setFilterValue={(val) => { setStatusFilter(val); onPageChange(1); }}
        // الفلتر هيمشي مع الستيت الـ boolean: All يعني كله، Active يعني done: false، Completed يعني done: true
        filterOptions={["All", "Active", "Completed"]}
        setCurrentPage={onPageChange}
      />

      <DataTable columns={columns} data={tasks} loading={loading} />

      <Pagination
        pagination={pagination}
        handlePageChange={onPageChange}
        handleRecordsPerPageChange={onLimitChange}
        currentDataLength={tasks.length}
        entityName="tasks"
      />

      {/* مودال التأكيد الموحد للأكشنز */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className={`flex items-center gap-4 mb-4 ${confirmModal.type === "accept" ? "text-emerald-400" : "text-red-400"}`}>
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold text-white">Confirm Action</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Are you sure you want to {confirmModal.type === "accept" ? "Accept & Complete" : "Permanently Delete"} the task: <br />
              <span className="text-white font-semibold italic">"{confirmModal.taskTitle}"</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, id: null, type: "", taskTitle: "" })}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                  confirmModal.type === "accept" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Yes, {confirmModal.type === "accept" ? "Accept" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default TasksTable;