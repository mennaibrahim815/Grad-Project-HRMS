// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "../../../services/axios";
// // import { updateLeaveStatus } from "../leaveSlice";

// // // 1. جلب كل الإشعارات
// // export const fetchNotifications = createAsyncThunk(
// //   "notifications/fetch",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get("/notifications");
// //       return response.data;
// //     } catch (err) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to fetch notifications",
// //       );
// //     }
// //   },
// // );

// // // 2. تعليم إشعار واحد كمقروء
// // export const markAsRead = createAsyncThunk(
// //   "notifications/markRead",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       await axios.patch(`/notifications/${id}/read`);
// //       return id;
// //     } catch (err) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to mark as read",
// //       );
// //     }
// //   },
// // );

// // // 3. تعليم كل الإشعارات كمقروءة
// // export const markAllAsRead = createAsyncThunk(
// //   "notifications/markAllRead",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       await axios.patch("/notifications/read-all");
// //       return true;
// //     } catch (err) {
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to mark all as read",
// //       );
// //     }
// //   },
// // );

// // // 4. التعامل مع الموافقة/الرفض
// // export const handleNotificationAction = createAsyncThunk(
// //   "notifications/handleAction",
// //   async ({ id, actionStatus }, { rejectWithValue }) => {
// //     try {
// //       await axios.patch(`/notifications/${id}/action`, { actionStatus });
// //       return { id, actionStatus };
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || "Action failed");
// //     }
// //   },
// // );

// // // الـ Slice
// // const notificationSlice = createSlice({
// //   name: "notifications",
// //   initialState: {
// //     list: [],
// //     loading: false,
// //     unreadCount: 0,
// //     error: null,
// //   },
// //   reducers: {
// //     clearNotifications: (state) => {
// //       state.list = [];
// //       state.unreadCount = 0;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // جلب الإشعارات
// //       .addCase(fetchNotifications.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchNotifications.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.list = action.payload || [];
// //         state.unreadCount = (action.payload || []).filter(
// //           (n) => n?.status === "unread",
// //         ).length;
// //       })
// //       .addCase(fetchNotifications.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
// //       // تعليم واحد كمقروء
// //       .addCase(markAsRead.fulfilled, (state, action) => {
// //         const notif = state.list.find((n) => n?.id === action.payload);
// //         if (notif && notif.status === "unread") {
// //           notif.status = "read";
// //           state.unreadCount = Math.max(0, state.unreadCount - 1);
// //         }
// //       })
// //       // تعليم الكل كمقروء
// //       .addCase(markAllAsRead.fulfilled, (state) => {
// //         state.list.forEach((n) => {
// //           if (n) n.status = "read";
// //         });
// //         state.unreadCount = 0;
// //       })
// //       // التعامل مع الموافقة/الرفض
// //       .addCase(handleNotificationAction.fulfilled, (state, action) => {
// //         const notif = state.list.find((n) => n?.id === action.payload.id);
// //         if (notif) {
// //           notif.actionStatus = action.payload.actionStatus;
// //           if (notif.status === "unread") {
// //             notif.status = "read";
// //             state.unreadCount = Math.max(0, state.unreadCount - 1);
// //           }
// //         }
// //       })
// //       // الربط مع تحديث حالة الأجازة
// //       .addCase(updateLeaveStatus.fulfilled, (state, action) => {
// //         const { id, status } = action.payload;
// //         const relatedNotif = state.list.find(
// //           (n) => n.targetId == id && n.type === "leave",
// //         );

// //         if (relatedNotif) {
// //           if (status === "Approved") {
// //           relatedNotif.actionStatus = "accepted";
// //          } else if (status === "Rejected") {
// //           relatedNotif.actionStatus = "rejected";
// //        } else {
// //            relatedNotif.actionStatus = null; // 👈 ده المهم
// //          }
// //           if (relatedNotif.status === "unread") {
// //             relatedNotif.status = "read";
// //             state.unreadCount = Math.max(0, state.unreadCount - 1);
// //           }
// //         }
// //       });
// //   },
// // });

// // export const { clearNotifications } = notificationSlice.actions;
// // export default notificationSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../services/axios";
// import { updateLeaveStatus } from "../leaveSlice";

// // 1. جلب كل الإشعارات (مع عمل Mapping للداتا)
// export const fetchNotifications = createAsyncThunk(
//   "notifications/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/api/notifications/my-notifications");
      
//       // Data Mapping: عشان تناسب الـ Component بتاعك
//       const mappedNotifications = response.data.data.notifications.map((n) => ({
//         id: n._id,
//         employeeName: n.sender ? `${n.sender.general.firstName} ${n.sender.general.lastName}` : "System",
//         avatar: n.sender ? n.sender.general.avatar : "",
//         title: n.title,
//         message: n.message,
//         type: n.type.toLowerCase(), // تحويل "Leave" لـ "leave"
//         status: n.isRead ? "read" : "unread",
//         isRead: n.isRead,
//         targetId: n.relatedId,
//         time: new Date(n.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }),
//         actionStatus: null, // بيتم التحكم فيها من الـ Components أو حسب البيزنس لوجيك بتاعك
//       }));

//       return mappedNotifications;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch notifications",
//       );
//     }
//   },
// );

// // 2. جلب عدد الإشعارات الغير مقروءة
// export const fetchUnreadCount = createAsyncThunk(
//   "notifications/fetchUnreadCount",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/api/notifications/unread-count");
//       return response.data.data.unreadCount;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch unread count",
//       );
//     }
//   }
// );

// // 3. تعليم إشعار واحد كمقروء (Placeholder جاهز للباك إند)
// export const markAsRead = createAsyncThunk(
//   "notifications/markRead",
//   async (id, { rejectWithValue }) => {
//     try {
//       // TODO: الاندبوينت دي محتاجة تتظبط لما الباك إند يخلصها
//       await axios.patch(`/api/notifications/${id}/read`); 
//       return id;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to mark as read",
//       );
//     }
//   },
// );

// // 4. تعليم كل الإشعارات كمقروءة
// export const markAllAsRead = createAsyncThunk(
//   "notifications/markAllRead",
//   async (_, { rejectWithValue }) => {
//     try {
//       await axios.patch("/api/notifications/mark-all-read");
//       return true;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to mark all as read",
//       );
//     }
//   },
// );

// // 5. التعامل مع الموافقة/الرفض
// export const handleNotificationAction = createAsyncThunk(
//   "notifications/handleAction",
//   async ({ id, actionStatus }, { rejectWithValue }) => {
//     try {
//       // عدل المسار ده لو الباك إند عمله بشكل مختلف
//       await axios.patch(`/api/notifications/${id}/action`, { actionStatus });
//       return { id, actionStatus };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Action failed");
//     }
//   },
// );

// // الـ Slice
// const notificationSlice = createSlice({
//   name: "notifications",
//   initialState: {
//     list: [],
//     loading: false,
//     unreadCount: 0,
//     error: null,
//   },
//   reducers: {
//     clearNotifications: (state) => {
//       state.list = [];
//       state.unreadCount = 0;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // جلب الإشعارات
//       .addCase(fetchNotifications.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload || [];
//       })
//       .addCase(fetchNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // جلب عدد الإشعارات الغير مقروءة
//       .addCase(fetchUnreadCount.fulfilled, (state, action) => {
//         state.unreadCount = action.payload;
//       })

//       // تعليم واحد كمقروء
//       .addCase(markAsRead.fulfilled, (state, action) => {
//         const notif = state.list.find((n) => n?.id === action.payload);
//         if (notif && notif.status === "unread") {
//           notif.status = "read";
//           notif.isRead = true;
//           state.unreadCount = Math.max(0, state.unreadCount - 1);
//         }
//       })

//       // تعليم الكل كمقروء
//       .addCase(markAllAsRead.fulfilled, (state) => {
//         state.list.forEach((n) => {
//           if (n) {
//             n.status = "read";
//             n.isRead = true;
//           }
//         });
//         state.unreadCount = 0;
//       })

//       // التعامل مع الموافقة/الرفض
//       .addCase(handleNotificationAction.fulfilled, (state, action) => {
//         const notif = state.list.find((n) => n?.id === action.payload.id);
//         if (notif) {
//           notif.actionStatus = action.payload.actionStatus;
//           if (notif.status === "unread") {
//             notif.status = "read";
//             notif.isRead = true;
//             state.unreadCount = Math.max(0, state.unreadCount - 1);
//           }
//         }
//       })

//       // الربط مع تحديث حالة الأجازة
//       .addCase(updateLeaveStatus.fulfilled, (state, action) => {
//         const { id, status } = action.payload;
//         const relatedNotif = state.list.find(
//           (n) => n.targetId == id && n.type === "leave",
//         );

//         if (relatedNotif) {
//           if (status === "Approved") {
//             relatedNotif.actionStatus = "accepted";
//           } else if (status === "Rejected") {
//             relatedNotif.actionStatus = "rejected";
//           } else {
//             relatedNotif.actionStatus = null; 
//           }
//           if (relatedNotif.status === "unread") {
//             relatedNotif.status = "read";
//             relatedNotif.isRead = true;
//             state.unreadCount = Math.max(0, state.unreadCount - 1);
//           }
//         }
//       });
//   },
// });

// export const { clearNotifications } = notificationSlice.actions;
// export default notificationSlice.reducer;



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
  );
}


}
);

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
  );
}


}
);

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
      );
    }
  }
);
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
      );
    }
  });


},
});

export const { clearNotifications } =
notificationSlice.actions;

export default notificationSlice.reducer;
