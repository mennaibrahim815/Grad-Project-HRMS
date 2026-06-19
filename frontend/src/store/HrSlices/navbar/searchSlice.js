
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const executeSearch = createAsyncThunk(
  "search/execute",
  async ({ query, type }, { rejectWithValue }) => {
    try {
      let endpoint = "";
      
      if (type === "employees") {
        endpoint = `/users/?firstName=${query}&limit=20`; 
      } else if (type === "projects") {
        endpoint = `/projects?name=${query}&limit=20`;
      } else if (type === "hiring") {
        endpoint = `/applicants/?limit=20`; 
      } else if (type === "leave") {
        // البحث عن طلبات الإجازات
        endpoint = `/leaves?limit=20`; 
      }

      const response = await axios.get(endpoint);
      const data = response.data.data;

      // --- 1. الموظفين (Employees) ---
      if (type === "employees") {
        return (data.users || [])
          .filter(u => `${u.general.firstName} ${u.general.lastName}`.toLowerCase().includes(query.toLowerCase()))
          .map((user) => ({
            id: user._id,
            name: `${user.general.firstName} ${user.general.lastName}`,
            image: user.general.avatar,
            position: user.employee.jobTitle,
            department: user.employee.department,
            category: "employees"
          }));
      }

      // --- 2. المشاريع (Projects) ---
      if (type === "projects") {
        return (data.projects || [])
          .filter(p => p.general.name.toLowerCase().includes(query.toLowerCase()))
          .map((project) => ({
            id: project._id,
            name: project.general.name,
            image: project.general.avatar,
            position: project.assignment.status,
            department: project.general.tag,
            category: "projects"
          }));
      }

      // --- 3. التوظيف (Hiring) ---
      if (type === "hiring") {
        return (data.applicants || [])
          .filter(a => `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase().includes(query.toLowerCase()))
          .map((app) => ({
            id: app._id,
            name: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            image: app.personalInfo.avatar,
            position: app.status,
            department: app.personalInfo.department,
            category: "hiring"
          }));
      }

      // --- 4. الإجازات (Leaves) ---
      if (type === "leave") {
        // بما أن الـ Response بتاع الإجازات هو array مباشر في الـ data
        const leavesList = Array.isArray(data) ? data : data.leaves || [];
        
        return leavesList
          .filter(l => `${l.employee.firstName} ${l.employee.lastName}`.toLowerCase().includes(query.toLowerCase()))
          .map((leave) => ({
            id: leave._id,
            name: `${leave.employee.firstName} ${leave.employee.lastName}`,
            image: leave.employee.avatar,
            position: `${leave.type} Leave`, // نوع الإجازة
            department: leave.status, // حالة الطلب (Approved, Pending...)
            category: "leave"
          }));
      }

      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);

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