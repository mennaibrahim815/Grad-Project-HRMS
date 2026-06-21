// store/HrSlices/employeePerformance/employeePerformanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// Helper: default range = current month (from today's start to today)
const getDefaultRange = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const firstDay = `${y}-${m}-01`;
  const lastDay = `${y}-${m}-${String(new Date(y, today.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;
  return { start: firstDay, end: lastDay };
};

export const fetchEmployeePerformance = createAsyncThunk(
  "employeePerformance/fetchEmployeePerformance",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { selectedRange } = getState().employeePerformance;

      if (!selectedRange?.start || !selectedRange?.end) {
        return rejectWithValue("Please select a valid date range");
      }

      const response = await  axios.get("/employeePerformance/", {
        params: {
          startDate: selectedRange.start,
          endDate: selectedRange.end,
        },
      });

      return response.data.data; // الجزء اللي جوه "data" في الـ response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch performance data"
      );
    }
  }
);

const employeePerformanceSlice = createSlice({
  name: "employeePerformance",
  initialState: {
    selectedRange: getDefaultRange(),
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPerformancePeriod: (state, action) => {
      state.selectedRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeePerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeePerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPerformancePeriod } = employeePerformanceSlice.actions;
export default employeePerformanceSlice.reducer;