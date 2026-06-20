
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const executeSearch = createAsyncThunk(
  "search/execute",
  async ({ query, type, status }, { rejectWithValue }) => {
    try {
      let endpoint = "";

      // ---------------- ENDPOINTS ----------------
      if (type === "employees") {
        endpoint = `/users/?firstName=${query}&limit=20`;
      } else if (type === "projects") {
        endpoint = `/projects?status=On-going&priority=Medium&page=1&limit=20`;
      } else if (type === "hiring") {
        endpoint = `/applicants/?limit=20`;
      } else if (type === "leave") {
        endpoint = `/leaves?limit=20`;
      } else if (type === "myTasks") {
        endpoint = `/tasks/my-tasks?filter=team-tasks&page=1&limit=10`;

        // 🔥 لو فيه فلتر status من التاب
        if (status) {
          endpoint = `/tasks/my-tasks?filter=team-tasks&status=${status}&page=1&limit=10`;
        }
      }

      const response = await axios.get(endpoint);

      // unified safe response handling
      const data = response.data?.data || response.data;

      // ---------------- EMPLOYEES ----------------
      if (type === "employees") {
        const users = data.users || [];

        return users
          .filter((u) =>
            `${u.general.firstName} ${u.general.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map((user) => ({
            id: user._id,
            name: `${user.general.firstName} ${user.general.lastName}`,
            image: user.general.avatar,
            position: user.employee?.jobTitle,
            department: user.employee?.department,
            category: "employees",
          }));
      }

      // ---------------- PROJECTS ----------------
      if (type === "projects") {
        const projects = data.projects || [];

        return projects
          .filter((p) =>
            p.general?.name?.toLowerCase().includes(query.toLowerCase())
          )
          .map((project) => ({
            id: project._id,
            name: project.general.name,
            image: project.general.avatar,
            position: project.status,
            department: project.general.tag,
            category: "projects",
          }));
      }

      // ---------------- HIRING ----------------
      if (type === "hiring") {
        const applicants = data.applicants || [];

        return applicants
          .filter((a) =>
            `${a.personalInfo.firstName} ${a.personalInfo.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map((app) => ({
            id: app._id,
            name: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            image: app.personalInfo.avatar,
            position: app.status,
            department: app.personalInfo.department,
            category: "hiring",
          }));
      }

      // ---------------- LEAVES ----------------
      if (type === "leave") {
        const leavesList = Array.isArray(data)
          ? data
          : data.leaves || [];

        return leavesList
          .filter((l) =>
            `${l.employee.firstName} ${l.employee.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map((leave) => ({
            id: leave._id,
            name: `${leave.employee.firstName} ${leave.employee.lastName}`,
            image: leave.employee.avatar,
            position: `${leave.type} Leave`,
            department: leave.status,
            category: "leave",
          }));
      }

      // ---------------- MY TASKS (STATUS BASED TABS) ----------------
      if (type === "myTasks") {
        const tasks = data.tasks || [];

        return tasks
          .filter((task) =>
            task.title?.toLowerCase().includes(query.toLowerCase())
          )
          .map((task) => ({
            id: task._id,
            name: task.title,
            image: task.assignedTo?.[0]?.general?.avatar || null,
            position: task.priority,
            department: task.status,
            category: "myTasks",
          }));
      }

      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Search failed"
      );
    }
  }
);

// ---------------- SLICE ----------------
const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload || [];
      })
      .addCase(executeSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.results = [];
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;