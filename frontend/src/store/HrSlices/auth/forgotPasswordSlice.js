import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// أكشن طلب إرسال الكود - بيكلم /api/auth/forget-Password
export const requestResetCode = createAsyncThunk(
  "auth/requestResetCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/forget-Password", { email });
      return response.data; // { status: "success", message: "OTP code sent..." }
    } catch (err) {
      // سحب رسالة الخطأ من الباك إيند الحقيقي (User not found)
      return rejectWithValue(err.response?.data?.message || "Failed to send code");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    resetForgotState: (state) => {
      state.error = null;
      state.loading = false;
      state.status = "idle";
    },
    clearForgotError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestResetCode.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(requestResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // هنا ستخزن رسالة "User not found"
        state.status = "failed";
      });
  },
});

export const { resetForgotState, clearForgotError } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;