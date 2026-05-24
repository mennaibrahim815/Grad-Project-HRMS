import jwt from "jsonwebtoken";
import appErrors from "../utils/errors.js";
import { httpResponseText } from "../utils/httpResponseText.js";

export const verifyToken = (req, res, next) => {
    let accessToken = req.cookies?.accessToken;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
    }

    if (!accessToken) {
        return next(
            appErrors.create(
                401,
                "Access token is required. Please log in.",
                httpResponseText.FAIL
            )
        );
    }

    try {
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_SECRET_KEY
        );
        req.currentUser = decodedToken;
        next();
    } catch (err) {
        return next(
            appErrors.create(
                401,
                "Invalid or expired access token!",
                httpResponseText.FAIL
            )
        );
    }
};
