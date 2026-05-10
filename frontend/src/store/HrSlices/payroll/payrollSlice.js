import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// Fetch Payroll Dashboard Summary
export const fetchPayrollSummary = createAsyncThunk(
  "payroll/fetchPayrollSummary",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/payroll/dashboard/monthly`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll summary");
    }
  }
);

// Get All Payrolls (Filtered)
export const fetchAllPayrolls = createAsyncThunk(
  "payroll/fetchAll",
  async ({ month, year, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/payroll/employees`, {
        params: {
          month,
          year,
          page,
          limit,
          ...(status && status !== "All" && { status })
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payrolls");
    }
  }
);

// Search Payrolls by Employee Name
export const searchPayrolls = createAsyncThunk(
  "payroll/search",
  async ({ employeeName, month, year, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/payroll/search`, {
        params: {
          employeeName,
          month,
          year,
          page,
          limit,
          ...(status && status !== "All" && { status }) // ← بيحافظ على الفلتر جوه البحث
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search payrolls");
    }
  }
);
// Fetch Yearly Payroll Chart
export const fetchYearlyPayroll = createAsyncThunk(
  "payroll/fetchYearly",
  async (year, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/payroll/dashboard/yearly`, {
        params: { year }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch yearly payroll");
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    selectedMonth: new Date().toISOString().slice(0, 7),
    selectedYear: new Date().getFullYear(),
    analytics: null,
    payrollList: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 10,
    },
    loading: false,
    tableLoading: false,
    yearlyLoading: false,
    error: null,
  },
  reducers: {
    setPayrollMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setPayrollYear: (state, action) => {
      state.selectedYear = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(fetchPayrollSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchPayrollSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // All Payrolls
      .addCase(fetchAllPayrolls.pending, (state) => {
        state.tableLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPayrolls.fulfilled, (state, action) => {
        state.tableLoading = false;
        state.payrollList = Array.isArray(action.payload.data)
          ? action.payload.data
          : action.payload.data?.payrolls || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllPayrolls.rejected, (state, action) => {
        state.tableLoading = false;
        state.error = action.payload;
      })

      // Search Payrolls
      .addCase(searchPayrolls.pending, (state) => {
        state.tableLoading = true;
        state.error = null;
      })
      .addCase(searchPayrolls.fulfilled, (state, action) => {
        state.tableLoading = false;
        console.log("Search Response:", action.payload);
        state.payrollList = action.payload.data?.leave || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        } else {
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalRecords: state.payrollList.length,
            limit: 10,
          };
        }
      })
      .addCase(searchPayrolls.rejected, (state, action) => {
        state.tableLoading = false;
        state.error = action.payload;
        state.payrollList = [];
      })
      // fetchYearlyPayroll
      .addCase(fetchYearlyPayroll.pending, (state) => {
        state.yearlyLoading = true;
        state.error = null;
      })
      .addCase(fetchYearlyPayroll.fulfilled, (state, action) => {
        state.yearlyLoading = false;
        state.yearlyData = action.payload.data?.yearlyOverview || [];
      })
      .addCase(fetchYearlyPayroll.rejected, (state, action) => {
        state.yearlyLoading = false;
        state.error = action.payload;
      });

  },
});

export const { setPayrollMonth,setPayrollYear } = payrollSlice.actions;
export default payrollSlice.reducer;