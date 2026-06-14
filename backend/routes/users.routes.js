import { Router } from "express";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchEmployees,
    getAllHRs,
} from "../controllers/user.controller.js";

import {
    searchEmployeesSchema,
    updateValidateUserSchema,
} from "../validators/users.validation.js";
import { validateIdParams } from "../validators/common.validation.js";
import upload from "../Middleware/multerConfig.js";
import { processUploadedFile } from "../Middleware/processUploads.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";

const router = Router();

// 1. المسارات المحددة (Static Routes) لازم تكون في الأول
router.route("/hrs").get(verifyToken, allowedTo("MANAGER"), getAllHRs);

router
    .route("/search")
    .get(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        validate(searchEmployeesSchema),
        searchEmployees
    );

// 2. المسار الأساسي (Base Route)
router.route("/").get(verifyToken, allowedTo("HR", "MANAGER"), getAllUsers);

// 3. المسارات الديناميكية (Dynamic Routes) لازم تكون في الآخر
router
    .route("/:id")
    .get(verifyToken, validate(validateIdParams), getUserById)
    .patch(
        verifyToken,
        upload.fields([{ name: "general[avatar]", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ "general[avatar]": "general.avatar" }),
        validate(validateIdParams),
        validate(updateValidateUserSchema),
        updateUser
    )
    .delete(verifyToken, allowedTo("HR", "MANAGER"), deleteUser);

export default router;
