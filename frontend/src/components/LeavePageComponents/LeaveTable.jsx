
// import LeaveRow from "./LeaveRow";

// export default function LeaveTable({ leaves }) {
//   return (
//     <div className="bg-[#1f2937] p-6 rounded-xl w-full">
//       <table className="w-full text-white">
//         <thead className="text-gray-300 text-left">
//           <tr>
//             <th className="p-3">Employee</th>
//             <th className="p-3">Leave Type</th>
//             <th className="p-3">From</th>
//             <th className="p-3">To</th>
//             <th className="p-3">Days</th>
//             <th className="p-3">Details</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaves.map((leave) => (
//             <LeaveRow key={leave.id} leave={leave} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import DataTable from "../table/DataTable";
import TableControls from "../table/TableControls";
import Pagination from "../table/Pagination";
import BaseCard from "../UI/Card";
import useTableController from "../../hooks/useTableController";
import { useNavigate } from "react-router-dom";

const LeaveStatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-400/40";
      case "Pending":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-400/40";
      case "Rejected":
        return "bg-red-500/15 text-red-400 border-red-400/40";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-400/40";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

const LeaveTable = ({ leaves }) => {
  const navigate = useNavigate();

  // 🔹 Columns
  const columns = [
    { header: "Employee", accessor: "name" },
    { header: "Leave Type", accessor: "type" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Days", accessor: "days" },

    

    {
      header: "Details",
      render: (row) => (
        <button
          onClick={() => navigate(`/leave-details/${row.id}`)}
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          View
        </button>
      ),
    },

    {
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
            Approve
          </button>
          <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
            Reject
          </button>
        </div>
      ),
    },
  ];

  // 🔹 Controller 
  const {
    currentData,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    recordsPerPage,
    setRecordsPerPage,
    currentPage,
    setCurrentPage,
    totalRecords,
    totalPages,
  } = useTableController({
    data: leaves,
    searchKeys: ["name", "type"],
    filterKey: null,
  });

  // 🔹 Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <BaseCard padding="p-0">

      {/* 🔹 Controls */}
      <TableControls
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        filterValue={activeFilter}
        setFilterValue={setActiveFilter}
        filterOptions={["All", "Pending", "Approved", "Rejected"]}
        setCurrentPage={setCurrentPage}
      />

      {/* 🔹 Table */}
      <DataTable columns={columns} data={currentData} />

      {/* 🔹 Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        recordsPerPage={recordsPerPage}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        totalRecords={totalRecords}
        currentDataLength={currentData.length}
      />

    </BaseCard>
  );
};

export default LeaveTable;