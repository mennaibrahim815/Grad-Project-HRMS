import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceStats } from "../../store/HrSlices/attendance/attendanceSlice";

import AttendanceTable from "../../HrComponents/AttendanceComponents/AttendanceTable";
import AttendanceHeader from "../../HrComponents/AttendanceComponents/AttendanceHeader";
import StatsCards from "../../components/StatsCards.jsx/StatsCards";

export default function Attendance() {
  const dispatch = useDispatch();
  const { loading, selectedMonth, analytics } = useSelector(
    (state) => state.attendance,
  );
  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    dispatch(
      fetchAttendanceStats({ month: parseInt(month), year: parseInt(year) }),
    );
  }, [dispatch, selectedMonth]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
  //     </div>
  //   );
  // }
  const stats = analytics?.data;

  const attendanceCards = [
    { title: "Total Attendance Records", value: stats?.totalAttendanceRecords },
    { title: "Total On Time", value: stats?.totalOnTimeCount },
    { title: "Total Late", value: stats?.totalLateCount },
    { title: "Total Absent", value: stats?.totalAbsentCount },
  ];
  return (
    <>
      <AttendanceHeader />
      <div className="mb-[12px]">
        <StatsCards cards={attendanceCards}/>
      </div>
      <AttendanceTable />
    </>

  )
}