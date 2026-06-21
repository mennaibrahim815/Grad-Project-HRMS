
import React, { useState, useEffect } from "react";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import instance from "@/services/axios";
import { CheckCircle, X, Upload, Loader2 } from "lucide-react";

const TaskStatusBadge = ({ status }) => {
  const styles = {
    Completed:    { background: "rgba(16,185,129,0.15)",  color: "#34d399", border: "1px solid rgba(52,211,153,0.4)"  },
    "On-going":   { background: "rgba(59,130,246,0.15)",  color: "#60a5fa", border: "1px solid rgba(96,165,250,0.4)"  },
    "In Progress":{ background: "rgba(245,158,11,0.15)",  color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)"  },
    Pending:      { background: "rgba(100,116,139,0.3)",  color: "#94a3b8", border: "1px solid rgba(100,116,139,0.4)" },
    Testing:      { background: "rgba(168,85,247,0.15)",  color: "#c084fc", border: "1px solid rgba(192,132,252,0.4)" },
  };
  const fallback = { background: "var(--input-bg)", color: "var(--text-muted)", border: "1px solid var(--border-main)" };
  const activeStyle = styles[status] || fallback;

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={activeStyle}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status || "Pending"}
    </span>
  );
};

const MyTasksTable = ({
  tasks, taskScope, setTaskScope,
  searchTerm, setSearchTerm,
  pagination, onPageChange, onLimitChange,
  loading, refreshTable, highlightId
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updateModal, setUpdateModal] = useState({ show: false, taskId: null, currentStatus: "Pending" });
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [flashId, setFlashId] = useState(null);

  const handleOpenUpdate = (id, currentStatus) => {
    setOpenMenuId(null);
    setSelectedStatus(currentStatus);
    setSelectedFile(null);
    setUpdateModal({ show: true, taskId: id, currentStatus });
  };

  const handleStatusAndDocSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("status", selectedStatus);
      if (selectedFile) formData.append("document", selectedFile);

      const response = await instance.patch(`/tasks/${updateModal.taskId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data?.status === "success") {
        setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" });
        if (refreshTable) refreshTable();
      }
    } catch (error) {
      console.error("Error updating task progress:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (highlightId) {
      setFlashId(highlightId);
      const timer = setTimeout(() => { setFlashId(null); }, 1200);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":   return { color: "#fb7185", background: "rgba(244,63,94,0.1)",   border: "1px solid rgba(244,63,94,0.2)"   };
      case "Medium": return { color: "#fbbf24", background: "rgba(245,158,11,0.1)",  border: "1px solid rgba(245,158,11,0.2)"  };
      case "Low":    return { color: "#34d399", background: "rgba(16,185,129,0.1)",  border: "1px solid rgba(16,185,129,0.2)"  };
      default:       return { color: "var(--text-muted)", background: "var(--input-bg)", border: "1px solid var(--border-main)" };
    }
  };

  const columns = [
    {
      header: "Task Title",
      render: (row) => (
        <span
          className="font-semibold truncate max-w-[220px] block transition-all duration-500"
          style={{
            color: flashId === row._id ? "#fde047" : "var(--text-main)",
            textShadow: flashId === row._id ? "0 0 10px rgba(250,204,21,0.8)" : "none",
          }}
        >
          {row.title || "N/A"}
        </span>
      )
    },
    {
      header: "Assigned To",
      render: (row) => {
        const assignees = row.assignedTo || [];
        if (assignees.length === 0) return <span className="text-xs" style={{ color: "var(--text-muted)" }}>Unassigned</span>;
        return (
          <div className="flex items-center -space-x-2 overflow-hidden">
            {assignees.map((user, idx) => {
              const fullName = `${user.general?.firstName || ""} ${user.general?.lastName || ""}`;
              return (
                <img
                  key={user._id || idx}
                  className="inline-block h-7 w-7 rounded-full object-cover"
                  style={{ border: "2px solid var(--bg-card)" }}
                  src={user.general?.avatar || "https://via.placeholder.com/150"}
                  alt={fullName}
                  title={fullName}
                />
              );
            })}
          </div>
        );
      }
    },
    {
      header: "Priority",
      render: (row) => {
        const pStyle = getPriorityStyle(row.priority);
        return (
          <span
            className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide"
            style={pStyle}
          >
            {row.priority || "Medium"}
          </span>
        );
      }
    },
    {
      header: "Deadline",
      render: (row) => (
        <span style={{ color: "var(--text-main)" }}>
          {row.deadline ? new Date(row.deadline).toISOString().split("T")[0] : "N/A"}
        </span>
      )
    },
    { header: "Status", render: (row) => <TaskStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id || row.id;
        const isCompleted = row.status === "Completed";
        return (
          <div className="relative">
            <button
              disabled={isCompleted}
              onClick={() => { setOpenMenuId(openMenuId === rowId ? null : rowId); }}
              className="p-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "var(--text-muted)" }}
            >
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => { setOpenMenuId(null); }}
              actions={[
                { label: "Submit Work", icon: CheckCircle, onClick: () => { handleOpenUpdate(rowId, row.status); } },
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={taskScope}
        setFilterValue={(val) => { setTaskScope(val); onPageChange(1); }}
        filterOptions={["My Tasks", "Team Tasks"]}
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

      {/* Update Modal */}
      {updateModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" dir="ltr">
          <div
            className="p-6 rounded-2xl max-w-md w-full shadow-2xl text-left relative"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)" }}
          >
            {/* Close */}
            <button
              onClick={() => { setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" }); }}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:text-red-400"
              style={{ color: "var(--text-muted)", background: "var(--input-bg)" }}
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-bold" style={{ color: "var(--text-main)" }}>Submit Task Progress</h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Upload your work deliverables. Your submission will be reviewed by HR for full approval.
              </p>
            </div>

            <form onSubmit={handleStatusAndDocSubmit} className="space-y-5">


              {/* File Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>Deliverables / Documentation</label>
                <div
                  className="relative border border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border-main)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-muted)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-main)"; }}
                >
                  <input
                    type="file"
                    onChange={(e) => { setSelectedFile(e.target.files[0]); }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".doc,.docx,.pdf,.zip,.rar"
                  />
                  <div
                    className="p-2.5 rounded-xl mb-2 transition-colors"
                    style={{ background: "var(--bg-deep)", color: "var(--text-muted)" }}
                  >
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--text-main)" }}>
                    {selectedFile ? selectedFile.name : "Click to upload document"}
                  </span>
                  <span className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Supports PDF, DOCX, ZIP up to 10MB"}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setUpdateModal({ show: false, taskId: null, currentStatus: "Pending" }); }}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  disabled={submitLoading}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  style={{ background: "#0293FA" }}
                  disabled={submitLoading}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#0282dd"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0293FA"; }}
                >
                  {submitLoading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Work"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default MyTasksTable;