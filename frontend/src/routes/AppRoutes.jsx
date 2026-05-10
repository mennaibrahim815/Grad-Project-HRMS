
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../HrPages/auth/Login/Login";
import ForgotPassword from "../HrPages/auth/ForgotPassword/ForgotPassword";
import VerifyCode from "../HrPages/auth/VerifyCode/VerifyCode";
import ResetPassword from "../HrPages/auth/ResetPassword/ResetPassword";

import Splash from "../HrPages/Splash/Splash";
import Error from "../HrPages/Error/Error";
import Dashboard from "../HrPages/Dashboard/Dashboard";
import Employees from "../HrPages/Emlpoyees/Employees";
import EmployeeDetail from "../HrPages/EmployeeDetail/EmployeeDetail";
import Project from "../HrPages/Project/Project";
import Payroll from "../HrPages/Payroll/Payroll";
import Hiring from "../HrPages/Hiring/Hiring";
import Attendance from "../HrPages/Attendance/Attendance";
import Performance from "../HrPages/Performance/Performance";
import LeaveRequests from "../HrPages/Leave/LeaveRequests/LeaveRequests";
import LeaveDetails from "../HrPages/Leave/LeaveDetails/LeaveDetails"; 
import EmployeeDashboard from "../EmployeePages/EmployeeDashboard/EmployeeDashboard";
import Settings from "../HrPages/sett/Settings";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Splash />, errorElement: <Error /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify", element: <VerifyCode /> },
    { path: "/reset-password", element: <ResetPassword /> },

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
        { path: "/payroll", element: <Payroll /> },
        { path: "/hiring", element: <Hiring /> },
        { path: "/attendance", element: <Attendance /> },
        { path: "/leave-requests", element: <LeaveRequests /> },

        { path: "/leave-details/:id", element: <LeaveDetails /> },

        { path: "/performance", element: <Performance /> },
      ],
    },

    // --- 🟢 Employee ---
    {
      element: (
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
          <EmployeeLayout />
        </ProtectedRoute>
      ),
      children: [{ path: "/my-dashboard", element: <EmployeeDashboard /> }],
    },

    // --- 🟡 Shared ---
    {
      element: <ProtectedRoute allowedRoles={["HR", "EMPLOYEE"]} />,
      children: [
        { path: "/profile", element: <EmployeeDetail /> },
        { path: "/settings", element: <Settings /> },
        { path: "/employee/:id", element: <EmployeeDetail /> },
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