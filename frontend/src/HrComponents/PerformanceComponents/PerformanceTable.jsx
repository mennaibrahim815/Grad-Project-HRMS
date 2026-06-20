

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import ReusableCalendar from "../../components/UI/ReusableCalendar";
import { Eye } from "lucide-react";

const PerformanceBadge = ({ score }) => {
  const getStyle = () => {
    if (score >= 85) return { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)" };
    if (score >= 65) return { background: "rgba(234,179,8,0.15)",  color: "#facc15", border: "1px solid rgba(250,204,21,0.4)" };
    return              { background: "rgba(239,68,68,0.15)",       color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" };
  };

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={getStyle()}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score}%
    </span>
  );
};

const TrendIndicator = ({ value }) => {
  if (value === undefined || value === null) return null;
  const isPositive = value >= 0;
  return (
    <span
      className="inline-flex items-center text-xs font-mono font-bold px-1.5 py-0.5 rounded"
      style={{
        color: isPositive ? "#34d399" : "#f87171",
        background: isPositive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
      }}
    >
      {isPositive ? "▲ +" : "▼ "}{value}%
    </span>
  );
};

const PerformanceTable = ({
  reportData = [],
  startDate, setStartDate,
  endDate, setEndDate,
  searchName, setSearchName,
  pagination, onPageChange, onLimitChange, loading
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  const columns = [
    {
      header: "Employee",
      render: (row) => {
        const fullName = row ? `${row.firstName} ${row.lastName}` : "Unknown User";
        return (
          <div className="flex items-center gap-3">
            <img
              src={row?.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "1px solid var(--border-main)" }}
              alt="avatar"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-main)" }}>{fullName}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{row?.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Job Title",
      render: (row) => <span className="text-sm" style={{ color: "var(--text-main)" }}>{row?.jobTitle || "N/A"}</span>
    },
    {
      header: "Attendance Score",
      render: (row) => (
        <span className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
          {row?.kpis?.attendanceScore ?? 0}%
        </span>
      )
    },
    {
      header: "Task Completion",
      render: (row) => (
        <span className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
          {row?.kpis?.taskScore ?? 0}%
        </span>
      )
    },
    {
      header: "Overall Performance",
      render: (row) => (
        <div className="flex items-center gap-2">
          <PerformanceBadge score={row?.overallPerformance ?? 0} />
          <TrendIndicator value={row?.percentageChange} />
        </div>
      )
    },
    {
      header: "Action",
      render: (row) => {
        const rowId = row?.employeeId;
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
                {
                  label: "View Performance Details",
                  icon: Eye,
                  onClick: () => { setOpenMenuId(null); navigate(`/performance-details/${rowId}`); }
                }
              ]}
            />
          </div>
        );
      }
    }
  ];

  return (
    <BaseCard padding="p-0">
      <div
        className="p-4 flex flex-wrap items-center justify-between gap-4"
        style={{ borderBottom: "1px solid var(--border-main)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Start Date</label>
            <ReusableCalendar
              mode="single"
              value={startDate}
              align="left"
              onSave={(dateStr) => { setStartDate(dateStr); onPageChange(1); }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>End Date</label>
            <ReusableCalendar
              mode="single"
              value={endDate}
              align="left"
              onSave={(dateStr) => { setEndDate(dateStr); onPageChange(1); }}
            />
          </div>
        </div>

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
    </BaseCard>
  );
};

export default PerformanceTable;