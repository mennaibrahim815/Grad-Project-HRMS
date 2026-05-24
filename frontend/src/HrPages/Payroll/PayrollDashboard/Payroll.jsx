import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollSummary, fetchYearlyPayroll,setPayrollYear } from "../../../store/HrSlices/payroll/payrollSlice";


//components
import PayrollHeader from "../../../HrComponents/PayrollComponents/PayrollDashboard/PayrollHeader/PayrollHeader";
import StatsCards from "../../../HrComponents/PayrollComponents/PayrollDashboard/StatsCards/StatsCards";
import PayrollTable from "../../../HrComponents/PayrollComponents/PayrollDashboard/PayrollTable/PayrollTable";
import StatusPieChart from "../../../HrComponents/StatusPieChart/StatusPieChart";
import YearlyChart from "../../../components/Charts/YearlyChart";

export default function Payroll() {
  const dispatch = useDispatch();
  const payrollRef = useRef(null);
  const { analytics, loading, selectedMonth, yearlyData, yearlyLoading, selectedYear } = useSelector(
    (state) => state.payroll,
  );

  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    dispatch(
      fetchPayrollSummary({ month: parseInt(month), year: parseInt(year) }),
    );
  }, [dispatch, selectedMonth]);
  useEffect(() => {
    dispatch(fetchYearlyPayroll(selectedYear));
  }, [dispatch, selectedYear]);

  const summaryCards = analytics?.data?.summaryCards;
  const payrollRaw = analytics?.data?.paymentStatusChart;
  const payrollChartData = [
    {
      name: "Paid",
      value: payrollRaw?.paidCount || 0,
      color: "#10b981",
      label: "Paid",
    },
    {
      name: "Pending",
      value: payrollRaw?.pendingCount || 0,
      color: "#3b82f6",
      label: "Pending",
    },
    {
      name: "Draft",
      value: payrollRaw?.draftCount || 0,
      color: "#4b5563",
      label: "Draft",
    },
  ];
  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }
  return (
    <div ref={payrollRef} className="max-w-[1650px] mx-auto p-4 bg-transparent">
      {/* 1. Header Section */}
      <PayrollHeader />
      {/* 2. Top Section: 4 Stats Cards */}
      <div className="mb-[12px]">
        <StatsCards stats={summaryCards} />
      </div>
      {/* 3. Middle Section: Two Columns (Chart & Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-[12px]">
        {/* Left: Bar Chart (Occupies 2 columns) */}
        <div className="lg:col-span-2">
          <YearlyChart
            title="Payroll cost overview"
            data={yearlyData}
            isLoading={yearlyLoading}
            selectedYear={selectedYear}
            onYearChange={(y) => dispatch(setPayrollYear(y))}
            bar1Key="netSalaries"
            bar1Label="Net Salaries"
            bar2Key="deductions"
            bar2Label="Deduction"
          />
        </div>
        {/* Right: Payments Status (Occupies 1 column) */}
        <div className="lg:col-span-1">
          <StatusPieChart
            title="Payment Status"
            data={payrollChartData}
            totalCount={payrollRaw?.totalEmployees}
          />
        </div>
      </div>
      {/* 4. Bottom Section: Full Width Table */}
      <PayrollTable />
    </div>
  );
}
