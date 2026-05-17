import  Applicant  from "../models/applicant.model.js";
import Job from "../models/job.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import {flatten} from "flat";
import appErrors from "../utils/errors.js";

export const getAllApplicantsWithFilters = asyncWraper(async (req, res, next) => {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const matchCondition = {};
    if (status) {
        matchCondition.status = status;
    }

    const result = await Applicant.aggregate([
        { $match: matchCondition },
        {
            $facet: {
                metadata: [{ $count: "totalRecords" }],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            "personalInfo.firstName": 1,
                            "personalInfo.lastName": 1,
                            "personalInfo.email": 1,
                            "personalInfo.department": 1,
                            "personalInfo.experienceLevel": 1,
                            "personalInfo.avatar": 1,
                            status: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        }
    ]);

    const totalRecords = result[0]?.metadata[0]?.totalRecords || 0;
    const applicants = result[0]?.data || [];

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            applicants,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / (limit || 1)) || 0,
                limit
            }
        }
    });
});


export const getApplicantById = asyncWraper(async (req, res, next) => {
    const applicantId = req.params.id;

    const applicant = await Applicant.findById(applicantId, {
        "personalInfo.firstName": 1,
        "personalInfo.lastName": 1,
        "personalInfo.email": 1,
        "personalInfo.department": 1,
        "personalInfo.experienceLevel": 1,
        "personalInfo.avatar": 1,
        status: 1,
        createdAt: 1
    });

    if (!applicant) {
        const error = appErrors.create(404, "Applicant Not Found", httpResponseText.FAIL);
        return next(error);
    }

    res.json({
        status: httpResponseText.SUCCESS,
        data: { applicant },
    });
});

export const getApplicantsByJobId = asyncWraper(async (req, res, next) => {
    const jobId = req.params.jobId;
    const applicants = await Applicant.find(
        { jobId },
        {
            __v: false,
        }
    );
    if (applicants.length === 0) {
        const error = appErrors.create(
            404,
            "Applicant Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.json({
        status: httpResponseText.SUCCESS,
        data: { applicants },
    });
});

export const createApplicant = asyncWraper(async (req, res, next) => {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if(!job){
        const error = appErrors.create(
            404,
            "Job Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const oldApplicant = await Applicant.findOne({
        "personalInfo.email": req.body.personalInfo?.email,
        jobId: jobId,
    });

    if (oldApplicant) {
        const error = appErrors.create(
            400,
            "Applicant Already Exists",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const newApplicant = new Applicant({ ...req.body, jobId });

    newApplicant.__v = undefined;

    await newApplicant.save();
    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { newApplicant },
    });
    
});

export const updateApplicant = asyncWraper(async (req, res, next) => {
    const applicantID = req.params.id;
    if (Object.keys(req.body).length === 0) {
        const error = appErrors.create(
            400,
            "Please provide data to update",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const updateData = flatten(req.body);

    const updatedApplicant = await Applicant.findByIdAndUpdate(
        applicantID,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    );
    if (!updatedApplicant) {
        const error = appErrors.create(
            404,
            "Applicant Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    updatedApplicant.__v = undefined;

    res.json({
        status: httpResponseText.SUCCESS,
        data: { applicant: updatedApplicant },
    });
});

export const deleteApplicant = asyncWraper(async (req, res, next) => {
    const applicantID = req.params.id;
    const applicant = await Applicant.findByIdAndDelete(applicantID);
    if (!applicant) {
        const error = appErrors.create(
            404,
            "Applicant Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.json({ status: httpResponseText.SUCCESS, data: null });
});


export const getHiringStatistics = asyncWraper(async (req, res, next) => {
    const stats = await Applicant.aggregate([
        {
            $group: {
                _id: null,
                totalApplicants: { $sum: 1 },
                interviewing: { $sum: { $cond: [{ $eq: ["$status", "Interviewing"] }, 1, 0] } },
                hired: { $sum: { $cond: [{ $eq: ["$status", "Hired"] }, 1, 0] } },
                rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } },
                applied: { $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] } }
            }
        },
        {
            $project: { _id: 0 }
        }
    ]);

    const result = stats[0] || { totalApplicants: 0, interviewing: 0, hired: 0, rejected: 0, applied: 0 };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { stats: result }
    });
});

export const searchApplicants = asyncWraper(async (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return res.status(200).json({ status: httpResponseText.SUCCESS, data: { results: [] } });
    }

    const results = await Applicant.aggregate([
        {
            $match: {
                $or: [
                    { "personalInfo.firstName": { $regex: name, $options: "i" } },
                    { "personalInfo.lastName": { $regex: name, $options: "i" } },
                    { 
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ["$personalInfo.firstName", " ", "$personalInfo.lastName"] },
                                regex: name,
                                options: "i"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                "personalInfo.firstName": 1,
                "personalInfo.lastName": 1,
                "personalInfo.email": 1,
                "personalInfo.department": 1,
                "personalInfo.experienceLevel": 1,
                "personalInfo.avatar": 1,
                status: 1,
                createdAt: 1
            }
        }
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { results }
    });
});