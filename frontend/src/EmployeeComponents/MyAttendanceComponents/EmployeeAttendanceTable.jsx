import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  fetchMyAttendance,
  addNewMyAttendanceRecord,
} from "../../store/EmployeeSlices/attendance/empAttendanceSlice";

import DataTable from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";
import BaseCard from "../../components/UI/Card";

const AttendanceBadge = ({ status }) => {
  const styles = {
    "On Time": "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    Late: "bg-[#0293FA]/15 text-[#0293FA] border-[#0293FA]/40",
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

const EmployeeAttendanceTable = () => {
  const dispatch = useDispatch();

  const { myAttendance, myAttendanceLoading } = useSelector(
    (state) => state.empAttendance
  );

  // 🔹 جيبي بيانات الموظف الحالي من auth state
  const { user } = useSelector((state) => state.auth);
  const currentEmployeeId = user?._id || user?.id;

  const [recordsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchMyAttendance({ page: 1, limit: recordsPerPage }));
  }, [dispatch, recordsPerPage]);

//   // ==========================================
//   // ✨ Socket: تحديث الجدول لايف عند البصمة ✨
//   // ==========================================
//   useEffect(() => {
//     const socket = io("grad-project-hrms-production-7.up.railway.app", {
//       withCredentials: true,
//     });

//     const handleNewCheckin = (newRecord) => {
//       // الباك إند بيبعت broadcast لكل الموظفين، فلازم نفلتر هنا
//       if (newRecord.employeeId === currentEmployeeId) {
//         dispatch(addNewMyAttendanceRecord(newRecord));
//       }
//     };

//     socket.on("new_checkin", handleNewCheckin);

//     return () => {
//       socket.off("new_checkin", handleNewCheckin);
//       socket.disconnect();
//     };
//   }, [dispatch, currentEmployeeId]);
//   // ==========================================

  const handlePageChange = (newPage) => {
    dispatch(fetchMyAttendance({ page: newPage, limit: recordsPerPage }));
  };

  const columns = [
    { header: "Date", accessor: "date" },
    {
      header: "Check In",
      accessor: "checkIn",
      render: (row) => {
        if (!row.checkIn) return <span className="text-slate-500 text-xs">—</span>;
        return (
          <span className="text-slate-300 text-sm font-medium">
            {new Date(row.checkIn).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Cairo",
            })}
          </span>
        );
      },
    },
    {
      header: "Department",
      accessor: "department",
      render: (row) => (
        <span className="text-slate-300 ">{row.employee?.department || "—"}</span>
      ),
    },
    {
      header: "Job Type",
      accessor: "jobType",
      render: (row) => (
        <span className="text-slate-300 ">{row.employee?.jobType || "—"}</span>
      ),
    },
    {
      header: "Delay (min)",
      accessor: "delayMinutes",
      render: (row) => (
        <span className="text-pink-400 ">
          {row.delayMinutes != null ? `${row.delayMinutes} min` : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <AttendanceBadge status={row.status} />,
    },
  ];

  return (
    <BaseCard padding="p-0">
      {myAttendanceLoading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        </div>
      ) : (
        <DataTable columns={columns} data={myAttendance.list} />
      )}
      <Pagination
        pagination={myAttendance.pagination}
        handlePageChange={handlePageChange}
        handleRecordsPerPageChange={() => {}}
        currentDataLength={myAttendance.list.length}
      />
    </BaseCard>
  );
};

export default EmployeeAttendanceTable;