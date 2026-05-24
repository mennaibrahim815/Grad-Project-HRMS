import { z } from "zod";

export const generatePayrolSchema = z.object({
    body: z.object({
        month: z.coerce
            .number({
                required_error: "month is required",
                invalid_type_error: "month must be a valid number",
            })
            .min(1, "Month cannot be less than 1")
            .max(12, "Month cannot be greater than 12"),

        year: z.coerce
            .number({
                required_error: "year is required",
            })
            .min(2000, "Year must be 2000 or later")
            .max(2100, "Year cannot exceed 2100"),
    }),
});
