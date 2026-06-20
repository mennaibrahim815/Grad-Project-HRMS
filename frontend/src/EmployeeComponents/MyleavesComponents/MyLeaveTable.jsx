
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, Trash2, AlertCircle, XCircle } from "lucide-react";

const LeaveStatusBadge = ({ status }) => {
  const styles = {
    Approved: { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)" },
    Pending:  { background: "rgba(234,179,8,0.15)",  color: "#facc15", border: "1px solid rgba(250,204,21,0.4)" },
    Rejected: { background: "rgba(239,68,68,0.15)",  color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" },
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

const MyLeaveTable = ({
  leaves, onLeaveDelete,
  statusFilter, setStatusFilter,
  pagination, onPageChange, onLimitChange, loading
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [alertModal, setAlertModal] = useState({ show: false, message: "" });

  const handleOpenDelete = (id, currentStatus) => {
    setOpenMenuId(null);
    if (currentStatus !== "Pending") {
      setAlertModal({ show: true, message: `This leave request has already been ${currentStatus.toLowerCase()}. You cannot delete it anymore.` });
      return;
    }
    setDeleteModal({ show: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.id) onLeaveDelete(deleteModal.id);
    setDeleteModal({ show: false, id: null });
  };

  const columns = [
    { header: "Type", render: (row) => <span style={{ color: "var(--text-main)" }}>{row.type || "Annual"}</span> },
    { header: "Start Date", render: (row) => <span style={{ color: "var(--text-main)" }}>{row.startDate ? new Date(row.startDate).toISOString().split("T")[0] : "N/A"}</span> },
    { header: "End Date",   render: (row) => <span style={{ color: "var(--text-main)" }}>{row.endDate   ? new Date(row.endDate).toISOString().split("T")[0]   : "N/A"}</span> },
    {
      header: "Duration",
      render: (row) => (
        <span className="font-semibold font-mono" style={{ color: "#35AAFD" }}>
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
            <button
              onClick={() => { setOpenMenuId(openMenuId === rowId ? null : rowId); }}
              className="p-2 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => { setOpenMenuId(null); }}
              actions={[
                { label: "See Details", icon: Eye, onClick: () => { navigate(`/my-leave-details/${rowId}`); } },
                { label: "Delete", icon: Trash2, variant: "danger", disabled: isProcessed, onClick: () => { handleOpenDelete(rowId, row.status); } },
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
        searchTerm={statusFilter}
        setSearchTerm={() => {}}
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

      {/* Delete Confirm Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="p-6 rounded-2xl max-w-md w-full shadow-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)" }}
          >
            <div className="flex items-center gap-4 mb-4" style={{ color: "#f87171" }}>
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold" style={{ color: "var(--text-main)" }}>Delete Request</h3>
            </div>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Are you sure you want to delete this leave application? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModal({ show: false, id: null }); }}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{ background: "#dc2626" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#b91c1c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#dc2626"; }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="p-6 rounded-2xl max-w-md w-full shadow-2xl text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)" }}
          >
            <div
              className="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
            >
              <XCircle size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-main)" }}>Action Not Allowed</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {alertModal.message}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => { setAlertModal({ show: false, message: "" }); }}
                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors w-full sm:w-auto shadow-md"
                style={{ background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--border-main)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--input-bg)"; }}
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

export default MyLeaveTable;