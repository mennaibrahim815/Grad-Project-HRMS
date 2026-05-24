import { Router } from "express";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    createLeave,
    deleteLeave,
    getAllLeaves,
    getLeaveById,
    getUserLeavesById,
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
    validateIdParams,
} from "../validators/common.validation.js";
import { getAllLeavesQuerySchema } from "../validators/leave.validation.js";

const router = Router();

router
    .route("/")
    .get(
        verifyToken,
        allowedTo("HR"),
        validate(getAllLeavesQuerySchema),
        getAllLeaves
    );
router.get("/search", validate(dailySearchSchema), searchLeave);

router
    .route("/employee/:id")
    .get(verifyToken, validate(validateIdParams), getUserLeavesById);

router.route("/:id").get(verifyToken, validate(validateIdParams), getLeaveById);

router
    .route("/create")
    .post(
        verifyToken,
        allowedTo("EMPLOYEE"),
        upload.fields([{ name: "attachment", maxCount: 1 }]),
        setFilesToBody({ attachment: "attachment" }),
        validate(validateLeaveSchema),
        createLeave
    );

router
    .route("/:id")
    .patch(
        verifyToken,
        allowedTo("EMPLOYEE"),
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
        allowedTo("HR"),
        validate(validateIdParams),
        validate(validateLeaveStatusSchema),
        updateLeaveStatus
    );

router
    .route("/:id")
    .delete(
        verifyToken,
        allowedTo("EMPLOYEE"),
        validate(validateIdParams),
        deleteLeave
    );

export default router;
