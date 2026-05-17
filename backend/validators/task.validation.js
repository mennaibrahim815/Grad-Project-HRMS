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
        done: z
            .boolean({
                invalid_type_error: "done must be a boolean (true/false)",
            })
            .default(false),
    }),
});

export const validateUpdateTaskSchema = z.object({
    params: z.object({
        id: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Task ID format" }),
    }),
    body: z.object({
        title: z.string().optional(),
        done: z.boolean().optional(),
    }),
});
