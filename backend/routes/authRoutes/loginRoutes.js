// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { getDB } = require("../../utils/db");
// require("dotenv").config();

// const SECRET_KEY = process.env.JWT_SECRET;

// // 1. التأكد من الإيميل
// router.post("/check-email", (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email || !email.includes("@")) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }
//     const db = getDB();
//     const user = db.HRs.find((u) => u.email === email);
//     if (!user) return res.status(404).json({ message: "Email not found" });
//     if (user.role !== "hr")
//       return res
//         .status(403)
//         .json({ message: "Access denied. Only HR can login." });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 2. تسجيل الدخول
// router.post("/login", (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     const db = getDB();
//     const user = db.HRs.find((u) => u.email === email);
//     if (!user) return res.status(404).json({ message: "Email not found" });
//     if (user.password !== password)
//       return res.status(401).json({ message: "Incorrect password" });

//     const token = jwt.sign(
//       { id: user.id, role: user.role, email: user.email },
//       SECRET_KEY,
//       { expiresIn: "2h" },
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         image: user.image || null,
//         avatar: user.avatar || null,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getDB } = require("../../utils/db");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// روت اللوجين الموحد
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    
    // البحث في مصفوفة الموظفين الشاملة
    const user = db.employeesFullData.find((u) => u.email === email);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // هنا الـ role هيرجع HR أو EMPLOYEE
        avatar: user.image || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// روت التأكد من الإيميل الموحد
router.post("/check-email", (req, res) => {
  const { email } = req.body;
  const db = getDB();
  const user = db.employeesFullData.find((u) => u.email === email);
  
  if (!user) return res.status(404).json({ message: "Email not found" });
  res.json({ success: true });
});

module.exports = router;