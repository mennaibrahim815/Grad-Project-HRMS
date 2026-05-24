import { z } from "zod";
import {
    dateValidation,
    limitValidation,
    pageValidation,
    statusValidation,
} from "./common.validation.js";

const leavePayloadSchema = z.object({
    type: z.enum(["Sick", "Annual", "Casual", "Unpaid", "Other"], {
        required_error: "leave type is required",
    }),
    startDate: z.coerce.date({
        required_error: "start date is required",
        invalid_type_error: "start date must be a valid date",
    }),
    endDate: z.coerce.date({
        required_error: "end date is required",
        invalid_type_error: "end date must be a valid date",
    }),
    reason: z.string({
        required_error: "reason is required",
        invalid_type_error: "reason must be a string",
    }),
    attachment: z.string().nullable().default(null),
});

export const validateLeaveSchema = z.object({
    body: leavePayloadSchema.refine((data) => data.endDate >= data.startDate, {
        message: "End date cannot be before start date",
        path: ["endDate"],
    }),
});

export const validateUpdateLeaveSchema = z.object({
    body: leavePayloadSchema.partial().refine(
        (data) => {
            if (data.endDate && data.startDate) {
                return data.endDate >= data.startDate;
            }
            return true;
        },
        {
            message: "End date cannot be before start date",
            path: ["endDate"],
        }
    ),
});

export const validateLeaveStatusSchema = z.object({
    body: z
        .object({
            status: statusValidation("Approved", "Rejected"),
            rejectReason: z.string().nullable().default(null),
        })
        .strict(),
});

export const getAllLeavesQuerySchema = z.object({
    query: z.object({
        page: pageValidation,
        limit: limitValidation,
        date: dateValidation,
        status: statusValidation("Pending", "Approved", "Rejected").optional(),
    }),
});
