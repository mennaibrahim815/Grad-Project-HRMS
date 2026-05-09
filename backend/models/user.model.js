import mongoose from "mongoose";
import validator from "validator";
import userRoles from "../utils/userRole.js";
import { modelConfig } from "../utils/modelConfig.js";

const userSchema = new mongoose.Schema(
    {
        general: {
            firstName: {
                type: String,
                required: true,
                minLength: [3, "the minimum number of character is 3"],
            },
            lastName: {
                type: String,
                required: true,
                minLength: [3, "the minimum number of character is 3"],
            },
            email: {
                type: String,
                required: true,
                unique: true,
                validate: [validator.isEmail, "Invalid email"],
            },
            password: {
                type: String,
                required: true,
                minLength: [
                    8,
                    "the password must be at least 8 characters long",
                ],
            },
            passwordResetCode: { type: String, default: null },
            passwordResetExpires: { type: Date, default: null },
            passwordResetVerified: { type: Boolean, default: false },
            role: {
                type: String,
                enum: ["HR", "EMPLOYEE", "MANAGER"],
                default: "EMPLOYEE",
            },
            rfidTag: { type: String, required: true, unique: true },
            phone: {
                type: String,
                required: true,
                minLength: [
                    6,
                    "the phone number must be at least 6 numbers long",
                ],
            },
            gender: { type: String, enum: ["Male", "Female"] },
            address: {
                type: String,
                required: true,
            },
            avatar: {
                type: String,
                default: "/uploads/default-avatar.png",
            },
        },

        experience: {
            company: { type: String },
            position: { type: String },
            jobType: {
                type: String,
                enum: ["Full-time", "Part-time", "Internship", "Contract"],
            },
            baseSalary: { type: Number },
            startDate: { type: Date },
            endDate: { type: Date },
        },

        employee: {
            jobTitle: {
                type: String,
                required: true,
            },
            department: {
                type: String,
                required: true,
            },
            workLocation: {
                type: String,
                required: true,
            },
            jobType: {
                type: String,
                enum: ["Full-time", "Part-time", "Internship", "Contract"],
            },
            workingHours: {
                type: Number,
                required: true,
                default: 8,
                min: [4, "working hours must be at least 4 hours"],
                max: [12, "working hours must be at most 12 hours"],
            },
            joiningDate: { type: Date, required: true },
            baseSalary: { type: Number, required: true },
            status: {
                type: String,
                enum: ["Active", "Archived"],
                default: "Active",
            },
            leaveBalance: {
                annual: { type: Number, default: 21 },
                sick: { type: Number, default: 30 },
                casual: { type: Number, default: 6 },
            },
        },
    },
    modelConfig
);

const User = mongoose.model("User", userSchema);
export default User;
