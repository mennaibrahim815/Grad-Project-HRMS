import mongoose from "mongoose";
import { modelConfig } from "../utils/modelConfig.js";

const payrollSchema = new mongoose.Schema(
    {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        baseSalary: { type: Number, required: true }, 
        netSalary: { type: Number, required: true },
        deductions: { type: Number, required: true },
        daysPresent: { type: Number, required: true },
        daysAbsent: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Draft", "Paid", "Pending"],
            default: "Pending",
        },
        cycleStartDate: { type: Date, required: true },
        cycleEndDate: { type: Date, required: true },
        totalDelayMinutes: { type: Number, required: true },
        totalHours: { type: Number, required: true },
        totalMinutes: { type: Number, required: true },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    modelConfig
);

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;
