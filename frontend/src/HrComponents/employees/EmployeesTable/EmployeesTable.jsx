// // import { useDispatch, useSelector } from "react-redux";
// // import { deleteEmployee, fetchAllEmployees, searchEmployeesByName, fetchAllHRs } from "../../../store/HrSlices/employeeSlice";

// // import { useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import axios from "../../../services/axios";

// // import DataTable from "../../../components/table/DataTable";
// // import TableControls from "../../../components/table/TableControls";
// // import Pagination from "../../../components/table/Pagination";
// // import EditIcon from "@mui/icons-material/Edit";
// // import RowActionMenu from "../../../components/UI/RowActionMenu";
// // import BaseCard from "../../../components/UI/Card";
// // import { Eye, Trash2 } from "lucide-react";

// // const AttendanceBadge = ({ status }) => {
// //   const styles = {
// //     "Full-time": "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
// //     "Part-time": 'bg-[#0293FA]/15 text-[#0293FA] border-[#0293FA]/40',
// //     "Contract": "bg-slate-500/20 text-slate-400 border-slate-400/40",
// //     "Internship": 'bg-slate-800 text-[#B0B4B4] border-[#B0B4B4]/20'
// //   };

// //   return (
// //     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] || ""}`}>
// //       <span className="w-1.5 h-1.5 rounded-full bg-current" />
// //       {status}
// //     </span>
// //   );
// // };
// // const getAvatarUrl = (name, background = "0D8ABC", color = "fff") =>
// //   `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`;



// // const EmployeesTable = ({ roleFilter }) => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();


// //   const { employeesList, pagination, loading, searchLoading } = useSelector(
// //     (state) => state.employees
// //   );
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [activeFilter, setActiveFilter] = useState("All");
// //   const [openMenuId, setOpenMenuId] = useState(null);
// //   const [recordsPerPage, setRecordsPerPage] = useState(5);
// //   const [confirmModal, setConfirmModal] = useState({ open: false, userId: null });

// //   // Delete Function
// //   const handleDelete = () => {
// //     const userId = confirmModal.userId;
// //     dispatch(deleteEmployee(userId)).then((result) => {
// //       if (result.meta.requestStatus === "fulfilled") {
// //         setConfirmModal({ open: false, userId: null });
// //         dispatch(fetchAllEmployees({ page: pagination.currentPage, limit: recordsPerPage }));
// //       }
// //     });
// //   };

// //   useEffect(() => {
// //     if (searchQuery.trim() !== "") {
// //       dispatch(searchEmployeesByName(searchQuery));
// //     } else {
// //     const fetchAction =
// //   roleFilter === "HR"
// //     ? fetchAllHRs
// //     : fetchAllEmployees;

// // dispatch(
// //   fetchAction({
// //     page: 1,
// //     limit: recordsPerPage,
// //     jobType: activeFilter !== "All" ? activeFilter : undefined,
// //   })
// // );
// //     }
// //   }, [dispatch, recordsPerPage, searchQuery, activeFilter]);
// //   if (loading && !employeesList) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
// //       </div>
// //     );
// //   }
// //   const columns = [
// //     {
// //       header: "Employee",
// //       accessor: "general.firstName",
// //       render: (row) => {
// //         const fullName = `${row.general?.firstName || ""} ${row.general?.lastName || ""}`;
// //         return (
// //           <div className="flex items-center gap-3">
// //             <img
// //               src={row.general?.avatar?.startsWith('http') ? row.general.avatar : getAvatarUrl(fullName)}
// //               alt={fullName}
// //               className="w-10 h-10 rounded-full object-cover"
// //               style={{ imageRendering: "auto" }}
// //             />
// //             <div>
// //               <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{fullName}</p>
// //               <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{row._id.slice(-6)}</p>
// //             </div>
// //           </div>
// //         );
// //       },
// //     },
// //     {
// //       header: "Email",
// //       accessor: "general.email",
// //       render: (row) => row.general?.email
// //     },
// //     {
// //       header: "Department",
// //       accessor: "employee.department",
// //       render: (row) => row.employee?.department
// //     },
// //     {
// //       header: "Job Title",
// //       accessor: "employee.jobTitle",
// //       render: (row) => row.employee?.jobTitle
// //     },
// //     {
// //       header: "Job Type",
// //       accessor: "employee.jobType",
// //       render: (row) => <AttendanceBadge status={row.employee?.jobType} />,
// //     },
// //     {
// //       header: "Action",
// //       accessor: "action",
// //       render: (row) => (
// //         <div className="relative">
// //           <button
// //             onClick={() => setOpenMenuId(openMenuId === row._id ? null : row._id)}
// //             style={{ color: 'var(--text-muted)' }}
// //             className="p-2 hover:opacity-70 transition-opacity"
// //           >
// //             <EditIcon />
// //           </button>
// //           <RowActionMenu
// //             isOpen={openMenuId === row._id}
// //             onClose={() => setOpenMenuId(null)}
// //             actions={[
// //               {
// //                 label: "See Details",
// //                 icon: Eye,
// //                 onClick: () => navigate(`/employee/${row._id}`),
// //               },
// //               {
// //                 label: "Delete",
// //                 variant: "danger",
// //                 icon: Trash2,
// //                 onClick: () => setConfirmModal({ open: true, userId: row._id }),
// //               },
// //             ]}
// //           />
// //         </div>
// //       ),
// //     },
// //   ];

// // const handlePageChange = (newPage) => {
// //   const fetchAction =
// //     roleFilter === "HR"
// //       ? fetchAllHRs
// //       : fetchAllEmployees;

// //   dispatch(
// //     fetchAction({
// //       page: newPage,
// //       limit: recordsPerPage,
// //       jobType:
// //         activeFilter !== "All"
// //           ? activeFilter
// //           : undefined,
// //     })
// //   );
// // };

// //   // المنطق المحدث للفلترة بالـ Role والـ Job Type معاً دون المساس بالـ UI
// //   const filteredEmployees = (employeesList || []).filter((emp) => {
// //     const matchesRole = roleFilter
// //       ? (emp.role === roleFilter || emp.employee?.role === roleFilter || emp.employee?.department === roleFilter)
// //       : true;

// //     const matchesJobType = activeFilter === "All"
// //       ? true
// //       : emp.employee?.jobType === activeFilter;

// //     return matchesRole && matchesJobType;
// //   });

// //   return (
// //     <BaseCard padding="p-0">
// //       {/* Confirm Delete Modal */}
// //       {confirmModal.open && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
// //           <div
// //             style={{
// //               background: 'linear-gradient(to bottom right, var(--menu-gradient-from), var(--menu-gradient-to))',
// //               borderColor: 'var(--border-main)',
// //             }}
// //             className="border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
// //           >
// //             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
// //               <Trash2 size={22} className="text-pink-400" />
// //             </div>

// //             <h3 className="text-center font-semibold text-lg mb-1" style={{ color: 'var(--text-main)' }}>
// //               Delete Employee
// //             </h3>
// //             <p className="text-center text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
// //               Are you sure you want to delete this employee? This action cannot be undone.
// //             </p>

// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => setConfirmModal({ open: false, userId: null })}
// //                 style={{ background: 'var(--tab-inactive-bg)', color: 'var(--tab-inactive-text)' }}
// //                 className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleDelete}
// //                 className="flex-1 py-2.5 rounded-xl bg-pink-400/12 text-pink-400 hover:bg-pink-400/20 text-sm font-medium transition-all"
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       <div className={loading ? "opacity-50 pointer-events-none" : ""}>
// //         <TableControls
// //           searchTerm={searchQuery}
// //           setSearchTerm={setSearchQuery}
// //           filterValue={activeFilter}
// //           setFilterValue={(filter) => {
// //             setActiveFilter(filter);

// //           }}
// //           filterOptions={["All", "Full-time", "Part-time", "Contract", "Internship"]}
// //           setCurrentPage={() => { }}
// //         />
// //         {searchLoading || loading ? (
// //           <div className="flex items-center justify-center py-20">
// //             <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
// //           </div>
// //         ) : (
// //           <DataTable columns={columns} data={filteredEmployees || []} />
// //         )}

// //       </div>

// //       <Pagination
// //         pagination={pagination}
// //         handlePageChange={handlePageChange}
// //         handleRecordsPerPageChange={(newLimit) => setRecordsPerPage(newLimit)}
// //         currentDataLength={filteredEmployees.length}
// //         entityName="Employees"
// //       />
// //     </BaseCard>
// //   );
// // };
// // export default EmployeesTable;


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

// Badge ملون واحترافي
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

  // دالة جلب البيانات بناءً على الـ Mode
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