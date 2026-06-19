import express from "express";
const router = express.Router();

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";

import { getEmployeePerformance, getAllEmployeesPerformance, getEmployeePerformanceHistory, searchEmployeePerformance } from "../controllers/Performance.controller.js";

router.route("/").get(verifyToken, allowedTo("EMPLOYEE"), getEmployeePerformanceHistory);
router.route("/all").get(verifyToken, allowedTo("HR"), getAllEmployeesPerformance);
router.route("/search").get(verifyToken, allowedTo("HR"), searchEmployeePerformance);
router.route("/:id").get(verifyToken, allowedTo("HR"), getEmployeePerformanceHistory);

export default router;