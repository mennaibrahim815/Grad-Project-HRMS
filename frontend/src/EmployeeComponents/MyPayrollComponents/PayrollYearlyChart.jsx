import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollYearlyStats } from "../../store/EmployeeSlices/payroll/empPayrollSlice";
import YearlyChart from "../../components/Charts/YearlyChart";

function PayrollYearlyChart() {
  const dispatch = useDispatch();
  const { yearlyStats, yearlyLoading } = useSelector((state) => state.empPayroll);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchPayrollYearlyStats({ year: selectedYear }));
  }, [selectedYear, dispatch]);

  return (
    <YearlyChart
      title="Yearly Payroll Overview"
      data={yearlyStats}
      isLoading={yearlyLoading}
      selectedYear={selectedYear}
      onYearChange={setSelectedYear}
      bar1Key="netSalaries"
      bar1Label="Net Salary"
      bar2Key="deductions"
      bar2Label="Deductions"
    />
  );
}

export default PayrollYearlyChart;