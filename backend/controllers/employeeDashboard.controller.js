import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import Setting from "../models/settings.models.js";
import mongoose from "mongoose";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getEmployeeDashboardStats = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;

    const setting = await Setting.findOne({});
    if (!setting) {
        const error = appErrors.create(
            400,
            "No setting found. Please create a setting in the database.",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const timeZone = setting.timeZone || "Africa/Cairo";
    const now = dayjs().tz(timeZone);
    const today = now.format("YYYY-MM-DD");

    const [
        todayAttendance,
        user,
        approvedLeaves,
        activeTasksStats,
        pendingRequestsCount,
    ] = await Promise.all([
        Attendance.findOne({ employeeId, date: today }),

        User.findById(employeeId).select("leaveBalance"),

        Leave.aggregate([
            {
                $match: {
                    employeeId: new mongoose.Types.ObjectId(employeeId),
                    status: "Approved",
                },
            },
            { $group: { _id: "$type", totalDuration: { $sum: "$duration" } } },
        ]),

        Task.aggregate([
            {
                $match: {
                    "assignedTo._id": new mongoose.Types.ObjectId(employeeId),
                    status: { $in: ["Pending", "On-going"] },
                },
            },
            {
                $group: {
                    _id: null,
                    activeCount: { $sum: 1 },
                    highPriorityCount: {
                        $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] },
                    },
                },
            },
        ]),
        Request.countDocuments({ employeeId, status: "Pending" }),
    ]);

    if (!user) {
        const error = appErrors.create(
            404,
            "User Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const attendanceStatus = todayAttendance
        ? todayAttendance.status
        : "Absent";
    const checkInTime =
        todayAttendance && todayAttendance.checkIn
            ? todayAttendance.checkIn
            : null;

    const leavesCount = approvedLeaves.reduce((acc, curr) => {
        acc[curr._id] = curr.totalDuration;
        return acc;
    }, {});

    const annualQuota = user.leaveBalance?.annual ?? 21;
    const takenAnnual = leavesCount["Annual"] || 0;
    const finalAnnualBalance = annualQuota - takenAnnual;

    const activeTasks = activeTasksStats[0]?.activeCount || 0;
    const highPriorityTasks = activeTasksStats[0]?.highPriorityCount || 0;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            todayStatus: {
                status: attendanceStatus,
                checkIn: checkInTime,
            },
            leaveBalance: finalAnnualBalance,
            activeTasks: {
                count: activeTasks,
                highPriorityCount: highPriorityTasks,
            },
            pendingRequests: pendingRequestsCount,
        },
    });
});

export const getMyProjects = asyncWraper(async (req, res, next) => {
    const userId = req.currentUser.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const result = await Project.aggregate([
        {
            $match: {
                "assignedTo._id": new mongoose.Types.ObjectId(userId),
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo._id",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            firstName: "$general.firstName",
                            lastName: "$general.lastName",
                            avatar: "$general.avatar",
                        },
                    },
                ],
                as: "assignedToUsers",
            },
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "projectId",
                as: "allTasks",
            },
        },
        {
            $addFields: {
                totalTasks: { $size: "$allTasks" },
                completedTasks: {
                    $size: {
                        $filter: {
                            input: "$allTasks",
                            as: "t",
                            cond: { $eq: ["$$t.status", "Completed"] },
                        },
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                name: "$general.name",
                description: "$general.description",
                priority: 1,
                deadline: "$general.deadline",
                assignedTo: "$assignedToUsers",
                projectProgress: {
                    $cond: [
                        { $gt: ["$totalTasks", 0] },
                        {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$completedTasks",
                                                "$totalTasks",
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                        0,
                    ],
                },
            },
        },
        {
            $facet: {
                metadata: [{ $count: "totalRecords" }],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        },
    ]);

    const totalRecords = result[0]?.metadata[0]?.totalRecords || 0;
    const projects = result[0]?.data || [];

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            projects,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / (limit || 1)) || 0,
                limit,
            },
        },
    });
});

export const getRecentRequests = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const requests = await Request.find({ employeeId })
        .select("type status createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalRecords = await Request.countDocuments({ employeeId });
    const totalPages = Math.ceil(totalRecords / (limit || 1)) || 0;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            requests,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages,
                limit,
            },
        },
    });
});

export const getEmployeeWeeklyAttendanceStats = asyncWraper(
    async (req, res, next) => {
        const { day, month, year } = req.query;

        // 1. التحقق من المدخلات
        if (!day || !month || !year) {
            const error = appErrors.create(
                400,
                "day, month, and year are required",
                httpResponseText.FAIL
            );
            return next(error);
        }

        // 2. استخراج الـ ID بشكل صحيح (عشان نتجنب خطأ Mongoose)
        // بنستخدم _id أو id من كائن المستخدم المتاح في الـ Request
        const employeeId = req.currentUser.userId;

        // 3. حساب تواريخ البداية والنهاية للأسبوع
        const startDate = dayjs(`${year}-${month}-${day}`)
            .subtract(6, "day")
            .format("YYYY-MM-DD");

        const endDate = dayjs(`${year}-${month}-${day}`).format("YYYY-MM-DD");

        const daysOfWeek = [
            "",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        // 4. استخراج الإحصائيات (Aggregation)
        const attendence = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                    // تحويل الـ ID المظبوط لـ ObjectId
                    employeeId: new mongoose.Types.ObjectId(employeeId),
                },
            },
            {
                $group: {
                    // التجميع بناءً على حقل التاريخ لكل يوم
                    _id: "$date",
                    onTimeCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "On Time"] }, 1, 0],
                        },
                    },
                    lateCount: {
                        $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] },
                    },
                    absentCount: {
                        $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0, // إخفاء الـ _id من النتيجة النهائية
                    fullDate: "$_id", // إرجاع التاريخ كامل
                    onTimeCount: 1,
                    lateCount: 1,
                    absentCount: 1,
                    dayName: {
                        $arrayElemAt: [
                            daysOfWeek,
                            {
                                $dayOfWeek: {
                                    // تحويل التاريخ لنص عشان نجيب منه اسم اليوم
                                    $dateFromString: { dateString: "$_id" },
                                },
                            },
                        ],
                    },
                },
            },
            { $sort: { fullDate: 1 } }, // ترتيب الأيام تصاعدياً
        ]);

        // 5. إرسال الاستجابة بنجاح
        res.status(200).json({
            status: httpResponseText.SUCCESS,
            data: { weeklyAttendenceStats: attendence },
        });
    }
);
