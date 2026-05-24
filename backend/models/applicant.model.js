import mongoose from "mongoose";
import validator from "validator";
import { modelConfig } from "../utils/modelConfig.js";

const applicantSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        personalInfo: {
            firstName: {
                type: String,
                required: [true, "First name is required"],
            },
            lastName: {
                type: String,
                required: [true, "Last name is required"],
            },
            email: {
                type: String,
                required: [true, "Email address is required"],
                validate: [validator.isEmail, "Invalid email address"],
            },
            phone: {
                type: String,
                required: [true, "Phone number is required"],
            },
            dateOfBirth: { type: Date },
            gender: {
                type: String,
                enum: ["Male", "Female"],
                required: [true, "Gender is required"],
            },
            city: { type: String },
            country: { type: String },
            department: {
                type: String,
                enum: ["UI Design", "Marketing", "Social Media"],
                required: [true, "Department is required"],
            },
            experienceLevel: {
                type: String,
                enum: ["Senior", "Mid-Level", "Junior"],
                required: [true, "Experience level is required"],
            },
            avatar: {
                type: String,
                default: "/uploads/default-avatar.png",
            },
        },
        
        professionalInfo: {
            yearsOfExperience: { type: String },
            currentJobTitle: { type: String },
            currentCompany: { type: String },
            educationLevel: {
                type: String,
                enum: ["High School", "Bachelor's", "Master's", "PhD"],
                required: [true, "Education level is required"],
            },
            skills: { type: [String] },
        },

        documents: {
            resume: {
                type: String,
                required: [true, "Resume is required"],
            },
            portfolio: { type: String },
        },

        additionalQuestions: {
            motivation: {
                type: String,
                required: [true, "Motivation is required"],
            },
            earliestStartDate: {
                type: Date,
                required: [true, "Earliest start date is required"],
            },
            workPreference: {
                type: String,
                enum: ["Remote", "On-site", "Hybrid"],
                required: [true, "Work preference is required"],
            },
        },
        status: {
            type: String,
            enum: ["Applied", "Interviewing", "Hired", "Rejected"],
            default: "Applied",
        },
    },
    modelConfig
);

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
