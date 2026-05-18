import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";

export const createRequest = asyncWraper(async (req, res, next) => {
    const employeeId = req.currentUser.userId;
    const { type, title, description, priority, attachment } = req.body;

    const newRequest = await Request.create({
        employeeId,
        type,
        title,
        description,
        priority,
        attachments: attachment || null,
    });

    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { request: newRequest },
    });
});

export const getAllRequests = asyncWraper(async (req, res, next) => {
    const { page, limit, status, type } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};

    if (req.currentUser.role !== "HR") {
        query.employeeId = req.currentUser.userId;
    }

    if (status) query.status = status;
    if (type) query.type = type;

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
        req.currentUser.role !== "HR" &&
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

export const updateRequest = asyncWraper(async (req, res, next) => {
    const { id } = req.params;
    const employeeId = req.currentUser.userId;

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

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { request: updatedRequest },
    });
});
