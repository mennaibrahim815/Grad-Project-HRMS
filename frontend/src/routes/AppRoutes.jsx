import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../HrPages/auth/Login/Login";
import ForgotPassword from "../HrPages/auth/ForgotPassword/ForgotPassword";
import VerifyCode from "../HrPages/auth/VerifyCode/VerifyCode";
import ResetPassword from "../HrPages/auth/ResetPassword/ResetPassword";
import ApplyJob from "../HrPages/ApplyJob/ApplyJob";
import ApplyJobForm from "../HrPages/ApplyJobForm/ApplyJobForm";

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
import EmployeeDashboard from "../EmployeePages/EmployeeDashboard/EmployeeDashboard";
import Myleaves  from "../EmployeePages/Myleaves/Myleaves";
import MyAttendance from "../EmployeePages/MyAttendance/MyAttendance";
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

    // --- 🔵 HR ---
    {
      element: (
        <ProtectedRoute allowedRoles={["HR"]}>
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
      ],
    },

    // --- 🟢 Employee ---
    {
      element: (
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
          <EmployeeLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/my-dashboard", element: <EmployeeDashboard /> },
        { path: "/my-leaves", element:<Myleaves/>},
        { path: "/my-attendance", element:<MyAttendance/>},
      ],

    },

    // --- 🟡 Shared ---
    {
      element: <ProtectedRoute allowedRoles={["HR", "EMPLOYEE"]} />,
      children: [
        { path: "/profile", element: <EmployeeDetail /> },
        { path: "/settings", element: <Settings /> },
        { path: "/employee/:id", element: <EmployeeDetail /> },
        { path: "/hiring/:id", element: <HiringDetail /> },
        { path: "/hiring/jobs/:id", element: <JobDetailPage /> },
      
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
  },
);
