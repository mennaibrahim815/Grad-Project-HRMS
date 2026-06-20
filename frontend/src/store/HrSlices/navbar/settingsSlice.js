

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// جلب الإعدادات
export const fetchSettings = createAsyncThunk("settings/fetch", async () => {
  const response = await axios.get("/settings");
  return response.data.data.settings; 
});

// تحديث الإعدادات (تخدم General و Access معاً)
export const updateSettings = createAsyncThunk(
  "settings/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/settings/update", payload);

      return response.data.data.settings;
    }catch (err) {
  console.log("FULL ERROR =>", err.response?.data);
  console.log("MESSAGES =>", err.response?.data?.message);

  return rejectWithValue(
    err.response?.data?.message || "Failed to update settings"
  );
}
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // تحديث الإعدادات
      .addCase(updateSettings.pending, (state) => {
        state.loading = true; // عشان الزرار يعمل Loading
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // تحديث الداتا في الصفحة فوراً
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default settingsSlice.reducer;