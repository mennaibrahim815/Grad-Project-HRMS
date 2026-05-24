import { z } from "zod";
import {
    dateValidation,
    dayValidation,
    limitValidation,
    monthValidation,
    pageValidation,
    statusValidation,
    yearValidation,
} from "./common.validation.js";

export const getAllAttendanceQuerySchema = z.object({
    query: z.object({
        page: pageValidation,
        limit: limitValidation,
        date: dateValidation,
        status: statusValidation("On Time", "Absent", "Late").optional(),
    }),
});

export const validateCheckInSchema = z.object({
    body: z.object({
        rfidTag: z
            .string({
                required_error: "rfidTag is required",
            })
            .length(8, { message: "rfidTag must be exactly 8 characters" })
            .regex(/^[0-9a-fA-F]+$/, {
                message: "Invalid RFID format (Hex only)",
            }),
    }),
});

export const weeklyStatsSchema = z.object({
    query: z.object({
        day: dayValidation,
        month: monthValidation,
        year: yearValidation,
    }),
});

export const AttendanceByEmployeeIdQuery = z.object({
    query: z.object({
        limit: limitValidation,
        page: pageValidation,
        month: monthValidation.optional(),
        year: yearValidation.optional(),
    }),
});
