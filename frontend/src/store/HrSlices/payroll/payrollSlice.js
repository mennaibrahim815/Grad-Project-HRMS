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
// ─── New Action Thunks ────────────────────────────────────────────────────────
 
export const generateDraft = createAsyncThunk(
  "payroll/generateDraft",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/payroll/draft", { month, year });
      return response.data; // { status, message, data: { payrolls } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to generate draft. Please try again." }
      );
    }
  }
);
 
export const approvePayroll = createAsyncThunk(
  "payroll/approve",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/payroll/approve", { month, year });
      return response.data; // { status, message, data: { approvedEmployeesCount } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to approve payroll. Please try again." }
      );
    }
  }
);
 
export const bulkPayPayroll = createAsyncThunk(
  "payroll/bulkPay",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      // PATCH — not POST
      const response = await axios.patch("/payroll/pay/bulk", { month, year });
      return response.data; // { status, message, data: { paidEmployeesCount } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to process payment. Please try again." }
      );
    }
  }
);
export const paySinglePayroll = createAsyncThunk(
  "payroll/paySingle",
  async ({ id, month, year }, { rejectWithValue }) => {
    try {
      
      const response = await axios.patch(`/payroll/pay/${id}`, { 
        month, 
        year 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to process payment." }
      );
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    selectedMonth: new Date().toISOString().slice(0, 7),
    selectedYear: new Date().getFullYear(),
    managementSelectedMonth: new Date().toISOString().slice(0, 7),
    managementSelectedYear: new Date().getFullYear(),
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
     // State for payroll actions (Generate / Approve / Pay)
    actionState: {
      loading: false,
      // After the API call resolves, we store the full response here.
      // The modal reads this to show the backend message.
      result: null, // { ok: bool, message: string, data: any } | null
    },
  },
  reducers: {
    setPayrollMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setPayrollYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setManagementMonth: (state, action) => {
      state.managementSelectedMonth = action.payload;
    },
    setManagementYear: (state, action) => {
      state.managementSelectedYear = action.payload;
    },
       // Call this when the modal is closed so the result is cleared for next time
    clearActionResult: (state) => {
      state.actionState = { loading: false, result: null };
    },
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
      })
      // ── Generate Draft ─────────────────────────────────────────────────────
      .addCase(generateDraft.pending, (state) => {
        state.actionState = { loading: true, result: null };
      })
      .addCase(generateDraft.fulfilled, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: true, message: action.payload.message, data: action.payload.data },
        };
      })
      .addCase(generateDraft.rejected, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: false, message: action.payload?.message || "Something went wrong.", data: null },
        };
      })
 
      // ── Approve Payroll ────────────────────────────────────────────────────
      .addCase(approvePayroll.pending, (state) => {
        state.actionState = { loading: true, result: null };
      })
      .addCase(approvePayroll.fulfilled, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: true, message: action.payload.message, data: action.payload.data },
        };
      })
      .addCase(approvePayroll.rejected, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: false, message: action.payload?.message || "Something went wrong.", data: null },
        };
      })
 
      // ── Bulk Pay ───────────────────────────────────────────────────────────
      .addCase(bulkPayPayroll.pending, (state) => {
        state.actionState = { loading: true, result: null };
      })
      .addCase(bulkPayPayroll.fulfilled, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: true, message: action.payload.message, data: action.payload.data },
        };
      })
      .addCase(bulkPayPayroll.rejected, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: false, message: action.payload?.message || "Something went wrong.", data: null },
        };
      })
      // ── Pay single payroll───────────────────────────────────────────────────────────
      .addCase(paySinglePayroll.pending, (state) => {
        state.actionState = { loading: true, result: null };
      })
      .addCase(paySinglePayroll.fulfilled, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: true, message: action.payload.message, data: action.payload.data },
        };
      })
      .addCase(paySinglePayroll.rejected, (state, action) => {
        state.actionState = {
          loading: false,
          result: { ok: false, message: action.payload?.message || "Something went wrong.", data: null },
        };
      });
      

  },
});

export const { setPayrollMonth,setPayrollYear,clearActionResult,setManagementMonth,setManagementYear, } = payrollSlice.actions;
export default payrollSlice.reducer;