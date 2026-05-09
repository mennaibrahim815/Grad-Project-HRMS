import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      // 💡 بنبعت الداتا كـ JSON عادي لأن السيرفر بيقبلها كدة
      const response = await axios.post("/auth/reset-password", { 
        email, 
        newPassword 
      });
      return response.data;
    } catch (err) {
      // 💡 معالجة شكل الخطأ الجديد (المصفوفة)
      const errorData = err.response?.data?.message;
      let finalMessage = "Reset failed";

      if (Array.isArray(errorData)) {
        finalMessage = errorData[0].message; // سحب أول رسالة خطأ من المصفوفة
      } else if (typeof errorData === 'string') {
        finalMessage = errorData;
      }

      return rejectWithValue(finalMessage);
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: { loading: false, error: null, success: false },
  reducers: {
    resetResetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
        state.success = false; 
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetResetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;