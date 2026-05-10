import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// جلب كل المشاريع
export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ المسار الصحيح: /api/projects (مش /projects/projects)
      const response = await axios.get("/projects");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch projects",
      );
    }
  },
);

// البحث في المشاريع
export const searchProjects = createAsyncThunk(
  "projects/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/projects/search?query=${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);

// الـ Slice
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    clearProjectSearch: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      // البحث
      .addCase(searchProjects.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectSearch } = projectSlice.actions;
export default projectSlice.reducer;
