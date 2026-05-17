import { z } from "zod";

export const validateTaskSchema = z.object({
    params: z.object({
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
            message: "Invalid Project ID format in URL",
        }),
    }),
    body: z.object({
        title: z.string({
            required_error: "Task title is required",
            invalid_type_error: "Task title must be a string",
        }),
        assignment: z.object(
            {
                assignedTo: z.array(
                    z.object({
                        _id: z
                            .string()
                            .regex(/^[0-9a-fA-F]{24}$/, {
                                message: "Invalid User ID format",
                            }),
                        general: z.object({
                            firstName: z.string({
                                required_error: "First name is required",
                            }),
                            lastName: z.string({
                                required_error: "Last name is required",
                            }),
                            avatar: z.string({
                                required_error: "Avatar is required",
                            }),
                        }),
                        employee: z.object({
                            jobTitle: z.string({
                                required_error: "Job title is required",
                            }),
                        }),
                    })
                ),

                status: z
                    .enum(["On-going", "Pending", "Completed"])
                    .default("Pending")
                    .optional(),
                priority: z
                    .enum(["High", "Medium", "Low"])
                    .default("Medium")
                    .optional(),
            },
            { required_error: "Assignment data is required" }
        ),
    }),
});

export const validateUpdateTaskSchema = z.object({
    params: z.object({
        id: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Task ID format" }),
    }),
    body: z.object({
        title: validateTaskSchema.shape.body.shape.title.optional(),
        assignment: validateTaskSchema.shape.body.shape.assignment
            .partial()
            .optional(),
    }),
});
