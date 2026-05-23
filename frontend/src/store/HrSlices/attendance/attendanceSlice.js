import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// Fetch Daily Attendance
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async ({ date, page = 1, limit = 5, status = "" }, { rejectWithValue }) => {
    try {
      let url = `/attendance?page=${page}&limit=${limit}`;
      if (date) url += `&date=${date}`;
      if (status && status !== "All") url += `&status=${status}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance",
      );
    }
  },
);

// Fetch Monthly Attendance Analytics
export const fetchMonthlyAttendance = createAsyncThunk(
  "attendance/fetchMonthlyAttendance",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `attendance/stats-six-months?month=${month}&year=${year}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch monthly attendance",
      );
    }
  },
);

// Fetch Attendance Search
export const fetchAttendanceSearch = createAsyncThunk(
  "attendance/fetchAttendanceSearch",
  async ({ employeeName, date, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      let url = `/attendance/search?employeeName=${employeeName}&page=${page}&limit=${limit}`;
      if (date) url += `&date=${date}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search",
      );
    }
  },
);

// Fetch Attendance By Employee
export const fetchAttendanceByEmployee = createAsyncThunk(
  "attendance/fetchAttendanceByEmployee",
  async (
    { employeeId, page = 1, limit = 5, month, year },
    { rejectWithValue },
  ) => {
    try {
      let url = `/attendance/employee/${employeeId}?page=${page}&limit=${limit}`;
      if (month) url += `&month=${month}`;
      if (year) url += `&year=${year}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);

const initialState = {
  attendanceList: [],
  pagination: {
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 5,
  },
  chartData: [],
  totals: {
    onTime: 0,
    late: 0,
    absent: 0,
  },
  selectedMonth: new Date().toISOString().slice(0, 7),
  selectedDate: new Date().toISOString().split("T")[0],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    // ✨ التعديل بتاع السوكيت: الزرار اللي بيضيف الحضور الجديد في الجدول ✨
    addNewAttendanceRecord: (state, action) => {
      // بنحط الموظف في أول الجدول
      state.attendanceList.unshift(action.payload);

      // لو عايز تحدث الإحصائيات كمان لايف (اختياري)
      if (action.payload.status === "On Time") state.totals.onTime += 1;
      else if (action.payload.status === "Late") state.totals.late += 1;
      else if (action.payload.status === "Absent") state.totals.absent += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { attendance, pagination } = action.payload.data;
        state.attendanceList = attendance || [];
        state.pagination = pagination || initialState.pagination;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMonthlyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const statsRoot = action.payload.data;
        if (statsRoot) {
          state.chartData = statsRoot.monthlyStats || [];
          const overall = statsRoot.overallStats;
          state.totals = {
            onTime: overall?.totalOnTime || 0,
            late: overall?.totalLate || 0,
            absent: overall?.totalAbsent || 0,
          };
        } else {
          state.chartData = [];
          state.totals = { onTime: 0, late: 0, absent: 0 };
        }
      })
      .addCase(fetchMonthlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSearch.fulfilled, (state, action) => {
        state.loading = false;
        const { attendance, pagination } = action.payload.data;
        state.attendanceList = attendance || [];
        state.pagination = pagination || initialState.pagination;
      })
      .addCase(fetchAttendanceSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceList = action.payload.data.attendance || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAttendanceByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedMonth, setSelectedDate, addNewAttendanceRecord } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
