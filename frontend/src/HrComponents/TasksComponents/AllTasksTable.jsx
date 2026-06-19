
import React, { useState } from "react";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Trash2, AlertCircle } from "lucide-react";

const TaskStatusBadge = ({ status }) => {
  const styles = {
    Completed: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.4)' },
    "On-going": { background: 'rgba(6,182,212,0.15)',  color: '#22d3ee', border: '1px solid rgba(34,211,238,0.4)' },
    Pending:    { background: 'rgba(234,179,8,0.15)',  color: '#facc15', border: '1px solid rgba(250,204,21,0.4)' },
  };
  const fallback = { background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-main)' };

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
      style={styles[status] || fallback}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status || "Pending"}
    </span>
  );
};

const TasksTable = ({
  tasks, onDeleteTask, onEditClick,
  searchTitle, setSearchTitle,
  statusFilter, setStatusFilter,
  pagination, onPageChange, onLimitChange, loading
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, type: "", taskTitle: "" });

  const handleOpenConfirm = (id, type, taskTitle) => { setOpenMenuId(null); setConfirmModal({ show: true, id, type, taskTitle }); };
  const handleConfirmAction = () => {
    if (confirmModal.type === "delete") onDeleteTask(confirmModal.id);
    setConfirmModal({ show: false, id: null, type: "", taskTitle: "" });
  };

  const columns = [
    {
      header: "Task Title",
      render: (row) => (
        <p className="text-sm font-medium max-w-xs truncate" style={{ color: 'var(--text-main)' }}>
          {row.title || "No Title"}
        </p>
      )
    },
    {
      header: "Project Name",
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
          {row.projectName || row.projectId?.general?.name || "Independent Task"}
        </span>
      )
    },
    {
      header: "Assigned To",
      render: (row) => {
        const emp = row.assignedTo?.[0] || {};
        const fullName = emp.general?.firstName ? `${emp.general.firstName} ${emp.general.lastName}`.trim() : "Unassigned";
        if (!emp.general) return <span className="italic text-xs" style={{ color: 'var(--text-muted)' }}>Unassigned</span>;
        return (
          <div className="flex items-center gap-2.5">
            <img
              src={emp.general.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`}
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: '1px solid var(--border-main)' }}
              alt="avatar"
            />
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-main)' }}>{fullName}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{emp.employee?.jobTitle || "Staff"}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Deadline",
      render: (row) => (
        <span style={{ color: 'var(--text-main)' }}>
          {row.deadline ? new Date(row.deadline).toISOString().split('T')[0] : "N/A"}
        </span>
      )
    },
    { header: "Status", render: (row) => <TaskStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id;
        return (
          <div className="relative">
            <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)}
              className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}>
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { label: "Update Task", icon: EditIcon, onClick: () => { setOpenMenuId(null); onEditClick(row); } },
                { label: "Delete Task", icon: Trash2, variant: "danger", onClick: () => handleOpenConfirm(rowId, "delete", row.title) },
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
        filterOptions={["All", "Pending", "On-going", "Completed"]}
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

      {/* Confirm Delete Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 rounded-2xl max-w-md w-full shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)' }}>
            <div className="flex items-center gap-4 mb-4" style={{ color: '#f87171' }}>
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Confirm Action</h3>
            </div>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to permanently delete the task: <br />
              <span className="font-semibold italic" style={{ color: 'var(--text-main)' }}>
                "{confirmModal.taskTitle}"
              </span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, id: null, type: "", taskTitle: "" })}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{ background: '#dc2626' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default TasksTable;