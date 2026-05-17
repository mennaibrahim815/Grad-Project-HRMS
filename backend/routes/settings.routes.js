import { Router } from "express";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    getAllSettings,
    updateSettings,
} from "../controllers/setting.controller.js";
import upload from "../Middleware/multerConfig.js";
import { setFilesToBody } from "../Middleware/setFilesToBody.js";
import { updateSettingsSchema } from "../validators/settings.vaildation.js";
import { processUploadedFile } from "../Middleware/processUploads.js";

const router = Router();

router.route("/").get(verifyToken, allowedTo("HR"), getAllSettings);

router
    .route("/update")
    .patch(
        verifyToken,
        allowedTo("HR"),
        upload.fields([{ name: "companyLogo", maxCount: 1 }]),
        processUploadedFile,
        setFilesToBody({ companyLogo: "companyLogo" }),
        validate(updateSettingsSchema),
        updateSettings
    );
export default router;
