import express from "express";
const router = express.Router();

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";
import { validate } from "../Middleware/validate.Middelware.js";

import {
    getEmployeeDashboardStats,
    getEmployeeWeeklyAttendanceStats,
    getMyProjects,
    getRecentRequests,
} from "../controllers/employeeDashboard.controller.js";

router
    .route("/dashboard-stats")
    .get(
        verifyToken,
        allowedTo("EMPLOYEE", "HR", "MANAGER"),
        getEmployeeDashboardStats
    );
router
    .route("/my-projects")
    .get(verifyToken, allowedTo("EMPLOYEE"), getMyProjects);
router
    .route("/recent-requests")
    .get(verifyToken, allowedTo("EMPLOYEE"), getRecentRequests);
router
    .route("/stats/weekly/me")
    .get(
        verifyToken,
        allowedTo("EMPLOYEE"),
        validate(weeklyStatsSchema),
        getEmployeeWeeklyAttendanceStats
    );

export default router;
