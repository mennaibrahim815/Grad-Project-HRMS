import mongoose from "mongoose";
import validator from "validator";
import userRoles from "../utils/userRole.js";
import { modelConfig } from "../utils/modelConfig.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "the minimum number of chracter is 3"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "the minimum number of chracter is 3"],
    },
    gender: { type: String, enum: ["Male", "Female"] },
    phone: {
      type: String,
      required: true,
      minLength: [6, "the phone number must be at least 6 numbes long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    address: {
      type: String,
      required: true,
      minLength: [8, "the address must be at least 8 characters long"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "the password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: [userRoles.HR, userRoles.EMPLOYEE, userRoles.MANAGER],
      default: userRoles.EMPLOYEE,
    },
    rfidCard: { type: String, unique: true },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: "/uploads/default-avatar.png",
    },
  },
  modelConfig
);

