// // const express = require('express');
// // const cors = require('cors');
// // const authRoutes = require('./routes/authRoutes');
// // const hrRoutes = require('./routes/hrRoutes');

// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // // ربط المسارات المنظمة
// // app.use('/api/auth', authRoutes);
// // app.use('/api/hr', hrRoutes);

// // const PORT = 5000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Master Server running on http://localhost:${PORT}`);
// //   console.log(`📡 Endpoints: /api/auth and /api/hr`);
// // });

// // backend/server.js
// require("dotenv").config(); // استدعاء دوت إنف في أول سطر خالص

// const express = require("express");
// const cors = require("cors");

// // استدعاء كل الملفات المنفصلة
// const authRoutes = require("./routes/authRoutes/hrAuthRoutes");
// const employeeRoutes = require("./routes/employeeRoutes");
// const leaveRoutes = require("./routes/leaveRoutes");
// const projectRoutes = require("./routes/projectRoutes");
// const notificationRoutes = require("./routes/navRoutes/notificationRoutes");
// const dashboardRoutes = require("./routes/mainDashboard/dashboardRoutes");
// const hiringRoutes = require("./routes/hiringRoute");
// const searchRoutes = require("./routes/navRoutes/searchRoutes");
// const hrProfileRoutes = require("./routes/navRoutes/hrProfileRoutes");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ربط كل موديول بمسار (Path) خاص بيه
// app.use("/api/auth", authRoutes);
// app.use("/api/employees", employeeRoutes);
// app.use("/api/leaves", leaveRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/hiring", hiringRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/hr-profile", hrProfileRoutes);

// // const PORT = 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




// // استخدام البورت من الملف أو 5000 كديفولت
// const PORT = process.env.PORT || 5000; 
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ✅ تحميل المتغيرات من .env

// ============================================
// استدعاء كل الـ Routes
// ============================================
const loginRoutes = require("./routes/authRoutes/loginRoutes");
const forgotPasswordRoutes = require("./routes/authRoutes/forgotPasswordRoutes");
const verifyCodeRoutes = require("./routes/authRoutes/verifyCodeRoutes");

const notificationRoutes = require("./routes/navRoutes/notificationRoutes");
const searchRoutes = require("./routes/navRoutes/searchRoutes");
const hrProfileRoutes = require("./routes/navRoutes/hrProfileRoutes");

const dashboardRoutes = require("./routes/mainDashboard/dashboardRoutes");

const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const projectRoutes = require("./routes/projectRoutes");
const hiringRoutes = require("./routes/hiringRoute");
const attendanceRoutes = require("./routes/attendance");
// ============================================
// إعداد الـ App
// ============================================
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ============================================
// ربط الـ Routes
// ============================================
app.use("/api/auth", loginRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/auth", verifyCodeRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hr-profile", hrProfileRoutes);

app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/hiring", hiringRoutes);
app.use("/api/attendance", attendanceRoutes);


app.use((req, res) => {
  res.status(404).json({ 
    message: "Endpoint not found",
    requestedUrl: req.url,
    method: req.method
  });
});

// ============================================
// Health Check Endpoint
// ============================================
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Staffly Backend API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      employees: "/api/employees",
      leaves: "/api/leaves",
      projects: "/api/projects",
      hiring: "/api/hiring",
      dashboard: "/api/dashboard",
      notifications: "/api/notifications",
      search: "/api/search",
      hrProfile: "/api/hr-profile"
    }
  });
});



app.use("/api/auth", loginRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/auth", verifyCodeRoutes);
// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    message: "Endpoint not found",
    requestedUrl: req.url,
    method: req.method
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ============================================
// بدء السيرفر
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Staffly Backend Server Started!");
  console.log("=".repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log("=".repeat(50) + "\n");
});

module.exports = app;