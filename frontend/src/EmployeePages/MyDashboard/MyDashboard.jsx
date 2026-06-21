
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDashboardStats,
  fetchEmployeeRequests,
  fetchEmployeeProjects,
  fetchAttendanceReport,
  fetchEmployeeNotifications
} from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";

import { Clock, Umbrella, ClipboardList, Inbox } from "lucide-react";
import DashboardHeader from "../../EmployeeComponents/DashBoardComponents/DashBoardHeader";
import StatsCard from "../../EmployeeComponents/DashBoardComponents/StatsCard";
import AttendanceReport from "../../components/Charts/AttendanceReport";
import MyTasksSidebar from "../../EmployeeComponents/DashBoardComponents/MyTasksSidebar";
import RecentRequestsTable from "../../EmployeeComponents/DashBoardComponents/RecentRequestsTable";
import NotificationsWidget from "../../EmployeeComponents/DashBoardComponents/NotificationsWidget";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { selectedDate, stats, attendanceReport, projects, requests, notifications } = useSelector(
    (state) => state.employeeDashboard
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "On Time": return "text-green-400";
      case "Late": return "text-orange-400";
      case "Absent": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  useEffect(() => {
    dispatch(fetchEmployeeDashboardStats({ dateString: selectedDate }));
    dispatch(fetchEmployeeRequests({ page: 1, limit: 5 }));
    dispatch(fetchEmployeeProjects({ page: 1, limit: 5 }));
    dispatch(fetchEmployeeNotifications());

    const dateObj = new Date(selectedDate);
    dispatch(fetchAttendanceReport({
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear()
    }));
  }, [dispatch, selectedDate]);

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-[1650px] mx-auto p-4 min-h-screen space-y-6">
      <DashboardHeader title="Dashboard" />

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title={isToday ? "Today's Status" : "Day Status"} 
          value={stats?.todayStatus?.status || "N/A"} 
          subValue={stats?.todayStatus?.checkIn ? `At ${stats.todayStatus.checkIn}` : "Absent"}
          icon={Clock} 
          colorClass="bg-blue-600"
          subColorClass={getStatusColor(stats?.todayStatus?.status)}
        />
        
        <StatsCard 
          title="Leave Balance" 
          value={`${stats?.leaveBalance || 0} Days`} 
          subValue="Annual Leave Balance"
          icon={Umbrella} 
          colorClass="bg-purple-600"
        />

        <StatsCard 
          title="Active Tasks" 
          value={stats?.activeTasks?.count || 0} 
          subValue={`${stats?.activeTasks?.highPriorityCount || 0} High Priority`}
          icon={ClipboardList} 
          colorClass="bg-orange-600"
          subColorClass="text-orange-400"
        />

        <StatsCard 
          title="Pending Requests" 
          value={stats?.pendingRequests || 0} 
          subValue="Awaiting Approval"
          icon={Inbox} 
          colorClass="bg-pink-600"
        />
      </div>
<div></div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <AttendanceReport
            title="Attendance report"
            data={attendanceReport}
            desc="Real-time employee attendance report"
            filter="Weekly"
          />
          <RecentRequestsTable requests={requests} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <MyTasksSidebar projects={projects} />
          <NotificationsWidget notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;