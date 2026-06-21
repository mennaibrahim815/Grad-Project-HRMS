// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchEmployeeDashboardStats,
//   fetchEmployeeRequests,
//   fetchEmployeeProjects,
//   fetchAttendanceReport,
//   fetchNotifications
// } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";
// import { fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

// import { Clock, Umbrella, ClipboardList, Inbox } from "lucide-react";
// import DashboardHeader from "../../EmployeeComponents/DashBoardComponents/DashboardHeader";
// import StatsCard from "../../EmployeeComponents/DashBoardComponents/StatsCard";
// import AttendanceReport from "../../components/Charts/AttendanceReport";
// import MyTasksSidebar from "../../EmployeeComponents/DashBoardComponents/MyTasksSidebar";
// import RecentRequestsTable from "../../EmployeeComponents/DashBoardComponents/RecentRequestsTable";
// import NotificationsWidget from "../../EmployeeComponents/DashBoardComponents/NotificationsWidget";

// const Dashboard = () => {
//   const dispatch = useDispatch();
  
//   // بيانات المستخدم والداشبورد من الريدكس
//   const { data: userProfile } = useSelector((state) => state.hrProfile);
//   const { selectedDate, stats, projects, requests, notifications } = useSelector((state) => state.employeeDashboard);

//   // 1. جلب البروفايل فور الدخول للحصول على ID الموظف
//   useEffect(() => {
//     if (!userProfile) dispatch(fetchMyHRProfile());
//   }, [dispatch, userProfile]);

//   // 2. جلب كافة البيانات عند تغيير التاريخ أو توفر البروفايل
//   useEffect(() => {
//     const dateObj = new Date(selectedDate);
    
//     // جلب الكروت، الطلبات، المشاريع، والإشعارات
//     dispatch(fetchEmployeeDashboardStats({ dateString: selectedDate }));
//     dispatch(fetchEmployeeRequests({ page: 1, limit: 5 }));
//     dispatch(fetchEmployeeProjects({ page: 1, limit: 5 }));
//     dispatch(fetchNotifications());

//     // جلب الحضور (يحتاج ID الموظف)
//     if (userProfile?._id) {
//       dispatch(fetchAttendanceReport({
//         id: userProfile._id,
//         month: dateObj.getMonth() + 1,
//         year: dateObj.getFullYear(),
//       }));
//     }
//   }, [dispatch, selectedDate, userProfile?._id]);

//   return (
//     <div className="max-w-[1650px] mx-auto p-4 min-h-screen space-y-6">
//       <DashboardHeader title="Dashboard Overview" />

//       {/* Stats Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard 
//           title="Today's Status" 
//           value={stats?.todayStatus?.status || "N/A"} 
//           subValue={stats?.todayStatus?.checkIn ? `At ${stats.todayStatus.checkIn}` : "Absent"}
//           icon={Clock} colorClass="bg-blue-600"
//         />
//         <StatsCard 
//           title="Leave Balance" 
//           value={`${stats?.leaveBalance || 0} Days`} 
//           subValue="Annual Leave"
//           icon={Umbrella} colorClass="bg-purple-600"
//         />
//         <StatsCard 
//           title="Active Tasks" 
//           value={stats?.activeTasks?.count || 0} 
//           subValue={`${stats?.activeTasks?.highPriorityCount || 0} High Priority`}
//           icon={ClipboardList} colorClass="bg-orange-600"
//         />
//         <StatsCard 
//           title="Pending Requests" 
//           value={stats?.pendingRequests || 0} 
//           subValue="Awaiting HR Approval"
//           icon={Inbox} colorClass="bg-pink-600"
//         />
//       </div>

//       <div className="grid grid-cols-12 gap-6">
//         {/* Main Content (Charts & Tables) */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
//           <AttendanceReport
//             title="Weekly Attendance"
//             data={stats?.attendanceReport} // الداتا تم تحويلها في السلايس
//             desc="Real-time attendance tracking"
//             filter="Weekly"
//           />
//           <RecentRequestsTable requests={requests} />
//         </div>

//         {/* Right Sidebar (Tasks & Notifications) */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <MyTasksSidebar projects={projects} />
//           <NotificationsWidget notifications={notifications} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchEmployeeDashboardStats,
//   fetchEmployeeRequests,
//   fetchEmployeeProjects,
//   fetchAttendanceReport,
//   fetchEmployeeNotifications
// } from "../../store/EmployeeSlices/dashBoard/employeeDashBoardSlice";

// import { Clock, Umbrella, ClipboardList, Inbox } from "lucide-react";
// import DashboardHeader from "../../EmployeeComponents/DashBoardComponents/DashboardHeader";
// import StatsCard from "../../EmployeeComponents/DashBoardComponents/StatsCard";
// import AttendanceReport from "../../components/Charts/AttendanceReport";
// import MyTasksSidebar from "../../EmployeeComponents/DashBoardComponents/MyTasksSidebar";
// import RecentRequestsTable from "../../EmployeeComponents/DashBoardComponents/RecentRequestsTable";
// import NotificationsWidget from "../../EmployeeComponents/DashBoardComponents/NotificationsWidget";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const { selectedDate, stats, attendanceReport, projects, requests, notifications } = useSelector(
//     (state) => state.employeeDashboard
//   );

//   // داخل Dashboard.jsx

// // دالة مساعدة لتحديد لون النقطة بناءً على الحالة
// const getStatusColor = (status) => {
//   switch (status) {
//     case "On Time": return "text-green-400";
//     case "Late": return "text-orange-400";
//     case "Absent": return "text-red-400";
//     default: return "text-gray-400";
//   }
// };

// // داخل الـ Return
// <StatsCard 
//   title={selectedDate === new Date().toISOString().split("T")[0] ? "Today's Status" : "Day Status"} 
//   value={stats?.todayStatus?.status || "N/A"} 
//   subValue={stats?.todayStatus?.checkIn ? `Checked in at ${stats.todayStatus.checkIn}` : "No Record Found"}
//   icon={Clock}
//   colorClass="bg-blue-600"
//   // ✅ نرسل اللون المناسب للحالة
//   subColorClass={getStatusColor(stats?.todayStatus?.status)}
// />

//   useEffect(() => {
//     // 1. جلب الإحصائيات العامة
//     dispatch(fetchEmployeeDashboardStats({ dateString: selectedDate }));
    
//     // 2. جلب الطلبات والمشاريع والإشعارات
//     dispatch(fetchEmployeeRequests({ page: 1, limit: 5 }));
//     dispatch(fetchEmployeeProjects({ page: 1, limit: 5 }));
//     dispatch(fetchEmployeeNotifications());

//     // 3. جلب بيانات الحضور (الشهر والسنة من التاريخ المختار)
//     const dateObj = new Date(selectedDate);
//     dispatch(fetchAttendanceReport({
//       month: dateObj.getMonth() + 1,
//       year: dateObj.getFullYear()
//     }));

//   }, [dispatch, selectedDate]);

//   return (
//     <div className="max-w-[1650px] mx-auto p-4 min-h-screen space-y-6">
//       <DashboardHeader title="Dashboard" />

//       {/* Stats Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard 
//           title="Today's Status" 
//           value={stats?.todayStatus?.status || "N/A"} 
//           subValue={stats?.todayStatus?.checkIn ? `At ${stats.todayStatus.checkIn}` : "Absent"}
//           icon={Clock} colorClass="bg-blue-600"
//             subColorClass={getStatusColor(stats?.todayStatus?.status)}

//         />
//         <StatsCard 
//           title="Leave Balance" 
//           value={`${stats?.leaveBalance || 0} Days`} 
//           subValue="Annual Leave Balance"
//           icon={Umbrella} colorClass="bg-purple-600"
//             subColorClass={getStatusColor(stats?.todayStatus?.status)}

//         />
//         <StatsCard 
//           title="Active Tasks" 
//           value={stats?.activeTasks?.count || 0} 
//           subValue={`${stats?.activeTasks?.highPriorityCount || 0} High Priority`}
//           icon={ClipboardList} colorClass="bg-orange-600"
//             subColorClass={getStatusColor(stats?.todayStatus?.status)}

//         />
//         <StatsCard 
//           title="Pending Requests" 
//           value={stats?.pendingRequests || 0} 
//           subValue="Awaiting Approval"
//           icon={Inbox} colorClass="bg-pink-600"
//             subColorClass={getStatusColor(stats?.todayStatus?.status)}

//         />
//       </div>

//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-12 lg:col-span-8 space-y-6">
//           {/* Attendance Chart */}
//           <AttendanceReport
//             title="Attendance report"
//             data={attendanceReport}
//             desc="Real-time employee attendance report"
//             filter="Weekly"
//           />
//           {/* Requests Table */}
//           <RecentRequestsTable requests={requests} />
//         </div>

//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           {/* Sidebar Components */}
//           <MyTasksSidebar projects={projects} />
//           <NotificationsWidget notifications={notifications} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
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
import DashboardHeader from "../../EmployeeComponents/DashBoardComponents/DashboardHeader";
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