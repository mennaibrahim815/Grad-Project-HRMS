import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            default: null,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                "Leave",
                "Payroll",
                "Attendance",
                "System",
                "Warning",
                "Request",
            ],
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
    },
    modelConfig
);

notificationSchema.index({ recipient: 1, isRead: 1 });
export default mongoose.model("Notification", notificationSchema);
