import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";
import { updateLeaveStatus } from "../leaveSlice";

// 1. جلب كل الإشعارات
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/notifications");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// 2. تعليم إشعار واحد كمقروء
export const markAsRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);

// 3. تعليم كل الإشعارات كمقروءة
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await axios.patch("/notifications/read-all");
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

// 4. التعامل مع الموافقة/الرفض
export const handleNotificationAction = createAsyncThunk(
  "notifications/handleAction",
  async ({ id, actionStatus }, { rejectWithValue }) => {
    try {
      await axios.patch(`/notifications/${id}/action`, { actionStatus });
      return { id, actionStatus };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Action failed");
    }
  },
);

// الـ Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    unreadCount: 0,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب الإشعارات
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.unreadCount = (action.payload || []).filter(
          (n) => n?.status === "unread",
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // تعليم واحد كمقروء
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.list.find((n) => n?.id === action.payload);
        if (notif && notif.status === "unread") {
          notif.status = "read";
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // تعليم الكل كمقروء
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list.forEach((n) => {
          if (n) n.status = "read";
        });
        state.unreadCount = 0;
      })
      // التعامل مع الموافقة/الرفض
      .addCase(handleNotificationAction.fulfilled, (state, action) => {
        const notif = state.list.find((n) => n?.id === action.payload.id);
        if (notif) {
          notif.actionStatus = action.payload.actionStatus;
          if (notif.status === "unread") {
            notif.status = "read";
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      // الربط مع تحديث حالة الأجازة
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const relatedNotif = state.list.find(
          (n) => n.targetId == id && n.type === "leave",
        );

        if (relatedNotif) {
          if (status === "Approved") {
          relatedNotif.actionStatus = "accepted";
         } else if (status === "Rejected") {
          relatedNotif.actionStatus = "rejected";
       } else {
           relatedNotif.actionStatus = null; // 👈 ده المهم
         }
          if (relatedNotif.status === "unread") {
            relatedNotif.status = "read";
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
