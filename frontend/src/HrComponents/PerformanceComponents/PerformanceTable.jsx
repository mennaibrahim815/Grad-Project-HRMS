
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
  startDate,          
  setStartDate,       
  endDate,            
  setEndDate,         
  searchName,       
  setSearchName,    
  pagination, 
  onPageChange,
  onLimitChange,
  loading 
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

        return (
          <div className="relative">
            <button 
              onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} 
              className="p-2 text-slate-400 hover:text-slate-200"
            >
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { 
                  label: "View Performance Details", 
                  icon: Eye, 
                  onClick: () => {
                    setOpenMenuId(null);
                    navigate(`/performance-details/${rowId}`);
                  }
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
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Start Date</label>
            <ReusableCalendar
              mode="single"
              value={startDate}
              align="left"
              onSave={(dateStr) => {
                setStartDate(dateStr);
                onPageChange(1);
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
                onPageChange(1);
              }}
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