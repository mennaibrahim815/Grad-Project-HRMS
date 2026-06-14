// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../services/axios";

// // جلب الإعدادات
// export const fetchSettings = createAsyncThunk("settings/fetch", async () => {
//   const response = await axios.get("/settings"); // تأكد لو محتاجة /api/settings
//   return response.data.data.settings; 
// });

// // تحديث الإعدادات (PATCH)
// // export const updateSettings = createAsyncThunk("settings/update", async (updateData, { rejectWithValue }) => {
// //   try {
// //     const response = await axios.patch("/settings/update", updateData);
// //     return response.data.data.settings;
// //   } catch (err) {
// //     return rejectWithValue(err.response.data.message);
// //   }
// // });


// export const updateSettings = createAsyncThunk(
//   "settings/update",
//   async (formData, { rejectWithValue }) => {
//     try {
//       // 1. جلب التوكن من الـ localStorage (تأكدي من الاسم المخزن عندك token أو accessToken)
//       const token = localStorage.getItem("token"); 
      
//       // 2. إرسال الـ Request مع الـ Headers المطلوبة للباك إند
//       const response = await axios.put("/settings", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // لأننا بنبعت FormData
//           Authorization: `Bearer ${token}`,      // تمرير التوكن هنا هو السر!
//         },
//       });

//       // 3. إرجاع الداتا الجديدة اللي رجعت من الباك إند بعد التعديل
//       return response.data.data.settings; 
//     } catch (err) {
//       // لو حصل خطأ رجعي رسالة الخطأ
//       return rejectWithValue(err.response?.data?.message || "Failed to update settings");
//     }
//   }
// );
// // ... الكود القديم (fetchSettings & updateSettings)

// const settingsSlice = createSlice({
//   name: "settings",
//   initialState: { data: null, loading: false, error: null }, // أضفنا error و نأكد loading false في البداية
//   extraReducers: (builder) => {
//     builder
//       // عند بدء التحميل
//       .addCase(fetchSettings.pending, (state) => {
//         state.loading = true;
//       })
//       // عند نجاح التحميل
//       .addCase(fetchSettings.fulfilled, (state, action) => {
//         state.loading = false; // مهم جداً نرجعها false
//         state.data = action.payload;
//       })
//       // عند فشل التحميل
//       .addCase(fetchSettings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       // تحديث الإعدادات
//       .addCase(updateSettings.fulfilled, (state, action) => {
//         state.data = action.payload;
//       });
//   }
// });

// export default settingsSlice.reducer;



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