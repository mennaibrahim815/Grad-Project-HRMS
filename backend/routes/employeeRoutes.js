// // // const express = require("express");
// // // const router = express.Router();
// // // const db = require("../data/db.json");

// // // // هنا هننقل الاند بوينتس بعد شوية

// // // router.get("/search-employees", (req, res) => {
// // //   const q = (req.query.query || "").toLowerCase();
// // //   res.json(
// // //     db.employeesFullData.filter((e) => e.name.toLowerCase().includes(q)),
// // //   );
// // // });

// // // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const db = require("../data/db.json"); // التأكد من استدعاء الداتا

// // // 1. بروفايل الـ HR الحالي
// // router.get("/profile", (req, res) => {
// //   const hr = db.HRs[0]; // السحب من db.json
// //   res.json(hr);
// // });

// // // 2. تفاصيل موظف بالـ ID (Aggregation logic)
// // router.get("/employees/:id", (req, res) => {
// //   const id = req.params.id;

// //   // البحث في الموظفين داخل db.json
// //   const empBase =
// //     db.employeesFullData.find((e) => e.id === id) || db.employeesFullData[0];

// //   // فلترة الحضور من db.json
// //   const attendance = db.attendanceRecords.filter(
// //     (log) => log.employeeId === empBase.id,
// //   );

// //   // فلترة المهام من db.json
// //   const hisTasks = db.tasksData.filter((t) => t.memberIds.includes(empBase.id));

// //   res.json({
// //     ...empBase,
// //     attendanceHistory: attendance,
// //     totalTimeWorked: { hours: 132, min: 12, active: 75, pause: 15, extra: 10 },
// //     projects: hisTasks,
// //   });
// // });

// // // 3. بحث الموظفين
// // router.get("/search-employees", (req, res) => {
// //   const q = (req.query.query || "").toLowerCase();
// //   res.json(
// //     db.employeesFullData.filter((e) => e.name.toLowerCase().includes(q)),
// //   );
// // });

// // module.exports = router;

// // backend/routes/employeeRoutes.js
// const express = require("express");
// const router = express.Router();
// const db = require("../data/db.json");

// // 1. بروفايل الـ HR (العنوان: /api/employees/profile)
// // router.get("/profile", (req, res) => {
// //   const hr = db.HRs[0];
// //   res.json(hr);
// // });

// // const jwt = require("jsonwebtoken");

// // const verifyToken = (req, res, next) => {
// //   const token = req.headers["authorization"]?.split(" ")[1];
// //   if (!token) return res.status(403).json({ message: "No token provided" });

// //   jwt.verify(token, "hr_dashboard_secret", (err, decoded) => {
// //     if (err) return res.status(401).json({ message: "Unauthorized" });
// //     req.userId = decoded.id; // بنحفظ الـ ID عشان نستخدمه في الروت اللي جاي
// //     next();
// //   });
// // };
// // // استدعي الميدل وير فوق
// // router.get("/profile", verifyToken, (req, res) => {
// //   const loggedInId = req.userId; // الـ ID اللي فكيناه من التوكن

//   // بنروح ندور في مصفوفة الموظفين الكبيرة مباشرة
// //   const fullProfile = db.employeesFullData.find(e => e.id == loggedInId);

// //   if (!fullProfile) {
// //     return res.status(404).json({ message: "Profile data not found in employees database" });
// //   }

// //   res.json(fullProfile);
// // });
// // 2. تفاصيل موظف (العنوان: /api/employees/:id)
// // شلنا كلمة /employees/ المكررة من الـ Route نفسه
// router.get("/:id", (req, res) => {
//   const id = req.params.id;
//   const empBase = db.employeesFullData.find((e) => e.id === id) || db.employeesFullData[0];
//   const attendance = db.attendanceRecords.filter((log) => log.employeeId === empBase.id);
//   const hisTasks = db.tasksData.filter((t) => t.memberIds.includes(empBase.id));

//   res.json({
//     ...empBase,
//     attendanceHistory: attendance,
//     totalTimeWorked: { hours: 132, min: 12, active: 75, pause: 15, extra: 10 },
//     projects: hisTasks,
//   });
// });

// // 3. البحث (العنوان: /api/employees/search)
// router.get("/search", (req, res) => {
//   const q = (req.query.query || "").toLowerCase();
//   res.json(db.employeesFullData.filter((e) => e.name.toLowerCase().includes(q)));
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB, saveDB } = require("../utils/db");

// ⚠️ CRITICAL: Static routes MUST come BEFORE dynamic routes!

// ============================================
// 1. البحث في الموظفين (Static Route)
// ============================================
router.get("/search", (req, res) => {
  try {
    const db = getDB();
    const q = (req.query.query || "").toLowerCase().trim();

    if (!q) {
      return res.json([]);
    }

    const results = db.employeesFullData.filter((e) =>
      e.name.toLowerCase().includes(q),
    );

    res.json(results);
  } catch (error) {
    console.error("Employee search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// ============================================
// 2. تفاصيل موظف معين (Dynamic Route - في الآخر!)
// ============================================
router.get("/:id/summary", (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    // البحث عن الموظف
    const empBase = db.employeesFullData.find((e) => e.id === id);

    if (!empBase) {
      return res.status(404).json({
        message: `Employee with ID ${id} not found`,
      });
    }

    // جلب سجلات الحضور
    const attendance = db.attendanceRecords.filter(
      (log) => log.employeeId === empBase.id,
    );
    // جلب ساعات العمل
   const totalTimeWorked = db.totalTimeWorked.find(
  (log) => log.employeeId === empBase.id  || {},
);

    // جلب المهام المرتبطة
    const hisTasks = db.EmployeeprojectsData.filter((t) =>
      t.employeeId.includes(empBase.id),
    );
      //  نجيب رصيد الإجازات
    const balance = db.leaveBalances.find(
      (b) => b.employeeId === id
    );

    // إرجاع البيانات المجمعة
    res.json({
      ...empBase,
      attendanceHistory: attendance,
      totalTimeWorked:totalTimeWorked,
      projects: hisTasks,
      leaveBalance: balance,
    });
  } catch (error) {
    console.error("Employee details error:", error);
    res.status(500).json({ message: "Failed to fetch employee details" });
  }
});
// ============================================
// 3. تعديل بيانات موظف
// ============================================
router.patch("/:id", (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const updatedData = req.body;

    // نجيب مكان الموظف في المصفوفة
    const employeeIndex = db.employeesFullData.findIndex(
      (e) => e.id === id
    );

    if (employeeIndex === -1) {
      return res.status(404).json({
        message: `Employee with ID ${id} not found`,
      });
    }

    // ندمج البيانات القديمة بالجديدة
    db.employeesFullData[employeeIndex] = {
      ...db.employeesFullData[employeeIndex],
      ...updatedData,
    };

    // 🔥 نحفظ في db.json فعليًا
    saveDB(db);

    res.json(db.employeesFullData[employeeIndex]);
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

module.exports = router;

