import { httpResponseText } from "../utils/httpResponseText.js";
import User from "../models/user.model.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import appErrors from "../utils/errors.js";
import Attendance from "../models/attendance.model.js";
import Setting from "../models/settings.models.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import mongoose from "mongoose";
import { buildNameSearchQuery } from "../utils/searchHelper.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export const getAllAttandence = asyncWraper(async (req, res, next) => {
    const { date, limit, page, status } = req.query;

    const pipeline = [];

    const matchStage = {};
    let finalDate = date;

    if (date) {
        finalDate = dayjs(date).format("YYYY-MM-DD");
    }

    if (finalDate) matchStage.date = finalDate;
    if (status) matchStage.status = status;

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    pipeline.push({
        $facet: {
            metadata: [{ $count: "totalRecords" }],
            data: [
                { $sort: { date: -1, _id: -1 } },
                { $skip: skip },
                { $limit: limitNumber },
                {
                    $lookup: {
                        from: "users",
                        localField: "employeeId",
                        foreignField: "_id",
                        as: "employeeDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$employeeDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        employeeId: 1,
                        date: 1,
                        checkIn: 1,
                        status: 1,
                        employee: {
                            firstName: "$employeeDetails.general.firstName",
                            lastName: "$employeeDetails.general.lastName",
                            email: "$employeeDetails.general.email",
                            department: "$employeeDetails.employee.department",
                            jobType: "$employeeDetails.employee.jobType",
                            avatar: "$employeeDetails.general.avatar",
                        },
                    },
                },
            ],
        },
    });

    const result = await Attendance.aggregate(pipeline);

    const attendanceData = result[0].data;
    const totalRecords = result[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            attendance: attendanceData,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
});

const fetchAttendanceHistoryLogic = async (
    req,
    res,
    next,
    targetEmployeeId
) => {
    const { month, year, limit, page } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const matchQuery = {
        employeeId: new mongoose.Types.ObjectId(targetEmployeeId),
    };

    if (month && year) {
        const startDate = dayjs(`${year}-${month}-01`).format("YYYY-MM-DD");
        const endDate = dayjs(`${year}-${month}-01`)
            .endOf("month")
            .format("YYYY-MM-DD");
        matchQuery.date = { $gte: startDate, $lte: endDate };
    }

    const pipeline = [
        {
            $match: matchQuery,
        },
        {
            $facet: {
                metadata: [{ $count: "totalRecords" }],
                data: [
                    { $sort: { date: -1, _id: -1 } },
                    { $skip: skip },
                    { $limit: limitNumber },
                    {
                        $lookup: {
                            from: "users",
                            localField: "employeeId",
                            foreignField: "_id",
                            as: "employeeDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$employeeDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            employeeId: 1,
                            date: 1,
                            checkIn: 1,
                            status: 1,
                            employee: {
                                firstName: "$employeeDetails.general.firstName",
                                lastName: "$employeeDetails.general.lastName",
                                email: "$employeeDetails.general.email",
                                department:
                                    "$employeeDetails.employee.department",
                                jobType: "$employeeDetails.employee.jobType",
                                avatar: "$employeeDetails.general.avatar",
                            },
                        },
                    },
                ],
            },
        },
    ];

    const result = await Attendance.aggregate(pipeline);

    const attendanceData = result[0].data;

    const totalRecords = result[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            attendance: attendanceData,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
};

export const getMyAttendance = asyncWraper(async (req, res, next) => {
    await fetchAttendanceHistoryLogic(req, res, next, req.currentUser.userId);
});

export const getEmployeeAttendanceById = asyncWraper(async (req, res, next) => {
    const targetId = req.params.id;
    await fetchAttendanceHistoryLogic(req, res, next, targetId);
});

export const checkIn = asyncWraper(async (req, res, next) => {
    const { rfidTag } = req.body;
    if (!rfidTag) {
        const error = appErrors.create(
            400,
            "rfidTag is required",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const user = await User.findOne({ "general.rfidTag": rfidTag });
    if (!user) {
        const error = appErrors.create(
            404,
            "User not found with the provided RFID tag",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const setting = await Setting.findOne({});
    if (!setting) {
        const error = appErrors.create(
            400,
            "No setting found. Please create a setting in the database.",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const workStartTime = setting.workStartTime || "08:00";
    const maxDelayMinutes = setting.maxDelayMinutes || 120;
    const gracePeriod = setting.gracePeriod || 30;
    const timeZone = setting.timeZone || "Africa/Cairo";
    const now = dayjs().tz(timeZone);
    const today = now.format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({
        employeeId: user._id,
        date: today,
    });

    if (attendance) {
        const error = appErrors.create(
            400,
            "user already checked in",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const [hours, minutes] = workStartTime.split(":").map(Number);
    const workStartDate = now
        .clone()
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", 0)
        .set("millisecond", 0);

    const rawTimeDifference = now.diff(workStartDate, "minutes");
    const timeDifference = Math.max(0, rawTimeDifference);

    let status = "On Time";
    let delayMinutes = 0;

    if (timeDifference > gracePeriod) {
        delayMinutes = timeDifference;
        if (timeDifference <= maxDelayMinutes) {
            status = "Late";
        } else {
            status = "Absent";
        }
    }

    const newAttendance = await Attendance.create({
        employeeId: user._id,
        date: today,
        status,
        delayMinutes,
        checkIn: now,
    });
    newAttendance.__v = undefined;

    const socketData = {
        _id: newAttendance._id,
        employeeId: newAttendance.employeeId,
        date: newAttendance.date,
        checkIn: newAttendance.checkIn,
        status: newAttendance.status,

        employee: {
            firstName: user.general.firstName,
            lastName: user.general.lastName,
            email: user.general.email,
            department: user.employee.department,
            jobType: user.employee.jobType,
            avatar: user.general.avatar,
        },
    };
    const io = req.app.get("io");
    io.emit("new_checkin", socketData);
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            firstName: user.general.firstName,
            status: newAttendance.status,
            newAttendance,
        },
    });
});

export const searchAttendance = asyncWraper(async (req, res, next) => {
    const { page, limit, date, employeeName } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [];

    if (date) {
        const finalDate = dayjs(date).format("YYYY-MM-DD");
        pipeline.push({
            $match: { date: finalDate },
        });
    }

    const nameMatchStage = buildNameSearchQuery(
        employeeName,
        "employeeDetails.general.firstName",
        "employeeDetails.general.lastName"
    );

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "employeeId",
                foreignField: "_id",
                as: "employeeDetails",
            },
        },
        {
            $unwind: {
                path: "$employeeDetails",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $match: nameMatchStage,
        }
    );

    pipeline.push({
        $facet: {
            metadata: [{ $count: "totalRecords" }],
            data: [
                { $sort: { date: -1, _id: -1 } },
                { $skip: skip },
                { $limit: limitNumber },
                {
                    $project: {
                        _id: 1,
                        employeeId: 1,
                        date: 1,
                        checkIn: 1,
                        status: 1,
                        employee: {
                            firstName: "$employeeDetails.general.firstName",
                            lastName: "$employeeDetails.general.lastName",
                            email: "$employeeDetails.general.email",
                            department: "$employeeDetails.employee.department",
                            jobType: "$employeeDetails.employee.jobType",
                            avatar: "$employeeDetails.general.avatar",
                        },
                    },
                },
            ],
        },
    });

    const result = await Attendance.aggregate(pipeline);
    console.log(result);
    const attendanceData = result[0].data;
    const totalRecords = result[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            attendance: attendanceData,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
});

export const getMonthlyAttendanceStats = asyncWraper(async (req, res, next) => {
    const { year, month } = req.query;

    const startDate = dayjs(`${year}-${month}-01`)
        .startOf("month")
        .format("YYYY-MM-DD");
    const endDate = dayjs(`${year}-${month}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");

    const stats = await Attendance.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: null,
                totalAttendanceRecords: { $sum: 1 },
                totalOnTimeCount: {
                    $sum: { $cond: [{ $eq: ["$status", "On Time"] }, 1, 0] },
                },
                totalLateCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] },
                },
                totalAbsentCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
                },
                totalDelayMinutes: { $sum: "$delayMinutes" },
            },
        },
        {
            $project: {
                _id: 0,
                totalAttendanceRecords: 1,
                totalOnTimeCount: 1,
                totalLateCount: 1,
                totalAbsentCount: 1,
                totalDelayMinutes: 1,
                attendanceRate: {
                    $cond: [
                        { $gt: ["$totalAttendanceRecords", 0] },
                        {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $add: [
                                                        "$totalOnTimeCount",
                                                        "$totalLateCount",
                                                    ],
                                                },
                                                "$totalAttendanceRecords",
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        0,
                    ],
                },
            },
        },
    ]);

    const result = stats[0];

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: result,
    });
});

export const getSixMonthsAttendanceStats = asyncWraper(
    async (req, res, next) => {
        const { month, year } = req.query;
        if (!month || !year) {
            const error = appErrors.create(
                400,
                "month and year are required",
                httpResponseText.FAIL
            );
            return next(error);
        }
        const startDate = dayjs(`${year}-${month}-01`)
            .subtract(5, "month")
            .format("YYYY-MM-DD");

        console.log(startDate);

        const endDate = dayjs(`${year}-${month}-01`)
            .endOf("month")
            .format("YYYY-MM-DD");
        console.log(endDate);

        const months = [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
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
                $facet: {
                    overallStats: [
                        {
                            $group: {
                                _id: null,
                                totalOnTime: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "On Time"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                totalLate: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "Late"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                totalAbsent: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "Absent"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                // avgDelay: { $avg: "$delayMinutes" },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                totalOnTime: 1,
                                totalLate: 1,
                                totalAbsent: 1,
                            },
                        },
                    ],
                    monthlyStats: [
                        {
                            $group: {
                                _id: {
                                    year: {
                                        $year: {
                                            $dateFromString: {
                                                dateString: "$date",
                                            },
                                        },
                                    },
                                    month: {
                                        $month: {
                                            $dateFromString: {
                                                dateString: "$date",
                                            },
                                        },
                                    },
                                },

                                totalOnTime: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "On Time"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                totalLate: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "Late"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                totalAbsent: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "Absent"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                year: "$_id.year",
                                month: "$_id.month",
                                monthName: {
                                    $arrayElemAt: [months, "$_id.month"],
                                },
                                totalOnTime: 1,
                                totalLate: 1,
                                totalAbsent: 1,
                            },
                        },
                        { $sort: { year: 1, month: 1 } },
                    ],
                },
            },
        ]);
        res.status(200).json({
            status: httpResponseText.SUCCESS,
            data: { monthlyAttendenceStats: attendence },
        });
    }
);
