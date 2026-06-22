import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, MinusCircle, CheckCircle2 } from "lucide-react";
import StatsCards from "../../components/StatsCards.jsx/StatsCards";
import { fetchPayrollDashboardStats } from "../../store/EmployeeSlices/payroll/empPayrollSlice";

function PayrollStats() {
  const dispatch = useDispatch();
  const { selectedMonth, dashboardStats, loading } = useSelector(
    (state) => state.empPayroll
  );

  useEffect(() => {
    const date = new Date(selectedMonth);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    dispatch(fetchPayrollDashboardStats({ month, year }));
  }, [selectedMonth, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  const { totalNetSalaries, totalDeductions } = dashboardStats.summaryCards;

   const cards = [
    {
      title: "Net Salary",
      value: totalNetSalaries.value,
      change: totalNetSalaries.changePercentage,
      up: totalNetSalaries.isIncrease,
      icon: DollarSign,
    },
    {
      title: "Deductions",
      value: totalDeductions.value,
      change: totalDeductions.changePercentage,
      up: totalDeductions.isIncrease,
      icon: MinusCircle,
    },
    {
      title: "Payment Status",
      value: dashboardStats.paymentStatus,
      icon: CheckCircle2,
      type: "badge",
    },
  ];

  
  return <StatsCards cards={cards} gridCols="md:grid-cols-3" />;
}

export default PayrollStats;