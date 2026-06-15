// const express = require("express");
// const router = express.Router();
// const db = require("../data/db.json");

// // هنا هننقل الاند بوينتس بعد شوية

// // ============================================
// // ============ projects ====================
// // ============================================
// // ب. جلب كل المشاريع
// router.get("/projects", (req, res) => {
//   const processed = db.tasksData.map(task => ({
//     ...task,
//     members: (task.memberIds || []).map(mId => {
//       const emp = db.employeesFullData.find(e => e.id === mId);
//       return { id: mId, image: emp ? emp.image : "" };
//     })
//   }));
//   res.json(processed);
// });

// router.get("/search-projects", (req, res) => {
//   const q = (req.query.query || "").toLowerCase();
//   res.json(db.tasksData.filter(t => t.title.toLowerCase().includes(q)));
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB } = require("../utils/db");

// ============================================
// 1. جلب كل المشاريع
// ============================================
router.get("/", (req, res) => {
  try {
    const db = getDB();

    const processed = db.tasksData.map((task) => ({
      ...task,
      members: (task.memberIds || []).map((mId) => {
        const emp = db.employeesFullData.find((e) => e.id === mId);
        return {
          id: mId,
          image: emp ? emp.image : "",
        };
      }),
    }));

    res.json(processed);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// ============================================
// 2. البحث في المشاريع
// ============================================
router.get("/search", (req, res) => {
  try {
    const db = getDB();
    const q = (req.query.query || "").toLowerCase().trim();

    if (!q) {
      return res.json([]);
    }

    const results = db.tasksData
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((task) => ({
        ...task,
        members: (task.memberIds || []).map((mId) => {
          const emp = db.employeesFullData.find((e) => e.id === mId);
          return { id: mId, image: emp ? emp.image : "" };
        }),
      }));

    res.json(results);
  } catch (error) {
    console.error("Project search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
