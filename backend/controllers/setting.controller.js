import { httpResponseText } from "../utils/httpResponseText.js";
import Setting from "../models/settings.models.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import appErrors from "../utils/errors.js";

export const getAllSettings = asyncWraper(async (req, res, next) => {
    const settings = await Setting.findOne({});
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { settings },
    });
});

export const updateSettings = asyncWraper(async (req, res, next) => {
    const updatedData = req.body;
    if (Object.keys(updatedData).length === 0) {
        const error = appErrors.create(
            400,
            "Please provide data to update",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const settings = await Setting.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
    });
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { settings },
    });
});
