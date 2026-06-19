// const express = require("express");
// const router = express.Router();
// const db = require("../data/db.json");

// // هنا هننقل الاند بوينتس بعد شوية

// // router.get("/search-hiring", (req, res) => {
// //   const q = (req.query.query || "").toLowerCase();
// //   res.json(db.jobApplicants.filter(a => a.name.toLowerCase().includes(q)));
// // });
// // تأكدي إن فيه الروت ده عشان fetchAllApplicants يشتغل
// router.get("/", (req, res) => {
//   res.json(db.jobApplicants); // إرجاع كل المتقدمين
// });

// // روت البحث
// router.get("/search", (req, res) => {
//   const q = (req.query.query || "").toLowerCase();
//   res.json(db.jobApplicants.filter(a => a.name.toLowerCase().includes(q)));
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB } = require("../utils/db");

// ============================================
// 1. جلب كل المتقدمين للوظائف
// ============================================
router.get("/", (req, res) => {
  try {
    const db = getDB();
    res.json(db.jobApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
});

// ============================================
// 2. البحث في المتقدمين
// ============================================
router.get("/search", (req, res) => {
  try {
    const db = getDB();
    const q = (req.query.query || "").toLowerCase().trim();

    if (!q) {
      return res.json([]);
    }

    const results = db.jobApplicants.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q),
    );

    res.json(results);
  } catch (error) {
    console.error("Applicant search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
