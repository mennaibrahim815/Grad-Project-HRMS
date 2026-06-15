import express from "express";
const router = express.Router();

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";

import { getEmployeePerformance, getAllEmployeesPerformance } from "../controllers/employeePerformance.controller.js";

router.route("/").get(verifyToken, allowedTo("EMPLOYEE"), getEmployeePerformance);
router.route("/all").get(verifyToken, allowedTo("HR"), getAllEmployeesPerformance);

export default router;