import { z } from "zod";

export const validateDashboardStatisticsSchema = z.object({
    query: z.object({
        month: z
            .string()
            .optional()
            .transform((val) => {
                const m = parseInt(val, 10);
                return m >= 1 && m <= 12 ? m : new Date().getMonth() + 1;
            }),
        year: z
            .string()
            .optional()
            .transform((val) => {
                const y = parseInt(val, 10);
                return y >= 2000 ? y : new Date().getFullYear();
            }),
    }),
});

const paginationSchema = {
    page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => Math.max(1, parseInt(val, 10) || 1)),

    limit: z
        .string()
        .optional()
        .default("10")
        .transform((val) => Math.max(1, parseInt(val, 10) || 10)),
};

export const validateApplicantStatisticsSchema = z.object({
    query: z.object({
        status: z
            .enum(["Applied", "Interviewing", "Hired", "Rejected"])
            .optional(),
        ...paginationSchema,
    }),
});

export const validateEmployeeStatusSchema = z.object({
    query: z.object({
        status: z
            .enum(["Full-time", "Part-time", "Internship", "Contract"])
            .optional(),
    }),
});

export const validateProjectSummarySchema = z.object({
    query: z.object({
        status: z.enum(["On-going", "Pending", "Completed"]).optional(),
        ...paginationSchema,
    }),
});
