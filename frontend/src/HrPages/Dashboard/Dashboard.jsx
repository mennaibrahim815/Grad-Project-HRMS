import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/HrSlices/HrDashboard/dashboardSlice";

//  components
import DashboardHeader from "../../HrComponents/DashboardComponents/DashboardHeader";
import StatsCards from "../../HrComponents/DashboardComponents/StatsCards";
import AttendanceReport from "../../components/Charts/AttendanceReport";
import EmployeeStatus from "../../HrComponents/DashboardComponents/EmployeeStatus";
import JobApplicants from "../../HrComponents/DashboardComponents/JobApplicants";
import TaskSummary from "../../HrComponents/DashboardComponents/TaskSummary";


const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardRef = useRef(null);

  const { selectedDate, analytics, loading } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardAnalytics({ dateString: selectedDate }));
  }, [selectedDate, dispatch]);

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

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
            data={analytics?.attendanceReport}
            desc={"Real-time employee attendance report"}
            filter={"Daily"}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <EmployeeStatus
              data={analytics?.employeeStatus}
              title="Employee status"
            />

            <JobApplicants
              applicants={analytics?.recentApplicants}
              pagination={analytics?.applicantsPagination}
            />
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
