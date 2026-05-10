import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAttendanceByEmployee, setSelectedMonth } from "../../../../store/HrSlices/attendance/attendanceSlice";
import DataTable from "../../../../Components/table/DataTable";
import Pagination from "../../../../Components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../../../Components/UI/RowActionMenu";
import BaseCard from "../../../../Components/UI/Card";
import ReusableCalendar from "../../../../Components/UI/ReusableCalendar";
import { Eye, Trash2 } from "lucide-react";
console.log("fetchAttendanceByEmployee:", fetchAttendanceByEmployee); // ← مش undefined؟
const AttendanceBadge = ({ status }) => {
  const styles = {
    "On Time": "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    Late: "bg-sky-500/15 text-sky-400 border-sky-400/40",
    Absent: "bg-slate-500/20 text-slate-400 border-slate-400/40",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] || ""}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const AttendanceHistoryCard = ({ employeeId }) => { 
  
  const dispatch = useDispatch();
  const { attendanceList, pagination, selectedMonth, loading } = useSelector(
    (state) => state.attendance
  );

  const [openMenuId, setOpenMenuId] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const getMonthYear = () => {
    if (!selectedMonth) return {};
    const [year, month] = selectedMonth.split("-");
    return { month: parseInt(month), year: parseInt(year) };
  };
  const safePagination = pagination ?? {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
};

  useEffect(() => {
   
    if (!employeeId) return;
    const { month, year } = getMonthYear();
     

    dispatch(fetchAttendanceByEmployee({
      employeeId,
      page: 1,
      limit: recordsPerPage,
      month,
      year,
    }));
  }, [dispatch, employeeId, selectedMonth, recordsPerPage]);

  const handleMonthSave = (newMonthValue) => {
    dispatch(setSelectedMonth(newMonthValue));
  };

  const handlePageChange = (newPage) => {
    const { month, year } = getMonthYear();
    dispatch(fetchAttendanceByEmployee({
      employeeId,
      page: newPage,
      limit: recordsPerPage,
      month,
      year,
    }));
  };

  const handleRecordsPerPageChange = (newLimit) => {
    setRecordsPerPage(newLimit); // useEffect هيحس بالتغيير
  };

  const columns = [
    { header: "Date", accessor: "date" },
    { 
      header: "Check In", 
      accessor: "checkIn",
      render: (row) => row.checkIn 
        ? new Date(row.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
        : "—"
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <AttendanceBadge status={row.status} />,
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === row._id ? null : row._id)}
            className="p-2 text-slate-400 hover:text-slate-200"
          >
            <EditIcon />
          </button>
          <RowActionMenu
            isOpen={openMenuId === row._id}
            onClose={() => setOpenMenuId(null)}
            actions={[
              {
                label: "See Details",
                icon: Eye,
                onClick: () => console.log("See Details", row._id),
              },
              {
                label: "Delete",
                variant: "danger",
                icon: Trash2,
                onClick: () => console.log("Delete", row._id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <BaseCard padding="p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-700/50">
        <h3 className="text-white font-semibold text-lg">Attendant history</h3>
        <ReusableCalendar
          mode="month"
          value={selectedMonth}
          onSave={handleMonthSave}
        />
      </div>

      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <DataTable columns={columns} data={attendanceList} />
      </div>

      <Pagination
        pagination={safePagination}
        handlePageChange={handlePageChange}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        currentDataLength={attendanceList.length}
      />
    </BaseCard>
  );
};

export default AttendanceHistoryCard;
