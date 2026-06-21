import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const fetchMyHRProfile = createAsyncThunk(
  "hrProfile/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      return response.data.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateHRProfile = createAsyncThunk(
  "hrProfile/update",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const hrProfileSlice = createSlice({
  name: "hrProfile",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearHRProfile: (state) => { state.data = null; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyHRProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchMyHRProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyHRProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHRProfile.pending, (state) => { state.loading = true; })
      .addCase(updateHRProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // تحديث فوري للبيانات
      })
      .addCase(updateHRProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHRProfile } = hrProfileSlice.actions;
export default hrProfileSlice.reducer;