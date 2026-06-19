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
    sixMonthsStats: {
        overallStats: {
            totalOnTime: 0,
            totalLate: 0,
            totalAbsent: 0,
        },
        monthlyStats: [],
    },
    myAttendance: {
        list: [],
        pagination: {
            totalRecords: 0,
            totalPages: 1,
            currentPage: 1,
            limit: 10,
        },
    },
    loading: false,
    sixMonthsLoading: false,
    myAttendanceLoading: false,
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

export const fetchSixMonthsStats = createAsyncThunk(
    "empAttendance/fetchSixMonthsStats",
    async ({ month, year }, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/attendance/stats-six-months/me?month=${month}&year=${year}`
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch 6-months attendance stats"
            );
        }
    }
);

export const fetchMyAttendance = createAsyncThunk(
    "empAttendance/fetchMyAttendance",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/attendance/employee/me?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch my attendance"
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
        addNewMyAttendanceRecord: (state, action) => {
            state.myAttendance.list.unshift(action.payload);
            // اختياري: تحديث العداد الكلي
            state.myAttendance.pagination.totalRecords += 1;
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
            })
            .addCase(fetchSixMonthsStats.pending, (state) => {
                state.sixMonthsLoading = true;
                state.error = null;
            })
            .addCase(fetchSixMonthsStats.fulfilled, (state, action) => {
                state.sixMonthsLoading = false;
                state.sixMonthsStats = action.payload;
            })
            .addCase(fetchSixMonthsStats.rejected, (state, action) => {
                state.sixMonthsLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyAttendance.pending, (state) => {
                state.myAttendanceLoading = true;
                state.error = null;
            })
            .addCase(fetchMyAttendance.fulfilled, (state, action) => {
                state.myAttendanceLoading = false;
                console.log("API Response:", action.payload);
                state.myAttendance.list = action.payload.data?.attendance || [];
                state.myAttendance.pagination = action.payload.data?.pagination || state.myAttendance.pagination;
            })
            .addCase(fetchMyAttendance.rejected, (state, action) => {
                state.myAttendanceLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedMonth,addNewMyAttendanceRecord } = empAttendanceSlice.actions;
export default empAttendanceSlice.reducer;