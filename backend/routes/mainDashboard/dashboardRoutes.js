const express = require("express");
const router = express.Router();
const { getDB } = require("../../utils/db");

// دالة مساعدة: حساب الأيام من تاريخ معين
const calculateDaysAgo = (dateString) => {
  const diffInMs = new Date() - new Date(dateString);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays > 0 ? `${diffInDays}d` : "Today";
};

// محرك التحليلات (Analytics Engine)
const runAnalytics = (filterDate) => {
  try {
    const db = getDB();
    const targetDate = new Date(filterDate);

    // الموظفين النشطين حتى التاريخ المحدد
    const activeEmps = db.employeesFullData.filter(
      (e) => new Date(e.joined) <= targetDate,
    );
    const totalCount = activeEmps.length;

    // 1. بيانات الشارت (آخر 6 أيام)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const loopDate = new Date(targetDate);
      loopDate.setDate(loopDate.getDate() - i);
      const dateStr = loopDate.toISOString().split("T")[0];
      const dayLabel = loopDate.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });

      const dayLogs = db.attendanceRecords.filter(
        (log) => log.date === dateStr,
      );

      const onTime = dayLogs.filter(
        (l) => l.status.toLowerCase() === "on-time",
      ).length;
      const late = dayLogs.filter(
        (l) => l.status.toLowerCase() === "late",
      ).length;
      const absent = dayLogs.filter(
        (l) => l.status.toLowerCase() === "absent",
      ).length;

      chartData.push({ name: dayLabel, onTime, late, absent });
    }

    // 2. معالجة المهام (إضافة الصور والوقت)
    // const processedTasks = db.tasksData.map((task) => ({
    //   ...task,
    //   timeAgo: calculateDaysAgo(task.createdAt || filterDate),
    //   members: (task.memberIds || []).map((mId) => {
    //     const emp = db.employeesFullData.find((e) => e.id === mId);
    //     return { id: mId, image: emp ? emp.image : "" };
    //   }),
    // }));

    // ✅ معالجة التاسكات (حساب الأعداد من المصفوفات)
    const processedTasks = db.tasksData.map((task) => ({
      ...task,
      timeAgo: calculateDaysAgo(task.createdAt || filterDate),

      // حساب عدد التعليقات والملحقات بناءً على طول المصفوفة (Array Length)
      commentsCount: (task.comments || []).length,
      attachmentsCount: (task.attachments || []).length,

      members: (task.memberIds || []).map((mId) => {
        const emp = db.employeesFullData.find((e) => e.id === mId);
        return { id: mId, image: emp ? emp.image : "" };
      }),
    }));

    // 3. حساب نسب حالة الموظفين
    const getPercent = (type) => {
      if (totalCount === 0) return 0;
      return Math.round(
        (activeEmps.filter((e) => e.type === type).length / totalCount) * 100,
      );
    };

    // 4. حساب إجمالي الرواتب
    const totalPayroll = activeEmps.reduce(
      (sum, e) => sum + (e.salary || 0),
      0,
    );

    return {
      stats: {
        employees: {
          value: totalCount.toLocaleString(),
          change: "+3.5%",
          up: true,
        },
        applicants: {
          value: db.jobApplicants.length.toString(),
          change: "-2%",
          up: false,
        },
        payroll: {
          value: `$${totalPayroll.toLocaleString()}`,
          change: "+32%",
          up: true,
        },
      },
      attendanceReport: {
        stats: {
          onTime: db.attendanceRecords.filter(
            (l) => l.date === filterDate && l.status === "On-time",
          ).length,
          late: db.attendanceRecords.filter(
            (l) => l.date === filterDate && l.status === "Late",
          ).length,
          absent: db.attendanceRecords.filter(
            (l) => l.date === filterDate && l.status === "absent",
          ).length,
        },
        chartData: chartData,
      },
      employeeStatus: [
        { name: "Permanent", value: getPercent("Permanent"), color: "#3b82f6" },
        { name: "Contract", value: getPercent("Contract"), color: "#10b981" },
        { name: "Part-time", value: getPercent("Part-time"), color: "#4b5563" },
      ],
      taskSummary: processedTasks,
      recentApplicants: db.jobApplicants,
    };
  } catch (err) {
    console.error("Analytics Error:", err);
    throw err;
  }
};

// API Endpoint: جلب تحليلات الداشبورد
router.get("/analytics", (req, res) => {
  try {
    const { date } = req.query;
    const filterDate = date || new Date().toISOString().split("T")[0];

    const analytics = runAnalytics(filterDate);
    res.json(analytics);
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({
      message: "Failed to generate analytics",
      error: error.message,
    });
  }
});

module.exports = router;
