import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSelectedMonth } from "../../../../store/HrSlices/attendance/attendanceSlice";
// import { fetchEmployeeById } from "../../../store/HrSlices/employeeSlice";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../table/DataTable";
import Pagination from "../../../table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import useTableController from "../../../../hooks/useTableController";
import RowActionMenu from "../../../UI/RowActionMenu";
import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import BaseCard from "../../../UI/Card";
import ReusableCalendar from "../../../UI/ReusableCalendar";

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

const AttendanceHistoryCard = ({ records }) => {
  const dispatch = useDispatch();
  const { selectedMonth } = useSelector((state) => state.attendance);

  const handleMonthSave = (newMonthValue) => {
    // 1. تحديث الـ state في Redux (هتتخزن كـ "2025-03")
    dispatch(setSelectedMonth(newMonthValue));
  };
  // const navigate = useNavigate();

  // const handleDetails = (id) => {
  //   dispatch(fetchEmployeeById(id));
  //   navigate(`/employee/${id}`);
  // };

  const [openMenuId, setOpenMenuId] = useState(null);
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Start work", accessor: "department" },
    { header: "End work", accessor: "date" },

    {
      header: "Status",
      accessor: "attendance",
      render: (row) => <AttendanceBadge status={row.attendance} />,
    },
    { header: "Overtime", accessor: "type" },

    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            className="p-2 text-slate-400 hover:text-slate-200"
          >
            <EditIcon />
          </button>

          <RowActionMenu
            isOpen={openMenuId === row.id}
            onClose={() => setOpenMenuId(null)}
            actions={[
              {
                label: "See Details",
                icon: Eye,
                onClick: () => console.log("See Details", row.id),
              },
              {
                label: "Delete",
                variant: "danger",
                icon: Trash2,
                onClick: () => console.log("Delete", row.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  const {
    currentData,
    recordsPerPage,
    setRecordsPerPage,
    currentPage,
    setCurrentPage,
    totalRecords,
    totalPages,
  } = useTableController({
    data: records,
    searchKeys: [],
    filterKey: null,
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
    <BaseCard padding="p-0" className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-700/50">
        <h3 className="text-white font-semibold text-lg">Attendant history</h3>
        <ReusableCalendar
          mode="month"
          value={selectedMonth}
          onSave={handleMonthSave}
        />
      </div>
      {/* Table */}
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

export default AttendanceHistoryCard;
