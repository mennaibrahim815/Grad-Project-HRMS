import User from "../models/user.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";
import bcrypt from "bcrypt";
import { flatten } from "flat";
import { asyncWraper } from "../Middleware/asyncWraper.js";

export const getAllUsers = asyncWraper(async (req, res, next) => {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { "general.role": "EMPLOYEE" };

    const [totalRecords, users] = await Promise.all([
        User.countDocuments(filter),
        User.find(
            filter,
            {
                __v: false,
                "general.password": false,
                "general.passwordResetCode": false,
                "general.passwordResetExpires": false,
                "general.passwordResetVerified": false,
            }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            users,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                limit,
            },
        },
    });
});

export const getUserById = asyncWraper(async (req, res, next) => {
    const userID = req.params.id;
    if (req.currentUser.role !== "HR" && req.currentUser.userId !== userID) {
        const error = appErrors.create(
            403,
            "Forbidden You are not allowed to show other users' data",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const user = await User.findById(userID, {
        __v: false,
        "general.password": false,
        "general.passwordResetCode": false,
        "general.passwordResetExpires": false,
        "general.passwordResetVerified": false,
    });
    if (!user) {
        const error = appErrors.create(
            404,
            "User Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.json({ status: httpResponseText.SUCCESS, data: { user } });
});

export const updateUser = asyncWraper(async (req, res, next) => {
    const userID = req.params.id;
    if (Object.keys(req.body).length === 0) {
        const error = appErrors.create(
            400,
            "Please provide data to update",
            httpResponseText.FAIL
        );
        return next(error);
    }
    // Insecure Direct Object Reference
    if (req.currentUser.role !== "HR" && req.currentUser.userId !== userID) {
        const error = appErrors.create(
            403,
            "Forbidden: You are not allowed to update other users' data",
            httpResponseText.FAIL
        );
        return next(error);
    }
    if (req.body.general?.email) {
        const error = appErrors.create(
            404,
            "Email cannot be updated",
            httpResponseText.FAIL
        );
        return next(error);
    }
    if (req.body.general?.password) {
        const hashedPassword = await bcrypt.hash(req.body.general.password, 10);
        req.body.general.password = hashedPassword;
    }

    const updateData = flatten(req.body);

    const updatedUser = await User.findByIdAndUpdate(
        userID,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    );
    if (!updatedUser) {
        const error = appErrors.create(
            404,
            "User Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    updatedUser.general.password = undefined;
    updatedUser.__v = undefined;
    updatedUser.general.passwordResetCode = undefined;
    updatedUser.general.passwordResetExpires = undefined;
    updatedUser.general.passwordResetVerified = undefined;
    res.json({
        status: httpResponseText.SUCCESS,
        data: { user: updatedUser },
    });
});

export const deleteUser = asyncWraper(async (req, res, next) => {
    const userID = req.params.id;
    const user = await User.findByIdAndDelete(userID);
    if (!user) {
        const error = appErrors.create(
            404,
            "User Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.json({ status: httpResponseText.SUCCESS, data: null });
});

export const searchEmployees = asyncWraper(async (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return res
            .status(200)
            .json({ status: httpResponseText.SUCCESS, data: { results: [] } });
    }

    const results = await User.aggregate([
        // {
        //     $match: {
        //         $or: [
        //             { "general.firstName": { $regex: name, $options: "i" } },
        //             { "general.lastName": { $regex: name, $options: "i" } }
        //         ]
        //     }
        // },
        {
            $match: {
                $or: [
                    { "general.firstName": { $regex: name, $options: "i" } },
                    { "general.lastName": { $regex: name, $options: "i" } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: {
                                    $concat: [
                                        "$general.firstName",
                                        " ",
                                        "$general.lastName",
                                    ],
                                },
                                regex: name,
                                options: "i",
                            },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                _id: 1,
                "general.firstName": 1,
                "general.lastName": 1,
                "general.avatar": 1,
                "employee.jobTitle": 1,
            },
        },
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { results },
    });
});
