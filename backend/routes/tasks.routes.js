import express from "express";
const router = express.Router();
import {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getTasksByProjectId,
} from "../controllers/task.controller.js";
import { verifyToken } from "../guards/verifyToken.js";
import { validate } from "../Middleware/validate.Middelware.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validateTaskSchema, validateUpdateTaskSchema } from "../validators/task.validation.js";

router.route("/").get(verifyToken, getAllTasks);

router
    .route("/:projectId").get(verifyToken, getTasksByProjectId)
    .post(verifyToken, allowedTo("HR", "MANAGER"),validate(validateTaskSchema), createTask);

router
    .route("/:id")
    .patch(verifyToken, allowedTo("HR", "MANAGER"), validate(validateUpdateTaskSchema), updateTask)
    .delete(verifyToken, allowedTo("HR", "MANAGER"), deleteTask);

export default router;
