import express from "express";
const router = express.Router();

import {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    searchJobs,
} from "../controllers/job.controller.js";
import { verifyToken } from "../guards/verifyToken.js";
import { allowedTo } from "../guards/allowedTo.js";
import userRoles from "../utils/userRole.js";
import { validate } from "../Middleware/validate.Middelware.js";
import {
    validateJobSchema,
    validateUpdateJobSchema,
    searchJobsSchema,
} from "../validators/job.validation.js";

router
    .route("/")
    .get(getAllJobs)
    .post(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateJobSchema),
        createJob
    );
    
router.route("/search").get(verifyToken, allowedTo(userRoles.HR), validate(searchJobsSchema), searchJobs);

router
    .route("/:id")
    .get(getJobById)
    .patch(
        verifyToken,
        allowedTo(userRoles.HR),
        validate(validateUpdateJobSchema),
        updateJob
    )
    .delete(verifyToken, allowedTo(userRoles.HR), deleteJob);

export default router;
