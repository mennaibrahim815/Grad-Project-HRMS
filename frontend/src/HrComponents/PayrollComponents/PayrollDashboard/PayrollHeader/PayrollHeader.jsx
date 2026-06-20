import ReusableCalendar from "../../../../components/UI/ReusableCalendar";
import { setPayrollMonth } from "../../../../store/HrSlices/payroll/payrollSlice";
import { useSelector, useDispatch } from "react-redux";


function PayrollHeader() {
  const dispatch = useDispatch();
  const {  selectedMonth, loading } = useSelector((state) => state.payroll);
  const handleMonthSave = (newMonth) => {
  dispatch(setPayrollMonth(newMonth));
};

  return (
    <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      {/* Title */}
       <h1 className="text-lg sm:text-2xl font-bold tracking-tight shrink-0" style={{ color: 'var(--text-main)' }}>
          Payroll
      </h1>
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

export default PayrollHeader;
