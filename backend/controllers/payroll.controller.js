import User from "../models/user.model.js";
import Setting from "../models/settings.models.js";
import Attendance from "../models/attendance.model.js";
import Leave from "../models/leave.model.js";
import Payroll from "../models/payroll.model.js";
import appErrors from "../utils/errors.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import dayjs from "dayjs";
import { buildNameSearchQuery } from "../utils/searchHelper.js";

export const generatePayrollDraft = asyncWraper(async (req, res, next) => {
    let { month, year } = req.body;
    month = parseInt(month);
    year = parseInt(year);

    if (!month || !year) {
        const error = appErrors.create(
            400,
            "Month and Year are required",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const setting = await Setting.findOne({});
    if (!setting) {
        const error = appErrors.create(
            400,
            "No settings found in the database.",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const cutoffDay = setting.payrollCutoffDay;
    const minutesMultiplier = setting.minutesMultiplier;

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const isFirstTimeRuning = (await Payroll.countDocuments()) === 0;

    if (!isFirstTimeRuning) {
        const PrevPayroll = await Payroll.findOne({
            month: prevMonth,
            year: prevYear,
        });

        if (!PrevPayroll || PrevPayroll.status === "Draft") {
            const error = appErrors.create(
                400,
                `Salaries for ${months[month]} ${year} can not be generated before the ${months[prevMonth]} ${prevYear} payroll is approved.`,
                httpResponseText.FAIL
            );
            return next(error);
        }
    }
    const currentMonthCutoff = dayjs(
        `${year}-${month}-${cutoffDay}`,
        "YYYY-M-D"
    );
    const prevMonthCutoff = currentMonthCutoff.subtract(1, "month");

    const cutoffDateString = currentMonthCutoff.format("YYYY-MM-DD");
    const employees = await User.find({
        "general.role": { $in: ["EMPLOYEE", "HR"] },
        "employee.status": "Active",
    });
    if (employees.length === 0) {
        const error = appErrors.create(
            404,
            "No active employees found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const payrollResults = [];
    for (const user of employees) {
        const baseSalary = user.employee.baseSalary;
        const joiningDate = dayjs(user.employee.joiningDate);
        const workingHours = user.employee.workingHours;

        const dayRate = baseSalary / 30;
        const minuteRate = dayRate / workingHours / 60;

        let payableDays = 30;

        if (joiningDate.isAfter(prevMonthCutoff)) {
            const daysWorked = currentMonthCutoff.diff(joiningDate, "day") + 1;
            payableDays = Math.max(0, Math.min(daysWorked, 30));
        }

        const unhandledAttendances = await Attendance.find({
            employeeId: user._id,
            isProcessed: false,
            date: { $lte: cutoffDateString },
        });

        let totalAbsentDays = 0;
        let totalDelayMinutes = 0;
        let actualDaysPresent = 0;

        unhandledAttendances.forEach((record) => {
            if (record.status === "Absent") {
                totalAbsentDays += 1;
            } else if (record.status === "Late") {
                totalDelayMinutes += record.delayMinutes || 0;
                actualDaysPresent += 1;
            } else if (record.status === "On Time") {
                actualDaysPresent += 1;
            }
        });

        const cycleStartDateStr = prevMonthCutoff
            .add(1, "day")
            .format("YYYY-MM-DD");

        const approvedLeaves = await Leave.find({
            employeeId: user._id,
            status: "Approved",
            startDate: { $lte: cutoffDateString },
            endDate: { $gte: cycleStartDateStr },
        });

        let unpaidLeaveDays = 0;
        let paidLeaveDays = 0;

        approvedLeaves.forEach((leave) => {
            const leaveStart = dayjs(leave.startDate).isBefore(
                cycleStartDateStr
            )
                ? dayjs(cycleStartDateStr)
                : dayjs(leave.startDate);
            const leaveEnd = dayjs(leave.endDate).isAfter(cutoffDateString)
                ? dayjs(cutoffDateString)
                : dayjs(leave.endDate);

            const overlapDays = leaveEnd.diff(leaveStart, "day") + 1;

            if (overlapDays > 0) {
                if (leave.type === "Unpaid") {
                    unpaidLeaveDays += overlapDays;
                } else {
                    paidLeaveDays += overlapDays;
                }
            }
        });

        totalAbsentDays += unpaidLeaveDays;

        actualDaysPresent += paidLeaveDays;

        const absenceDeduction = totalAbsentDays * dayRate;
        const delayDeduction =
            totalDelayMinutes * minuteRate * minutesMultiplier;
        let calculatedBaseSalary = Math.min(dayRate * payableDays, baseSalary);
        const totalDeductions = Math.floor(absenceDeduction + delayDeduction);
        let netSalary = calculatedBaseSalary - totalDeductions;

        if (netSalary > calculatedBaseSalary) netSalary = calculatedBaseSalary;
        if (netSalary < 0) netSalary = 0;

        const totalExpectedMinutes = actualDaysPresent * workingHours * 60;
        const totalActualMinutes = totalExpectedMinutes - totalDelayMinutes;
        const totalHours = Math.floor(totalActualMinutes / 60);
        const totalMinutes = totalActualMinutes % 60;

        const payrollRecord = await Payroll.findOneAndUpdate(
            { employeeId: user._id, month, year },
            {
                baseSalary: calculatedBaseSalary,
                netSalary,
                deductions: totalDeductions,
                daysPresent: actualDaysPresent,
                daysAbsent: totalAbsentDays,
                status: "Draft",
                cycleStartDate: prevMonthCutoff
                    .add(1, "day")
                    .format("DD MMM YYYY"),
                cycleEndDate: currentMonthCutoff.format("DD MMM YYYY"),
                totalDelayMinutes,
                totalHours,
                totalMinutes,
                generatedBy: req.currentUser.userId,
            },

            { new: true, upsert: true, runValidators: true }
        );

        payrollResults.push(payrollRecord);
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: `Salaries for ${months[month]} ${year} have been generated successfully`,
        data: { payrolls: payrollResults },
    });
});

export const ApprovePayroll = asyncWraper(async (req, res, next) => {
    let { month, year } = req.body;
    month = parseInt(month);
    year = parseInt(year);
    if (!month || !year) {
        const error = appErrors.create(
            400,
            "Month and Year are required",
            httpResponseText.FAIL
        );
        return next(error);
    }

    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const approvedMonthPayroll = await Payroll.findOne({
        month,
        year,
        status: "Pending",
    });
    if (approvedMonthPayroll) {
        const error = appErrors.create(
            400,
            `Salaries for ${months[month]} ${year} have already been approved.`,
            httpResponseText.FAIL
        );
        return next(error);
    }

    const monthPayroll = await Payroll.findOne({
        month,
        year,
        status: "Draft",
    });
    if (!monthPayroll) {
        const error = appErrors.create(
            400,
            `Please generate salaries for ${months[month]} ${year} before approving.`,
            httpResponseText.FAIL
        );
        return next(error);
    }

    const setting = await Setting.findOne({});
    if (!setting) {
        const error = appErrors.create(
            400,
            "No settings found in the database.",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const cutoffDay = setting.payrollCutoffDay;
    const timeZone = setting.timeZone || "Africa/Cairo";

    const currentMonthCutoff = dayjs(
        `${year}-${month}-${cutoffDay}`,
        "YYYY-M-D"
    );

    const today = dayjs().tz(timeZone);
    if (currentMonthCutoff.isAfter(today)) {
        const error = appErrors.create(
            400,
            `Payroll for ${months[month]} ${year} can not be approved before the cutoff day of ${currentMonthCutoff.format("YYYY-MM-DD")}.`,
            httpResponseText.FAIL
        );
        return next(error);
    }
    const cutoffDateString = currentMonthCutoff.format("YYYY-MM-DD");

    const result = await Payroll.updateMany(
        { month, year, status: "Draft" },
        { $set: { status: "Pending", approvedBy: req.currentUser.userId } }
    );

    await Attendance.updateMany(
        {
            isProcessed: false,
            date: { $lte: cutoffDateString },
        },
        { $set: { isProcessed: true } }
    );

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: `Payroll for ${months[month]} ${year} has been approved successfully.`,
        data: {
            approvedEmployeesCount: result.modifiedCount,
        },
    });
});

export const getEmployeesPayroll = asyncWraper(async (req, res, next) => {
    const { month, year, status, limit, page } = req.query;

    const searchQuery = {};
    if (month && year) {
        searchQuery.month = month;
        searchQuery.year = year;
    }
    if (status) {
        searchQuery.status = status;
    }

    const limitNumber = Number(limit) || 10;
    const pageNumber = Number(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const payrolls = await Payroll.find(searchQuery)
        .populate(
            "employeeId",
            "general.firstName general.lastName general.email general.phone general.gender general.role general.avatar employee.department employee.jobTitle employee.jobType"
        )
        .skip(skip)
        .limit(limitNumber)
        .lean();
    if (payrolls.length === 0) {
        const error = appErrors.create(
            404,
            "No payroll found for employees in the specified period",
            httpResponseText.FAIL
        );
        return next(error);
    }
    const formattedPayrolls = payrolls.map((payroll) => {
        return {
            _id: payroll._id,
            month: payroll.month,
            year: payroll.year,
            baseSalary: payroll.baseSalary,
            netSalary: payroll.netSalary,
            deductions: payroll.deductions,
            daysPresent: payroll.daysPresent,
            daysAbsent: payroll.daysAbsent,
            status: payroll.status,
            employeeId: payroll.employeeId?._id,
            employee: {
                firstName: payroll.employeeId?.general?.firstName || "",
                lastName: payroll.employeeId?.general?.lastName || "",
                email: payroll.employeeId?.general?.email || "",
                phone: payroll.employeeId?.general?.phone || "",
                gender: payroll.employeeId?.general?.gender || "",
                role: payroll.employeeId?.general?.role || "",
                avatar: payroll.employeeId?.general?.avatar || "",
                department: payroll.employeeId?.employee?.department || "",
                jobTitle: payroll.employeeId?.employee?.jobTitle || "",
                jobType: payroll.employeeId?.employee?.jobType || "",
            },
        };
    });

    const totalRecords = await Payroll.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: formattedPayrolls,
        pagination: {
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber,
        },
    });
});

export const getPayrollDetails = asyncWraper(async (req, res, next) => {
    const payrollId = req.params.id;

    const payroll = await Payroll.findById(payrollId).populate(
        "employeeId",
        "general.firstName general.lastName general.email general.phone general.gender general.role general.avatar employee.department employee.jobTitle employee.jobType"
    );

    if (!payroll) {
        return next(
            appErrors.create(
                404,
                "Payroll record not found",
                httpResponseText.FAIL
            )
        );
    }

    const employeeIdString = payroll.employeeId._id.toString();

    if (
        req.currentUser.role !== "HR" &&
        req.currentUser.userId !== employeeIdString
    ) {
        const error = appErrors.create(
            403,
            "Forbidden, You are not allowed to view other users' payroll details"
        );
        return next(error);
    }

    const formattedPayroll = {
        _id: payroll._id,
        month: payroll.month,
        year: payroll.year,
        baseSalary: payroll.baseSalary,
        netSalary: payroll.netSalary,
        deductions: payroll.deductions,
        daysPresent: payroll.daysPresent,
        daysAbsent: payroll.daysAbsent,
        status: payroll.status,
        employeeId: payroll.employeeId?._id,
        employee: {
            firstName: payroll.employeeId?.general?.firstName || "",
            lastName: payroll.employeeId?.general?.lastName || "",
            email: payroll.employeeId?.general?.email || "",
            phone: payroll.employeeId?.general?.phone || "",
            gender: payroll.employeeId?.general?.gender || "",
            role: payroll.employeeId?.general?.role || "",
            avatar: payroll.employeeId?.general?.avatar || "",
            department: payroll.employeeId?.employee?.department || "",
            jobTitle: payroll.employeeId?.employee?.jobTitle || "",
            jobType: payroll.employeeId?.employee?.jobType || "",
        },
    };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { formattedPayroll },
    });
});

export const getEmployeePayrollHistory = asyncWraper(async (req, res, next) => {
    const { month, year, status, limit, page } = req.query;
    const id = req.params.id;
    const limitNumber = Number(limit) || 10;
    const pageNumber = Number(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    if (req.currentUser.role !== "HR" && req.currentUser.userId !== id) {
        const error = appErrors.create(
            403,
            "Forbidden, You are not allowed to view other users' payroll"
        );
        return next(error);
    }

    const searchQuery = {};
    if (month && year) {
        searchQuery.month = month;
        searchQuery.year = year;
    }
    if (status) {
        searchQuery.status = status;
    }
    searchQuery.employeeId = id;

    const payrolls = await Payroll.find(searchQuery)
        .skip(skip)
        .limit(limitNumber)
        .populate(
            "employeeId",
            "general.firstName general.lastName general.email general.phone general.gender general.role general.avatar employee.department employee.jobTitle employee.jobType"
        );

    if (!payrolls || payrolls.length === 0) {
        return next(
            appErrors.create(
                404,
                "Payroll not found for this employee in the specified period",
                httpResponseText.FAIL
            )
        );
    }

    const formattedPayrolls = payrolls.map((payroll) => ({
        _id: payroll._id,
        month: payroll.month,
        year: payroll.year,
        baseSalary: payroll.baseSalary,
        netSalary: payroll.netSalary,
        deductions: payroll.deductions,
        daysPresent: payroll.daysPresent,
        daysAbsent: payroll.daysAbsent,
        status: payroll.status,
        employeeId: payroll.employeeId?._id,
        employee: {
            firstName: payroll.employeeId?.general?.firstName || "",
            lastName: payroll.employeeId?.general?.lastName || "",
            email: payroll.employeeId?.general?.email || "",
            phone: payroll.employeeId?.general?.phone || "",
            gender: payroll.employeeId?.general?.gender || "",
            role: payroll.employeeId?.general?.role || "",
            avatar: payroll.employeeId?.general?.avatar || "",
            department: payroll.employeeId?.employee?.department || "",
            jobTitle: payroll.employeeId?.employee?.jobTitle || "",
            jobType: payroll.employeeId?.employee?.jobType || "",
        },
    }));

    const totalRecords = await Payroll.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { payrolls: formattedPayrolls },
        pagination: {
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber,
        },
    });
});

export const payingOnemonthtoEmployees = asyncWraper(async (req, res, next) => {
    const { month, year } = req.body;
    if (!month || !year) {
        return next(
            appErrors.create(
                400,
                "Month and Year are required",
                httpResponseText.FAIL
            )
        );
    }
    const result = await Payroll.updateMany(
        { month, year, status: "Pending" },
        { $set: { status: "Paid", paidBy: req.currentUser.userId } }
    );

    if (result.matchedCount === 0) {
        const error = appErrors.create(
            404,
            "No pending payrolls found for employees in the specified period",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: `Payroll for ${month}/${year} paid successfully`,
        data: {
            paidEmployeesCount: result.modifiedCount,
        },
    });
});

export const payingOnemonthtoEmployee = asyncWraper(async (req, res, next) => {
    const payrollId = req.params.id;
    const payment = await Payroll.findOneAndUpdate(
        { _id: payrollId, status: "Pending" },
        { $set: { status: "Paid", paidBy: req.currentUser.userId } },
        { new: true, runValidators: true }
    );
    if (!payment) {
        const error = appErrors.create(
            404,
            "Payroll not found, or it is not in 'Pending' status to be paid.",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: `The employee's salary for ${payment.month}/${payment.year} was successfully paid.`,
    });
});

export const payAllPending = asyncWraper(async (req, res, next) => {
    const result = await Payroll.updateMany(
        { status: "Pending" },
        { $set: { status: "Paid", paidBy: req.currentUser.userId } }
    );

    if (result.matchedCount === 0) {
        const error = appErrors.create(
            404,
            "No pending payrolls found for employees",
            httpResponseText.FAIL
        );
        return next(error);
    }
    res.status(200).json({
        status: httpResponseText.SUCCESS,
        message: `All pending salaries have been paid Successfully`,
        data: {
            paidEmployeesCount: result.modifiedCount,
        },
    });
});

export const getMonthlyDashboardStats = asyncWraper(async (req, res, next) => {
    let { month, year } = req.query;
    month = parseInt(month);
    year = parseInt(year);

    if (!month || !year) {
        return next(
            appErrors.create(
                400,
                "Month and Year are required",
                httpResponseText.FAIL
            )
        );
    }

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const getMonthStatsPipeline = (targetMonth, targetYear) => [
        { $match: { month: targetMonth, year: targetYear } },
        {
            $group: {
                _id: null,
                totalNetSalaries: { $sum: "$netSalary" },
                totalDeductions: { $sum: "$deductions" },
                totalPending: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "Pending"] },
                            "$netSalary",
                            0,
                        ],
                    },
                },
                totalPaidAmount: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Paid"] }, "$netSalary", 0],
                    },
                },

                paidCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
                },
                pendingCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                },
                draftCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Draft"] }, 1, 0] },
                },
                totalEmployees: { $sum: 1 },
            },
        },
    ];

    const [currentMonthResult, prevMonthResult] = await Promise.all([
        Payroll.aggregate(getMonthStatsPipeline(month, year)),
        Payroll.aggregate(getMonthStatsPipeline(prevMonth, prevYear)),
    ]);

    const current = currentMonthResult[0] || {
        totalNetSalaries: 0,
        totalDeductions: 0,
        totalPending: 0,
        totalPaidAmount: 0,
        paidCount: 0,
        pendingCount: 0,
        draftCount: 0,
        totalEmployees: 0,
    };
    const prev = prevMonthResult[0] || {
        totalNetSalaries: 0,
        totalDeductions: 0,
        totalPending: 0,
        totalPaidAmount: 0,
    };

    const calcChange = (curr, prv) => {
        if (prv === 0 && curr === 0) return 0;
        if (prv === 0) return 100;
        return Number((((curr - prv) / prv) * 100).toFixed(2));
    };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            summaryCards: {
                totalNetSalaries: {
                    value: current.totalNetSalaries,
                    changePercentage: calcChange(
                        current.totalNetSalaries,
                        prev.totalNetSalaries
                    ),
                    isIncrease:
                        current.totalNetSalaries > prev.totalNetSalaries,
                },
                totalDeductions: {
                    value: current.totalDeductions,
                    changePercentage: calcChange(
                        current.totalDeductions,
                        prev.totalDeductions
                    ),
                    isIncrease: current.totalDeductions > prev.totalDeductions,
                },
                pendingPayments: {
                    value: current.totalPending,
                    changePercentage: calcChange(
                        current.totalPending,
                        prev.totalPending
                    ),
                    isIncrease: current.totalPending > prev.totalPending,
                },
                paidAmount: {
                    value: current.totalPaidAmount,
                    changePercentage: calcChange(
                        current.totalPaidAmount,
                        prev.totalPaidAmount
                    ),
                    isIncrease: current.totalPaidAmount > prev.totalPaidAmount,
                },
            },
            paymentStatusChart: {
                paidCount: current.paidCount,
                pendingCount: current.pendingCount,
                draftCount: current.draftCount,
                totalEmployees: current.totalEmployees,
            },
        },
    });
});

export const getYearlyPayrollChart = asyncWraper(async (req, res, next) => {
    let { year } = req.query;
    year = parseInt(year);

    if (!year) {
        return next(
            appErrors.create(400, "Year is required", httpResponseText.FAIL)
        );
    }

    const yearlyData = await Payroll.aggregate([
        { $match: { year: year } },
        {
            $group: {
                _id: "$month",
                netSalaries: { $sum: "$netSalary" },
                deductions: { $sum: "$deductions" },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const formattedData = [];

    for (let i = 1; i <= 12; i++) {
        const monthData = yearlyData.find((m) => m._id === i);
        formattedData.push({
            month: i,
            monthName: months[i],
            netSalaries: monthData ? monthData.netSalaries : 0,
            deductions: monthData ? monthData.deductions : 0,
        });
    }

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            yearlyOverview: formattedData,
        },
    });
});

export const searchPayroll = asyncWraper(async (req, res, next) => {
    const { page, limit, month, year, employeeName } = req.query;

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [];

    if (month && year) {
        pipeline.push({
            $match: {
                month: parseInt(month),
                year: parseInt(year),
            },
        });
    }
    const nameMatchStage = buildNameSearchQuery(
        employeeName,
        "employeeDetails.general.firstName",
        "employeeDetails.general.lastName"
    );

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "employeeId",
                foreignField: "_id",
                as: "employeeDetails",
            },
        },
        {
            $unwind: {
                path: "$employeeDetails",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $match: nameMatchStage,
        },
        {
            $lookup: {
                from: "users",
                localField: "hrId",
                foreignField: "_id",
                as: "hrDetails",
            },
        },
        {
            $unwind: {
                path: "$hrDetails",
                preserveNullAndEmptyArrays: true,
            },
        }
    );

    pipeline.push({
        $facet: {
            metadata: [{ $count: "totalRecords" }],
            data: [
                { $sort: { date: -1, _id: -1 } },
                { $skip: skip },
                { $limit: limitNumber },
                {
                    $project: {
                        _id: 1,
                        month: 1,
                        year: 1,
                        baseSalary: 1,
                        netSalary: 1,
                        deductions: 1,
                        daysPresent: 1,
                        daysAbsent: 1,
                        status: 1,
                        employeeId: 1,
                        employee: {
                            employeeId: "$employeeDetails._id",
                            firstName: "$employeeDetails.general.firstName",
                            lastName: "$employeeDetails.general.lastName",
                            email: "$employeeDetails.general.email",
                            phone: "$employeeDetails.general.phone",
                            avatar: "$employeeDetails.general.avatar",
                            department: "$employeeDetails.employee.department",
                            jobTitle: "$employeeDetails.employee.jobTitle",
                            jobType: "$employeeDetails.employee.jobType",
                        },
                        hrApprovedBy: {
                            _id: "$hrDetails._id",
                            firstName: "$hrDetails.general.firstName",
                            lastName: "$hrDetails.general.lastName",
                            avatar: "$hrDetails.general.avatar",
                        },
                    },
                },
            ],
        },
    });

    const result = await Payroll.aggregate(pipeline);
    const leaveData = result[0].data;
    const totalRecords = result[0].metadata[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            leave: leaveData,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        },
    });
});
