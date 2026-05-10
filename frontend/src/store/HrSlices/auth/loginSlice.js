import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", userData);

      // 💡 رجّع اليوزر بس (مش التوكنز)
      return res.data.data.user;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// ✅ CHECK AUTH (بعد الريفرش)
export const checkAuthStatus = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/me");

      return res.data.data.user;

    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/auth/logout");
      return true;
    } catch (err) {
      return rejectWithValue();
    }
  }
);

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,

    loading: false,
    isCheckingAuth: true, // مهم جدا للريفرش

    error: null,
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===== LOGIN =====
      .addCase(loginUser.pending, (state) => {
        console.log(checkAuthStatus);
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ===== CHECK AUTH =====
      .addCase(checkAuthStatus.pending, (state) => {
        state.isCheckingAuth = true;
      })

      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isCheckingAuth = false;

        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(checkAuthStatus.rejected, (state) => {
        state.isCheckingAuth = false;

        state.user = null;
        state.isAuthenticated = false;
      })

      // ===== LOGOUT =====
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;

        state.loading = false;
        state.isCheckingAuth = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;