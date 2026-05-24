import User from "../models/user.model.js";
import Applicant from "../models/applicant.model.js";
import Payroll from "../models/payroll.model.js";
import Project from "../models/project.model.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Attendance from "../models/attendance.model.js";

export const getDashboardStatistics = asyncWraper(async (req, res, next) => {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const [employeeStats, applicantStats, payrollStats] = await Promise.all([
        User.aggregate([
            {
                $facet: {
                    current: [
                        {
                            $match: {
                                "employee.status": "Active",
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $month: "$createdAt" },
                                                month,
                                            ],
                                        },
                                        {
                                            $eq: [
                                                { $year: "$createdAt" },
                                                year,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $count: "total" },
                    ],
                    previous: [
                        {
                            $match: {
                                "employee.status": "Active",
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $month: "$createdAt" },
                                                prevMonth,
                                            ],
                                        },
                                        {
                                            $eq: [
                                                { $year: "$createdAt" },
                                                prevYear,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $count: "total" },
                    ],
                },
            },
            {
                $project: {
                    currentTotal: {
                        $ifNull: [{ $arrayElemAt: ["$current.total", 0] }, 0],
                    },
                    previousTotal: {
                        $ifNull: [{ $arrayElemAt: ["$previous.total", 0] }, 0],
                    },
                },
            },
        ]),
        Applicant.aggregate([
            {
                $facet: {
                    current: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $month: "$createdAt" },
                                                month,
                                            ],
                                        },
                                        {
                                            $eq: [
                                                { $year: "$createdAt" },
                                                year,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $count: "total" },
                    ],
                    previous: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $month: "$createdAt" },
                                                prevMonth,
                                            ],
                                        },
                                        {
                                            $eq: [
                                                { $year: "$createdAt" },
                                                prevYear,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        { $count: "total" },
                    ],
                },
            },
            {
                $project: {
                    currentTotal: {
                        $ifNull: [{ $arrayElemAt: ["$current.total", 0] }, 0],
                    },
                    previousTotal: {
                        $ifNull: [{ $arrayElemAt: ["$previous.total", 0] }, 0],
                    },
                },
            },
        ]),
        Payroll.aggregate([
            {
                $facet: {
                    current: [
                        { $match: { month, year, status: "Paid" } },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$netSalary" },
                            },
                        },
                    ],
                    previous: [
                        {
                            $match: {
                                month: prevMonth,
                                year: prevYear,
                                status: "Paid",
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$netSalary" },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    currentTotal: {
                        $ifNull: [{ $arrayElemAt: ["$current.total", 0] }, 0],
                    },
                    previousTotal: {
                        $ifNull: [{ $arrayElemAt: ["$previous.total", 0] }, 0],
                    },
                },
            },
        ]),
    ]);

    const emp = employeeStats[0] || { currentTotal: 0, previousTotal: 0 };
    const app = applicantStats[0] || { currentTotal: 0, previousTotal: 0 };
    const pay = payrollStats[0] || { currentTotal: 0, previousTotal: 0 };

    const calcPercentage = (current, previous) => {
        if (previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            employees: {
                total: emp.currentTotal,
                previousTotal: emp.previousTotal,
                percentageChange: calcPercentage(
                    emp.currentTotal,
                    emp.previousTotal
                ),
            },
            applicants: {
                total: app.currentTotal,
                previousTotal: app.previousTotal,
                percentageChange: calcPercentage(
                    app.currentTotal,
                    app.previousTotal
                ),
            },
            payroll: {
                total: pay.currentTotal,
                previousTotal: pay.previousTotal,
                percentageChange: calcPercentage(
                    pay.currentTotal,
                    pay.previousTotal
                ),
            },
        },
    });
});

export const getApplicantsByStatus = asyncWraper(async (req, res, next) => {
    const filterStatus = req.query.status || "Hired";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalRecords = await Applicant.countDocuments({
        status: filterStatus,
    });

    const applicants = await Applicant.find({ status: filterStatus })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("firstName lastName avatar status experience.position");

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            applicants,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / (limit || 1)) || 0,
                limit,
            },
        },
    });
});

export const getEmployeeStatus = asyncWraper(async (req, res, next) => {
    const stats = await User.aggregate([
        {
            $match: {
                "general.role": "EMPLOYEE",
                "employee.status": "Active",
            },
        },
        {
            $group: {
                _id: null,
                totalEmployee: { $sum: 1 },
                fullTimeCount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$employee.jobType", "Full-time"] },
                            1,
                            0,
                        ],
                    },
                },
                partTimeCount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$employee.jobType", "Part-time"] },
                            1,
                            0,
                        ],
                    },
                },
                internshipCount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$employee.jobType", "Internship"] },
                            1,
                            0,
                        ],
                    },
                },
                contractCount: {
                    $sum: {
                        $cond: [
                            { $eq: ["$employee.jobType", "Contract"] },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
    ]);

    const result = stats[0] || {
        totalEmployee: 0,
        fullTimeCount: 0,
        partTimeCount: 0,
        internshipCount: 0,
        contractCount: 0,
    };
    const {
        totalEmployee,
        fullTimeCount,
        partTimeCount,
        internshipCount,
        contractCount,
    } = result;

    const getPercentage = (count) =>
        totalEmployee > 0 ? Math.round((count / totalEmployee) * 100) : 0;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            totalEmployee,
            fullTimeCount,
            fullTimePercentage: getPercentage(fullTimeCount),
            partTimeCount,
            partTimePercentage: getPercentage(partTimeCount),
            internshipCount,
            internshipPercentage: getPercentage(internshipCount),
            contractCount,
            contractPercentage: getPercentage(contractCount),
        },
    });
});

export const getProjectSummary = asyncWraper(async (req, res, next) => {
    const filterStatus = req.query.status || "On-going";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const result = await Project.aggregate([
        { $match: { "assignment.status": filterStatus } },
        {
            $lookup: {
                from: "users",
                localField: "assignment.assignedTo",
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
                as: "assignedTo",
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
                            cond: { $eq: ["$$t.done", true] },
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
                deadline: "$general.deadline",
                assignedTo: 1,
                documentsCount: { $size: { $ifNull: ["$documents", []] } },
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

export const getWeeklyAttendanceStats = asyncWraper(async (req, res, next) => {
    const { day, month, year } = req.query;
    if (!day || !month || !year) {
        const error = appErrors.create(
            400,
            "day and month and year are required",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const startDate = dayjs(`${year}-${month}-${day}`)
        .subtract(6, "day")
        .format("YYYY-MM-DD");

    console.log(startDate);

    const endDate = dayjs(`${year}-${month}-${day}`).format("YYYY-MM-DD");
    console.log(endDate);

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

    const attendence = await Attendance.aggregate([
        {
            $match: {
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: "$date",
                onTimeCount: {
                    $sum: { $cond: [{ $eq: ["$status", "On Time"] }, 1, 0] },
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
                _id: 0,
                fullDate: "$_id",
                onTimeCount: 1,
                lateCount: 1,
                absentCount: 1,
                dayName: {
                    $arrayElemAt: [
                        daysOfWeek,
                        {
                            $dayOfWeek: {
                                $dateFromString: { dateString: "$_id" },
                            },
                        },
                    ],
                },
            },
        },
        { $sort: { fullDate: 1 } },
    ]);
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { weeklyAttendenceStats: attendence },
    });
});
