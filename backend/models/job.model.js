import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            enum: ["UI Design", "Marketing", "Social Media"],
            required: true,
        },
        experienceLevel: {
            type: String,
            enum: ["Senior", "Mid-Level", "Junior"],
            required: true,
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true,
        },
        workLocation: {
            type: String,
            enum: ["Remote", "On-site", "Hybrid"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    modelConfig
);

const Job = mongoose.model("Job", jobSchema);
export default Job;