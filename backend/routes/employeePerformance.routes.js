import express from "express";
const router = express.Router();

import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";

import { getEmployeePerformance } from "../controllers/employeePerformance.controller.js";

router.route("/").get(verifyToken, allowedTo("EMPLOYEE"), getEmployeePerformance);

export default router;