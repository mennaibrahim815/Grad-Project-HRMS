import Attendance from "../models/attendance.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import mongoose from "mongoose";
import appErrors from "../utils/errors.js";
import dayjs from "dayjs";
import { calculateSingleEmployeePerformance } from "../utils/calculateSingleEmployeePerformance.js";

export const getEmployeePerformance = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;

    const startDate = req.query.startDate
        ? dayjs(req.query.startDate)
        : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    const scores = await calculateSingleEmployeePerformance(employeeId, startDate, endDate);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            period: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            kpis: {
                attendanceScore: scores.attendanceScore,
                taskScore: scores.taskScore,
            },
            overallPerformance: scores.overallPerformance,
        },
    });
});


export const getAllEmployeesPerformance = asyncWraper(async (req, res, next) => {
    const startDate = req.query.startDate ? dayjs(req.query.startDate) : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalRecords = await User.countDocuments({ "general.role": "EMPLOYEE" });

    const employees = await User.find({ "general.role": "EMPLOYEE" })
        .select("general.firstName general.lastName general.email general.avatar employee.jobTitle")
        .skip(skip)
        .limit(limit)
        .lean();

    const performanceReport = await Promise.all(
        employees.map(async (emp) => {
            const scores = await calculateSingleEmployeePerformance(emp._id, startDate, endDate);

            return {
                employeeId: emp._id,
                firstName: emp.general?.firstName,
                lastName: emp.general?.lastName,
                email: emp.general?.email,
                avatar: emp.general?.avatar,
                jobTitle: emp.employee?.jobTitle,
                kpis: {
                    attendanceScore: scores.attendanceScore,
                    taskScore: scores.taskScore,
                },
                overallPerformance: scores.overallPerformance,
            };
        })
    );

    const totalPages = Math.ceil(totalRecords / (limit || 1)) || 0;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            period: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            performanceReport,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages,
                limit,
            },
        },
    });
});