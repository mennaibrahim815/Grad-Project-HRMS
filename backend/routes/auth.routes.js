import { Router } from "express";

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import upload from "../Middleware/multerConfig.js";
import { validate } from "../Middleware/validate.Middelware.js";
import { loginLimiter } from "../Middleware/rateLimiting.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import {
    forgetPassword,
    getMe,
    login,
    logout,
    refreshUserToken,
    register,
    resetPassword,
    verifyResetCode,
} from "../controllers/auth.controller.js";
import {
    validateUserSchema,
    validateLogInSchema,
    forgetPasswordSchema,
    verifyResetCodeSchema,
    resetPasswordSchema,
} from "../validators/users.validation.js";
import { processUploadedFile } from "../Middleware/processUploads.js";

const router = Router();

router
    .route("/register")
    .post(
        verifyToken,
        allowedTo("HR", "MANAGER"),
        upload.fields([{ name: "general[avatar]", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ "general[avatar]": "general.avatar" }),
        validate(validateUserSchema),
        register
    );

router.route("/me").get(verifyToken, getMe);

router.route("/login").post(validate(validateLogInSchema), loginLimiter, login);

router.route("/logout").post(verifyToken, logout);

router.route("/refresh").post(refreshUserToken);

router
    .route("/forget-Password")
    .post(validate(forgetPasswordSchema), forgetPassword);

router
    .route("/verify-reset-code")
    .post(validate(verifyResetCodeSchema), verifyResetCode);
router
    .route("/reset-password")
    .post(validate(resetPasswordSchema), resetPassword);

export default router;
