import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

const initialState = {
  selectedMonth: new Date().toISOString(), // current date by default
  stats: {
    totalAttendanceRecords: 0,
    totalOnTimeCount: 0,
    totalLateCount: 0,
    totalAbsentCount: 0,
    totalDelayMinutes: 0,
    attendanceRate: 0,
  },
  loading: false,
  error: null,
};

export const fetchMonthlyStats = createAsyncThunk(
  "empAttendance/fetchMonthlyStats",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/attendance/stats/monthly/me?month=${month}&year=${year}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch attendance stats"
      );
    }
  }
);

const empAttendanceSlice = createSlice({
  name: "empAttendance",
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchMonthlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedMonth } = empAttendanceSlice.actions;
export default empAttendanceSlice.reducer;