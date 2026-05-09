import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./HrSlices/auth/loginSlice";
import forgotPasswordReducer from "./HrSlices/auth/forgotPasswordSlice";
import verifyCodeReducer from "./HrSlices/auth/verifyCodeSlice";
import resetPasswordReducer from "./HrSlices/auth/resetPasswordSlice"; // 💡 السطر الجديد


// Navbar
import notificationReducer from "./HrSlices/navbar/notificationSlice";
import uiReducer from "./HrSlices/navbar/sideMenuSlice";
import searchReducer from "./HrSlices/navbar/searchSlice";
import hrProfileReducer from "./HrSlices/navbar/hrProfileSlice";

// Dashboard
import dashboardReducer from "./HrSlices/HrDashboard/dashboardSlice";

// Features
import employeeReducer from "./HrSlices/employeeSlice";
import projectReducer from "./HrSlices/projectSlice";
import hiringReducer from "./HrSlices/hiringSlice";
import leaveReducer from "./HrSlices/leaveSlice";
import attendanceReducer from "./HrSlices/attendance/attendanceSlice";
import payrollReducer from "./HrSlices/payroll/payrollSlice";

export const store = configureStore({
  reducer: {
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

    // Dashboard
    dashboard: dashboardReducer,

    // Main Features
    employees: employeeReducer,
    projects: projectReducer,
    leaves: leaveReducer,
    hiring: hiringReducer,
    attendance: attendanceReducer,
    payroll:payrollReducer
    
  },
});

export default store;
