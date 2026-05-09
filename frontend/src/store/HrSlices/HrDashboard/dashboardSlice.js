import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const fetchDashboardAnalytics = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async (dateString, { rejectWithValue }) => {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();

      // 💡 طلب الـ 3 Endpoints مع بعض لسرعة الاستجابة
      const [
        summaryRes,
        attendanceRes,
        projectsRes,
        employeeRes,
        applicantsRes,
      ] = await Promise.all([
        axios.get(`/dashboard/summary?month=${month}&year=${year}`),
        axios.get(
          `/dashboard/stats/weekly?day=${day}&month=${month}&year=${year}`,
        ),
        // بنجيب المشاريع اللي حالتها On-going كبداية
        axios.get(
          `/dashboard/project-overview?status=On-going&page=1&limit=10`,
        ),
        axios.get(`/dashboard/employee-status`),
        axios.get(`/dashboard/recent-applicants?status=Applied&page=1&limit=5`),
      ]);

      return {
        ...summaryRes.data.data,
        attendanceReport: attendanceRes.data.data,
        projects: projectsRes.data.data.projects,
        projectsPagination: projectsRes.data.data.pagination,
        employeeStatus: employeeRes.data.data, // 👈 raw object زي ما هو
        recentApplicants: applicantsRes.data.data.applicants,
        applicantsPagination: applicantsRes.data.data.pagination,

        // نبعت مصفوفة المشاريع زي ما هي للـ UI
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load stats",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetToToday: (state) => {
      state.selectedDate = new Date().toISOString().split("T")[0];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedDate, resetToToday } = dashboardSlice.actions;
export default dashboardSlice.reducer;
