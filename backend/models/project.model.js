import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const projectSchema = new mongoose.Schema(
    {
        general: {
            avatar: {
                type: String,
                default:
                    "https://res.cloudinary.com/dh4qznqpd/image/upload/v1779033102/hrms_uploads/fuawxxtbgih0g5e5drax.jpg",
            },
            name: {
                type: String,
                required: [true, "Project name is required"],
                unique: true,
            },
            description: {
                type: String,
                required: [true, "Project description is required"],
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            startDate: {
                type: Date,
                default: Date.now,
            },
            deadline: {
                type: Date,
                required: [true, "Deadline is required"],
            },
            tag: {
                type: String,
                enum: ["UI Design", "Marketing", "Social Media"],
                required: [true, "Tag is required"],
            },
        },
        
        assignedTo: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                general: {
                    firstName: { type: String, required: true },
                    lastName: { type: String, required: true },
                    avatar: { type: String, required: true },
                },
                employee: {
                    jobTitle: { type: String },
                },
            },
        ],
        status: {
            type: String,
            enum: ["On-going", "Pending", "Completed"],
            default: "Pending",
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: [true, "Priority is required"],
        },
        documents: {
            type: [
                {
                    name: { type: String },
                },
            ],
        },
    },
    modelConfig
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
