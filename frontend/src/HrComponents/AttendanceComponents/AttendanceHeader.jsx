import ReusableCalendar from "../../components/UI/ReusableCalendar";
import { setSelectedMonth } from "../../store/HrSlices/attendance/attendanceSlice";
import { useSelector, useDispatch } from "react-redux";

function AttendanceHeader() {
  const dispatch = useDispatch();
  const {selectedMonth, loading } = useSelector((state) => state.attendance);
  const handleMonthSave = (newMonth) => {
  dispatch(setSelectedMonth(newMonth));
};

  return (
    <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Attendance</h1>
      <div className="flex items-center gap-3 relative">
        {/* Calender button */}
        <ReusableCalendar
          mode="month"
          value={selectedMonth}
          onSave={handleMonthSave}
        />
      </div>
    </div>
  );
}

export default AttendanceHeader;