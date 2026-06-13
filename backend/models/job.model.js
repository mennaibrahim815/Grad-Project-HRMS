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
        requiredSkills: {
            type: [String], // مثال: ["React", "Node.js", "MongoDB"]
            required: true,
        },
        requiredExperienceYears: {
            type: Number,
            required: true,
        },
        requiredEducationLevel: {
            type: String,
            enum: ["High School", "Bachelor's", "Master's", "PhD"],
            default: "Bachelor's",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    modelConfig
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
