import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// 1. جلب كل المتقدمين
export const fetchAllApplicants = createAsyncThunk(
  "hiring/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ المسار الصحيح: /api/hiring
      const response = await axios.get("/hiring");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicants",
      );
    }
  },
);

// 2. البحث في المتقدمين
export const searchHiring = createAsyncThunk(
  "hiring/search",
  async (query, { rejectWithValue }) => {
    try {
      // /api/hiring/search
      const response = await axios.get(`/hiring/search?query=${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);

const hiringSlice = createSlice({
  name: "hiring",
  initialState: {
    list: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    clearHiringSearch: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب كل المتقدمين
      .addCase(fetchAllApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      // البحث
      .addCase(searchHiring.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchHiring.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchHiring.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHiringSearch } = hiringSlice.actions;
export default hiringSlice.reducer;
