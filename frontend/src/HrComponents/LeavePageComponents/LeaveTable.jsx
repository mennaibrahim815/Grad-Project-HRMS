
// import DataTable from "../table/DataTable";
// import TableControls from "../table/TableControls";
// import Pagination from "../table/Pagination";
// import BaseCard from "../UI/Card";
// import useTableController from "../../hooks/useTableController";
// import { useNavigate } from "react-router-dom";

// const LeaveStatusBadge = ({ status }) => {
//   const getStyles = () => {
//     switch (status) {
//       case "Approved":
//         return "bg-emerald-500/15 text-emerald-400 border-emerald-400/40";
//       case "Pending":
//         return "bg-yellow-500/15 text-yellow-400 border-yellow-400/40";
//       case "Rejected":
//         return "bg-red-500/15 text-red-400 border-red-400/40";
//       default:
//         return "bg-slate-500/20 text-slate-400 border-slate-400/40";
//     }
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}
//     >
//       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//       {status}
//     </span>
//   );
// };

// const LeaveTable = ({ leaves }) => {
//   const navigate = useNavigate();

//   // 🔹 Columns
//   const columns = [
//     { header: "Employee", accessor: "name" },
//     { header: "Leave Type", accessor: "type" },
//     { header: "From", accessor: "from" },
//     { header: "To", accessor: "to" },
//     { header: "Days", accessor: "days" },

    

//     {
//       header: "Details",
//       render: (row) => (
//         <button
//           onClick={() => navigate(`/leave-details/${row.id}`)}
//           className="text-cyan-400 hover:text-cyan-300 underline"
//         >
//           View
//         </button>
//       ),
//     },

//     {
//       header: "Actions",
//       render: () => (
//         <div className="flex gap-2">
//           <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
//             Approve
//           </button>
//           <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
//             Reject
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // 🔹 Controller 
//   const {
//     currentData,
//     searchQuery,
//     setSearchQuery,
//     activeFilter,
//     setActiveFilter,
//     recordsPerPage,
//     setRecordsPerPage,
//     currentPage,
//     setCurrentPage,
//     totalRecords,
//     totalPages,
//   } = useTableController({
//     data: leaves,
//     searchKeys: ["name", "type"],
//     filterKey: null,
//   });

//   // 🔹 Handlers
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleRecordsPerPageChange = (value) => {
//     setRecordsPerPage(value);
//     setCurrentPage(1);
//   };

//   return (
//     <BaseCard padding="p-0">

//       {/* 🔹 Controls */}
//       <TableControls
//         searchTerm={searchQuery}
//         setSearchTerm={setSearchQuery}
//         filterValue={activeFilter}
//         setFilterValue={setActiveFilter}
//         filterOptions={["All", "Pending", "Approved", "Rejected"]}
//         setCurrentPage={setCurrentPage}
//       />

//       {/* 🔹 Table */}
//       <DataTable columns={columns} data={currentData} />

//       {/* 🔹 Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         handlePageChange={handlePageChange}
//         recordsPerPage={recordsPerPage}
//         handleRecordsPerPageChange={handleRecordsPerPageChange}
//         totalRecords={totalRecords}
//         currentDataLength={currentData.length}
//       />

//     </BaseCard>
//   );
// };

// export default LeaveTable;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import useTableController from "../../hooks/useTableController"; // تأكدي من المسار هنا
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";


const LeaveStatusBadge = ({ status }) => {
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

const LeaveTable = ({ leaves, onStatusUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  const columns = [
    {
      header: "Employee",
      render: (row) => {
        const emp = row.employee || row.user || {};
        const fullName = emp.firstName ? `${emp.firstName} ${emp.lastName}` : (emp.name || "Unknown User");
        return (
          <div className="flex items-center gap-3">
            <img 
              src={emp.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
              className="w-10 h-10 rounded-full border border-slate-700"
            />
            <div>
              <p className="text-sm font-medium text-slate-100">{fullName}</p>
              <p className="text-xs text-slate-500">{emp.jobTitle || "Staff"}</p>
            </div>
          </div>
        );
      }
    },
    { header: "Type", render: (row) => row.type || "Annual" },
    { 
      header: "Duration", 
      render: (row) => (
        <span className="text-xs text-slate-300">
          {row.duration || 0} Days ({row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"})
        </span>
      )
    },
    { header: "Status", render: (row) => <LeaveStatusBadge status={row.status} /> },
    {
      header: "Action",
      render: (row) => {
        const rowId = row._id || row.id;
        return (
          <div className="relative">
            <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
              <EditIcon />
            </button>
            <RowActionMenu
              isOpen={openMenuId === rowId}
              onClose={() => setOpenMenuId(null)}
              actions={[
                { label: "See Details", icon: Eye, onClick: () => navigate(`/leave-details/${rowId}`) },
                { label: "Approve", icon: CheckCircle, onClick: () => onStatusUpdate(rowId, "Approved") },
                { label: "Reject", icon: XCircle, variant: "danger", onClick: () => onStatusUpdate(rowId, "Rejected") },
                { label: "Delete", variant: "danger", icon: Trash2, onClick: () => onDelete(rowId) },
              ]}
            />
          </div>
        );
      }
    }
  ];

  const controller = useTableController({
    data: leaves,
    searchKeys: ["type", "status"],
    filterKey: "status",
  });

  return (
    <BaseCard padding="p-0">
      <TableControls
        searchTerm={controller.searchQuery} setSearchTerm={controller.setSearchQuery}
        filterValue={controller.activeFilter} setFilterValue={controller.setActiveFilter}
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        setCurrentPage={controller.setCurrentPage}
      />
      <DataTable columns={columns} data={controller.currentData} />
      <Pagination
        currentPage={controller.currentPage} totalPages={controller.totalPages}
        handlePageChange={controller.setCurrentPage}
        recordsPerPage={controller.recordsPerPage}
        handleRecordsPerPageChange={controller.setRecordsPerPage}
        totalRecords={controller.totalRecords}
        currentDataLength={controller.currentData.length}
      />
    </BaseCard>
  );
};

export default LeaveTable;
// import React from "react";
// import DataTable from "@/components/table/DataTable.jsx";
// import Pagination from "@/components/table/Pagination.jsx";
// import BaseCard from "@/components/UI/Card.jsx";
// import { useNavigate } from "react-router-dom";
// import { MoreVertical, Eye, Trash2 } from "lucide-react"; // لو بتستخدمي lucide-react للـ icons

// // مكون الحالة (Status) بنفس شكل الـ Pill اللي في الصورة
// const LeaveStatusBadge = ({ status }) => {
//   const styles = {
//     Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
//     Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
//     Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
//   };
//   return (
//     <div className="flex items-center gap-2">
//       <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || ""}`}>
//         <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//         {status}
//       </span>
//     </div>
//   );
// };

// const LeaveTable = ({ leaves, onStatusUpdate, onDelete, onPageChange, currentPage, totalPages }) => {
//   const navigate = useNavigate();
//   const safeLeaves = Array.isArray(leaves) ? leaves : [];

//   const columns = [
//     {
//       header: "Employee",
//       render: (row) => (
//         <div className="flex items-center gap-3 py-2">
//           {/* لو مفيش صورة بنعرض أول حرف من الاسم بشكل شيك */}
//           {row?.employee?.avatar ? (
//             <img src={row.employee.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-700" alt="avatar" />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold uppercase">
//               {row?.employee?.firstName?.charAt(0) || "U"}
//             </div>
//           )}
//           <div className="flex flex-col">
//             <span className="text-sm font-semibold text-slate-200">
//               {row?.employee ? `${row.employee.firstName} ${row.employee.lastName}` : "Unknown"}
//             </span>
//             <span className="text-xs text-slate-500">{row?.employee?.email}</span>
//           </div>
//         </div>
//       ),
//     },
//     { 
//       header: "Department", 
//       render: (row) => <span className="text-sm text-slate-300">{row?.employee?.department || "N/A"}</span> 
//     },
//     { 
//       header: "Type", 
//       render: (row) => <span className="text-sm text-slate-300 font-medium">{row?.type}</span> 
//     },
//     { 
//       header: "Status", 
//       render: (row) => <LeaveStatusBadge status={row?.status} /> 
//     },
//     {
//       header: "Action",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//            {/* زرار الـ Action بنفس ستايل الصورة التانية */}
//            <div className="group relative">
//               <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700">
//                 <MoreVertical size={16} className="text-slate-400" />
//               </button>
              
//               {/* Dropdown Menu بسيط (يظهر عند الـ hover أو بالضغط) */}
//               <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-36 bg-[#1a1f2e] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
//                 <button 
//                   onClick={() => navigate(`/leave-details/${row._id}`)}
//                   className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
//                 >
//                   <Eye size={14} /> See Details
//                 </button>
//                 <button 
//                   onClick={() => onDelete(row._id)}
//                   className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-slate-800 transition-colors"
//                 >
//                   <Trash2 size={14} /> Delete
//                 </button>
//               </div>
//            </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-[#0f172a]/50 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-sm shadow-lg">
//       <DataTable 
//         columns={columns} 
//         data={safeLeaves} 
//         className="text-left"
//       />
      
//       {/* الـ Footer بتاع الجدول اللي فيه Pagination */}
//       <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/30">
//         <span className="text-xs text-slate-500 uppercase tracking-wider">
//            Showing: {safeLeaves.length} of {totalPages * 5} Leaves
//         </span>
//         <Pagination 
//           currentPage={currentPage} 
//           totalPages={totalPages} 
//           handlePageChange={onPageChange} 
//         />
//       </div>
//     </div>
//   );
// };

// export default LeaveTable;