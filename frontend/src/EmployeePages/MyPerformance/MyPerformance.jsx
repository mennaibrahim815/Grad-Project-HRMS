import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PerformanceHeader from "../../EmployeeComponents/MyPerformanceComponents/PerformanceHeader";
import OverallPerformanceCard from "../../EmployeeComponents/MyPerformanceComponents/OverallPerformanceCard";
import KpiStats from "../../EmployeeComponents/MyPerformanceComponents/KpiStats";
import { fetchEmployeePerformance } from "../../store/EmployeeSlices/employeePerformance/employeePerformanceSlice";

export default function MyPerformance() {
  const dispatch = useDispatch();
  const { selectedRange, data, loading, error } = useSelector(
    (state) => state.employeePerformance
  );

  useEffect(() => {
    if (selectedRange?.start && selectedRange?.end) {
      dispatch(fetchEmployeePerformance());
    }
  }, [selectedRange, dispatch]);

  return (
    <>
      <PerformanceHeader />

      {loading && (
        <p style={{ color: "var(--text-muted)" }} className="text-center py-10">
          Loading...
        </p>
      )}

      {error && (
        <p className="text-center py-10 text-red-500">{error}</p>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <OverallPerformanceCard
            overallPerformance={data.overallPerformance}
            performanceStatus={data.performanceStatus}
          />
          {/* KpiStats هنا لما نخلصه */}
          <KpiStats/>
        </div>
      )}
    </>
  );
}