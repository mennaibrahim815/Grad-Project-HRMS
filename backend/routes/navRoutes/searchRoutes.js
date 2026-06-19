// const express = require("express");
// const router = express.Router();
// const db = require("../../data/db.json");

// router.get("/", (req, res) => {
//   const { query, type } = req.query;
//   const q = (query || "").toLowerCase();
//   let results = [];

//   if (!q) return res.json([]);

//   switch (type) {
//     case "employees":
//       results = db.employeesFullData.filter((e) =>
//         e.name.toLowerCase().includes(q),
//       );
//       break;

//     case "projects":
//       results = db.tasksData
//         .filter((t) => t.title.toLowerCase().includes(q))
//         .map((t) => ({
//           ...t,
//           name: t.title, // توحيد الاسم للعرض
//           position: t.status,
//         }));
//       break;

//     case "hiring":
//       results = db.jobApplicants
//         .filter((a) => a.name.toLowerCase().includes(q))
//         .map((a) => ({
//           ...a,
//           position: a.role,
//         }));
//       break;

//     case "leave":
//       results = db.leavesData
//         .filter((l) => {
//           const emp = db.employeesFullData.find((e) => e.id === l.employeeId);
//           return (
//             emp?.name.toLowerCase().includes(q) ||
//             l.type.toLowerCase().includes(q)
//           );
//         })
//         .map((l) => {
//           const emp = db.employeesFullData.find((e) => e.id === l.employeeId);
//           return {
//             id: l.id,
//             name: emp ? emp.name : "Unknown",
//             avatar: emp ? emp.image : null,
//             position: `${l.type} - ${l.status}`,
//           };
//         });
//       break;

//     default:
//       results = [];
//   }

//   res.json(results);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getDB } = require("../../utils/db");

// ============================================
// البحث الموحد في كل الأقسام
// ============================================
router.get("/", (req, res) => {
  try {
    const { query, type } = req.query;
    const q = (query || "").toLowerCase().trim();

    // Validation
    if (!q) {
      return res.json([]);
    }

    if (!type) {
      return res.status(400).json({
        message: "Search type is required (employees, projects, hiring, leave)",
      });
    }

    const db = getDB();
    let results = [];

    switch (type) {
      case "employees":
        results = db.employeesFullData
          .filter((e) => e.name.toLowerCase().includes(q))
          .map((e) => ({
            id: e.id,
            name: e.name,
            position: e.position,
            image: e.image,
            type: "employee",
          }));
        break;

      case "projects":
        results = db.tasksData
          .filter((t) => t.title.toLowerCase().includes(q))
          .map((t) => ({
            id: t.id,
            name: t.title,
            position: t.status,
            desc: t.desc,
            type: "project",
          }));
        break;

      case "hiring":
        results = db.jobApplicants
          .filter((a) => a.name.toLowerCase().includes(q))
          .map((a) => ({
            id: a.id,
            name: a.name,
            position: a.role,
            image: a.image,
            status: a.status,
            type: "applicant",
          }));
        break;

      case "leave":
        results = db.leavesData
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
              id: l.id,
              name: emp ? emp.name : "Unknown",
              avatar: emp ? emp.image : null,
              position: `${l.type} - ${l.status}`,
              type: "leave",
            };
          });
        break;

      default:
        return res.status(400).json({
          message: "Invalid search type",
        });
    }

    res.json(results);
  } catch (error) {
    // console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
