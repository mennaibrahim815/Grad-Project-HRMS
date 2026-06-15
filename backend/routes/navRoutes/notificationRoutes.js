// const express = require("express");
// const router = express.Router();
// const db = require("../../data/db.json");

// // ============================================
// // ============ notifications ====================
// // ============================================
// // د. جلب الإشعارات
// router.get("/notifications", (req, res) => {
//   const detailed = db.notifications.map((notif) => {
//     const emp = db.employeesFullData.find((e) => e.id === notif.employeeId);
//     return {
//       ...notif,
//       employeeName: emp ? emp.name : "System",
//       avatar: emp ? emp.image : null,
//     };
//   });
//   res.json(detailed);
// });

// // --- [ 4. مسارات التحديث (Patch) ] ---
// // 1. تحديث حالة الإجراء من داخل الإشعار (Accept/Reject)
// router.patch("/notifications/:id/action", (req, res) => {
//   const { id } = req.params;
//   const { actionStatus } = req.body; // 'accepted' or 'rejected'

//   const notif = db.notifications.find((n) => n.id === parseInt(id));
//   if (notif) {
//     notif.actionStatus = actionStatus;
//     notif.status = "read"; // يتحول لمقروء بمجرد اتخاذ إجراء

//     // اختيارياً: لو الإشعار مرتبط بأجازة (targetId)، نحدث حالة الأجازة هي كمان
//     if (notif.type === "leave" && notif.targetId) {
//       const leave = db.leavesData.find((l) => l.id === notif.targetId);
//       if (leave) {
//         leave.status = actionStatus === "accepted" ? "Approved" : "Rejected";
//       }
//     }

//     res.json({ success: true, notif });
//   } else {
//     res.status(404).json({ message: "Notification not found" });
//   }
// });

// // 3. تعليم إشعار واحد كمقروء (عند الضغط عليه أو على علامة الصح)
// router.patch("/notifications/:id/read", (req, res) => {
//   const id = parseInt(req.params.id);
//   const notif = db.notifications.find((n) => n.id === id);
//   if (notif) {
//     notif.status = "read";
//     res.json({ success: true, id });
//   } else {
//     res.status(404).json({ message: "Notification not found" });
//   }
// });

// // 4. تعليم كل الإشعارات كمقروءة (Mark all as read)
// router.patch("/notifications/read-all", (req, res) => {
//   db.notifications.forEach((n) => (n.status = "read"));
//   res.json({ success: true });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB, saveDB } = require("../../utils/db");

// ============================================
// جلب كل الإشعارات
// ============================================
router.get("/", (req, res) => {
  try {
    const db = getDB();

    const detailed = db.notifications.map((notif) => {
      const emp = db.employeesFullData.find((e) => e.id === notif.employeeId);
      return {
        ...notif,
        employeeName: emp ? emp.name : "System",
        avatar: emp ? emp.image : null,
      };
    });

    res.json(detailed);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// ============================================
// تحديث حالة الإجراء (Accept/Reject)
// ============================================
// router.patch("/notifications/:id/action", (req, res) => {
//   const { id } = req.params;
//   const { actionStatus } = req.body; // 'accepted' or 'rejected'

//   const notif = db.notifications.find((n) => n.id === parseInt(id));
//   if (notif) {
//     notif.actionStatus = actionStatus;
//     notif.status = "read"; // يتحول لمقروء بمجرد اتخاذ إجراء

//     // اختيارياً: لو الإشعار مرتبط بأجازة (targetId)، نحدث حالة الأجازة هي كمان
//     if (notif.type === "leave" && notif.targetId) {
//       const leave = db.leavesData.find((l) => l.id === notif.targetId);
//       if (leave) {
//         leave.status = actionStatus === "accepted" ? "Approved" : "Rejected";
//       }
//     }

//     res.json({ success: true, notif });
//   } else {
//     res.status(404).json({ message: "Notification not found" });
//   }
// });

router.patch("/:id/action", (req, res) => {
  try {
    const { id } = req.params;
    const { actionStatus } = req.body;

    // Validation
    if (!["accepted", "rejected"].includes(actionStatus)) {
      return res.status(400).json({
        message: "Invalid actionStatus. Must be 'accepted' or 'rejected'",
      });
    }

    const db = getDB();
    const notif = db.notifications.find((n) => n.id === parseInt(id));

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // تحديث الإشعار
    notif.actionStatus = actionStatus;
    notif.status = "read";

    // تحديث الأجازة المرتبطة إذا كان الإشعار خاص بأجازة
    if (notif.type === "leave" && notif.targetId) {
      const leave = db.leavesData.find((l) => l.id === notif.targetId);
      if (leave) {
        leave.status = actionStatus === "accepted" ? "Approved" : "Rejected";
      }
    }

    // ✅ حفظ التعديلات في الملف
    saveDB(db);

    res.json({
      success: true,
      notification: notif,
    });
  } catch (error) {
    console.error("Error updating notification action:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// ============================================
// تعليم إشعار واحد كمقروء
// ============================================
router.patch("/:id/read", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = getDB();

    const notif = db.notifications.find((n) => n.id === id);
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notif.status = "read";

    // ✅ حفظ التعديل
    saveDB(db);

    res.json({ success: true, id });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// ============================================
// تعليم كل الإشعارات كمقروءة
// ============================================
router.patch("/read-all", (req, res) => {
  try {
    const db = getDB();

    db.notifications.forEach((n) => (n.status = "read"));

    // ✅ حفظ التعديل
    saveDB(db);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
});

module.exports = router;
