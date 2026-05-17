import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import appErrors from "../utils/errors.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";

export const getAllTasks = asyncWraper(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [totalRecords, tasks] = await Promise.all([
        Task.countDocuments(),
        Task.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
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

export const getTasksByProjectId = asyncWraper(async (req, res, next) => {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId });
    res.status(200).json({ status: httpResponseText.SUCCESS, data: { tasks } });
});

export const createTask = asyncWraper(async (req, res, next) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        const error = appErrors.create(
            404,
            "Project Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const { title, done } = req.body;

    const newTask = new Task({
        projectId,
        title,
        done
    });

    await newTask.save();

    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: { task: newTask },
    });
});

export const updateTask = asyncWraper(async (req, res, next) => {
    const taskId = req.params.id;

    if (Object.keys(req.body).length === 0) {
        const error = appErrors.create(
            400,
            "Please provide data to update",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: req.body }, 
        { returnDocument: "after", runValidators: true }
    );

    if (!updatedTask) {
        return next(appErrors.create(404, "Task Not Found", httpResponseText.FAIL));
    }

    res.json({
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
        data: null 
    });
});