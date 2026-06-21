import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AttendanceReport from "../../components/Charts/AttendanceReport";
import { fetchSixMonthsStats } from "../../store/EmployeeSlices/attendance/empAttendanceSlice"

function AttendanceTrend() {
  const dispatch = useDispatch();
  const { selectedMonth, sixMonthsStats, sixMonthsLoading } = useSelector(
    (state) => state.empAttendance
  );

  useEffect(() => {
    const date = new Date(selectedMonth);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    dispatch(fetchSixMonthsStats({ month, year }));
  }, [selectedMonth, dispatch]);

  if (sixMonthsLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  
  const reportData = {
    chartData: sixMonthsStats.monthlyStats,
    totals: {
      onTime: sixMonthsStats.overallStats.totalOnTime,
      late: sixMonthsStats.overallStats.totalLate,
      absent: sixMonthsStats.overallStats.totalAbsent,
    },
  };

  return (
    <AttendanceReport
      title="Attendance Trend"
      desc="Last 6 months overview"
      data={reportData}
      filter="Last 6 months"
    />
  );
}

export default AttendanceTrend;