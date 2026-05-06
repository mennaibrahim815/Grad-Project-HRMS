import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// 1. جلب كل طلبات الأجازات
export const fetchAllLeaves = createAsyncThunk(
  "leaves/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ Pending بس في الكارد + limit صغير
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
      // /api/leaves/:id/status
      const response = await axios.patch(`/leaves/${id}/status`, { status });
      return response.data;;
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
      // ✅ الداتا جوه action.payload.data
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
      
//       .addCase(updateLeaveStatus.fulfilled, (state, action) => {
//        state.error = null; // مهم جدًا

//       const { id, status } = action.payload;

//   const leave = state.list.find((l) => l.id === id);
//   if (leave) {
//     leave.status = status;
//   }

//   const searchLeave = state.searchResults.find((l) => l.id === id);
//   if (searchLeave) {
//     searchLeave.status = status;
//   }
// })
// .addCase(updateLeaveStatus.rejected, (state, action) => {
//   state.error = action.payload;
// });
    .addCase(updateLeaveStatus.pending, (state) => {
  state.error = null; // امسحي أي error قديم
})
.addCase(updateLeaveStatus.fulfilled, (state, action) => {
  state.error = null; // تأكيد مسح الخطأ
  const { id, status } = action.payload;

  const leave = state.list.find((l) => l.id === id);
  if (leave) {
    leave.status = status;
  }

  const searchLeave = state.searchResults.find((l) => l.id === id);
  if (searchLeave) {
    searchLeave.status = status;
  }
})
.addCase(updateLeaveStatus.rejected, (state, action) => {
  state.error = action.payload;
});
  },
});

export const { clearLeaveSearch } = leaveSlice.actions;
export default leaveSlice.reducer;
