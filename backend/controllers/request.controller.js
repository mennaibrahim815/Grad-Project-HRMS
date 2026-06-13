import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import { sendNotification } from "../utils/sendNotification.js";
import Notification from "../models/notification.model.js";
import { months } from "../utils/monthsArray.js";
import mongoose from "mongoose";
import dayjs from "dayjs";

export const createRequest = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;
    const { type, title, description, priority, attachment } = req.body;
    const user = await User.findById(employeeId);

    const newRequest = await Request.create({
        employeeId,
        type,
        title,
        description,
        priority,
        attachments: attachment || null,
    });
    const io = req.app.get("io");
    await sendNotification(io, {
        targetRoom: "HR_Room",
        recipient: null,
        sender: newRequest.employeeId,
        title: "New Request",
        message: `A new ${newRequest.type} request has been submitted by ${user.general.firstName} ${user.general.lastName}.`,
        type: "Request",
        relatedId: newRequest._id,
    });

    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { request: newRequest },
    });
});

export const getAllRequests = asyncWraper(async (req, res, next) => {
    const { page, limit, status, type, date } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};

    if (req.currentUser.role === "EMPLOYEE") {
        query.employeeId = req.currentUser.userId;
    }

    if (status) query.status = status;
    if (type) query.type = type;

    if (date) {
        const startOfDay = dayjs(date).startOf("day").toDate();
        const endOfDay = dayjs(date).endOf("day").toDate();
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const requests = await Request.find(query)
        .populate(
            "employeeId",
            "general.firstName general.lastName general.avatar"
        )
        .populate("handledBy", "general.firstName general.lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean();

    const totalRecords = await Request.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            requests,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: parseInt(page),
                limit: limitNumber,
            },
        },
    });
});

const fetchRequestHistoryLogic = async (req, res, next, targetEmployeeId) => {
    const { date, status, type, page, limit } = req.query;

    const matchStage = {
        employeeId: new mongoose.Types.ObjectId(targetEmployeeId),
    };

    if (date) {
        const startOfDay = dayjs(date).startOf("day").toDate();
        const endOfDay = dayjs(date).endOf("day").toDate();
        matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status) matchStage.status = status;
    if (type) matchStage.type = type;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [
        { $match: matchStage },
        {
            $facet: {
                metadata: [{ $count: "totalRecords" }],
                requestsData: [
                    { $sort: { createdAt: -1, _id: -1 } },
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
                        $lookup: {
                            from: "users",
                            localField: "handledBy",
                            foreignField: "_id",
                            as: "hrDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$hrDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            type: 1,
                            title: 1,
                            description: 1,
                            priority: 1,
                            attachments: 1,
                            status: 1,
                            hrResponse: 1,
                            createdAt: 1,
                            employee: {
                                _id: "$employeeDetails._id",
                                firstName: "$employeeDetails.general.firstName",
                                lastName: "$employeeDetails.general.lastName",
                                email: "$employeeDetails.general.email",
                                avatar: "$employeeDetails.general.avatar",
                                department:
                                    "$employeeDetails.employee.department",
                                jobTitle: "$employeeDetails.employee.jobTitle",
                            },
                            handledBy: {
                                _id: "$hrDetails._id",
                                firstName: "$hrDetails.general.firstName",
                                lastName: "$hrDetails.general.lastName",
                                avatar: "$hrDetails.general.avatar",
                            },
                        },
                    },
                ],
            },
        },
    ];

    const requests = await Request.aggregate(pipeline);
    const totalRecords = requests[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);
    const data = requests[0].requestsData;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            requests: data,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
};

export const getRequestById = asyncWraper(async (req, res, next) => {
    const { id } = req.params;

    const request = await Request.findById(id)
        .populate(
            "employeeId",
            "general.firstName general.lastName general.email employee.department"
        )
        .populate(
            "handledBy",
            "general.firstName general.lastName general.avatar"
        );

    if (!request) {
        return next(
            appErrors.create(404, "Request not found", httpResponseText.FAIL)
        );
    }

    if (
        req.currentUser.role === "EMPLOYEE" &&
        req.currentUser.userId !== request.employeeId._id.toString()
    ) {
        return next(
            appErrors.create(
                403,
                "Forbidden, You are not allowed to view this request",
                httpResponseText.FAIL
            )
        );
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { request },
    });
});

export const getMyRequests = asyncWraper(async (req, res, next) => {
    await fetchRequestHistoryLogic(req, res, next, req.currentUser.userId);
});

export const getEmployeeRequestsById = asyncWraper(async (req, res, next) => {
    const targetId = req.params.id;
    await fetchRequestHistoryLogic(req, res, next, targetId);
});

export const updateRequest = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const employeeId = req.currentUser.userId;
    const user = await User.findById(employeeId);

    const request = await Request.findOne({ _id: id, employeeId });

    if (!request)
        return next(
            appErrors.create(404, "Request not found", httpResponseText.FAIL)
        );
    if (request.status !== "Pending") {
        return next(
            appErrors.create(
                400,
                "Cannot update request after it has been reviewed by HR",
                httpResponseText.FAIL
            )
        );
    }

    const { type, title, description, priority, attachment } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
        id,
        {
            type,
            title,
            description,
            priority,
            attachments: attachment || request.attachments,
        },
        { new: true, runValidators: true }
    );
    const io = req.app.get("io");
    await sendNotification(io, {
        targetRoom: "HR_Room",
        recipient: null,
        sender: request.employeeId,
        title: "Request Update",
        message: `Employee ${user.general.firstName} ${user.general.lastName} has updated their pending ${type}  request.`,
        type: "Request",
        relatedId: updatedRequest._id,
    });

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { request: updatedRequest },
    });
});

export const deleteRequest = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const employeeId = req.currentUser.userId;

    const request = await Request.findOneAndDelete({
        _id: id,
        employeeId,
        status: "Pending",
    });

    if (!request) {
        return next(
            appErrors.create(
                404,
                "Request not found or already reviewed",
                httpResponseText.FAIL
            )
        );
    }
    await Notification.deleteMany({ relatedId: id });

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: null,
        message: "Request deleted successfully",
    });
});

export const replyToRequest = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const hrId = req.currentUser.userId;
    const { status, text, hrAttachment } = req.body;

    const hr = await User.findById(hrId);
    const request = await Request.findById(id);
    if (!request)
        return next(
            appErrors.create(404, "Request not found", httpResponseText.FAIL)
        );

    const updatedRequest = await Request.findByIdAndUpdate(
        id,
        {
            status: status,
            handledBy: hrId,
            hrResponse: {
                text: text,
                attachments: hrAttachment,
            },
        },
        { new: true, runValidators: true }
    ).populate("handledBy", "general.firstName general.lastName");

    const io = req.app.get("io");
    await sendNotification(io, {
        recipient: updatedRequest.employeeId,
        sender: hrId,
        title: "Request Update",
        message: `Your ${updatedRequest.type} request has been ${status} by ${hr.general.firstName} ${hr.general.lastName}.`,
        type: "Request",
        relatedId: updatedRequest._id,
    });

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { request: updatedRequest },
    });
});

export const getMonthlyRequestStats = asyncWraper(async (req, res, next) => {
    let { month, year } = req.query;
    month = parseInt(month);
    year = parseInt(year);

    if (!month || !year) {
        return next(
            appErrors.create(
                400,
                "Month and Year are required",
                httpResponseText.FAIL
            )
        );
    }

    let targetId = null;
    if (req.path.includes("/me")) {
        targetId = req.currentUser.userId;
    } else if (req.params.id) {
        targetId = req.params.id;
    }

    const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();

    const matchStage = {
        createdAt: { $gte: startDate, $lte: endDate },
    };

    if (targetId) {
        matchStage.employeeId = new mongoose.Types.ObjectId(targetId);
    }

    const stats = await Request.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalRequests: { $sum: 1 },
                approvedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
                },
                pendingCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                },
                rejectedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalRequests: 1,
                approvedCount: 1,
                pendingCount: 1,
                rejectedCount: 1,
            },
        },
    ]);

    const result = stats[0] || {
        totalRequests: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
    };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: result,
    });
});

export const getYearlyRequestChart = asyncWraper(async (req, res, next) => {
    let { year } = req.query;
    year = parseInt(year);

    if (!year) {
        return next(
            appErrors.create(400, "Year is required", httpResponseText.FAIL)
        );
    }

    let targetId = null;
    if (req.path.includes("/me")) {
        targetId = req.currentUser.userId;
    } else if (req.params.id) {
        targetId = req.params.id;
    }

    const startDate = dayjs(`${year}-01-01`).startOf("year").toDate();
    const endDate = dayjs(`${year}-12-31`).endOf("year").toDate();

    const matchStage = {
        createdAt: { $gte: startDate, $lte: endDate },
    };

    if (targetId) {
        matchStage.employeeId = new mongoose.Types.ObjectId(targetId);
    }

    const yearlyData = await Request.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $month: "$createdAt" }, // تجميع بالشهور من تاريخ الإنشاء
                totalRequests: { $sum: 1 },
                approvedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
                },
                pendingCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                },
                rejectedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const formattedData = [];

    for (let i = 1; i <= 12; i++) {
        const monthData = yearlyData.find((m) => m._id === i);
        formattedData.push({
            month: i,
            monthName: months[i],
            totalRequests: monthData ? monthData.totalRequests : 0,
            approvedCount: monthData ? monthData.approvedCount : 0,
            pendingCount: monthData ? monthData.pendingCount : 0,
            rejectedCount: monthData ? monthData.rejectedCount : 0,
        });
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            yearlyOverview: formattedData,
        },
    });
});
