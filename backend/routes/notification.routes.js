import express from "express";
import { verifyToken } from "../guards/verifyToken.js";
import {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../controllers/notification.controller.js";
import { allowedTo } from "../guards/allowedTo.js";

const router = express.Router();

router.use(verifyToken);

router.get(
    "/my-notifications",
    verifyToken,
    allowedTo("HR", "EMPLOYEE"),
    getMyNotifications
);
router.get(
    "/unread-count",
    verifyToken,
    allowedTo("HR", "EMPLOYEE"),
    getUnreadCount
);
router.put(
    "/mark-all-read",
    verifyToken,
    allowedTo("HR", "EMPLOYEE"),
    markAllAsRead
);
router.put("/:id/read", verifyToken, allowedTo("HR", "EMPLOYEE"), markAsRead);

export default router;
