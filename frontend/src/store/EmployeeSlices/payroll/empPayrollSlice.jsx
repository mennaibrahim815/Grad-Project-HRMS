import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

const getLastMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString();
};

const initialState = {
    selectedMonth: getLastMonthDate(),
    dashboardStats: {
        summaryCards: {
            totalNetSalaries: { value: 0, changePercentage: 0, isIncrease: true },
            totalDeductions: { value: 0, changePercentage: 0, isIncrease: true },
        },
        paymentStatus: "",
    },
    yearlyStats: [],
    yearlyLoading: false,
    myPayrollHistory: {
        list: [],
        pagination: { totalRecords: 0, totalPages: 1, currentPage: 1, limit: 10 },
    },
    historyLoading: false,
    loading: false,
    error: null,
};

export const fetchPayrollDashboardStats = createAsyncThunk(
    "empPayroll/fetchPayrollDashboardStats",
    async ({ month, year }, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/payroll/dashboard/monthly/me?month=${month}&year=${year}`
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch payroll dashboard stats"
            );
        }
    }
);

export const fetchPayrollYearlyStats = createAsyncThunk(
    "empPayroll/fetchPayrollYearlyStats",
    async ({ year }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/payroll/dashboard/yearly/me?year=${year}`);
            return res.data.data.yearlyOverview;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch yearly payroll stats"
            );
        }
    }
);

export const fetchMyPayrollHistory = createAsyncThunk(
    "empPayroll/fetchMyPayrollHistory",
    async ({ month, year, status, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page, limit });
            if (month && year) { params.append("month", month); params.append("year", year); }
            if (status && status !== "All") params.append("status", status);

            const res = await axios.get(`/payroll/employees/me?${params.toString()}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch payroll history");
        }
    }
);

const empPayrollSlice = createSlice({
    name: "empPayroll",
    initialState,
    reducers: {
        setSelectedMonth: (state, action) => {
            state.selectedMonth = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayrollDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayrollDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload;
            })
            .addCase(fetchPayrollDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPayrollYearlyStats.pending, (state) => {
                state.yearlyLoading = true;
                state.error = null;
            })
            .addCase(fetchPayrollYearlyStats.fulfilled, (state, action) => {
                state.yearlyLoading = false;
                state.yearlyStats = action.payload;
            })
            .addCase(fetchPayrollYearlyStats.rejected, (state, action) => {
                state.yearlyLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyPayrollHistory.pending, (state) => {
                state.historyLoading = true;
                state.error = null;
            })
            .addCase(fetchMyPayrollHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.myPayrollHistory.list = action.payload.data?.payrolls || [];
                state.myPayrollHistory.pagination = action.payload.pagination || state.myPayrollHistory.pagination;
            })
            .addCase(fetchMyPayrollHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedMonth } = empPayrollSlice.actions;
export default empPayrollSlice.reducer;