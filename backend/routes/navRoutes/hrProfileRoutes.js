// const express = require("express");
// const router = express.Router();
// const db = require("../../data/db.json");
// const verifyToken = require("../../middleware/auth");

// // الروت ده خاص بيكي إنتِ بس (بروفايل الـ HR اللي فاتح)
// router.get("/me", verifyToken, (req, res) => {
//   const loggedInId = req.userId;
//   // بنجيب الداتا من مصفوفة الموظفين بس برابط (Endpoint) مختلف تماماً
//   const profile = db.employeesFullData.find((e) => e.id == loggedInId);

//   if (!profile)
//     return res.status(404).json({ message: "HR Profile not found" });
//   res.json(profile);
// });

// // router.get("/me", verifyToken, (req, res) => {
// //   const loggedInId = req.userId;
// //   const profile = db.employeesFullData.find(e => e.id == loggedInId);

// //   if (!profile) return res.status(404).json({ message: "HR Profile not found" });
// //   res.json(profile);
// // });
// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB } = require("../../utils/db");
const verifyToken = require("../../middleware/auth");

// ============================================
// جلب بروفايل الـ HR الحالي (المسجل دخوله)
// ============================================
router.get("/me", verifyToken, (req, res) => {
  try {
    const loggedInId = req.userId; // الـ ID من التوكن
    const db = getDB();

    // البحث في بيانات الموظفين
    const profile = db.employeesFullData.find((e) => e.id === loggedInId);

    if (!profile) {
      return res.status(404).json({
        message: "HR Profile not found in employees database",
      });
    }

    res.json(profile);
  } catch (error) {
    // console.error("Error fetching HR profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

module.exports = router;
