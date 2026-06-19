import dayjs from "dayjs";
import Attendance from "../models/attendance.model.js";
import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const calculateKPI = async (employeeId, startDate, endDate) => {
    // Attendance KPI
    const attendanceRecords = await Attendance.find({
        employeeId,
        date: {
            $gte: startDate.format("YYYY-MM-DD"),
            $lte: endDate.format("YYYY-MM-DD"),
        },
    }).lean();

    let attendanceScore = 100;
    if (attendanceRecords.length > 0) {
        const totalDays = attendanceRecords.length;
        let earnedPoints = 0;

        attendanceRecords.forEach((record) => {
            if (record.status === "On Time") earnedPoints += 100;
            else if (record.status === "Late") earnedPoints += 50;
            else if (record.status === "Absent") earnedPoints += 0;
        });
        attendanceScore = Math.round(earnedPoints / totalDays);
    }

    // Tasks KPI
    const tasks = await Task.find({
        "assignedTo._id": new mongoose.Types.ObjectId(employeeId),
        status: "Completed",
        "general.deadline": {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
        },
    }).lean();

    let taskScore = 0;
    if (tasks.length > 0) {
        let onTimeTasks = 0;

        tasks.forEach((task) => {
            const deadline = dayjs(task.general?.deadline);
            const completedAt = task.completedAt ? dayjs(task.completedAt) : deadline;

            if (completedAt.isBefore(deadline) || completedAt.isSame(deadline, "day")) {
                onTimeTasks++;
            }
        });
        taskScore = Math.round((onTimeTasks / tasks.length) * 100);
    }

    // Overall Calculation
    const overallPerformance = Math.round(attendanceScore * 0.5 + taskScore * 0.5);

    return {
        attendanceScore,
        taskScore,
        overallPerformance
    };
};