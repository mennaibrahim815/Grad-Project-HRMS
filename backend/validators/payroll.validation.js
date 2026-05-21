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

export const editPayrollDraftSchema = z.object({
    body: z
        .object({
            manualAdditions: z
                .number()
                .min(0, "Additions cannot be negative")
                .optional(),
            manualDeductions: z
                .number()
                .min(0, "Deductions cannot be negative")
                .optional(),
            adjustmentReason: z.string().optional(),
        })
        .refine(
            (data) => {
                const hasAdditions =
                    typeof data.manualAdditions === "number" &&
                    data.manualAdditions > 0;
                const hasDeductions =
                    typeof data.manualDeductions === "number" &&
                    data.manualDeductions > 0;

                if (hasAdditions || hasDeductions) {
                    return (
                        typeof data.adjustmentReason === "string" &&
                        data.adjustmentReason.trim().length > 0
                    );
                }

                return true;
            },
            {
                message:
                    "Adjustment reason is strongly required when adding manual additions or deductions",
                path: ["adjustmentReason"],
            }
        ),
});
