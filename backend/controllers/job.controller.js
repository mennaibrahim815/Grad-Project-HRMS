import Job from "../models/job.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import mongoose from "mongoose";
import { flatten } from "flat";
import appErrors from "../utils/errors.js";

export const getAllJobs = asyncWraper(async (req, res, next) => {
    const { department, experienceLevel, jobType } = req.query;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const matchCondition = {};
    if (department) matchCondition.department = department;
    if (experienceLevel) matchCondition.experienceLevel = experienceLevel;
    if (jobType) matchCondition.jobType = jobType;

    const result = await Job.aggregate([
        { $match: matchCondition },
        {
            $facet: {
                metadata: [{ $count: "totalRecords" }],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { __v: 0 } }
                ]
            }
        }
    ]);

    const totalRecords = result[0]?.metadata[0]?.totalRecords || 0;
    const jobs = result[0]?.data || [];

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { 
            jobs,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / (limit || 1)) || 0,
                limit
            }
        },
    });
});

export const getJobById = asyncWraper(async (req, res, next) => {
    const JobID = req.params.id;

    const job = await Job.findById(JobID, { __v: 0 });

    if (!job) {
        const error = appErrors.create(
            404,
            "Job Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    res.json({
        status: httpResponseText.SUCCESS,
        data: { job },
    });
});

export const createJob = asyncWraper(async (req, res, next) => {
    const { title, description, department, experienceLevel, jobType, workLocation } = req.body;

    const createdBy = req.currentUser.userId;

    const newJob = new Job({
        title,
        description,
        department,
        experienceLevel,
        jobType,
        workLocation,
        createdBy,
    });

    newJob.__v = undefined;

    await newJob.save();
    
    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { newJob },
    });
});

export const updateJob = asyncWraper(async (req, res, next) => {
    const JobID = req.params.id;
    if (Object.keys(req.body).length === 0) {
        const error = appErrors.create(
            400,
            "Please provide data to update",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const updateData = flatten(req.body);

    const updatedJob = await Job.findByIdAndUpdate(
        JobID,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    );
    if (!updatedJob) {
        const error = appErrors.create(
            404,
            "Job Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    updatedJob.__v = undefined;

    res.json({
        status: httpResponseText.SUCCESS,
        data: { job: updatedJob },
    });
});

export const deleteJob = asyncWraper(async (req, res, next) => {
    const JobID = req.params.id;
    const job = await Job.findByIdAndDelete(JobID);
    if (!job) {
        const error = appErrors.create(
            404,
            "Job Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.json({ status: httpResponseText.SUCCESS, data: null });
});


export const searchJobs = asyncWraper(async (req, res, next) => {
    const { title } = req.query;

    if (!title) {
        return res.status(200).json({ status: httpResponseText.SUCCESS, data: { results: [] } });
    }

    const results = await Job.aggregate([
        { $match: { title: { $regex: title, $options: "i" } } },
        {
            $project: {
                _id: 1,
                title: 1,
                department: 1,
                experienceLevel: 1,
                jobType: 1,
                workLocation: 1,
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