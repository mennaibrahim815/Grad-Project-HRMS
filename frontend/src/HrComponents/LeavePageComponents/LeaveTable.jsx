
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
    Approved: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.4)' },
    Pending:  { background: 'rgba(234,179,8,0.15)',  color: '#facc15', border: '1px solid rgba(250,204,21,0.4)' },
    Rejected: { background: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(248,113,113,0.4)' },
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

const LeaveTable = ({
  leaves, onStatusUpdate,
  searchName, setSearchName,
  searchDate, setSearchDate,
  statusFilter, setStatusFilter,
  pagination, onPageChange, onLimitChange, loading
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, status: "", rejectReason: "" });
  const [alertModal, setAlertModal] = useState({ show: false, message: "" });

  const handleOpenConfirm = (id, targetStatus, currentStatus) => {
    setOpenMenuId(null);
    if (currentStatus !== "Pending") {
      setAlertModal({ show: true, message: `This leave request has already been ${currentStatus.toLowerCase()}. You cannot change its status anymore.` });
      return;
    }
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
              className="w-10 h-10 rounded-full"
              style={{ border: '1px solid var(--border-main)' }}
              alt="avatar"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{fullName}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{emp.jobTitle || "Staff"}</p>
            </div>
          </div>
        );
      }
    },
    { header: "Type", render: (row) => row.type || "Annual" },
    { header: "Start Date", render: (row) => row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : "N/A" },
    { header: "End Date",   render: (row) => row.endDate   ? new Date(row.endDate).toISOString().split('T')[0]   : "N/A" },
    {
      header: "Duration",
      render: (row) => (
        <span className="font-semibold font-mono" style={{ color: '#35AAFD' }}>
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
            <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)}
              className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}>
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { label: "See Details", icon: Eye, onClick: () => navigate(`/leave-details/${rowId}`) },
                { label: "Approve", icon: CheckCircle, disabled: isProcessed, onClick: () => handleOpenConfirm(rowId, "Approved", row.status) },
                { label: "Reject",  icon: XCircle,    disabled: isProcessed, variant: "danger", onClick: () => handleOpenConfirm(rowId, "Rejected", row.status) },
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

      {/* Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 rounded-2xl max-w-md w-full shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)' }}>
            <div className="flex items-center gap-4 mb-4" style={{ color: 'var(--accent-cyan)' }}>
              <AlertCircle size={32} />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Confirm Action</h3>
            </div>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to{" "}
              <span style={{ color: confirmModal.status === "Approved" ? '#34d399' : '#f87171' }}>
                {confirmModal.status.toLowerCase()}
              </span>{" "}
              this leave request?
            </p>

            {confirmModal.status === "Rejected" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-main)' }}>
                  Rejection Reason <span style={{ color: '#f87171' }}>*</span>
                </label>
                <textarea
                  className="w-full rounded-xl p-3 text-sm outline-none min-h-[100px] resize-none placeholder:text-[var(--text-muted)]"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-main)', color: 'var(--text-main)' }}
                  placeholder="Explain why this request is being rejected..."
                  value={confirmModal.rejectReason}
                  onChange={(e) => setConfirmModal({ ...confirmModal, rejectReason: e.target.value })}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, id: null, status: "", rejectReason: "" })}
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
                style={{ background: confirmModal.status === "Approved" ? '#059669' : '#dc2626' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Confirm {confirmModal.status}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 rounded-2xl max-w-md w-full shadow-2xl text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-main)' }}>
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              <XCircle size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>Action Not Allowed</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {alertModal.message}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setAlertModal({ show: false, message: "" })}
                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors w-full sm:w-auto shadow-md"
                style={{ color: 'var(--text-main)', background: 'var(--input-bg)', border: '1px solid var(--border-main)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--input-bg)'}
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