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
        deadline: z.string({
            required_error: "Deadline is required",
        })
        .regex(/^\d{4}-\d{1,2}-\d{1,2}$/, { 
            message: "Invalid date format. Expected YYYY-MM-DD" 
        }),
        assignedTo: z.array(
            z.object({
                _id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
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
                    }).optional(), // جعلناه اختياري لمرونة أكبر لو مش مبعوت
                }).optional(),
            })
        ).optional(), // جعلنا الـ Array كلها اختيارية في حالة لو بنعمل تاسك من غير تعيين فوري
        status: z
            .enum(["On-going", "Pending", "Completed"])
            .default("Pending")
            .optional(),
        priority: z
            .enum(["High", "Medium", "Low"])
            .default("Medium")
            .optional(),
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
        assignedTo: validateTaskSchema.shape.body.shape.assignedTo.optional(),
        status: validateTaskSchema.shape.body.shape.status.optional(),
        priority: validateTaskSchema.shape.body.shape.priority.optional(),
        document: z.string().optional(),
        acceptance: z.enum(["waiting", "accept", "reject"]).optional(),
        deadline: validateTaskSchema.shape.body.shape.deadline.optional(),
    }),
});
