import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const settingsSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },
        companyLogo: {
            type: String,
            required: true,
        },
        companyEmail: {
            type: String,
            required: true,
        },
        timeZone: {
            type: String,
            default: "Africa/Cairo",
        },
        workStartTime: {
            type: String,
            default: "09:00",
        },
        workEndTime: {
            type: String,
            default: "17:00",
        },
        weekEnds: {
            type: [Number],
            default: [5, 6],
        },
        holidays: {
            type: [String],
            default: [],
        },
        gracePeriod: {
            type: Number,
            default: 30,
            required: true,
            min: [0, "gracePeriod must be at least 0"],
            max: [60, "gracePeriod must be at most 60"],
        },
        minutesMultiplier: {
            type: Number,
            default: 2,
            required: true,
            min: [1, "minutesMultiplier must be at least 1"],
            max: [4, "minutesMultiplier must be at most 4"],
        },
        maxDelayMinutes: {
            type: Number,
            default: 120,
            min: [60, "maxDelayMinutes must be at least 60"],
            required: true,
        },
        payrollCutoffDay: {
            type: Number,
            default: 25,
            min: [21, "payrollCutoffDay must be at least 21"],
            max: [28, "payrollCutoffDay must be at most 28"],
        },
        leaveBalance: {
            annual: { type: Number, default: 21 },
            sick: { type: Number, default: 30 },
            casual: { type: Number, default: 6 },
        },
    },
    modelConfig
);

const Setting = mongoose.model("Setting", settingsSchema);
export default Setting;
