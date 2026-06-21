import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PerformanceHeader from "../../EmployeeComponents/MyPerformanceComponents/PerformanceHeader";
import OverallPerformanceCard from "../../EmployeeComponents/MyPerformanceComponents/OverallPerformanceCard";
import KpiStats from "../../EmployeeComponents/MyPerformanceComponents/KpiStats";
import PerformanceTrendChart from "../../components/Charts/PerformanceTrendChart";
import PreviousPeriodsTable from "../../EmployeeComponents/MyPerformanceComponents/PreviousPeriodsTable";
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
                <div className="flex justify-center items-center py-10">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                </div>
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
                    <KpiStats />
                   
                        <PerformanceTrendChart
                            previousPeriods={data.previousPeriods}
                            currentPeriod={data.currentPeriod}
                            overallPerformance={data.overallPerformance}
                            performanceStatus={data.performanceStatus}
                            isLoading={loading}
                        />
                        <PreviousPeriodsTable
                            previousPeriods={data.previousPeriods}
                            isLoading={loading}
                        />
                    
                </div>
            )}
        </>
    );
}