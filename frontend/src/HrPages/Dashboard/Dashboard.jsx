import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/HrSlices/HrDashboard/dashboardSlice";

//  components
import DashboardHeader from "../../HrComponents/DashboardComponents/DashboardHeader";
import StatsCards from "../../HrComponents/DashboardComponents/StatsCards";
import AttendanceReport from "../../components/Charts/AttendanceReport";
import EmployeeStatus from "../../HrComponents/DashboardComponents/EmployeeStatus";
// import StatusPieChart from "../../HrComponents/StatusPieChart/StatusPieChart";
import JobApplicants from "../../HrComponents/DashboardComponents/JobApplicants";
import TaskSummary from "../../HrComponents/DashboardComponents/TaskSummary";

// src/pages/Dashboard/Dashboard.jsx

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardRef = useRef(null);

  const { selectedDate, analytics, loading, error } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardAnalytics(selectedDate));
  }, [selectedDate, dispatch]);

  // 💡 التعديل هنا: شيلنا شرط الـ if (error) اللي كان بيلغي الصفحة
  // وسيبنا بس اللودر في حالة إن الداتا لسه بتحمل لأول مرة خالص
  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }
// const employeeRaw = analytics?.employeeStatus;
// const employeeChartData = [
//     {
//       name: "Full Time",
//       value: employeeRaw.fullTimePercentage || 0,
//       color: "#3b82f6",
//     },
//     {
//       name: "Part Time",
//       value: employeeRaw.partTimePercentage || 0,
//       color: "#4b5563",
//     },
//     {
//       name: "Internship",
//       value: employeeRaw.internshipPercentage || 0,
//       color: "#10b981",
//     },
//     {
//       name: "Contract",
//       value: employeeRaw.contractPercentage || 0,
//       color: "#ef4444",
//     },
//   ];


  return (
    <div
      ref={dashboardRef}
      className="max-w-[1650px] mx-auto p-4 bg-transparent space-y-3"
    >
      <DashboardHeader printRef={dashboardRef} />

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <StatsCards stats={analytics} />

          <AttendanceReport
            title={"Attendance report"}
            desc={"Real-time employee attendance report"}
            data={analytics?.attendanceReport}
            filter={"Daily"}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <EmployeeStatus
              data={analytics?.employeeStatus}
              title="Employee status"
              pieStripes="Part-time" 
            />
            {/* <StatusPieChart 
  title="Employee Status" 
  data={employeeChartData} 
  totalCount={employeeRaw?.totalEmployee} 
/> */}
            <JobApplicants applicants={analytics?.recentApplicants} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <TaskSummary
            data={analytics?.projects}
            pagination={analytics?.projectsPagination}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
