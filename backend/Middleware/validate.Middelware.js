import { z } from "zod";
import appErrors from "../utils/errors.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import { httpResponseText } from "../utils/httpResponseText.js";

export const validate = (schema) => async (req, res, next) => {
    try {
        const validatedData = await schema.parseAsync({
            body: req.body || {},
            query: req.query || {},
            params: req.params || {},
        });

        if (validatedData.body) Object.assign(req.body, validatedData.body);
        if (validatedData.query) Object.assign(req.query, validatedData.query);
        if (validatedData.params)
            Object.assign(req.params, validatedData.params);
        next();
    } catch (error) {
        if (req.body?.general?.avatar) {
            await deleteFromCloudinary(req.body.general.avatar);
        }
        if (req.body?.attachment) {
            await deleteFromCloudinary(req.body.attachment);
        }
        if (req.body?.hrAttachment) {
            await deleteFromCloudinary(req.body.hrAttachment);
        }
        if (error instanceof z.ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path.slice(1).join("."),
                message: issue.message,
            }));
            console.log(errorMessages);
            const newError = appErrors.create(
                400,
                errorMessages,
                httpResponseText.FAIL
            );
            return next(newError);
        }
        next(error);
    }
};
