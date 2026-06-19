import express from "express";
const router = express.Router();
import {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getMyAndTeamTasks,
    getTaskStatistics,
    getEmployeeTaskStatistics,
    searchTasks,
    getOngoingTasks,
} from "../controllers/task.controller.js";
import { verifyToken } from "../guards/verifyToken.js";
import { validate } from "../Middleware/validate.Middelware.js";
import { allowedTo } from "../guards/allowedTo.js";
import {
    validateTaskSchema,
    validateUpdateTaskSchema,
} from "../validators/task.validation.js";

import upload from "../Middleware/multerConfig.js";
import { processUploadedFile2 } from "../Middleware/processUploads2.js";
import { setFilesToBody2 } from "../Middleware/setFilesToBody2.js";

router.route("/stats").get(verifyToken, allowedTo("EMPLOYEE", "HR"), getTaskStatistics);
router.route("/task-stats").get(verifyToken, allowedTo("EMPLOYEE", "HR"), getEmployeeTaskStatistics);

router.route("/search").get(verifyToken, allowedTo("HR", "EMPLOYEE"), searchTasks);
router.route("/my-tasks").get(verifyToken, allowedTo("EMPLOYEE"), getMyAndTeamTasks);

router.route("/").get(verifyToken, allowedTo("HR", "MANAGER"), getTasks);
router
    .route("/ongoing")
    .get(verifyToken, allowedTo("HR", "MANAGER"), getOngoingTasks);
router
    .route("/task/:id")
    .get(verifyToken, allowedTo("HR", "MANAGER"), getTasks);

router
    .route("/:projectId")

    .post(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        upload.any(),
        processUploadedFile2,
        setFilesToBody2(),
        validate(validateTaskSchema),
        createTask
    );

router
    .route("/:id")
    .patch(
        verifyToken,
        allowedTo("HR", "EMPLOYEE", "MANAGER"),
        upload.any(),
        processUploadedFile2,
        setFilesToBody2(),
        validate(validateUpdateTaskSchema),
        updateTask
    )
    .delete(verifyToken, allowedTo("HR", "MANAGER"), deleteTask);

export default router;
