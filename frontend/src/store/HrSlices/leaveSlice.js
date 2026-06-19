// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../services/axios";

// // 1. جلب كل طلبات الأجازات
// export const fetchAllLeaves = createAsyncThunk(
//   "leaves/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {

//       const response = await axios.get("/leaves?limit=5&page=1");
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed");
//     }
//   },
// );

// // 2. البحث في الأجازات
// export const searchLeaves = createAsyncThunk(
//   "leaves/search",
//   async (query, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/leaves/search?query=${query}`);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Search failed");
//     }
//   },
// );

// // 3. تحديث حالة طلب الأجازة
// export const updateLeaveStatus = createAsyncThunk(
//   "leaves/updateStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(`/leaves/${id}/status`, { status });
      
//       // التعديل هنا: هنرجع الـ id والـ status بوضوح للـ Reducer
//       return { id, status, data: response.data }; 
      
//     } catch (err) {
//       console.log(err.response);
//       return rejectWithValue(err.response?.data?.message || "Update failed");
//     }
//   },
// );


// const leaveSlice = createSlice({
//   name: "leaves",
//   initialState: {
//     list: [],
//     searchResults: [],
//     loading: false,
//     searchLoading: false,
//     error: null,
//   },
//   reducers: {
//     clearLeaveSearch: (state) => {
//       state.searchResults = [];
//       state.searchLoading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // جلب كل الأجازات
//       .addCase(fetchAllLeaves.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllLeaves.fulfilled, (state, action) => {
//         state.loading = false;
//         // ✅ الداتا جوه action.payload.data
//         state.list = action.payload.data || [];
//       })

//       // البحث
//       .addCase(searchLeaves.pending, (state) => {
//         state.searchLoading = true;
//       })
//       .addCase(searchLeaves.fulfilled, (state, action) => {
//         state.searchLoading = false;
//         state.searchResults = action.payload || [];
//       })
//       .addCase(searchLeaves.rejected, (state, action) => {
//         state.searchLoading = false;
//         state.error = action.payload;
//       })


//       .addCase(updateLeaveStatus.pending, (state) => {
//         state.error = null; // امسحي أي error قديم
//       })
//       .addCase(updateLeaveStatus.fulfilled, (state, action) => {
//         state.error = null; // تأكيد مسح الخطأ
//         const { id, status } = action.payload;

//         state.list = state.list.map((leave) =>
//           leave._id === id ? { ...leave, status } : leave
//         );

//         const searchLeave = state.searchResults.find((l) => l.id === id);
//         if (searchLeave) {
//           searchLeave.status = status;
//         }
//       })
//       .addCase(updateLeaveStatus.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearLeaveSearch } = leaveSlice.actions;
// export default leaveSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// 1. جلب كل طلبات الأجازات
export const fetchAllLeaves = createAsyncThunk(
  "leaves/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/leaves?limit=5&page=1");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// 2. البحث في الأجازات
export const searchLeaves = createAsyncThunk(
  "leaves/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/leaves/search?query=${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);

// 3. تحديث حالة طلب الأجازة
export const updateLeaveStatus = createAsyncThunk(
  "leaves/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/leaves/${id}/status`, { status });
      // إرجاع الـ id والـ status بوضوح للـ Reducer لضمان التحديث اللحظي
      return { id, status, data: response.data }; 
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    list: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    updatingItem: { id: null, status: null }, // 📜 سطر جديد لتتبع الزرار النشط
  },
  reducers: {
    clearLeaveSearch: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب كل الأجازات
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
      })

      // البحث
      .addCase(searchLeaves.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchLeaves.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchLeaves.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // تحديث الحالة
      .addCase(updateLeaveStatus.pending, (state, action) => {
        state.error = null;
        // 📜 نأخذ الـ id والـ status من الداتا اللي مبعوتة للـ Thunk تلقائياً عن طريق action.meta.arg
        state.updatingItem = {
          id: action.meta.arg?.id,
          status: action.meta.arg?.status,
        };
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.error = null;
        state.updatingItem = { id: null, status: null }; // 📜 تصفير بعد النجاح
        
        const { id, status } = action.payload;

        state.list = state.list.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        );

        const searchLeave = state.searchResults.find((l) => l.id === id);
        if (searchLeave) {
          searchLeave.status = status;
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.updatingItem = { id: null, status: null }; // 📜 تصفير بعد الفشل
      });
  },
});

export const { clearLeaveSearch } = leaveSlice.actions;
export default leaveSlice.reducer;