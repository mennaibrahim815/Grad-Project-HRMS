    import { modelConfig } from "../utils/modelConfig.js";
    import mongoose from "mongoose";

    const taskSchema = new mongoose.Schema(
        {
            projectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
                required: [true, "Task must belong to a project"],
            },
            title: {
                type: String,
                required: [true, "Task title is required"],
            },
            assignment: {
                assignedTo: [
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                            required: true,
                        },
                        general: {
                            firstName: { type: String, required: true },
                            lastName: { type: String, required: true },
                            avatar: { type: String, required: true },
                        },
                        employee: {
                            jobTitle: { type: String },
                        },
                    },
                ],
                status: {
                    type: String,
                    enum: ["On-going", "Pending", "Completed"],
                    default: "Pending",
                },
                priority: {
                    type: String,
                    enum: ["High", "Medium", "Low"],
                    default: "Medium",
                },
            },
        },
        modelConfig
        
    );

    const Task = mongoose.model("Task", taskSchema);
    export default Task;
