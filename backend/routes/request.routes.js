import { Router } from "express";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import upload from "../Middleware/multerConfig.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import { validateIdParams } from "../validators/common.validation.js";

import {
    createRequestSchema,
    updateRequestSchema,
    replyRequestSchema,
    getAllRequestsQuerySchema,
} from "../validators/request.validation.js";

import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    replyToRequest,
    getMonthlyRequestStats,
    getYearlyRequestChart,
    getMyRequests,
    getEmployeeRequestsById,
} from "../controllers/request.controller.js";
import { processUploadedFile } from "../Middleware/processUploads.js";

const router = Router();

router
    .route("/")
    .get(verifyToken, validate(getAllRequestsQuerySchema), getAllRequests);

router
    .route("/create")
    .post(
        verifyToken,
        allowedTo("EMPLOYEE"),
        upload.fields([{ name: "attachment", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ attachment: "attachment" }),
        validate(createRequestSchema),
        createRequest
    );

router.get(
    "/monthly-stats",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    getMonthlyRequestStats
);
router.get("/monthly-stats/me", verifyToken, getMonthlyRequestStats);
router.get(
    "/monthly-stats/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateIdParams),
    getMonthlyRequestStats
);

router.get(
    "/yearly-chart",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    getYearlyRequestChart
);
router.get("/yearly-chart/me", verifyToken, getYearlyRequestChart);
router.get(
    "/yearly-chart/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateIdParams),
    getYearlyRequestChart
);

router.get("/history/me", verifyToken, getMyRequests);

router.get(
    "/history/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateIdParams),
    getEmployeeRequestsById
);

router
    .route("/:id")
    .get(verifyToken, validate(validateIdParams), getRequestById)
    .patch(
        verifyToken,
        allowedTo("EMPLOYEE"),
        upload.fields([{ name: "attachment", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ attachment: "attachment" }),
        validate(validateIdParams),
        validate(updateRequestSchema),
        updateRequest
    )
    .delete(
        verifyToken,
        allowedTo("EMPLOYEE"),
        validate(validateIdParams),
        deleteRequest
    );

router
    .route("/:id/reply")
    .patch(
        verifyToken,
        allowedTo("HR"),
        upload.fields([{ name: "hrAttachment", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ hrAttachment: "hrAttachment" }),
        validate(validateIdParams),
        validate(replyRequestSchema),
        replyToRequest
    );

export default router;
