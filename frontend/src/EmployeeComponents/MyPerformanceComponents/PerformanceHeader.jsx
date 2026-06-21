import ReusableCalendar from "../../components/UI/ReusableCalendar";
import { setPerformancePeriod } from "../../store/EmployeeSlices/employeePerformance/employeePerformanceSlice"
import { useSelector, useDispatch } from "react-redux";

function PerformanceHeader() {
  const dispatch = useDispatch();
  const { selectedRange, loading } = useSelector((state) => state.employeePerformance);

  const handleRangeSave = (newRange) => {
    dispatch(setPerformancePeriod(newRange));
  };

  return (
    <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      {/* Title */}
      <h1
        className="text-lg sm:text-2xl font-bold tracking-tight shrink-0"
        style={{ color: "var(--text-main)" }}
      >
        My Performance
      </h1>

      <div className="flex items-center gap-3 relative">
        {/* Calendar button */}
        <ReusableCalendar
          mode="range"
          value={selectedRange}
          onSave={handleRangeSave}
        />
      </div>
    </div>
  );
}

export default PerformanceHeader;