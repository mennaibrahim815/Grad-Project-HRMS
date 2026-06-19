const express = require("express");
const router = express.Router();
const { getDB } = require("../utils/db");

// ============================================
// GET /attendance?date=YYYY-MM-DD
// جلب جدول الحضور ليوم واحد
// ============================================

router.get("/", (req, res) => {
  try {
    const db = getDB();
    const { date } = req.query;

    // لو مفيش تاريخ، نستخدم تاريخ اليوم
    const filterDate =
      date || new Date().toISOString().split("T")[0];

    // نجيب كل الموظفين
    const employees = db.employeesFullData;

    // ندمج بيانات الموظفين مع سجل الحضور
    const dailyAttendance = employees.map((emp) => {
      const record = db.attendanceRecords.find(
        (log) =>
          log.employeeId === emp.id &&
          log.date === filterDate
      );

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        type: emp.type,
        date: filterDate,
        attendance: record ? record.status : "Absent",
        image: emp.image
      };
    });

    res.json(dailyAttendance);
  } catch (error) {
    console.error("Attendance Route Error:", error);
    res.status(500).json({
      message: "Failed to fetch daily attendance",
    });
  }
});
// ============================================
// GET /attendance?date=YYYY-MM-DD
//  جلب تحليل الحضور الشهري للموظفين
// ============================================

const getMonthlyAttendance = (req, res) => {
  try {
    const db = getDB();
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const targetDate = new Date(year, month - 1);

    const chartData = [];
    let totalOnTime = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    for (let i = 5; i >= 0; i--) {
      const loopDate = new Date(targetDate);
      loopDate.setMonth(loopDate.getMonth() - i);

      const loopMonth = loopDate.getMonth();
      const loopYear = loopDate.getFullYear();

      const monthLabel = loopDate.toLocaleDateString("en-US", {
        month: "short",
      });

      const monthLogs = db.attendanceRecords.filter((log) => {
        const logDate = new Date(log.date);
        return (
          logDate.getMonth() === loopMonth &&
          logDate.getFullYear() === loopYear
        );
      });

      const onTime = monthLogs.filter(
        (l) => l.status.toLowerCase() === "on-time"
      ).length;

      const late = monthLogs.filter(
        (l) => l.status.toLowerCase() === "late"
      ).length;

      const absent = monthLogs.filter(
        (l) => l.status.toLowerCase() === "absent"
      ).length;

      totalOnTime += onTime;
      totalLate += late;
      totalAbsent += absent;

      chartData.push({
        name: monthLabel,
        onTime,
        late,
        absent,
      });
    }

    res.json({
      totals: {
        onTime: totalOnTime,
        late: totalLate,
        absent: totalAbsent,
      },
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly analytics" });
  }
};

router.get("/monthly", getMonthlyAttendance);
module.exports = router;
