
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// ======================================
// 1. الأكشنز (Thunks)
// ======================================

// إحصائيات الكروت
export const fetchEmployeeDashboardStats = createAsyncThunk(
  "employeeDashboard/fetchStats",
  async ({ dateString }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employeeDashboard/dashboard-stats?date=${dateString}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Stats Error");
    }
  }
);

// تقرير الحضور
export const fetchAttendanceReport = createAsyncThunk(
  "employeeDashboard/fetchAttendance",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/attendance/employee/me?page=1&limit=10&month=${month}&year=${year}`);
      return response.data.data.attendance;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Attendance Error");
    }
  }
);

// المشاريع
export const fetchEmployeeProjects = createAsyncThunk(
  "employeeDashboard/fetchProjects",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employeeDashboard/my-projects?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Projects Error");
    }
  }
);

// الطلبات الأخيرة
export const fetchEmployeeRequests = createAsyncThunk(
  "employeeDashboard/fetchRequests",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employeeDashboard/recent-requests?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Requests Error");
    }
  }
);

// الإشعارات
export const fetchEmployeeNotifications = createAsyncThunk(
  "employeeDashboard/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/notifications/my-notifications");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Notifications Error");
    }
  }
);

// ======================================
// 2. السلايس (Slice)
// ======================================

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0],
    stats: null,
    attendanceReport: { weeklyAttendenceStats: [], totals: { onTime: 0, late: 0, absent: 0 } },
    projects: [],
    requests: [],
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedDate: (state, action) => { state.selectedDate = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // داخل extraReducers في السلايس
.addCase(fetchEmployeeDashboardStats.fulfilled, (state, action) => {
  state.loadingStats = false;
  // ✅ التعديل هنا: استبدال الكائن بالكامل لضمان تحديث القيم بناءً على التاريخ المختار
  state.stats = action.payload; 
})
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        const attendance = action.payload || [];
        // تحويل البيانات لشكل الرسم البياني
        const mappedStats = attendance.map(item => ({
          dayName: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
          onTimeCount: item.status === "On Time" ? 1 : 0,
          lateCount: item.status === "Late" ? 1 : 0,
          absentCount: item.status === "Absent" ? 1 : 0,
          fullDate: item.date
        }));

        state.attendanceReport = {
          weeklyAttendenceStats: mappedStats,
          totals: {
            onTime: attendance.filter(i => i.status === "On Time").length,
            late: attendance.filter(i => i.status === "Late").length,
            absent: attendance.filter(i => i.status === "Absent").length,
          }
        };
      })
      .addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects || [];
      })
      .addCase(fetchEmployeeRequests.fulfilled, (state, action) => {
        state.requests = action.payload.requests || [];
      })
      .addCase(fetchEmployeeNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications || [];
      });
  },
});

export const { setSelectedDate } = employeeDashboardSlice.actions;
export default employeeDashboardSlice.reducer;