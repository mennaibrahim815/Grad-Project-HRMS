import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const fetchDashboardAnalytics = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async ({ dateString }, { rejectWithValue }) => {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();

      const [summaryRes, attendanceRes, projectsRes, employeeRes, applicantsRes] = await Promise.all([
        axios.get(`/dashboard/summary?month=${month}&year=${year}`),
        axios.get(`/dashboard/stats/weekly?day=${day}&month=${month}&year=${year}`),
        axios.get(`/dashboard/project-overview?status=On-going&page=1&limit=10`),
        axios.get(`/dashboard/employee-status`),
        axios.get(`/dashboard/recent-applicants?status=Applied&page=1&limit=5`),
      ]);

      return {
        ...summaryRes.data.data,
        attendanceReport: attendanceRes.data.data,
        projects: projectsRes.data.data.projects,
        projectsPagination: projectsRes.data.data.pagination,
        employeeStatus: employeeRes.data.data,
        recentApplicants: applicantsRes.data.data.applicants,
        applicantsPagination: applicantsRes.data.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load stats");
    }
  }
);

export const fetchProjects = createAsyncThunk(
  "dashboard/fetchProjects",
  async ({ status, page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dashboard/project-overview?status=${status}&page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const fetchApplicants = createAsyncThunk(
  "dashboard/fetchApplicants",
  async ({ status, page, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dashboard/recent-applicants?status=${status}&page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0],
    analytics: null,
    loading: false,
    loadingProjects: false,
    loadingApplicants: false,
    error: null,
  },
  reducers: {
    setSelectedDate: (state, action) => { state.selectedDate = action.payload; },
    resetToToday: (state) => { state.selectedDate = new Date().toISOString().split("T")[0]; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjects.pending, (state) => { state.loadingProjects = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loadingProjects = false;
        if (state.analytics) {
          state.analytics.projects = action.payload.projects;
          state.analytics.projectsPagination = action.payload.pagination;
        }
      })
      .addCase(fetchApplicants.pending, (state) => { state.loadingApplicants = true; })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loadingApplicants = false;
        if (state.analytics) {
          state.analytics.recentApplicants = action.payload.applicants;
          state.analytics.applicantsPagination = action.payload.pagination;
        }
      });
  },
});

export const { setSelectedDate, resetToToday } = dashboardSlice.actions;
export default dashboardSlice.reducer;