import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const requestSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "HR Letter",
                "Payroll Inquiry",
                "Complaint",
                "IT Support",
                "Other",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        attachments: {
            type: String,
        },

        hrResponse: {
            text: {
                type: String,
                default: null,
            },
            attachments: {
                type: String,
                default: null,
            },
        },

        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    modelConfig
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
