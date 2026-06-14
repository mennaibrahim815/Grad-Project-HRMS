import express from "express";
const router = express.Router();

import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import upload from "../Middleware/multerConfig.js";
import { processUploadedFile } from "../Middleware/processUploads.js";
import { validate } from "../Middleware/validate.Middelware.js";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";

import {
    validateApplicantSchema,
    validateUpdateApplicantSchema,
    validateQueryParamsSchema,
    searchApplicantsSchema,
    validateOnboardApplicantSchema,
} from "../validators/applicant.validation.js";

import {
    getAllApplicantsWithFilters,
    getApplicantById,
    getApplicantsByJobId,
    createApplicant,
    updateApplicant,
    deleteApplicant,
    getHiringStatistics,
    searchApplicants,
    onboardApplicant,
} from "../controllers/applicant.controller.js";

// 1. مسارات الإحصائيات والبحث (محددة)
router
    .route("/hiring-statistics")
    .get(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        getHiringStatistics
    );
router
    .route("/search")
    .get(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        validate(searchApplicantsSchema),
        searchApplicants
    );

router
    .route("/:id/onboard")
    .post(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        upload.fields([{ name: "general[avatar]", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ "general[avatar]": "general.avatar" }),
        validate(validateOnboardApplicantSchema),
        onboardApplicant
    );

// 3. مسارات التقديم (محددة بالـ jobId)
router.route("/apply/:jobId").post(
    upload.fields([
        { name: "documents[resume]", maxCount: 1 },
        { name: "personalInfo[avatar]", maxCount: 1 },
    ]),
    processUploadedFile,
    setFilesToBody({
        "documents[resume]": "documents.resume",
        "personalInfo[avatar]": "personalInfo.avatar",
    }),
    validate(validateApplicantSchema),
    createApplicant
);

router
    .route("/job/:jobId")
    .get(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        getApplicantsByJobId
    );

router
    .route("/")
    .get(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        validate(validateQueryParamsSchema),
        getAllApplicantsWithFilters
    );

router
    .route("/:id")
    .get(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        getApplicantById
    )
    .patch(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        validate(validateUpdateApplicantSchema),
        updateApplicant
    )
    .delete(
        verifyToken,
        allowedTo(userRoles.HR, userRoles.MANAGER),
        deleteApplicant
    );

export default router;
