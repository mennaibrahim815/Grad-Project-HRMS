
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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DataTable from "../../components/table/DataTable";
// import TableControls from "../../components/table/TableControls";
// import Pagination from "../../components/table/Pagination";
// import EditIcon from "@mui/icons-material/Edit";
// import useTableController from "../../hooks/useTableController"; // تأكدي من المسار هنا
// import RowActionMenu from "../../components/UI/RowActionMenu";
// import BaseCard from "../../components/UI/Card";
// import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react";


// const LeaveStatusBadge = ({ status }) => {
//   const styles = {
//     Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
//     Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-400/40",
//     Rejected: "bg-red-500/15 text-red-400 border-red-400/40",
//   };
//   return (
//     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-500/20 text-slate-400 border-slate-400/40"}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//       {status || "Pending"}
//     </span>
//   );
// };

// const LeaveTable = ({ leaves, onStatusUpdate, onDelete }) => {
//   const navigate = useNavigate();
//   const [openMenuId, setOpenMenuId] = useState(null);

//   const columns = [
//     {
//       header: "Employee",
//       render: (row) => {
//         const emp = row.employee || row.user || {};
//         const fullName = emp.firstName ? `${emp.firstName} ${emp.lastName}` : (emp.name || "Unknown User");
//         return (
//           <div className="flex items-center gap-3">
//             <img 
//               src={emp.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=0D8ABC&color=fff`}
//               className="w-10 h-10 rounded-full border border-slate-700"
//             />
//             <div>
//               <p className="text-sm font-medium text-slate-100">{fullName}</p>
//               <p className="text-xs text-slate-500">{emp.jobTitle || "Staff"}</p>
//             </div>
//           </div>
//         );
//       }
//     },
//     { header: "Type", render: (row) => row.type || "Annual" },
//     { 
//       header: "Duration", 
//       render: (row) => (
//         <span className="text-xs text-slate-300">
//           {row.duration || 0} Days ({row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"})
//         </span>
//       )
//     },
//     { header: "Status", render: (row) => <LeaveStatusBadge status={row.status} /> },
//     {
//       header: "Action",
//       render: (row) => {
//         const rowId = row._id || row.id;
//         return (
//           <div className="relative">
//             <button onClick={() => setOpenMenuId(openMenuId === rowId ? null : rowId)} className="p-2 text-slate-400 hover:text-slate-200">
//               <EditIcon />
//             </button>
//             <RowActionMenu
//               isOpen={openMenuId === rowId}
//               onClose={() => setOpenMenuId(null)}
//               actions={[
//                 { label: "See Details", icon: Eye, onClick: () => navigate(`/leave-details/${rowId}`) },
//                 { label: "Approve", icon: CheckCircle, onClick: () => onStatusUpdate(rowId, "Approved") },
//                 { label: "Reject", icon: XCircle, variant: "danger", onClick: () => onStatusUpdate(rowId, "Rejected") },
//                 { label: "Delete", variant: "danger", icon: Trash2, onClick: () => onDelete(rowId) },
//               ]}
//             />
//           </div>
//         );
//       }
//     }
//   ];

//   const controller = useTableController({
//     data: leaves,
//     searchKeys: ["type", "status"],
//     filterKey: "status",
//   });

//   return (
//     <BaseCard padding="p-0">
//       <TableControls
//         searchTerm={controller.searchQuery} setSearchTerm={controller.setSearchQuery}
//         filterValue={controller.activeFilter} setFilterValue={controller.setActiveFilter}
//         filterOptions={["All", "Pending", "Approved", "Rejected"]}
//         setCurrentPage={controller.setCurrentPage}
//       />
//       <DataTable columns={columns} data={controller.currentData} />
//       <Pagination
//         currentPage={controller.currentPage} totalPages={controller.totalPages}
//         handlePageChange={controller.setCurrentPage}
//         recordsPerPage={controller.recordsPerPage}
//         handleRecordsPerPageChange={controller.setRecordsPerPage}
//         totalRecords={controller.totalRecords}
//         currentDataLength={controller.currentData.length}
//       />
//     </BaseCard>
//   );
// };

// export default LeaveTable;

import React from "react";
import DataTable from "@/components/table/DataTable";
import TableControls from "@/components/table/TableControls";
import Pagination from "@/components/table/Pagination";
import BaseCard from "@/components/UI/Card";
import { useNavigate } from "react-router-dom";

// ===== STATUS BADGE =====
const LeaveStatusBadge = ({ status }) => {
  const styles = {
    Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-400/40",
    Rejected: "bg-red-500/15 text-red-400 border-red-400/40",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        styles[status] || ""
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

const LeaveTable = ({
  leaves = [],

  onStatusUpdate,
  onDelete,

  onSearch,
  onFilter,

  onPageChange,
  currentPage = 1,
  totalPages = 1,
}) => {
  const navigate = useNavigate();

  // ✔️ safety check (prevents map crash)
  const safeLeaves = Array.isArray(leaves) ? leaves : [];

  const columns = [
    // ===== Employee =====
    {
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row?.employee?.avatar || "/default-avatar.png"}
            className="w-8 h-8 rounded-full object-cover"
            alt="employee"
          />
          <span className="text-sm font-medium">
            {row?.employee
              ? `${row.employee.firstName} ${row.employee.lastName}`
              : "Unknown"}
          </span>
        </div>
      ),
    },

    // ===== Type =====
    {
      header: "Type",
      accessor: "type",
    },

    // ===== Duration =====
    {
      header: "Duration",
      render: (row) =>
        row?.startDate ? (
          <span className="text-xs text-gray-400">
            {new Date(row.startDate).toLocaleDateString("en-GB")} (
            {row?.duration || 0} Days)
          </span>
        ) : (
          "-"
        ),
    },

    // ===== Status =====
    {
      header: "Status",
      render: (row) => <LeaveStatusBadge status={row?.status} />,
    },

    // ===== Actions =====
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 items-center">

          {row?.status === "Pending" ? (
            <>
              <button
                onClick={() => onStatusUpdate?.(row._id, "Approved")}
                className="text-emerald-400"
              >
                ✅
              </button>

              <button
                onClick={() => onStatusUpdate?.(row._id, "Rejected")}
                className="text-red-400"
              >
                ❌
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete?.(row._id)}
              className="text-gray-400"
            >
              🗑️
            </button>
          )}

          <button
            onClick={() =>
              row?._id && navigate(`/leave-details/${row._id}`)
            }
            className="text-cyan-400 text-xs underline"
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <BaseCard padding="p-0">

      {/* ===== CONTROLS ===== */}
      <TableControls
        onSearch={onSearch}
        onFilter={onFilter}
      />

      {/* ===== TABLE ===== */}
      <DataTable columns={columns} data={safeLeaves} />

      {/* ===== PAGINATION ===== */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={onPageChange}
      />

    </BaseCard>
  );
};

export default LeaveTable;