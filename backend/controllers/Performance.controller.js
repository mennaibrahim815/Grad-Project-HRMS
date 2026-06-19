import Attendance from "../models/attendance.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import mongoose from "mongoose";
import appErrors from "../utils/errors.js";
import dayjs from "dayjs";
import { calculateKPI } from "../utils/calculateKPI.js";
import { calculatePercentageChange } from "../utils/calculatePercentageChange.js";
import { getPerformanceLabel } from "../utils/getPerformanceLabel.js";

export const getEmployeePerformance = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;

    const startDate = req.query.startDate
        ? dayjs(req.query.startDate)
        : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    const daysDifference = endDate.diff(startDate, "day") + 1;
    const prevStartDate = startDate.subtract(daysDifference, "day");
    const prevEndDate = endDate.subtract(daysDifference, "day");

    const [currentScores, previousScores] = await Promise.all([
        calculateKPI(employeeId, startDate, endDate),
        calculateKPI(employeeId, prevStartDate, prevEndDate)
    ]);

    const performanceChange = calculatePercentageChange(currentScores.overallPerformance, previousScores.overallPerformance);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            currentPeriod: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            previousPeriod: {
                from: prevStartDate.format("YYYY-MM-DD"),
                to: prevEndDate.format("YYYY-MM-DD"),
            },
            kpis: {
                attendanceScore: currentScores.attendanceScore,
                taskScore: currentScores.taskScore,
            },
            overallPerformance: currentScores.overallPerformance,
            performanceStatus: getPerformanceLabel(currentScores.overallPerformance),
            previousOverallPerformance: previousScores.overallPerformance,
            percentageChange: performanceChange,
        },
    });
});


export const getAllEmployeesPerformance = asyncWraper(async (req, res, next) => {
    const startDate = req.query.startDate ? dayjs(req.query.startDate) : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const daysDifference = endDate.diff(startDate, "day") + 1;
    const prevStartDate = startDate.subtract(daysDifference, "day");
    const prevEndDate = endDate.subtract(daysDifference, "day");

    const totalRecords = await User.countDocuments({ "general.role": "EMPLOYEE" });

    const employees = await User.find({ "general.role": "EMPLOYEE" })
        .select("general.firstName general.lastName general.email general.avatar employee.jobTitle")
        .skip(skip)
        .limit(limit)
        .lean();

    const performanceReport = await Promise.all(
        employees.map(async (emp) => {
            const [currentScores, previousScores] = await Promise.all([
                calculateKPI(emp._id, startDate, endDate),
                calculateKPI(emp._id, prevStartDate, prevEndDate)
            ]);

            const performanceChange = calculatePercentageChange(currentScores.overallPerformance, previousScores.overallPerformance);

            return {
                employeeId: emp._id,
                firstName: emp.general?.firstName,
                lastName: emp.general?.lastName,
                email: emp.general?.email,
                avatar: emp.general?.avatar,
                jobTitle: emp.employee?.jobTitle,
                kpis: {
                    attendanceScore: currentScores.attendanceScore,
                    taskScore: currentScores.taskScore,
                },
                overallPerformance: currentScores.overallPerformance,
                performanceStatus: getPerformanceLabel(currentScores.overallPerformance),
                previousOverallPerformance: previousScores.overallPerformance,
                percentageChange: performanceChange,
            };
        })
    );

    const totalPages = Math.ceil(totalRecords / (limit || 1)) || 1;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            currentPeriod: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            previousPeriod: {
                from: prevStartDate.format("YYYY-MM-DD"),
                to: prevEndDate.format("YYYY-MM-DD"),
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

export const getEmployeePerformanceHistory = asyncWraper(async (req, res, next) => {
    const employeeId = req.params.id || req.currentUser.userId;

    const startDate = req.query.startDate ? dayjs(req.query.startDate) : dayjs().subtract(30, "day");
    const endDate = req.query.endDate ? dayjs(req.query.endDate) : dayjs();

    const daysDifference = endDate.diff(startDate, "day") + 1;

    const currentScores = await calculateKPI(employeeId, startDate, endDate);

    const previousPeriodsData = [];
    
    for (let i = 1; i <= 5; i++) {
        const prevStartDate = startDate.subtract(daysDifference * i, "day");
        const prevEndDate = endDate.subtract(daysDifference * i, "day");

        const prevScores = await calculateKPI(employeeId, prevStartDate, prevEndDate);
        const performanceChange = calculatePercentageChange(currentScores.overallPerformance, prevScores.overallPerformance);

        previousPeriodsData.push({
            from: prevStartDate.format("YYYY-MM-DD"),
            to: prevEndDate.format("YYYY-MM-DD"),
            overallPerformance: prevScores.overallPerformance,
            performanceStatus: getPerformanceLabel(prevScores.overallPerformance),
            percentageChange: performanceChange
        });
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            currentPeriod: {
                from: startDate.format("YYYY-MM-DD"),
                to: endDate.format("YYYY-MM-DD"),
            },
            kpis: {
                attendanceScore: currentScores.attendanceScore,
                taskScore: currentScores.taskScore,
            },
            overallPerformance: currentScores.overallPerformance,
            performanceStatus: getPerformanceLabel(currentScores.overallPerformance),
            previousPeriods: previousPeriodsData 
        },
    });
});