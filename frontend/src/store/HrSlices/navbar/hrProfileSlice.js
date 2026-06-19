// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "../../../services/axios";

// // // جلب بروفايل الـ HR الحالي
// // export const fetchMyHRProfile = createAsyncThunk(
// //   "hrProfile/fetchMe",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get("/hr-profile/me");
// //       return response.data;
// //     } catch (err) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to fetch HR profile",
// //       );
// //     }
// //   },
// // );

// // // إضافة Thunk التحديث في hrProfileSlice.js

// // export const updateHRProfile = createAsyncThunk(
// //   "hrProfile/update",
// //   async (formData, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.patch("/hr-profile/update-me", formData);
// //       return response.data.updatedUser;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || "Update failed");
// //     }
// //   }
// // );



// // const hrProfileSlice = createSlice({
// //   name: "hrProfile",
// //   initialState: {
// //     data: null,
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {
// //     clearHRProfile: (state) => {
// //       state.data = null;
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchMyHRProfile.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchMyHRProfile.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.data = action.payload;
// //       })
// //       .addCase(fetchMyHRProfile.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
// // // في الـ extraReducers:

// //   .addCase(updateHRProfile.pending, (state) => { state.loading = true; })
// //   .addCase(updateHRProfile.fulfilled, (state, action) => {
// //     state.loading = false;
// //     state.data = action.payload; // تحديث بيانات السلايس بالبيانات الجديدة فوراً
// //   })
// //   .addCase(updateHRProfile.rejected, (state, action) => {
// //     state.loading = false;
// //     state.error = action.payload;
// //   });
// //   },
// // });

// // export const { clearHRProfile, updateHRProfile } = hrProfileSlice.actions;
// // export default hrProfileSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../services/axios";

// // ============================================
// // 1. جلب بروفايل الـ HR الحالي
// // ============================================
// export const fetchMyHRProfile = createAsyncThunk(
//   "hrProfile/fetchMe",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/hr-profile/me");
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch HR profile"
//       );
//     }
//   }
// );

// // ============================================
// // 2. تحديث بيانات الـ HR
// // ============================================
// export const updateHRProfile = createAsyncThunk(
//   "hrProfile/update",
//   async (formData, { rejectWithValue }) => {
//     try {
//       // إرسال البيانات المحدثة للباك إند
//       const response = await axios.patch("/hr-profile/update-me", formData);
//       // بنرجع الـ updatedUser اللي السيرفر بيبعته في الـ response
//       return response.data.updatedUser;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Update failed"
//       );
//     }
//   }
// );

// // ============================================
// // الـ Slice
// // ============================================
// const hrProfileSlice = createSlice({
//   name: "hrProfile",
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     // ريديوسر لمسح البيانات عند الخروج Logout
//     clearHRProfile: (state) => {
//       state.data = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // حالات جلب البيانات (Fetch)
//       .addCase(fetchMyHRProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyHRProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchMyHRProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // حالات تحديث البيانات (Update)
//       .addCase(updateHRProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateHRProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload; // تحديث المخزن بالبيانات الجديدة فوراً
//       })
//       .addCase(updateHRProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // ✅ تصدير الأكشنز العادية فقط
// export const { clearHRProfile } = hrProfileSlice.actions;

// // تصدير الـ Reducer الأساسي
// export default hrProfileSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// 1. جلب بروفايل الـ HR الحالي
export const fetchMyHRProfile = createAsyncThunk(
  "hrProfile/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      return response.data.data; // بيرجع الـ user object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch HR profile");
    }
  }
);

// 2. تحديث بيانات الـ HR
export const updateHRProfile = createAsyncThunk(
  "hrProfile/update",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/users/${userId}`,
        formData
      );

      return response.data.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

const hrProfileSlice = createSlice({
  name: "hrProfile",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearHRProfile: (state) => { state.data = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyHRProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchMyHRProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user; // 💡 تخزين الـ user مباشرة
      })
      .addCase(fetchMyHRProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHRProfile.fulfilled, (state, action) => {
        state.data = action.payload; 
      });
  },
});

export const { clearHRProfile } = hrProfileSlice.actions;
export default hrProfileSlice.reducer;