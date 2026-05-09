import express from "express";
import {
    generatePayrollDraft,
    ApprovePayroll,
    getEmployeesPayroll,
    getPayrollDetails,
    payingOnemonthtoEmployees,
    payingOnemonthtoEmployee,
    getEmployeePayrollHistory,
    payAllPending,
    getMonthlyDashboardStats,
    getYearlyPayrollChart,
    searchPayroll,
} from "../controllers/payroll.controller.js";

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import { validate } from "../Middleware/validate.Middelware.js";

import { generatePayrolSchema } from "../validators/payroll.validation.js";
import {
    monthlySearchSchema,
    monthYearBodySchema,
    monthYearQuerySchema,
    validateYearQuery,
} from "../validators/common.validation.js";

const router = express.Router();

router.post(
    "/draft",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(generatePayrolSchema),
    generatePayrollDraft
);

router.get(
    "/search",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(monthlySearchSchema),
    searchPayroll
);

router.post(
    "/approve",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(generatePayrolSchema),
    ApprovePayroll
);

router.patch(
    "/pay/bulk",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(monthYearBodySchema),
    payingOnemonthtoEmployees
);

router.patch(
    "/pay/all",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    payAllPending
);

router.patch(
    "/pay/:id",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    payingOnemonthtoEmployee
);

router.get(
    "/employees",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    getEmployeesPayroll
);

router.get(
    "/dashboard/monthly",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(monthYearQuerySchema),
    getMonthlyDashboardStats
);

router.get(
    "/dashboard/yearly",
    verifyToken,
    allowedTo("HR", "MANAGER"),
    validate(validateYearQuery),
    getYearlyPayrollChart
);

router.get(
    "/:id",
    verifyToken,
    allowedTo("HR", "MANAGER", "EMPLOYEE"),
    getPayrollDetails
);
router.get(
    "/employee/:id",
    verifyToken,
    allowedTo("HR", "MANAGER", "EMPLOYEE"),
    getEmployeePayrollHistory
);

export default router;
