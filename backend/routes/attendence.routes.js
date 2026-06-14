import { Router } from "express";
import {
    checkIn,
    getAllAttandence,
    getEmployeeAttendanceById,
    getMonthlyAttendanceStats,
    getMyAttendance,
    getSixMonthsAttendanceStats,
    searchAttendance,
} from "../controllers/attendance.controller.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    AttendanceByEmployeeIdQuery,
    getAllAttendanceQuerySchema,
    validateCheckInSchema,
    weeklyStatsSchema,
} from "../validators/attendance.validation.js";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import {
    dailySearchSchema,
    monthlyStatsSchema,
    validateIdParams,
} from "../validators/common.validation.js";

const router = Router();

router
    .route("/")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(getAllAttendanceQuerySchema),
        getAllAttandence
    );
router.get("/search", validate(dailySearchSchema), searchAttendance);

router
    .route("/employee/me")
    .get(verifyToken, allowedTo("HR", "EMPLOYEE", "MANAGER"), getMyAttendance);
router
    .route("/employee/:id")
    .get(verifyToken, allowedTo("HR", "MANAGER"), getEmployeeAttendanceById);

router.route("/check-in").post(validate(validateCheckInSchema), checkIn);

router
    .route("/stats/monthly/me")
    .get(
        verifyToken,
        allowedTo("HR", "EMPLOYEE", "MANAGER"),
        validate(monthlyStatsSchema),
        getMonthlyAttendanceStats
    );

router
    .route("/stats/monthly")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(monthlyStatsSchema),
        getMonthlyAttendanceStats
    );
router
    .route("/stats/monthly/:id")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(monthlyStatsSchema),
        validate(validateIdParams),
        getMonthlyAttendanceStats
    );
router
    .route("/stats-six-months/me")
    .get(
        verifyToken,
        allowedTo("HR", "EMPLOYEE", "MANAGER"),
        validate(monthlyStatsSchema),
        getSixMonthsAttendanceStats
    );

router
    .route("/stats-six-months")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(monthlyStatsSchema),
        getSixMonthsAttendanceStats
    );

router
    .route("/stats-six-months/:id")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(monthlyStatsSchema),
        validate(validateIdParams),
        getSixMonthsAttendanceStats
    );

export default router;
