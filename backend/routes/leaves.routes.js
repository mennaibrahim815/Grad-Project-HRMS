import { Router } from "express";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    createLeave,
    deleteLeave,
    getAllLeaves,
    getEmployeeLeavesById,
    getLeaveBalances,
    getLeaveById,
    getMonthlyLeaveStats,
    getMyLeaves,
    getYearlyLeaveChart,
    searchLeave,
    updateLeave,
    updateLeaveStatus,
} from "../controllers/leave.controller.js";
import {
    validateLeaveSchema,
    validateLeaveStatusSchema,
    validateUpdateLeaveSchema,
} from "../validators/leave.validation.js";
import upload from "../Middleware/multerConfig.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import {
    dailySearchSchema,
    monthYearQuerySchema,
    validateIdParams,
    validateYearQuery,
} from "../validators/common.validation.js";
import { getAllLeavesQuerySchema } from "../validators/leave.validation.js";

const router = Router();

router.get("/my-balance", verifyToken, getLeaveBalances);

router.get(
    "/balance/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    getLeaveBalances
);

router
    .route("/")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(getAllLeavesQuerySchema),
        getAllLeaves
    );
router.get("/search", validate(dailySearchSchema), searchLeave);

router
    .route("/employee/me")
    .get(verifyToken, allowedTo("HR", "EMPLOYEE", "MANAGER"), getMyLeaves);

router
    .route("/employee/:id")
    .get(verifyToken, allowedTo("HR", "MANAGER"), getEmployeeLeavesById);

router.route("/:id").get(verifyToken, validate(validateIdParams), getLeaveById);

router
    .route("/create")
    .post(
        verifyToken,
        allowedTo("EMPLOYEE", "MANAGER"),
        upload.fields([{ name: "attachment", maxCount: 1 }]),
        setFilesToBody({ attachment: "attachment" }),
        validate(validateLeaveSchema),
        createLeave
    );

router
    .route("/:id")
    .patch(
        verifyToken,
        allowedTo("EMPLOYEE", "MANAGER"),
        upload.fields([{ name: "attachment", maxCount: 1 }]),
        setFilesToBody({ attachment: "attachment" }),
        validate(validateIdParams),
        validate(validateUpdateLeaveSchema),
        updateLeave
    );

router
    .route("/:id/status")
    .patch(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(validateIdParams),
        validate(validateLeaveStatusSchema),
        updateLeaveStatus
    );

router
    .route("/:id")
    .delete(
        verifyToken,
        allowedTo("EMPLOYEE", "MANAGER"),
        validate(validateIdParams),
        deleteLeave
    );

router.get(
    "/stats/monthly/me",
    verifyToken,
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    validate(monthYearQuerySchema),
    getMonthlyLeaveStats
);

router.get(
    "/stats/monthly",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(monthYearQuerySchema),
    getMonthlyLeaveStats
);

router.get(
    "/stats/monthly/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(monthYearQuerySchema),
    validate(validateIdParams),
    getMonthlyLeaveStats
);

router.get(
    "/stats/yearly/me",
    verifyToken,
    allowedTo("HR", "EMPLOYEE", "MANAGER"),
    validate(validateYearQuery),
    getYearlyLeaveChart
);

router.get(
    "/stats/yearly",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateYearQuery),
    getYearlyLeaveChart
);

router.get(
    "/stats/yearly/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateYearQuery),
    validate(validateIdParams),
    getYearlyLeaveChart
);

export default router;
