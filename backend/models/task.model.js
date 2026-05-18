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
            done: {
                type: Boolean,
                default: false,
            },
        },
        modelConfig
        
    );

    const Task = mongoose.model("Task", taskSchema);
    export default Task;
