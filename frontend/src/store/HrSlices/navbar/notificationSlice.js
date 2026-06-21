

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";
import { updateLeaveStatus } from "../leaveSlice";

// Get Notifications
export const fetchNotifications = createAsyncThunk(
"notifications/fetch",
async (_, { rejectWithValue }) => {
try {
const response = await axios.get(
"/notifications/my-notifications"
);
  const notifications =
    response.data?.data?.notifications?.map((item) => ({
      id: item._id,

      employeeName: `${item.sender?.general?.firstName || ""} ${
        item.sender?.general?.lastName || ""
      }`.trim(),
      avatar: item.sender?.general?.avatar || "",
      title: item.title,
      message: item.message,
      type: item.type?.toLowerCase(),
      status: item.isRead ? "read" : "unread",
      targetId: item.relatedId,
      time: new Date(item.createdAt).toLocaleString(),
      actionStatus: null,
    })) || [];
  return notifications;
} catch (err) {
  return rejectWithValue(
    err.response?.data?.message ||
      "Failed to fetch notifications"
  );}
});

// Get Unread Count
export const fetchUnreadCount = createAsyncThunk(
"notifications/fetchUnreadCount",
async (_, { rejectWithValue }) => {
try {
const response = await axios.get(
"/notifications/unread-count"
);
  return response.data.data.unreadCount;
} catch (err) {
  return rejectWithValue(
    err.response?.data?.message ||
      "Failed to fetch unread count"
  );}
});
// Temporary Until Backend Endpoint Exists
export const markAsRead = createAsyncThunk(
"notifications/markRead",
async (id) => {
return id;
}
);
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await axios.put("/notifications/mark-all-read");

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to mark all as read"
      );}
  });

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
addLiveNotification: (state, action) => {
  const newItem = {
    id: action.payload._id,
    employeeName: `${action.payload.sender?.general?.firstName || ""} ${action.payload.sender?.general?.lastName || ""}`.trim(),
    avatar: action.payload.sender?.general?.avatar || "",
    title: action.payload.title,
    message: action.payload.message,
    type: action.payload.type?.toLowerCase(),
    status: "unread",
    targetId: action.payload.relatedId,
    time: "Just now",
    actionStatus: null,
  };
  state.list.unshift(newItem);
  state.unreadCount += 1;
},
},
extraReducers: (builder) => {
builder
  // Fetch Notifications
  .addCase(fetchNotifications.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchNotifications.fulfilled, (state, action) => {
    state.loading = false;
    state.list = action.payload || [];
  })
  .addCase(fetchNotifications.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  // Fetch Unread Count
  .addCase(fetchUnreadCount.fulfilled, (state, action) => {
    state.unreadCount = action.payload;
  })
  // Mark Single Notification
  .addCase(markAsRead.fulfilled, (state, action) => {
    const notif = state.list.find(
      (n) => n.id === action.payload
    );
    if (notif && notif.status === "unread") {
      notif.status = "read";
      state.unreadCount = Math.max(
        0,
        state.unreadCount - 1
      );
    }
  })
  // Mark All Read
  .addCase(markAllAsRead.fulfilled, (state) => {
    state.list.forEach((n) => {
      n.status = "read";
    });

    state.unreadCount = 0;
  })
  // Leave Status Sync
  .addCase(updateLeaveStatus.fulfilled, (state, action) => {
    const { id, status } = action.payload;

    const relatedNotif = state.list.find(
      (n) =>
        n.targetId == id &&
        n.type === "leave"
    );
    if (!relatedNotif) return;
    if (status === "Approved") {
      relatedNotif.actionStatus = "accepted";
    } else if (status === "Rejected") {
      relatedNotif.actionStatus = "rejected";
    } else {
      relatedNotif.actionStatus = null;
    }
    if (relatedNotif.status === "unread") {
      relatedNotif.status = "read";

      state.unreadCount = Math.max(
        0,
        state.unreadCount - 1
      );}
  });
},});

export const { addLiveNotification,clearNotifications } =
notificationSlice.actions;
export default notificationSlice.reducer;
