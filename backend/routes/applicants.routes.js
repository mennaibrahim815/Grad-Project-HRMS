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
} from "../controllers/applicant.controller.js";

router
    .route("/")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateQueryParamsSchema),
        getAllApplicantsWithFilters
    );

router
    .route("/hiring-statistics")
    .get(verifyToken, allowedTo(userRoles.HR), getHiringStatistics);

router
    .route("/search")
    .get(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(searchApplicantsSchema),
        searchApplicants
    );

router
    .route("/apply/:jobId")
    .post(
        verifyToken,
        allowedTo(userRoles.HR),
        upload.fields([{ name: "documents[resume]", maxCount: 1 },
            {name:"personalInfo[avatar]", maxCount: 1}
        ]),
        processUploadedFile,
        setFilesToBody({
            "documents[resume]": "documents.resume",
            "personalInfo[avatar]": "personalInfo.avatar"
        }),
        validate(validateApplicantSchema),
        createApplicant
    );

router
    .route("/job/:jobId")
    .get(verifyToken, allowedTo(userRoles.HR), getApplicantsByJobId);

router
    .route("/:id")
    .get(verifyToken, allowedTo(userRoles.HR), getApplicantById)
    .patch(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateUpdateApplicantSchema),
        updateApplicant
    )
    .delete(verifyToken, allowedTo(userRoles.HR), deleteApplicant);

export default router;
