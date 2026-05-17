import { httpResponseText } from "../utils/httpResponseText.js";
import User from "../models/user.model.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import appErrors from "../utils/errors.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import { getCookieOptions } from "../utils/cookiesOptions.js";

export const register = asyncWraper(async (req, res, next) => {
    const { general, experience, employee } = req.body;

    const oldUser = await User.findOne({ "general.email": general.email });
    if (oldUser) {
        if (general.avatar) await deleteFromCloudinary(general.avatar);
        return next(
            appErrors.create(400, "User Already Exists", httpResponseText.FAIL)
        );
    }

    if (general?.rfidTag) {
        const oldRfid = await User.findOne({
            "general.rfidTag": general.rfidTag,
        });
        if (oldRfid) {
            if (general.avatar) await deleteFromCloudinary(general.avatar);
            return next(
                appErrors.create(
                    400,
                    "RFID Tag is already assigned to another employee",
                    httpResponseText.FAIL
                )
            );
        }
    }

    try {
        const generatedPassword = crypto.randomBytes(4).toString("hex");

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        general.password = hashedPassword;

        const newUser = new User({ general, experience, employee });
        await newUser.save();

        try {
            await sendEmail({
                email: newUser.general.email,
                subject: "Welcome to the Team - Your Account Details",
                message: `
                    Dear ${newUser.general.firstName} ${newUser.general.lastName},
                    
                    Your account has been successfully created in the company's HR system.
                    
                    Here are your login credentials:
                    Email: ${newUser.general.email}
                    Temporary Password: ${generatedPassword}
                    
                    Please log in and change your password as soon as possible.
                    
                    Best Regards,
                    HR Department
                `,
            });
        } catch (emailError) {
            await User.findByIdAndDelete(newUser._id);
            if (general.avatar) await deleteFromCloudinary(general.avatar);

            return next(
                appErrors.create(
                    500,
                    "Failed to send welcome email. Employee registration aborted.",
                    httpResponseText.FAIL
                )
            );
        }

        newUser.general.password = undefined;
        newUser.__v = undefined;

        res.status(201).json({
            status: httpResponseText.SUCCESS,
            message: "Employee registered successfully and welcome email sent.",
            data: { newUser },
        });
    } catch (error) {
        if (general.avatar) await deleteFromCloudinary(general.avatar);
        return next(error);
    }
});

export const login = asyncWraper(async (req, res, next) => {
    const { email, password } = req.body;

    const oldUser = await User.findOne({ "general.email": email });
    if (!oldUser) {
        const error = appErrors.create(
            400,
            "Invalid email or password",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const isMatchedPass = await bcrypt.compare(
        password,
        oldUser.general.password
    );

    if (!isMatchedPass) {
        const error = appErrors.create(
            400,
            "Invalid email or password",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const { accessToken, refreshToken } = generateToken({
        email: oldUser.general.email,
        userId: oldUser._id,
        role: oldUser.general.role,
    });

    res.cookie("accessToken", accessToken, getCookieOptions(2));

    res.cookie("refreshToken", refreshToken, getCookieOptions(7));

    const userResponse = oldUser.toObject();
    delete userResponse.general.password;
    delete userResponse.__v;
    delete userResponse.general.passwordResetCode;
    delete userResponse.general.passwordResetExpires;
    delete userResponse.general.passwordResetVerified;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "Successfully logged in",
        data: {
            user: userResponse,
            accessToken,
            refreshToken,
        },
    });
});

export const refreshUserToken = asyncWraper(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
        const error = appErrors.create(401, "you must log in", FAIL);
        return next(error);
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const payload = {
            email: decoded.email,
            userId: decoded.userId,
            role: decoded.role,
        };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "2d",
        });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000,
        });
        res.status(200).json({
            status: httpResponseText.SUCCESS,
            data: { accessToken: newAccessToken },
        });
    } catch (err) {
        return next(
            appErrors.create(401, "Invalid or expired refreshtoken", ERROR)
        );
    }
});

export const logout = asyncWraper(async (req, res, next) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "Logged out successfully",
    });
});

export const forgetPassword = asyncWraper(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        const error = appErrors.create(
            400,
            "Email is required",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const oldUser = await User.findOne({ "general.email": email });
    if (!oldUser) {
        const error = appErrors.create(
            404,
            "User not found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    oldUser.general.passwordResetCode = hashedResetCode;
    oldUser.general.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    oldUser.general.passwordResetVerified = false;
    await oldUser.save();

    try {
        await sendEmail({
            email: oldUser.general.email,
            subject: "Password Reset OTP",
            message: `Your OTP code for password reset is: ${resetCode}`,
        });
        res.status(200).json({
            status: httpResponseText.SUCCESS,
            message: "OTP code sent to your email",
        });
    } catch (err) {
        oldUser.general.passwordResetCode = null;
        oldUser.general.passwordResetExpires = null;
        await oldUser.save();
        return next(
            appErrors.create(
                500,
                `Nodemailer Error: ${err.message}`,
                httpResponseText.FAIL
            )
        );
    }
});

export const verifyResetCode = asyncWraper(async (req, res, next) => {
    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
        const error = appErrors.create(
            400,
            "Email and resetCode are required",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    const user = await User.findOne({
        "general.email": email,
        "general.passwordResetCode": hashedResetCode,
        "general.passwordResetExpires": { $gt: Date.now() },
    });

    if (!user) {
        const error = appErrors.create(
            400,
            "Invalid or expired reset code for this email",
            httpResponseText.FAIL
        );
        return next(error);
    }

    user.general.passwordResetVerified = true;
    user.general.passwordResetCode = null;
    user.general.passwordResetExpires = null;
    user.markModified("general");
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "Reset code verified successfully",
    });
});

export const resetPassword = asyncWraper(async (req, res, next) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        const error = appErrors.create(
            400,
            "email and newPassword are required",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const user = await User.findOne({ "general.email": email });
    if (!user) {
        const error = appErrors.create(
            404,
            "user not found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    if (!user.general.passwordResetVerified) {
        const error = appErrors.create(
            400,
            "reset code not verified",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.general.password = hashedPassword;
    user.general.passwordResetVerified = false;
    user.markModified("general");
    await user.save();
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: "password reset successfully",
    });
});

export const getMe = asyncWraper(async (req, res, next) => {
    const user = await User.findById(req.currentUser.userId).select(
        "-general.password -general.passwordResetCode -general.passwordResetExpires -general.passwordResetVerified -__v"
    );

    if (!user) {
        return next(
            appErrors.create(404, "User not found", httpResponseText.FAIL)
        );
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { user },
    });
});
