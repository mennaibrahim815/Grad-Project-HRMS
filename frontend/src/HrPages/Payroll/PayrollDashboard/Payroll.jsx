import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollSummary } from "../../../store/HrSlices/payroll/payrollSlice";
// import { fetchPayrollSummary, fetchMonthlyStats, fetchPayrollEmployees } from "../../redux/HrSlices/payrollSlice";
//components
import PayrollHeader from "../../../HRComponents/PayrollComponents/PayrollDashboard/PayrollHeader/PayrollHeader";
import StatsCards from "../../../HRComponents/PayrollComponents/PayrollDashboard/StatsCards/StatsCards";
import PayrollTable from "../../../HRComponents/PayrollComponents/PayrollDashboard/PayrollTable/PayrollTable";
import EmployeeStatus from "../../../HrComponents/DashboardComponents/EmployeeStatus";

export default function Payroll() {
  const dispatch = useDispatch();
  const payrollRef = useRef(null);
  const { analytics, loading, error } = useSelector((state) => state.payroll);

  // const { summary, monthlyStats, employees, selectedRange, loading } = useSelector((state) => state.payroll);
  //   useEffect(() => {
  //   dispatch(fetchPayrollSummary());
  //   dispatch(fetchMonthlyStats());
  //   dispatch(fetchPayrollEmployees(selectedRange));
  // }, [dispatch, selectedRange]);

  // useEffect(() => {
  //   dispatch(fetchPayrollSummary());
  // }, [dispatch]);
  // حالات التحميل والأخطاء
  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-400 font-semibold tracking-wide">
            Loading Dashboard Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-red-400 font-semibold mb-2">
            Failed to load dashboard
          </p>
          <p className="text-gray-500 text-sm">{error.message}</p>
          <button
            onClick={() => dispatch(fetchPayrollSummary())}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={payrollRef} className="max-w-[1650px] mx-auto p-4 bg-transparent">
      {/* 1. Header Section */}
      <PayrollHeader />
      {/* 2. Top Section: 4 Stats Cards */}
      <div className="mb-[12px]">
        <StatsCards stats={analytics?.cards} />
      </div>
      {/* 3. Middle Section: Two Columns (Chart & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-[12px]">
        {/* Left: Bar Chart (Occupies 2 columns) */}
        <div className="lg:col-span-2"></div>
        {/* Right: Payments Status (Occupies 1 column) */}
        <div className="lg:col-span-1">
          <EmployeeStatus
            data={analytics?.payment_status}
            pieStripes={"unpaid"}
            title={"Payment status"}
          />
        </div>
      </div>
      {/* 4. Bottom Section: Full Width Table */}
      <PayrollTable />
    </div>
  );
}
