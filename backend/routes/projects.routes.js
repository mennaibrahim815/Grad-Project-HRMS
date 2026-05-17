import express from "express";
const router = express.Router();
import {
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    createProject,
    searchProjects,
    getProjectStats,
} from "../controllers/project.controller.js";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    validateProjectSchema,
    updateValidateProjectSchema,
    searchProjectsSchema,
    validateProjectQueryParamsSchema,
} from "../validators/project.validation.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import upload from "../Middleware/multerConfig.js";
import { processUploadedFile } from "../Middleware/processUploads.js";

router
    .route("/")
    .get(verifyToken, allowedTo("HR"), validate(validateProjectQueryParamsSchema), getAllProjects)
    .post(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        upload.fields([
            { name: "general[avatar]", maxCount: 1 },
            { name: "documents", maxCount: 10 },
        ]),
        processUploadedFile,
        setFilesToBody({
            "general[avatar]": "general.avatar",
            documents: "documents",
        }),
        validate(validateProjectSchema),
        createProject
    );
    
router.route("/stats").get(verifyToken, getProjectStats);
    
router.route("/search").get(verifyToken,allowedTo("HR"), validate(searchProjectsSchema), searchProjects);

router
    .route("/:id")
    .get(verifyToken, getProjectById)
    .patch(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(updateValidateProjectSchema),
        updateProject
    )
    .delete(verifyToken, allowedTo("HR", "MANAGER"), deleteProject);

export default router;
