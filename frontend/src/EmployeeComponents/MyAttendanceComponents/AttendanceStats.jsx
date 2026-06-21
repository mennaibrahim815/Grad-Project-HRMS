import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatsCards from "../../components/StatsCards.jsx/StatsCards";
import { fetchMonthlyStats } from "../../store/EmployeeSlices/attendance/empAttendanceSlice"

function AttendanceStats() {
  const dispatch = useDispatch();
  const { selectedMonth, stats, loading } = useSelector((state) => state.empAttendance);

  useEffect(() => {
    const date = new Date(selectedMonth);
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    dispatch(fetchMonthlyStats({ month, year }));
  }, [selectedMonth, dispatch]);

  const cards = [
    {
      title: "Total Days",
      value: stats.totalAttendanceRecords,
    },
    {
      title: "On Time",
      value: stats.totalOnTimeCount,
    },
    {
      title: "Late",
      value: stats.totalLateCount,
    },
    {
      title: "Absent",
      value: stats.totalAbsentCount,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  return <StatsCards cards={cards} />;
}

export default AttendanceStats;