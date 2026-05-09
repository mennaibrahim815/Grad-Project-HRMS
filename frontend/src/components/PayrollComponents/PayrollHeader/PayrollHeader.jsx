import ReusableCalendar from "../../UI/ReusableCalendar";
import { setPayrollRange } from "../../../store/HrSlices/payroll/payrollSlice";
import { useSelector, useDispatch } from "react-redux";

function PayrollHeader() {
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.payroll.selectedRange);
  const handleDateSave = (newRange) => {
    if (newRange.start && newRange.end) {
      // تأكدي إنه اختار التاريخين
      dispatch(setPayrollRange(newRange));
    }
  };
  return (
    <div className="flex justify-between items-center mb-4 bg-transparent p-4 rounded-2xl">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white tracking-tight">Payroll</h1>
      <div className="flex items-center gap-3 relative">
        {/* Calender button */}
        <ReusableCalendar
          mode="range"
          value={dateRange}
          onSave={handleDateSave}
        />
      </div>
    </div>
  );
}

export default PayrollHeader;
