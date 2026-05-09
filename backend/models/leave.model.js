import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const leaveSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["Sick", "Annual", "Casual", "Unpaid", "Other"],
            required: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String, required: true },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        rejectReason: { type: String, default: null },
        attachment: { type: String, default: null },
        duration: { type: Number, required: true },
        hrId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    modelConfig
);
leaveSchema.index({ employeeId: 1, status: 1, startDate: 1, endDate: 1 });
const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
