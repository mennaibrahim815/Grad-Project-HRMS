import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyAttendance, fetchAttendance } from "../../store/HrSlices/attendance/attendanceSlice";

// components
import EmployeesTable from "../../HrComponents/employees/EmployeesTable/EmployeesTable";
import EmployeeHeader from "../../HrComponents/employees/EmployeeHeader/EmployeeHeader";
import HRApproval from "../../HrComponents/employees/HRApproval/HRApproval";
import AttendanceReport from "../../HrComponents/DashboardComponents/AttendanceReport";

const Employees = () => {
  const dispatch = useDispatch();
  const { chartData, totals, selectedDate, pagination,loading } = useSelector(
    (state) => state.attendance,
  );

  const attendanceReportData = {
    totals,
    chartData,
  };

  useEffect(() => {
  if (selectedDate) {
    const dateObj = new Date(selectedDate);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    
    dispatch(fetchMonthlyAttendance({ month, year }));
  }
}, [selectedDate, dispatch]);
if (loading ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }
  return (
    <div className="max-w-[1650px] mx-auto p-4 bg-transparent">
      <div className="space-y-3">
        <EmployeeHeader />

        <AttendanceReport
          title="Performance report"
          desc="Real-time employee attendance report"
          data={attendanceReportData}
          filter="Monthly"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 ">
            
            <EmployeesTable /> 
          </div>

          <div className="space-y-6">
            <HRApproval />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
