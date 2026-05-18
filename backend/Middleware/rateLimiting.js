import rateLimit from "express-rate-limit";
import { httpResponseText } from "../utils/httpResponseText.js";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        status: httpResponseText.FAIL,
        message:
            "Too many login attempts from this IP, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
