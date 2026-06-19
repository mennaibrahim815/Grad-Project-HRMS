import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import { flatten } from "flat";
import mongoose from "mongoose";

export const getTasks = asyncWraper(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    let matchQuery = {};

    if (req.params.id) {
        matchQuery._id = req.params.id;
    }
    if (status) {
        matchQuery.status = status;
    }
    const [totalRecords, tasks] = await Promise.all([
        Task.countDocuments(matchQuery),
        Task.find(matchQuery,"-__v").populate("projectId", "general.name").sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    if (req.params.id && tasks.length === 0) {
        return next(
            appErrors.create(404, "Task Not Found", httpResponseText.FAIL)
        );
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            tasks: req.params.id ? tasks[0] : tasks,
            pagination: req.params.id
                ? undefined
                : {
                      totalRecords,
                      currentPage: page,
                      totalPages: Math.ceil(totalRecords / limit),
                      limit,
                  },
        },
    });
});

export const getTaskStatistics = asyncWraper(async (req, res, next) => {
    const stats = await Task.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                ongoing: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "On-going"] },
                            1,
                            0,
                        ],
                    },
                },
                pending: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "Pending"] },
                            1,
                            0,
                        ],
                    },
                },
                completed: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "Completed"] },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
    ]);

    const data = stats[0] || { total: 0, ongoing: 0, pending: 0, completed: 0 };

    const headers = [
        { title: "All Tasks", value: data.total },
        { title: "On-going", value: data.ongoing },
        { title: "Pending", value: data.pending },
        { title: "Completed", value: data.completed },
    ];

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: headers,
    });
});

export const getEmployeeTaskStatistics = asyncWraper(async (req, res, next) => {
    const userId = req.currentUser.userId;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const stats = await Task.aggregate([
        {
            $match: {
                "assignedTo._id": new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $facet: {
                dueToday: [
                    {
                        $match: {
                            deadline: { $gte: startOfToday, $lte: endOfToday },
                            status: { $ne: "Completed" },
                        },
                    },
                    { $count: "count" },
                ],
                pendingReview: [
                    {
                        $match: {
                            acceptance: "waiting",
                            status: "On-going",
                        },
                    },
                    { $count: "count" },
                ],
                totalCompleted: [
                    {
                        $match: { status: "Completed" },
                    },
                    { $count: "count" },
                ],
                completedThisWeek: [
                    {
                        $match: {
                            status: "Completed",
                            completedAt: { $gte: startOfWeek },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const result = stats[0];
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            dueToday: result.dueToday[0]?.count || 0,
            pendingReview: result.pendingReview[0]?.count || 0,
            completed: {
                total: result.totalCompleted[0]?.count || 0,
                thisWeek: result.completedThisWeek[0]?.count || 0,
            },
        },
    });
});

export const getMyAndTeamTasks = asyncWraper(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filterType = req.query.filter || "my-tasks";
    const userId = req.currentUser.userId;

    let matchQuery = {};

    if (filterType === "my-tasks") {
        matchQuery = { "assignedTo._id": userId };
    } else if (filterType === "team-tasks") {
        const userProjects = await Project.find({
            "assignedTo._id": userId,
        }).select("_id");
        const projectIds = userProjects.map((proj) => proj._id); // تصفية الـ Documents إلى مصفوفة صافية من الـ IDs
        matchQuery = { projectId: { $in: projectIds } };
    }

    const [totalRecords, tasks] = await Promise.all([
        Task.countDocuments(matchQuery),
        Task.find(matchQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            tasks,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                limit,
            },
        },
    });
});

export const createTask = asyncWraper(async (req, res, next) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        return next(
            appErrors.create(404, "Project Not Found", httpResponseText.FAIL)
        );
    }

    const { title, assignedTo, deadline, priority } = req.body;

    if (assignedTo && assignedTo.length > 0) {
        const projectMemberIds = project.assignedTo.map((member) =>
            member._id.toString()
        );
        for (const employee of assignedTo) {
            if (!projectMemberIds.includes(employee._id.toString())) {
                const error = appErrors.create(
                    400,
                    "Employee is not assigned to this project.",
                    httpResponseText.FAIL
                );
                return next(error);
            }
        }
    }

    const newTask = new Task({
        projectId,
        title,
        assignedTo,
        deadline,
        priority,
    });

    await newTask.save();

    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { task: newTask },
    });
});

export const updateTask = asyncWraper(async (req, res, next) => {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
        const error = appErrors.create(404, "Task Not Found", httpResponseText.FAIL);
        return next(error);
    }

    let updateData = {};

    if (req.currentUser.role === "EMPLOYEE") {
        const { document } = req.body;

        if (!document) {
            return next(appErrors.create(400, "Employee can only upload a document.", httpResponseText.FAIL));
        }

        updateData.document = document;
        updateData.status = "On-going";
        updateData.acceptance = "waiting";

        await Project.findByIdAndUpdate(
            task.projectId,
            { $set: { status: "On-going" } },
            { returnDocument: "after",runValidators: true }
        );
    } 

    else if (req.currentUser.role === "HR") {
        const { acceptance, title, deadline, priority, assignedTo, status } = req.body;

        if (assignedTo && assignedTo.length > 0) {
            const project = await Project.findById(task.projectId);
            const projectMemberIds = project.assignedTo.map(member => member._id.toString());
            for (const employee of assignedTo) {
                if (!projectMemberIds.includes(employee._id.toString())) {
                    const error = appErrors.create(400, "Employee is not assigned to this project.", httpResponseText.FAIL);
                    return next(error);
                }
            }
        }

        if (acceptance) {
            if (acceptance === "accept") {
                updateData.acceptance = "accept";
                updateData.status = "Completed";
                updateData.completedAt = new Date(); 
            } else if (acceptance === "reject") {
                updateData.acceptance = "waiting";
                updateData.status = "Pending";
                updateData.document = null;
                updateData.completedAt = null; 
            }
        }

        if (title) updateData.title = title;
        if (deadline) updateData.deadline = new Date(deadline);
        if (priority) updateData.priority = priority;
        if (assignedTo) updateData.assignedTo = assignedTo;
        
        if (status && !acceptance) {
            updateData.status = status;
            if (status === "Completed") updateData.completedAt = new Date();
        }

        updateData.updatedBy = req.currentUser.userId
    }

    if (Object.keys(updateData).length === 0) {
        return next(appErrors.create(400, "No valid actions or fields provided for update", httpResponseText.FAIL));
    }
    
    const flattenedData = flatten(updateData);

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: flattenedData },
        { returnDocument: "after", runValidators: true }
    );
    
    if (req.currentUser.role === "HR" && updateData.acceptance === "accept") {
        const allProjectTasks = await Task.find({ projectId: task.projectId });
        const isAllCompleted = allProjectTasks.every((t) => t.status === "Completed");

        if (isAllCompleted) {
            await Project.findByIdAndUpdate(
                task.projectId,
                { $set: { status: "Completed" } },
                { returnDocument: "after",runValidators: true }
            );
        }
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { task: updatedTask },
    });
});

export const deleteTask = asyncWraper(async (req, res, next) => {
    const taskId = req.params.id;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        const error = appErrors.create(
            404,
            "Task Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    res.json({
        status: httpResponseText.SUCCESS,
        message: "Task deleted successfully",
        data: null,
    });
});

export const searchTasks = asyncWraper(async (req, res, next) => {
    const { title } = req.query;

    if (!title) {
        return res
            .status(200)
            .json({ status: httpResponseText.SUCCESS, data: { results: [] } });
    }

    const results = await Task.aggregate([
        { $match: { title: { $regex: title, $options: "i" } } },
        
        {
            $lookup: {
                from: "projects",
                localField: "projectId",
                foreignField: "_id",
                as: "projectDetails"
            }
        },
        {
            $addFields: {
                projectDetails: { $arrayElemAt: ["$projectDetails", 0] }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                status: 1,
                priority: 1,
                deadline: 1,
                assignedTo: 1,
                projectName: "$projectDetails.general.name"
            },
        },
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { results },
    });
});

export const getOngoingTasks = asyncWraper(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchQuery = { status: "On-going" };

    const [totalRecords, tasks] = await Promise.all([
        Task.countDocuments(matchQuery),
        Task.find(matchQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            tasks,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                limit,
            },
        },
    });
});