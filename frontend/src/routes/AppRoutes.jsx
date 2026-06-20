// import { createBrowserRouter, Navigate } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import ProtectedRoute from "./ProtectedRoute";
// import Login from "../HrPages/auth/Login/Login";
// import ForgotPassword from "../HrPages/auth/ForgotPassword/ForgotPassword";
// import VerifyCode from "../HrPages/auth/VerifyCode/VerifyCode";
// import ResetPassword from "../HrPages/auth/ResetPassword/ResetPassword";
// import ApplyJob from "../HrPages/ApplyJob/ApplyJob";
// import ApplyJobForm from "../HrPages/ApplyJobForm/ApplyJobForm";

// import ManageHRs from "../HrPages/ManageHRs/ManageHRs";

// import Splash from "../HrPages/Splash/Splash";
// import Error from "../HrPages/error/Error";
// import Dashboard from "../HrPages/Dashboard/Dashboard";
// import Employees from "../HrPages/Emlpoyees/Employees";
// import EmployeeDetail from "../HrPages/EmployeeDetail/EmployeeDetail";
// import Project from "../HrPages/Project/Project";
// import Payroll from "../HrPages/Payroll/PayrollDashboard/Payroll";
// import PayrollManagment from "../HrPages/Payroll/PayrollManagement/payrollManagement";
// import Hiring from "../HrPages/Hiring/Hiring";
// import HiringJobs from "../HrPages/HiringJobs/HiringJobs";
// import HiringDetail from "../HrPages/HiringDetail/HiringDetail";
// import JobDetailPage from "../HrPages/JobDetailPage/JobDetailPage";
// import Attendance from "../HrPages/Attendance/Attendance";
// import Performance from "../HrPages/Performance/Performance";
// import LeaveRequests from "../HrPages/Leave/LeaveRequests/LeaveRequests";
// import LeaveDetails from "../HrPages/Leave/LeaveDetails/LeaveDetails";
// import Requests from "../HrPages/Requests/Requests";
// import EmployeeDashboard from "../EmployeePages/EmployeeDashboard/EmployeeDashboard";
// import Myleaves from "../EmployeePages/Myleaves/Myleaves";
// import MyAttendance from "../EmployeePages/MyAttendance/MyAttendance";
// import Settings from "../HrPages/sett/Settings";

// export const router = createBrowserRouter(
//   [
//     { path: "/", element: <Splash />, errorElement: <Error /> },
//     { path: "/login", element: <Login /> },
//     { path: "/forgot-password", element: <ForgotPassword /> },
//     { path: "/verify", element: <VerifyCode /> },
//     { path: "/reset-password", element: <ResetPassword /> },
//     { path: "/apply-job", element: <ApplyJob /> },
//     { path: "/careers/apply/:id", element: <ApplyJobForm /> },

//     // --- 🔵 HR ---
//     {
//       element: (
//         <ProtectedRoute allowedRoles={["HR", "MANAGER"]}>
//           <MainLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { path: "/dashboard", element: <Dashboard /> },
//         { path: "/employees", element: <Employees /> },
//         { path: "/project", element: <Project /> },
//         { path: "/payroll/dashboard", element: <Payroll /> },
//         { path: "/payroll/management", element: <PayrollManagment /> },
//         { path: "/hiring", element: <Hiring /> },
//         { path: "/hiring/jobs", element: <HiringJobs /> },
//         { path: "/attendance", element: <Attendance /> },
//         { path: "/leave-requests", element: <LeaveRequests /> },

//         { path: "/leave-details/:id", element: <LeaveDetails /> },

//         { path: "/performance", element: <Performance /> },
//         { path: "/Requests", element: <Requests /> },

        
//         {
//           path: "/manage-hrs",
//           element: (
//             <ProtectedRoute allowedRoles={["MANAGER"]}>
//               <ManageHRs />
//             </ProtectedRoute>
//           ),
//         },
//       ],
//     },

//     // --- 🟢 Employee ---
//     {
//       element: (
//         <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
//           <MainLayout />
//         </ProtectedRoute>
//       ),
//       children: [
//         { path: "/my-dashboard", element: <EmployeeDashboard /> },
//         { path: "/my-leaves", element: <Myleaves /> },
//         { path: "/my-attendance", element: <MyAttendance /> },
//       ],
//     },

//     // --- 🟡 Shared ---
//     {
//       element: <ProtectedRoute allowedRoles={["HR", "EMPLOYEE", "MANAGER"]} />,
//       children: [
//         { path: "/profile", element: <EmployeeDetail /> },
//         { path: "/settings", element: <Settings /> },
//         { path: "/employee/:id", element: <EmployeeDetail /> },
//         { path: "/hiring/:id", element: <HiringDetail /> },
//         { path: "/hiring/jobs/:id", element: <JobDetailPage /> },
//       ],
//     },

//     { path: "*", element: <Error /> },
//   ],
//   {
//     future: {
//       v7_startTransition: true,
//       v7_relativeSplatPath: true,
//       v7_fetcherPersist: true,
//       v7_normalizeFormMethod: true,
//       v7_partialHydration: true,
//       v7_skipActionErrorRevalidation: true,
//     },
//   },
// );




import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../HrPages/auth/Login/Login";
import ForgotPassword from "../HrPages/auth/ForgotPassword/ForgotPassword";
import VerifyCode from "../HrPages/auth/VerifyCode/VerifyCode";
import ResetPassword from "../HrPages/auth/ResetPassword/ResetPassword";
import ApplyJob from "../HrPages/ApplyJob/ApplyJob";
import ApplyJobForm from "../HrPages/ApplyJobForm/ApplyJobForm";
import ManageHRs from "../HrPages/ManageHRs/ManageHRs";
import Splash from "../HrPages/Splash/Splash";
import Error from "../HrPages/error/Error";
import Dashboard from "../HrPages/Dashboard/Dashboard";
import Employees from "../HrPages/Emlpoyees/Employees";
import EmployeeDetail from "../HrPages/EmployeeDetail/EmployeeDetail";
import Project from "../HrPages/Project/Project";
import Payroll from "../HrPages/Payroll/PayrollDashboard/Payroll";
import PayrollManagment from "../HrPages/Payroll/PayrollManagement/payrollManagement";
import Hiring from "../HrPages/Hiring/Hiring";
import HiringJobs from "../HrPages/HiringJobs/HiringJobs";
import HiringDetail from "../HrPages/HiringDetail/HiringDetail";
import JobDetailPage from "../HrPages/JobDetailPage/JobDetailPage";
import Attendance from "../HrPages/Attendance/Attendance";
import Performance from "../HrPages/Performance/Performance";
import LeaveRequests from "../HrPages/Leave/LeaveRequests/LeaveRequests";
import LeaveDetails from "../HrPages/Leave/LeaveDetails/LeaveDetails";
import Requests from "../HrPages/Requests/Requests";
import Tasks from "../HrPages/Tasks/Tasks";
import EmployeeDashboard from "../EmployeePages/EmployeeDashboard/EmployeeDashboard";
import Myleaves  from "../EmployeePages/Myleaves/Myleaves";
import EmployeeLeaveDetails from "../EmployeePages/Myleaves/EmployeeLeaveDetails";
import MyAttendance from "../EmployeePages/MyAttendance/MyAttendance";
import MyRequests from "../EmployeePages/MyRequests/MyRequests";
import MyTasks from "../EmployeePages/MyTasks/MyTasks";
import Myparoll from "../EmployeePages/MyPayroll/Mypayroll";
import MyPerformance from "../EmployeePages/MyPerformance/MyPerformance";
import Settings from "../HrPages/sett/Settings";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Splash />, errorElement: <Error /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify", element: <VerifyCode /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/apply-job", element: <ApplyJob /> },
    { path: "/careers/apply/:id", element: <ApplyJobForm /> },

    {
      element: <ProtectedRoute />, // حماية عامة للجلسة
      children: [
        // 🔵 موديول الإدارة (يفتح للـ HR والـ MANAGER)
        {
          element: (
            <ProtectedRoute allowedRoles={["HR", "MANAGER"]}>
              <MainLayout />
            </ProtectedRoute>
          ),
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/employees", element: <Employees /> },
            { path: "/project", element: <Project /> },
            { path: "/payroll/dashboard", element: <Payroll /> },
            { path: "/payroll/management", element: <PayrollManagment /> },
            { path: "/hiring", element: <Hiring /> },
            { path: "/hiring/jobs", element: <HiringJobs /> },
            { path: "/attendance", element: <Attendance /> },
            { path: "/leave-requests", element: <LeaveRequests /> },
            { path: "/leave-details/:id", element: <LeaveDetails /> },
            { path: "/performance", element: <Performance /> },
            { path: "/Requests", element: <Requests /> },
            { path: "/Tasks", element: <Tasks /> },

            // تابة المانجر محمية داخلياً برول المانجر بس
            { path: "/manage-hrs", element: <ProtectedRoute allowedRoles={["MANAGER"]}><ManageHRs /></ProtectedRoute> },
          ],
        },

        // 🟢 موديول الموظف
        {
          element: (
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MainLayout />
            </ProtectedRoute>
          ),
          children: [
            { path: "/my-dashboard", element: <EmployeeDashboard /> },
            { path: "/my-leaves", element: <Myleaves /> },
            { path: "/my-attendance", element: <MyAttendance /> },
            { path: "/my-requests", element:<MyRequests/>},
            { path: "/my-tasks", element:<MyTasks/>},
            { path: "/my-leave-details/:id", element: <EmployeeLeaveDetails /> },
            { path: "/my-payroll", element: <Myparoll /> },
            { path: "/my-performance", element: <MyPerformance /> },
          ],
        },

        // 🟡 الصفحات المشتركة
        {
          element: <ProtectedRoute allowedRoles={["HR", "EMPLOYEE", "MANAGER"]} />,
          children: [
            { path: "/profile", element: <EmployeeDetail /> },
            { path: "/settings", element: <Settings /> },
            { path: "/employee/:id", element: <EmployeeDetail /> },
            { path: "/hiring/:id", element: <HiringDetail /> },
            { path: "/hiring/jobs/:id", element: <JobDetailPage /> },
          ],
        },
      ],
    },

    { path: "*", element: <Error /> },
  ],
  {
    future: {
      
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);