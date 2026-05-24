import Notification from "../models/notification.model.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import { httpResponseText } from "../utils/httpResponseText.js";

export const getMyNotifications = asyncWraper(async (req, res, next) => {
    const { page = 1, limit = 10, unreadOnly } = req.query;
    const limitNumber = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNumber;

    const query = {
        $or: [{ recipient: req.currentUser.userId }],
    };

    if (req.currentUser.role === "HR" || req.currentUser.role === "MANAGER") {
        query.$or.push({ recipient: null });
    }

    if (unreadOnly === "true") {
        query.isRead = false;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate(
            "sender",
            "general.firstName general.lastName general.avatar"
        );

    const totalRecords = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { notifications },
        pagination: {
            totalRecords,
            totalPages,
            currentPage: parseInt(page),
            limit: limitNumber,
        },
    });
});

export const getUnreadCount = asyncWraper(async (req, res, next) => {
    const query = {
        $or: [{ recipient: req.currentUser.userId }],
        isRead: false,
    };

    if (req.currentUser.role === "HR" || req.currentUser.role === "MANAGER") {
        query.$or.push({ recipient: null });
    }

    const count = await Notification.countDocuments(query);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { unreadCount: count },
    });
});

export const markAsRead = asyncWraper(async (req, res, next) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id },
        { $set: { isRead: true } },
        { new: true, runValidators: true }
    );

    if (!notification) {
        return next(
            appErrors.create(
                404,
                "Notification not found",
                httpResponseText.FAIL
            )
        );
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { notification },
    });
});

export const markAllAsRead = asyncWraper(async (req, res, next) => {
    const query = {
        $or: [{ recipient: req.currentUser.userId }],
        isRead: false,
    };

    if (req.currentUser.role === "HR" || req.currentUser.role === "MANAGER") {
        query.$or.push({ recipient: null });
    }

    const result = await Notification.updateMany(query, {
        $set: { isRead: true },
    });

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "All notifications marked as read successfully",
        data: {
            markedCount: result.modifiedCount,
        },
    });
});
