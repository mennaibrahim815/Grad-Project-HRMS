import { z } from "zod";

export const validateApplicantSchema = z.object({
    params: z.object({
        jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),
    }),
    body: z.object({
        personalInfo: z.object({
            firstName: z.string().min(3),
            lastName: z.string().min(3),
            email: z.string().email(),
            phone: z.string().min(6),
            gender: z.enum(["Male", "Female"]),
            department: z.enum(["UI Design", "Marketing", "Social Media"]),
            experienceLevel: z.enum(["Senior", "Mid-Level", "Junior"]),
            avatar: z.string().optional(),
        }),
        professionalInfo: z.object({
            educationLevel: z.enum(["High School", "Bachelor's", "Master's", "PhD"]),
            yearsOfExperience: z.string().optional(),
            currentJobTitle: z.string().optional(),
            currentCompany: z.string().optional(),
            skills: z.array(z.string()).optional(),
        }),
        documents: z.object({
            resume: z.string(),
            portfolio: z.string().optional(),
        }),
        additionalQuestions: z.object({
            motivation: z.string(),
            earliestStartDate: z.coerce.date(),
            workPreference: z.enum(["Remote", "On-site", "Hybrid"]),
        }),
        status: z.enum(["Applied", "Interviewing", "Hired", "Rejected"]).optional(),
    }),
});

export const validateUpdateApplicantSchema = z.object({
    body:z.object({
        personalInfo: validateApplicantSchema.shape.body.shape.personalInfo.partial().optional(),
        professionalInfo: validateApplicantSchema.shape.body.shape.professionalInfo.partial().optional(),
        documents: validateApplicantSchema.shape.body.shape.documents.partial().optional(),
        additionalQuestions: validateApplicantSchema.shape.body.shape.additionalQuestions.partial().optional(),
        status: validateApplicantSchema.shape.body.shape.status.optional(),
    })
});

export const validateQueryParamsSchema = z.object({
    query: z.object({
        status: z.enum(["Applied", "Interviewing", "Hired", "Rejected"]).optional(),
        page: z.string()
            .optional()
            .default("1"),
        limit: z.string()
            .optional()
            .default("5"),
    }),
});

export const searchApplicantsSchema = z.object({
    query: z.object({
        name: z
            .string({ required_error: "Search name is required" })
            .min(1, "Search name cannot be empty")
            .trim(),
    }),
});
