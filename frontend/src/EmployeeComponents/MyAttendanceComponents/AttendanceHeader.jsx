import ReusableCalendar from "../../components/UI/ReusableCalendar";
import { setSelectedMonth } from "../../store/EmployeeSlices/attendance/empAttendanceSlice";
import { useSelector, useDispatch } from "react-redux";

function AttendanceHeader() {
  const dispatch = useDispatch();
  const { selectedMonth } = useSelector((state) => state.empAttendance);

  const handleMonthSave = (newMonth) => {
    dispatch(setSelectedMonth(newMonth));
  };

  const formattedMonth = new Date(selectedMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex justify-between items-start sm:items-center gap-3 mb-4 bg-transparent p-4 rounded-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          My Attendance
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Overview of your work hours and punctuality for {formattedMonth}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
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