import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// تنفيذ البحث الموحد
export const executeSearch = createAsyncThunk(
  "search/execute",
  async ({ query, type }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/search?query=${query}&type=${type}`);
      return response.data;
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
