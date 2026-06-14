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
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    getMyNotifications
);
router.get(
    "/unread-count",
    verifyToken,
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    getUnreadCount
);
router.put(
    "/mark-all-read",
    verifyToken,
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    markAllAsRead
);
router.put(
    "/:id/read",
    verifyToken,
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    markAsRead
);

export default router;
