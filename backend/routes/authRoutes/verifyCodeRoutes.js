// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { getDB } = require("../../utils/db");
// const verificationCodes = require("../../utils/authStore"); // استدعاء المخزن المشترك
// require("dotenv").config();

// const SECRET_KEY = process.env.JWT_SECRET;

// router.post("/verify-code", (req, res) => {
//   try {
//     const { email, code } = req.body;
//     if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

//     const storedData = verificationCodes[email];
//     if (!storedData) return res.status(400).json({ message: "No verification code found" });

//     const now = Date.now();
//     if (now - storedData.timestamp > storedData.expiresIn) {
//       delete verificationCodes[email];
//       return res.status(400).json({ message: "Code expired" });
//     }

//     if (storedData.code !== code) return res.status(400).json({ message: "Invalid code" });

//     const db = getDB();
//     const user = db.HRs.find((u) => u.email === email);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: "2h" });
//     delete verificationCodes[email];

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
const verificationCodes = require("../../utils/authStore");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const storedData = verificationCodes[email];

  if (!storedData || storedData.code !== code) return res.status(400).json({ message: "Invalid code" });

  const db = getDB();
  const user = db.employeesFullData.find((u) => u.email === email);
  
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "2h" });
  delete verificationCodes[email];

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.image || null,
    },
  });
});

module.exports = router;