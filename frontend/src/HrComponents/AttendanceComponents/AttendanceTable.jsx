import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendance,
  fetchAttendanceSearch,
  addNewAttendanceRecord,
} from "../../store/HrSlices/attendance/attendanceSlice";
import { deleteEmployee } from "../../store/HrSlices/employeeSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import DataTable from "../../components/table/DataTable";
import TableControls from "../../components/table/TableControls";
import Pagination from "../../components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../components/UI/RowActionMenu";
import BaseCard from "../../components/UI/Card";
import { Eye, Trash2 } from "lucide-react";
import ReusableCalendar from "../../components/UI/ReusableCalendar";

const getAvatarUrl = (name, background = "0D8ABC", color = "fff") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`;

const AttendanceBadge = ({ status }) => {
  const styles = {
    "On Time": "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    Late: 'bg-[#0293FA]/15 text-[#0293FA] border-[#0293FA]/40',
    Absent: "bg-slate-500/20 text-slate-400 border-slate-400/40",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status] || ""}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const AttendanceTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attendanceList, pagination, loading } = useSelector(
    (state) => state.attendance,
  );

  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [tableDate, setTableDate] = useState("");

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    dispatch(deleteEmployee(userId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        alert("Employee deleted successfully!");
        if (searchQuery.trim()) {
          dispatch(
            fetchAttendanceSearch({
              employeeName: searchQuery,
              date: tableDate,
              page: pagination.currentPage,
              limit: recordsPerPage,
            }),
          );
        } else {
          dispatch(
            fetchAttendance({
              date: tableDate,
              page: pagination.currentPage,
              limit: recordsPerPage,
              status: activeFilter,
            }),
          );
        }
      }
    });
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(
        fetchAttendanceSearch({
          employeeName: searchQuery,
          date: tableDate,
          page: 1,
          limit: recordsPerPage,
        }),
      );
    } else {
      dispatch(
        fetchAttendance({
          date: tableDate,
          page: 1,
          limit: recordsPerPage,
          status: activeFilter,
        }),
      );
    }
  }, [dispatch, tableDate, recordsPerPage, activeFilter, searchQuery]);

  useEffect(() => {
    const socket = io("https://grad-project-hrms-production.up.railway.app", {
      withCredentials: true,
    });

    const handleNewCheckin = (newRecord) => {
      console.log("السيرفر بعت بصمة جديدة:", newRecord);

      const isMatchingStatus =
        activeFilter === "All" || activeFilter === newRecord.status;
      const isFirstPage = pagination.currentPage === 1;

      if (isMatchingStatus && isFirstPage) {
        dispatch(addNewAttendanceRecord(newRecord));
      } else {
        console.log(
          `موظف بصم: ${newRecord.employee?.firstName} وحالته ${newRecord.status}`,
        );
      }
    };

    socket.on("new_checkin", handleNewCheckin);

    return () => {
      socket.off("new_checkin", handleNewCheckin);
      socket.disconnect();
    };
  }, [dispatch, activeFilter, pagination.currentPage]);

  const columns = [
    {
      header: "Employee",
      accessor: "firstName",
      render: (row) => {
        const fullName = `${row.employee?.firstName || ""} ${row.employee?.lastName || ""}`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.employee?.avatar || getAvatarUrl(fullName)}
              alt={fullName}
              className="w-10 h-10 rounded-full"
              style={{ imageRendering: "auto" }}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{fullName}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.employeeId}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Department",
      accessor: "department",
      render: (row) => row.employee?.department,
    },
    {
      header: "Type",
      accessor: "jobType",
      render: (row) => row.employee?.jobType,
    },

    { header: "Date", accessor: "date" },
    {
      header: "Check In",
      accessor: "checkIn",
      render: (row) => {
        if (!row.checkIn) return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>;
        return (
          <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
            {new Date(row.checkIn).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <AttendanceBadge status={row.status} />,
    },

  ];

  const handlePageChange = (newPage) => {
    dispatch(
      fetchAttendance({
        date: tableDate,
        page: newPage,
        limit: recordsPerPage,
        status: activeFilter,
      }),
    );
  };

  const handleRecordsPerPageChange = (newLimit) => {
    setRecordsPerPage(newLimit);
  };

  return (
    <BaseCard padding="p-0">

      <TableControls
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        filterValue={activeFilter}
        setFilterValue={setActiveFilter}
        filterOptions={["All", "On Time", "Late", "Absent"]}
        setCurrentPage={() => { }}
        extraRight={
          <div className="flex items-center gap-2">
            <ReusableCalendar
              mode="single"
              value={tableDate}
              onSave={(date) => setTableDate(date)}
            />
            {tableDate && (
              <button
                onClick={() => setTableDate("")}
                style={{ color: 'var(--text-muted)' }}
                className="text-xs hover:opacity-70 transition-colors"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        }
      />
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
      ) : (
        <DataTable columns={columns} data={attendanceList} />
      )}
      <Pagination
        pagination={pagination}
        handlePageChange={handlePageChange}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        currentDataLength={attendanceList.length}
      />
    </BaseCard>
  );
};

export default AttendanceTable;