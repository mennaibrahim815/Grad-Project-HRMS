import appErrors from "../utils/errors.js";
import { httpResponseText } from "../utils/httpResponseText.js";

export const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            const error = appErrors.create(
                403,
                "User not authorized to perform this action",
                httpResponseText.FAIL
            );
            return next(error);
        }
        next();
    };
};
