import { z } from "zod";
import { limitValidation, pageValidation } from "./common.validation.js";

const RequestTypeEnum = z.enum([
    "HR Letter",
    "Payroll Inquiry",
    "Complaint",
    "IT Support",
    "Other",
]);
const PriorityEnum = z.enum(["Low", "Medium", "High"]);
const StatusEnum = z.enum(["Pending", "Approved", "Rejected"]);

export const createRequestSchema = z.object({
    body: z.object({
        type: RequestTypeEnum,
        title: z
            .string({ required_error: "Subject is required" })
            .min(5)
            .max(100)
            .trim(),
        description: z
            .string({ required_error: "Description is required" })
            .min(10)
            .trim(),
        priority: PriorityEnum.optional(),
        attachment: z.string().optional(),
    }),
});

export const updateRequestSchema = z.object({
    body: z
        .object({
            type: RequestTypeEnum.optional(),
            subject: z.string().min(5).max(100).trim().optional(),
            description: z.string().min(10).trim().optional(),
            priority: PriorityEnum.optional(),
            attachment: z.string().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "Please provide data to update",
        }),
});

export const replyRequestSchema = z.object({
    body: z
        .object({
            status: StatusEnum,
            text: z.string().trim(),
            hrAttachment: z.string().optional(),
        })
        .refine(
            (data) =>
                data.status !== "Pending" || data.text || data.hrAttachment,
            {
                message:
                    "You must provide a status update or a response message.",
            }
        ),
});

export const getAllRequestsQuerySchema = z.object({
    query: z.object({
        page: pageValidation,
        limit: limitValidation,
        status: StatusEnum.optional(),
        type: RequestTypeEnum.optional(),
    }),
});
