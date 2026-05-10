import jwt from "jsonwebtoken";
import cookie from "cookie";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";

export const socketAuthMiddleware = (socket, next) => {
    try {
        let accessToken;

        if (socket.handshake.auth && socket.handshake.auth.token) {
            accessToken = socket.handshake.auth.token;
        } else if (socket.request.headers.cookie) {
            const cookies = cookie.parse(socket.request.headers.cookie);
            accessToken = cookies.accessToken;
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

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_SECRET_KEY
        );

        socket.currentUser = decodedToken;
        next();
    } catch (err) {
        console.error("Socket Auth Error:", err.message);

        return next(
            appErrors.create(
                400,
                "Authentication error: Invalid or expired token",
                httpResponseText.FAIL
            )
        );
    }
};
