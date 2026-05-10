
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// 1. أكشن التحقق من الكود
export const verifyOtpCode = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/verify-reset-code", { 
        email, 
        resetCode: code 
      });
      // نرجع البيانات (التي تحتوي على رسالة النجاح)
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

// 2. إعادة إرسال الكود
export const resendCode = createAsyncThunk(
  "verify/resend",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/forget-Password", { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Resend failed");
    }
  }
);

const verifyCodeSlice = createSlice({
  name: "verifyCode",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    resetVerifyState: (state) => {
      state.error = null;
      state.loading = false;
    },
    clearVerifyError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpCode.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtpCode.fulfilled, (state) => { state.loading = false; })
      .addCase(verifyOtpCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendCode.pending, (state) => { state.loading = true; })
      .addCase(resendCode.fulfilled, (state) => { state.loading = false; })
      .addCase(resendCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerifyState, clearVerifyError } = verifyCodeSlice.actions;
export default verifyCodeSlice.reducer;