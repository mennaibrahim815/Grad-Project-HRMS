// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");
// const { getDB } = require("../../utils/db");
// const verificationCodes = require("../../utils/authStore"); // استدعاء المخزن المشترك
// require("dotenv").config();

// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const db = getDB();
//     const user = db.HRs.find((u) => u.email === email);
//     if (!user) return res.status(404).json({ message: "Email not found" });

//     const code = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // حفظ الكود في المخزن المشترك
//     verificationCodes[email] = {
//       code: code,
//       timestamp: Date.now(),
//       expiresIn: 10 * 60 * 1000,
//     };

//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     await transporter.sendMail({
//       from: `"Staffly Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Password Reset - Verification Code",
//       html: `<h3>Verification code is: ${code}</h3>` // تقدري تحطي الـ HTML الطويل بتاعك هنا
//     });

//     res.json({ message: "Verification code sent to your email!" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send email. Please try again." });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { getDB } = require("../../utils/db");
const verificationCodes = require("../../utils/authStore");

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDB();
    
    // البحث في المصفوفة الموحدة
    const user = db.employeesFullData.find((u) => u.email === email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = { code, timestamp: Date.now(), expiresIn: 10 * 60 * 1000 };

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Staffly Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Verification Code",
      html: `<h3>Your code is: ${code}</h3>`
    });

    res.json({ message: "Code sent!" });
  } catch (error) { res.status(500).send(); }
});

module.exports = router;