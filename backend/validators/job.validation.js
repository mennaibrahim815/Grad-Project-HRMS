import { z } from "zod";

export const validateJobSchema = z.object({
    body: z.object({
        title: z
            .string({
                required_error: "Job title is required",
                invalid_type_error: "Job title must be a string",
            })
            .min(3, "Title must be at least 3 characters"),

        description: z.string({
            required_error: "Job description is required",
        }),

        department: z.enum(["UI Design", "Marketing", "Social Media"], {
            required_error: "Department is required",
        }),

        experienceLevel: z.enum(["Senior", "Mid-Level", "Junior"], {
            required_error: "Experience level is required",
        }),

        jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"], {
            required_error: "Job type is required",
        }),

        workLocation: z.enum(["Remote", "On-site", "Hybrid"], {
            required_error: "Work location is required",
        }),

        status: z.enum(["Open", "Closed"]).default("Open").optional(),
    }),
});

export const validateUpdateJobSchema = z.object({
    body: validateJobSchema.shape.body.partial(),
});

export const searchJobsSchema = z.object({
    query: z.object({
        title: z
            .string({ required_error: "Job title is required" })
            .min(1, "Job title cannot be empty")
            .trim(),
    }),
});
