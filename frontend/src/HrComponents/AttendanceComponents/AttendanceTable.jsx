import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance,fetchAttendanceSearch } from "../../store/HrSlices/attendance/attendanceSlice";
import { deleteEmployee } from "../../store/HrSlices/employeeSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axios";

import DataTable from "../../Components/table/DataTable";
import TableControls from "../../Components/table/TableControls";
import Pagination from "../../Components/table/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import RowActionMenu from "../../Components/UI/RowActionMenu";
import BaseCard from "../../Components/UI/Card";
import { Eye, Trash2 } from "lucide-react";

const getAvatarUrl = (name, background = "0D8ABC", color = "fff") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}&size=80&bold=true&rounded=true`;

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

const AttendanceTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attendanceList, pagination, selectedDate, loading } = useSelector(
    (state) => state.attendance
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
        dispatch(fetchAttendanceSearch({
          employeeName: searchQuery,
          date: tableDate,
          page: pagination.currentPage,
          limit: recordsPerPage,
        }));
      } else {
        dispatch(fetchAttendance({
          date: tableDate,
          page: pagination.currentPage,
          limit: recordsPerPage,
          status: activeFilter,
        }));
      }
    }
  });
};
  useEffect(() => {
  if (searchQuery.trim()) {
    
    dispatch(fetchAttendanceSearch({
      employeeName: searchQuery,
      date: tableDate,
      page: 1,
      limit: recordsPerPage,
    }));
  } else {
   
    dispatch(fetchAttendance({
      date: tableDate,
      page: 1,
      limit: recordsPerPage,
      status: activeFilter,
    }));
  }
}, [dispatch, tableDate, recordsPerPage, activeFilter, searchQuery]);

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
            />
            <div>
              <p className="text-sm font-medium text-slate-100">{fullName}</p>
              <p className="text-xs text-slate-500">{row.employeeId}</p>
            </div>
          </div>
        );
      },
    },
    { header: "Email", accessor: "email",render: (row) => row.employee?.email },
    { header: "Date", accessor: "date" },
    { header: "Department", accessor: "department",render: (row) => row.employee?.department },
    { header: "Type", accessor: "jobType", render: (row) => row.employee?.jobType }, 
    {
      header: "Attendance",
      accessor: "status",
      render: (row) => <AttendanceBadge status={row.status} />,
    },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === row._id ? null : row._id)
            }
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
                onClick: () => navigate(`/employee/${row.employeeId}`),
              },
              {
                label: "Delete",
                variant: "danger",
                icon: Trash2,
                onClick: () => handleDelete(row.employeeId),
              },
            ]}
          />
        </div>
      ),
    },
  ];


  const handlePageChange = (newPage) => {
    dispatch(
      fetchAttendance({
        date: tableDate,
        page: newPage,
        limit: recordsPerPage,
        status: activeFilter,
      })
    );
  };

  const handleRecordsPerPageChange = (newLimit) => {
    setRecordsPerPage(newLimit);
  };


  return (
    <BaseCard padding="p-0">
   
      <div className="px-6 pt-4">
        <input
          type="date"
          value={tableDate}
          onChange={(e) => setTableDate(e.target.value)}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500/50"
        />
       
        {tableDate && (
          <button
            onClick={() => setTableDate("")}
            className="ml-2 text-sm text-slate-400 hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>
      <TableControls
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        filterValue={activeFilter}
        setFilterValue={setActiveFilter} 
        filterOptions={["All", "On Time", "Late", "Absent"]}
        setCurrentPage={() => {}} 
      />

      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
     
        <DataTable columns={columns} data={attendanceList} />
      </div>

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