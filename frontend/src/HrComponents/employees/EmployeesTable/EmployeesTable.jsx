import { useDispatch, useSelector } from "react-redux";
import { 
  deleteEmployee, 
  fetchAllEmployees, 
  searchEmployeesByName, 
  fetchHRs 
} from "../../../store/HrSlices/employeeSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import DataTable from "../../../components/table/DataTable";
import TableControls from "../../../components/table/TableControls";
import Pagination from "../../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../../components/UI/RowActionMenu";
import BaseCard from "../../../components/UI/Card";
import { Eye, Trash2, UserCheck, ShieldAlert } from "lucide-react";

const AttendanceBadge = ({ status }) => {
  const styles = {
    "Full-time": "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    "Part-time": 'bg-[#0293FA]/15 text-[#0293FA] border-[#0293FA]/40',
    "Contract": "bg-slate-500/20 text-slate-400 border-slate-400/40",
    "Internship": 'bg-amber-500/15 text-amber-400 border-amber-400/30'
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-sm ${styles[status] || ""}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&bold=true&rounded=true`;

const EmployeesTable = ({ mode = "employees" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employeesList, pagination, loading, searchLoading } = useSelector((state) => state.employees);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });

  const loadData = useCallback((page) => {
    const params = {
      page,
      limit: recordsPerPage,
      jobType: activeFilter !== "All" ? activeFilter : undefined
    };

    if (mode === "hrs") {
      dispatch(fetchHRs(params));
    } else {
      dispatch(fetchAllEmployees(params));
    }
  }, [dispatch, mode, recordsPerPage, activeFilter]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      dispatch(searchEmployeesByName(searchQuery));
    } else {
      loadData(1);
    }
  }, [loadData, searchQuery]);

  const handleDelete = () => {
    dispatch(deleteEmployee(confirmModal.userId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setConfirmModal({ open: false, userId: null });
        loadData(pagination.currentPage);
      }
    });
  };

  const columns = [
    {
      header: "Employee / Staff",
      render: (row) => {
        const fullName = `${row.general?.firstName || ""} ${row.general?.lastName || ""}`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.general?.avatar?.startsWith('http') ? row.general.avatar : getAvatarUrl(fullName)}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: 'var(--border-main)' }}
            />
            <div>
              <p className="text-sm font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{fullName}</p>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>#{row._id.slice(-6)}</p>
            </div>
          </div>
        );
      },
    },
    { header: "Email Address", render: (row) => <span className="text-xs font-bold opacity-80">{row.general?.email}</span> },
    { header: "Department", render: (row) => <span className="text-[10px] font-black uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>{row.employee?.department}</span> },
    { header: "Designation", render: (row) => <span className="text-xs font-bold text-blue-500">{row.employee?.jobTitle}</span> },
    {
      header: "Employment",
      render: (row) => <AttendanceBadge status={row.employee?.jobType} />,
    },
    {
      header: "Action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === row._id ? null : row._id)}
            style={{ color: 'var(--text-muted)' }}
            className="p-2 hover:text-blue-500 transition-all active:scale-90"
          >
            <EditIcon fontSize="small" />
          </button>
          <RowActionMenu
            isOpen={openMenuId === row._id}
            onClose={() => setOpenMenuId(null)}
            actions={[
              { label: "View Profile", icon: Eye, onClick: () => navigate(`/employee/${row._id}`) },
              { label: "Terminate", variant: "danger", icon: Trash2, onClick: () => setConfirmModal({ open: true, userId: row._id }) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <BaseCard padding="p-0" style={{ background: 'linear-gradient(to bottom right, var(--card-from) 0%, var(--card-to) 100%)', borderColor: 'var(--card-border)' }} className="rounded-[2.5rem] border shadow-2xl overflow-hidden transition-all duration-500">
      
      {/* Luxury Delete Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} className="border rounded-[2.5rem] p-10 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
               <ShieldAlert size={40} className="text-red-500 animate-pulse" />
            </div>
            <h3 style={{ color: 'var(--text-main)' }} className="font-black text-2xl mb-2">Wait!</h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm font-medium mb-10 opacity-70">Are you sure you want to delete this {mode === 'hrs' ? 'HR' : 'employee'}? This cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmModal({ open: false })} style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-main)' }} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 active:scale-95 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className={loading ? "opacity-30 pointer-events-none grayscale" : ""}>
        <TableControls
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          filterValue={activeFilter}
          setFilterValue={setActiveFilter}
          filterOptions={["All", "Full-time", "Part-time", "Contract", "Internship"]}
          setCurrentPage={() => { }}
        />
        
        {loading || searchLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-800 rounded-full animate-spin"></div>
            <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Database...</span>
          </div>
        ) : (
          <DataTable columns={columns} data={employeesList || []} />
        )}
      </div>

      <Pagination
        pagination={pagination}
        handlePageChange={(newPage) => loadData(newPage)}
        handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
        currentDataLength={employeesList.length}
        entityName={mode === "hrs" ? "HR Records" : "Employee Records"}
      />
    </BaseCard>
  );
};
export default EmployeesTable;