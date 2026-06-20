import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./HrSlices/auth/loginSlice";
import forgotPasswordReducer from "./HrSlices/auth/forgotPasswordSlice";
import verifyCodeReducer from "./HrSlices/auth/verifyCodeSlice";
import resetPasswordReducer from "./HrSlices/auth/resetPasswordSlice"; // 💡 السطر الجديد
import careersReducer from "./HrSlices/careersSlice/careersSlice";

// Navbar
import notificationReducer from "./HrSlices/navbar/notificationSlice";
import uiReducer from "./HrSlices/navbar/sideMenuSlice";
import searchReducer from "./HrSlices/navbar/searchSlice";
import hrProfileReducer from "./HrSlices/navbar/hrProfileSlice";
import settingsReducer  from "./HrSlices/navbar/settingsSlice";

// Dashboard
import dashboardReducer from "./HrSlices/HrDashboard/dashboardSlice";

// Features
import employeeReducer from "./HrSlices/employeeSlice";
import projectReducer from "./HrSlices/projectSlice";
import hiringReducer from "./HrSlices/Hiring/hiringSlice";
import leaveReducer from "./HrSlices/leaveSlice";
import attendanceReducer from "./HrSlices/attendance/attendanceSlice";
import payrollReducer from "./HrSlices/payroll/payrollSlice";
import employeeDashboardReducer  from "./EmployeeSlices/dashBoard/employeeDashBoardSlice"
// // Employee Side
import empAttendanceReducer from "./EmployeeSlices/attendance/empAttendanceSlice";
import empPayrollReducer from "./EmployeeSlices/payroll/empPayrollSlice";
import employeePerformanceReducer from "./EmployeeSlices/employeePerformance/employeePerformanceSlice"

import themeReducer from "./themeSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // Authentication
    auth: loginReducer,
    forgotPassword: forgotPasswordReducer,
    verifyCode: verifyCodeReducer,
    resetPassword: resetPasswordReducer, 
    

    // Navbar Features
    ui: uiReducer,
    search: searchReducer,
    notifications: notificationReducer,
    hrProfile: hrProfileReducer,
    
    settings: settingsReducer ,

    // Dashboard
    dashboard: dashboardReducer,

    // Main Features
    employees: employeeReducer,
    projects: projectReducer,
    leaves: leaveReducer,
    hiring: hiringReducer,
    attendance: attendanceReducer,
    payroll:payrollReducer,
    careers: careersReducer,
    empAttendance: empAttendanceReducer,
    empPayroll: empPayrollReducer,
    employeePerformance: employeePerformanceReducer,
    
    employeeDashboard: employeeDashboardReducer,
  },
});

export default store;
