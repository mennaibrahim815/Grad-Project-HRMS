import express from "express";
const router = express.Router();

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";
import { validate } from "../Middleware/validate.Middelware.js";

import {
    validateApplicantStatisticsSchema,
    validateProjectSummarySchema,
    validateDashboardStatisticsSchema,
    validateEmployeeStatusSchema,
} from "../validators/dashboard.validation.js";

import {
    getDashboardStatistics,
    getApplicantsByStatus,
    getEmployeeStatus,
    getProjectSummary,
    getWeeklyAttendanceStats,
} from "../controllers/dashboard.controller.js";
import { monthlyStatsSchema } from "../validators/common.validation.js";
import { weeklyStatsSchema } from "../validators/attendance.validation.js";

router
    .route("/summary")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateDashboardStatisticsSchema),
        getDashboardStatistics
    );

router
    .route("/recent-applicants")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateApplicantStatisticsSchema),
        getApplicantsByStatus
    );

router
    .route("/employee-status")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateEmployeeStatusSchema),
        getEmployeeStatus
    );

router
    .route("/project-overview")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateProjectSummarySchema),
        getProjectSummary
    );

router
    .route("/stats/weekly")
    .get(
        verifyToken,
        allowedTo("HR"),
        validate(weeklyStatsSchema),
        getWeeklyAttendanceStats
    );

export default router;
