import { z } from "zod";

export const validateProjectSchema = z.object({
    body: z.object({
        general: z.object({
            name: z.string(
                { required_error: "Project name is required" },
                { unique_error: "Project name must be unique" }
            ),
            description: z.string({
                required_error: "Project description is required",
                invalid_type_error: "Invalid project description type",
            }),
            avatar: z.string().optional(),
            createdBy: z
                .string()
                .regex(/^[0-9a-fA-F]{24}$/, {
                    message: "Invalid User ID format",
                })
                .optional(),
            startDate: z.coerce.date().default(() => new Date()),
            deadline: z.coerce.date({ required_error: "Deadline is required" }),
            tag: z.enum(["UI Design", "Marketing", "Social Media"], {
                required_error: "Tag is required",
            }),
        }),

        assignment: z.object({
            assignedTo: z
                .array(
                    z.string().regex(/^[0-9a-fA-F]{24}$/, {
                        message: "Invalid Team Member ID",
                    })
                )
                .min(1, {
                    message: "At least one team member must be assigned",
                }),
            status: z
                .enum(["On-going", "Pending", "Completed"])
                .default("On-going"),
            priority: z.enum(["High", "Medium", "Low"], {
                required_error: "Priority is required",
            }),
        }),

        documents: z
            .array(
                z.object({
                    name: z.string({
                        required_error: "Document name is required",
                    }),
                })
            )
            .optional(),

        subTasks: z
            .array(
                z.object({
                    title: z.string({
                        required_error: "Task title is required",
                    }),
                    done: z.boolean().default(false),
                })
            )
            .optional(),
    }),
});

export const updateValidateProjectSchema = z.object({
    body: z
        .object({
            general: validateProjectSchema.shape.body.shape.general.partial().optional(),
            assignment:
                validateProjectSchema.shape.body.shape.assignment.partial().optional,
            documents: validateProjectSchema.shape.body.shape.documents.optional(),
        })
        .partial(),
});
export const validateProjectQueryParamsSchema = z.object({
    query: z.object({
        tag: z.enum(["UI Design", "Marketing", "Social Media"]).optional(),
        status: z.enum(["On-going", "Pending", "Completed"]).optional(),
        priority: z.enum(["High", "Medium", "Low"]).optional(),
        deadline: z.coerce.date({ required_error: "Deadline is required" }).optional(),
        startDate: z.coerce.date().optional(),
        createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID").optional(),
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10"),
    })
});

export const searchProjectsSchema = z.object({
    query: z.object({
        name: z
            .string({ required_error: "Project name is required" })
            .min(1, "Project name cannot be empty")
            .trim(),
    }),
});
