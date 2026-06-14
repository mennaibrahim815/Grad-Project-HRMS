import Attendance from "../models/attendance.model.js";
import Task from "../models/task.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import mongoose from "mongoose";
import appErrors from "../utils/errors.js";
import dayjs from "dayjs";

export const getEmployeePerformance = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;

    const startDate = req.query.startDate
        ? dayjs(req.query.startDate)
        : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    //Attendance KPI
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

    //Tasks KPI
    const tasks = await Task.find({
        "assignedTo._id": new mongoose.Types.ObjectId(employeeId),
        status: "Completed",
        "general.deadline": {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
        },
    }).lean();
    //100
    let taskScore = 0;
    if (tasks.length > 0) {
        let onTimeTasks = 0;

        tasks.forEach((task) => {
            const deadline = dayjs(task.general?.deadline);
            const completedAt = task.completedAt
                ? dayjs(task.completedAt)
                : deadline;

            if (
                completedAt.isBefore(deadline) ||
                completedAt.isSame(deadline, "day")
            ) {
                onTimeTasks++;
            }
        });
        taskScore = Math.round((onTimeTasks / tasks.length) * 100);
    }

    //Overall Calculation
    const overallPerformance = Math.round(
        attendanceScore * 0.5 + taskScore * 0.5
    );

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            period: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            kpis: {
                attendanceScore: attendanceScore,
                taskScore: taskScore,
            },
            overallPerformance: overallPerformance,
        },
    });
});
