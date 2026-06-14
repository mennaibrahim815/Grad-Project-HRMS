// const express = require("express");
// const router = express.Router();
// const db = require("../data/db.json");

// // هنا هننقل الاند بوينتس بعد شوية

// // ============================================
// // ============ leaves ====================
// // ============================================
// // ج. جلب كل الأجازات
// router.get("/leaves", (req, res) => {
//   const enriched = db.leavesData.map(leave => {
//     const emp = db.employeesFullData.find(e => e.id === leave.employeeId);
//     return { ...leave, employeeName: emp ? emp.name : "Unknown", avatar: emp ? emp.image : null };
//   });
//   res.json(enriched);
// });

// router.get("/search-leaves", (req, res) => {
//   const q = (req.query.query || "").toLowerCase();
//   const filtered = db.leavesData.filter(l => {
//     const emp = db.employeesFullData.find(e => e.id === l.employeeId);
//     return emp?.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q);
//   }).map(l => ({
//     ...l,
//     employeeName: db.employeesFullData.find(e => e.id === l.employeeId)?.name
//   }));
//   res.json(filtered);
// });

// // 2. تحديث حالة طلب الأجازة من صفحة الـ Leaves (الربط العكسي)
// router.patch("/leaves/:id/status", (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body; // 'Approved' or 'Rejected'

//   const leave = db.leavesData.find(l => l.id === parseInt(id));
//   if (leave) {
//     leave.status = status;

//     // أهم جزء: بنحدث الإشعار المرتبط بالأجازة دي عشان يظهر التغيير في الناف بار
//     const relatedNotif = db.notifications.find(n => n.targetId === leave.id && n.type === 'leave');
//     if (relatedNotif) {
//       relatedNotif.actionStatus = (status === 'Approved' ? 'accepted' : 'rejected');
//       relatedNotif.status = 'read';
//     }

//     res.json({ success: true, id: parseInt(id), status });
//   } else {
//     res.status(404).json({ message: "Leave request not found" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB, saveDB } = require("../utils/db");

// ============================================
// 1. جلب كل الأجازات
// ============================================
router.get("/", (req, res) => {
  try {
    const db = getDB();

    const enriched = db.leavesData.map((leave) => {
      const emp = db.employeesFullData.find((e) => e.id === leave.employeeId);
      return {
        ...leave,
        employeeName: emp ? emp.name : "Unknown",
        avatar: emp ? emp.image : null,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
});

// ============================================
// 2. البحث في الأجازات
// ============================================
router.get("/search-leaves", (req, res) => {
  try {
    const db = getDB();
    const q = (req.query.query || "").toLowerCase().trim();

    if (!q) {
      return res.json([]);
    }

    const filtered = db.leavesData
      .filter((l) => {
        const emp = db.employeesFullData.find((e) => e.id === l.employeeId);
        return (
          emp?.name.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q)
        );
      })
      .map((l) => {
        const emp = db.employeesFullData.find((e) => e.id === l.employeeId);
        return {
          ...l,
          employeeName: emp ? emp.name : "Unknown",
          avatar: emp ? emp.image : null,
        };
      });

    res.json(filtered);
  } catch (error) {
    console.error("Leave search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// ============================================
// 3. تحديث حالة طلب الأجازة
// ============================================
router.patch("/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: Approved, Rejected, or Pending",
      });
    }

    const db = getDB();
    const leave = db.leavesData.find((l) => l.id === parseInt(id));

    if (!leave) {
      return res.status(404).json({
        message: `Leave request with ID ${id} not found`,
      });
    }

    // تحديث حالة الأجازة
    leave.status = status;

    // تحديث الإشعار المرتبط
    const relatedNotif = db.notifications.find(
      (n) => n.targetId === leave.id && n.type === "leave",
    );

    if (relatedNotif) {
      relatedNotif.actionStatus =
        status === "Approved" ? "accepted" : "rejected";
      relatedNotif.status = "read";
    }

    // ✅ حفظ التعديلات في الملف
    saveDB(db);

    res.json({
      success: true,
      id: parseInt(id),
      status,
      message: `Leave request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Failed to update leave status" });
  }
});

module.exports = router;

