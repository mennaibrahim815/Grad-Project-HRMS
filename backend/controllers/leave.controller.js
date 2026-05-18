import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import dayjs from "dayjs";
import { httpResponseText } from "../utils/httpResponseText.js";
import mongoose from "mongoose";
import { buildNameSearchQuery } from "../utils/searchHelper.js";

export const getAllLeaves = asyncWraper(async (req, res, next) => {
    const { date, status, page, limit } = req.query;
    const pipeline = [];
    const matchStage = {};
    if (date) {
        let finalDate = dayjs(date).format("YYYY-MM-DD");
        matchStage.startDate = { $lte: finalDate };
        matchStage.endDate = { $gte: finalDate };
    }
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
            leavesData: [
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
                        localField: "hrId",
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
                        employeeId: 1,
                        type: 1,
                        startDate: 1,
                        endDate: 1,
                        status: 1,
                        reason: 1,
                        rejectReason: 1,
                        attachment: 1,
                        duration: 1,
                        hrId: 1,
                        employee: {
                            firstName: "$employeeDetails.general.firstName",
                            lastName: "$employeeDetails.general.lastName",
                            email: "$employeeDetails.general.email",
                            phone: "$employeeDetails.general.phone",
                            avatar: "$employeeDetails.general.avatar",
                            department: "$employeeDetails.employee.department",
                            jobTitle: "$employeeDetails.employee.jobTitle",
                            annualLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.annual",
                            sickLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.sick",
                            casualLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.casual",
                        },
                        hrApprovedBy: {
                            _id: "$hrDetails._id",
                            firstName: "$hrDetails.general.firstName",
                            lastName: "$hrDetails.general.lastName",
                        },
                    },
                },
            ],
        },
    });

    const leaves = await Leave.aggregate(pipeline);
    const totalRecords = leaves[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);
    const data = leaves[0].leavesData;
    res.status(200).json({
        data,
        pagination: {
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber,
        },
    });
});

export const createLeave = asyncWraper(async (req, res, next) => {
    const { type, startDate, endDate, reason, attachment } = req.body;
    const employeeId = req.currentUser.userId;
    const user = await User.findById(employeeId);
    if (!user) {
        const error = appErrors.create(
            400,
            "Employee not found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    if (type === "Sick" && (!attachment || attachment.trim() === "")) {
        return next(
            appErrors.create(
                400,
                "Medical attachment report is required for Sick leave.",
                httpResponseText.FAIL
            )
        );
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = end.diff(start, "days") + 1;

    const leaveType = type.toLowerCase();
    if (user.employee.leaveBalance[leaveType] !== undefined) {
        if (duration > user.employee.leaveBalance[leaveType]) {
            const error = appErrors.create(
                400,
                `Leave duration is greater than ${leaveType} leave balance`,
                httpResponseText.FAIL
            );
            return next(error);
        }
    }
    const overLappedLeave = await Leave.findOne({
        employeeId,
        status: { $in: ["Pending", "Approved"] },
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
    });
    if (overLappedLeave) {
        const error = appErrors.create(
            400,
            "You aleady have an leave pending or approved in this period",
            httpResponseText.FAIL
        );

        return next(error);
    }
    if (user.employee.leaveBalance[leaveType] !== undefined) {
        const typeToMatch =
            type === "Casual" || type === "Annual"
                ? ["Casual", "Annual"]
                : [type];

        const pendingLeaves = await Leave.aggregate([
            {
                $match: {
                    employeeId: new mongoose.Types.ObjectId(employeeId),
                    status: "Pending",
                    type: { $in: typeToMatch },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$duration" },
                },
            },
        ]);

        let totalPendingTypeLeaves = 0;
        let totalCompinedLeaves = 0;

        pendingLeaves.forEach((leave) => {
            if (leave._id === type) totalPendingTypeLeaves = leave.total;
            if (leave._id === "Annual" || leave._id === "Casual") {
                totalCompinedLeaves += leave.total;
            }
        });
        if (
            duration + totalPendingTypeLeaves >
            user.employee.leaveBalance[leaveType]
        ) {
            const error = appErrors.create(
                400,
                `Cannot apply for ${duration} days. You have ${totalPendingTypeLeaves} pending ${type} days. Your exact available ${type} balance is ${user.employee.leaveBalance[leaveType] - totalPendingTypeLeaves}.`,
                httpResponseText.FAIL
            );
            return next(error);
        }
        if (type === "Casual" || type === "Annual") {
            if (
                duration + totalCompinedLeaves >
                user.employee.leaveBalance.annual
            ) {
                console.log(totalCompinedLeaves);
                const error = appErrors.create(
                    400,
                    `Cannot apply for ${duration} days. You have ${totalCompinedLeaves} pending Annual and Casual days combined. Your total available Annual limit is ${user.employee.leaveBalance.annual - totalCompinedLeaves} days.`,
                    httpResponseText.FAIL
                );
                return next(error);
            }
        }
    }

    const leave = await Leave.create({
        employeeId,
        type,
        startDate,
        endDate,
        reason,
        attachment,
        duration,
    });
    res.status(201).json({ status: httpResponseText.SUCCESS, data: leave });
});

export const getUserLeavesById = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    if (req.currentUser.role !== "HR" && req.currentUser.userId !== id) {
        const error = appErrors.create(
            403,
            "Forbidden, You are not allowed to view leave of other users",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const user = await User.findById(id);
    if (!user) {
        const error = appErrors.create(
            404,
            "User not found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const leaves = await Leave.find({ employeeId: user._id }, { __v: 0 });
    res.status(200).json({ status: httpResponseText.SUCCESS, data: leaves });
});

export const getLeaveById = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
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
                localField: "hrId",
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
                startDate: 1,
                endDate: 1,
                status: 1,
                reason: 1,
                rejectReason: 1,
                attachment: 1,
                duration: 1,
                employee: {
                    firstName: "$employeeDetails.general.firstName",
                    lastName: "$employeeDetails.general.lastName",
                    email: "$employeeDetails.general.email",
                    phone: "$employeeDetails.general.phone",
                    avatar: "$employeeDetails.general.avatar",
                    department: "$employeeDetails.employee.department",
                    jobTitle: "$employeeDetails.employee.jobTitle",
                    annualLeaveBalance:
                        "$employeeDetails.employee.leaveBalance.annual",
                    sickLeaveBalance:
                        "$employeeDetails.employee.leaveBalance.sick",
                    casualLeaveBalance:
                        "$employeeDetails.employee.leaveBalance.casual",
                },
                hrApprovedBy: {
                    _id: "$hrDetails._id",
                    firstName: "$hrDetails.general.firstName",
                    lastName: "$hrDetails.general.lastName",
                },
            },
        },
    ];

    const leave = await Leave.aggregate(pipeline);

    if (!leave) {
        const error = appErrors.create(
            404,
            "Leave not found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const leaveData = leave[0];
    res.status(200).json({ status: httpResponseText.SUCCESS, data: leaveData });
});

export const updateLeave = asyncWraper(async (req, res, next) => {
    const id = req.params.id;
    const employeeId = req.currentUser.userId;
    const updatedData = req.body;

    const user = await User.findById(employeeId);
    if (!user) {
        return next(
            appErrors.create(404, "Employee not found", httpResponseText.FAIL)
        );
    }

    if (Object.keys(updatedData).length === 0) {
        return next(
            appErrors.create(
                400,
                "Please provide data to update",
                httpResponseText.FAIL
            )
        );
    }

    const oldLeave = await Leave.findOne({
        _id: id,
        employeeId: employeeId,
        status: "Pending",
    });

    if (!oldLeave) {
        return next(
            appErrors.create(404, "Leave is not found", httpResponseText.FAIL)
        );
    }

    const { type, startDate, endDate, reason, attachment } = req.body;

    const newStartDate = startDate || oldLeave.startDate;
    const newEndDate = endDate || oldLeave.endDate;

    const start = dayjs(newStartDate);
    const end = dayjs(newEndDate);

    if (start.isAfter(end)) {
        return next(
            appErrors.create(
                400,
                "End date cannot be before start date",
                httpResponseText.FAIL
            )
        );
    }
    const duration = end.diff(start, "days") + 1;

    const newType = type || oldLeave.type;
    const leaveType = newType.toLowerCase();

    if (user.employee.leaveBalance[leaveType] !== undefined) {
        if (duration > user.employee.leaveBalance[leaveType]) {
            return next(
                appErrors.create(
                    400,
                    `Leave duration is greater than ${leaveType} leave balance`,
                    httpResponseText.FAIL
                )
            );
        }
    }

    const overLappedLeave = await Leave.findOne({
        _id: { $ne: oldLeave._id },
        employeeId,
        status: { $in: ["Pending", "Approved"] },
        startDate: { $lte: newEndDate },
        endDate: { $gte: newStartDate },
    });

    if (overLappedLeave) {
        return next(
            appErrors.create(
                400,
                "You already have a leave pending or approved in this period",
                httpResponseText.FAIL
            )
        );
    }

    if (startDate || endDate || type) {
        const typeToMatch =
            newType === "Casual" || newType === "Annual"
                ? ["Casual", "Annual"]
                : [newType];

        const pendingLeaves = await Leave.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(id) },
                    employeeId: new mongoose.Types.ObjectId(employeeId),
                    status: "Pending",
                    type: { $in: typeToMatch },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$duration" },
                },
            },
        ]);

        let totalPendingTypeLeaves = 0;
        let totalCompinedLeaves = 0;

        pendingLeaves.forEach((leave) => {
            if (leave._id === newType) totalPendingTypeLeaves = leave.total;
            if (leave._id === "Annual" || leave._id === "Casual") {
                totalCompinedLeaves += leave.total;
            }
        });

        if (
            duration + totalPendingTypeLeaves >
            user.employee.leaveBalance[leaveType]
        ) {
            return next(
                appErrors.create(
                    400,
                    `Cannot apply for ${duration} days. You have ${totalPendingTypeLeaves} pending ${newType} days. Your exact available ${newType} balance is ${user.employee.leaveBalance[leaveType] - totalPendingTypeLeaves}.`,
                    httpResponseText.FAIL
                )
            );
        }

        if (newType === "Casual" || newType === "Annual") {
            if (
                duration + totalCompinedLeaves >
                user.employee.leaveBalance.annual
            ) {
                return next(
                    appErrors.create(
                        400,
                        `Cannot apply for ${duration} days. You have ${totalCompinedLeaves} pending Annual and Casual days combined. Your total available Annual limit is ${user.employee.leaveBalance.annual - totalCompinedLeaves} days.`,
                        httpResponseText.FAIL
                    )
                );
            }
        }
    }
    const finalAttachment =
        attachment !== undefined ? attachment : oldLeave.attachment;
    if (
        newType === "Sick" &&
        (!finalAttachment || finalAttachment.trim() === "")
    ) {
        return next(
            appErrors.create(
                400,
                "Medical attachment report is required for Sick leave.",
                httpResponseText.FAIL
            )
        );
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
        id,
        {
            type: newType,
            startDate: newStartDate,
            endDate: newEndDate,
            duration,
            reason: reason || oldLeave.reason,
            attachment: finalAttachment,
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({ status: "success", data: updatedLeave });
});

export const updateLeaveStatus = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const { status, rejectReason } = req.body;
    const hrId = req.currentUser.userId;

    const leave = await Leave.findById(id);
    if (!leave) {
        return next(
            appErrors.create(404, "Leave is not found", httpResponseText.FAIL)
        );
    }
    if (leave.status !== "Pending") {
        return next(
            appErrors.create(
                400,
                `This leave is already ${leave.status} and cannot be modified`,
                httpResponseText.FAIL
            )
        );
    }
    if (status === "Approved") {
        const user = await User.findById(leave.employeeId);
        if (!user) {
            return next(
                appErrors.create(
                    404,
                    "Employee not found",
                    httpResponseText.FAIL
                )
            );
        }
        const leaveType = leave.type.toLowerCase();
        if (user.employee.leaveBalance[leaveType] !== undefined) {
            if (leaveType === "casual") {
                user.employee.leaveBalance[leaveType] -= leave.duration;
                user.employee.leaveBalance.annual -= leave.duration;
            } else {
                user.employee.leaveBalance[leaveType] -= leave.duration;
            }
            await user.save();
        }
        leave.status = "Approved";
        leave.hrId = hrId;
        await leave.save();

        res.status(200).json({ status: "success", data: leave });
    }
    if (status === "Rejected") {
        if (rejectReason) {
            leave.rejectReason = rejectReason;
        }
        leave.status = "Rejected";
        leave.hrId = hrId;
        await leave.save();
        res.status(200).json({ status: "success", data: leave });
    }
});

export const deleteLeave = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const employeeId = req.currentUser.userId;

    const leave = await Leave.findOne({ _id: id, employeeId: employeeId });

    if (!leave) {
        const error = appErrors.create(
            404,
            "Leave not found or you don't have permission to delete it",
            httpResponseText.FAIL
        );
        return next(error);
    }

    if (leave.status !== "Pending") {
        const error = appErrors.create(
            400,
            `Cannot delete this leave request because it is already ${leave.status}`,
            httpResponseText.FAIL
        );
        return next(error);
    }
    await Leave.findByIdAndDelete(id);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "Leave request has been deleted successfully",
        data: { id: leave._id },
    });
});

export const searchLeave = asyncWraper(async (req, res, next) => {
    const { page, limit, date, employeeName } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [];

    if (date) {
        const searchDateStart = dayjs.utc(date).startOf("day").toDate();
        const searchDateEnd = dayjs.utc(date).endOf("day").toDate();

        pipeline.push({
            $match: {
                startDate: { $lte: searchDateEnd },
                endDate: { $gte: searchDateStart },
            },
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
        },
        {
            $lookup: {
                from: "users",
                localField: "hrId",
                foreignField: "_id",
                as: "hrDetails",
            },
        },
        {
            $unwind: {
                path: "$hrDetails",
                preserveNullAndEmptyArrays: true,
            },
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
                        type: 1,
                        startDate: 1,
                        endDate: 1,
                        status: 1,
                        reason: 1,
                        rejectReason: 1,
                        attachment: 1,
                        duration: 1,
                        employee: {
                            employeeId: "$employeeDetails._id",
                            firstName: "$employeeDetails.general.firstName",
                            lastName: "$employeeDetails.general.lastName",
                            email: "$employeeDetails.general.email",
                            phone: "$employeeDetails.general.phone",
                            avatar: "$employeeDetails.general.avatar",
                            department: "$employeeDetails.employee.department",
                            jobTitle: "$employeeDetails.employee.jobTitle",
                            annualLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.annual",
                            sickLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.sick",
                            casualLeaveBalance:
                                "$employeeDetails.employee.leaveBalance.casual",
                        },
                        hrApprovedBy: {
                            _id: "$hrDetails._id",
                            firstName: "$hrDetails.general.firstName",
                            lastName: "$hrDetails.general.lastName",
                            avatar: "$hrDetails.general.avatar",
                        },
                    },
                },
            ],
        },
    });

    const result = await Leave.aggregate(pipeline);
    const leaveData = result[0].data;
    const totalRecords = result[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            leave: leaveData,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
});
