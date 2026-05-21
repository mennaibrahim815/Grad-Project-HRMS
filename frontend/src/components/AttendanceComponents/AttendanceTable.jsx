// import DataTable from "../table/DataTable";
// import TableControls from "../table/TableControls";
// import Pagination from "../table/Pagination";
// import BaseCard from "../UI/Card";
// import useTableController from "../../hooks/useTableController";
// استخدم الـ @ عشان تبدأ دائماً من مجلد الـ src
import DataTable from "@/Components/table/DataTable";
import TableControls from "@/Components/table/TableControls";
import Pagination from "@/Components/table/Pagination";
import BaseCard from "@/Components/UI/Card"; // افترضنا إنها جوه src/Components
import useTableController from "@/hooks/useTableController"; // افترضنا إنها جوه src/hooks
// ... باقي الـ Imports
import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

// Generate avatar URL using UI Avatars
const getAvatarUrl = (name, background = "0D8ABC", color = "fff") => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`;
};

const AttendanceBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "On-time":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-400/40";

      case "Late":
        return "bg-sky-500/15 text-sky-400 border-sky-400/40";

      case "Absent":
        return "bg-slate-500/20 text-slate-400 border-slate-400/40";

      case "Part-time":
        return "bg-slate-500/20 text-slate-400 border-slate-400/40";
    }
  };
  return (
    <span
      className={`
    inline-flex items-center gap-2
    px-3 py-1
    rounded-full
    text-xs font-medium
    border
    backdrop-blur-sm" ${getStatusStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

const AttendanceTable = ({ attendanceList }) => {
  const columns = [
    {
      header: "Employee",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || getAvatarUrl(row.name)}
            alt={row.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-slate-100">{row.name}</p>
            <p className="text-xs text-slate-500">{row.id}</p>
          </div>
        </div>
      ),
    },

    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
    { header: "Date", accessor: "date" },
    { header: "Type", accessor: "type" },

    {
      header: "Attendance",
      accessor: "attendance",
      render: (row) => <AttendanceBadge status={row.attendance} />,
    },
  ];

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
    data: attendanceList,
    searchKeys: ["name", "email", "department", "type"],
    filterKey: "attendance",
  });
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
      <TableControls
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        filterValue={activeFilter}
        setFilterValue={setActiveFilter}
        filterOptions={["All", "On-time", "Late", "Absent"]}
        setCurrentPage={setCurrentPage}
      />

      <DataTable columns={columns} data={currentData} />
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

export default AttendanceTable;
