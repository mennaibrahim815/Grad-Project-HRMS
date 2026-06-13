import Applicant from "../models/applicant.model.js";
import Job from "../models/job.model.js";
import { httpResponseText } from "../utils/httpResponseText.js";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import appErrors from "../utils/errors.js";
import * as ort from "onnxruntime-node";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
    calculateSkillsMatch,
    calculateEducationMatch,
} from "../utils/atsFeatureExtractor.js";
import { sendNotification } from "../utils/sendNotification.js";

export const getAllApplicantsWithFilters = asyncWraper(
    async (req, res, next) => {
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
                        { $sort: { atsScore: -1, createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        // ==========================================
                        // 🔗 1. ربط المتقدم بالوظيفة (Join)
                        // ==========================================
                        {
                            $lookup: {
                                from: "jobs", // اسم كوليكشن الوظائف في الداتابيز (بيكون جمع وسمول)
                                localField: "jobId", // الـ ID اللي في المتقدم
                                foreignField: "_id", // الـ ID اللي في الوظيفة
                                as: "jobDetails", // اسم الحقل الجديد اللي هيرجع
                            },
                        },
                        // 🔗 2. تحويل الـ Array اللي راجعة لـ Object واحد
                        {
                            $unwind: {
                                path: "$jobDetails",
                                preserveNullAndEmptyArrays: true, // عشان لو الوظيفة ممسوحة المتقدم ميختفيش
                            },
                        },
                        {
                            $project: {
                                "personalInfo.firstName": 1,
                                "personalInfo.lastName": 1,
                                "personalInfo.email": 1,
                                "personalInfo.department": 1,
                                "personalInfo.experienceLevel": 1,
                                "personalInfo.avatar": 1,
                                status: 1,
                                atsScore: 1,
                                createdAt: 1,
                                // ==========================================
                                // 🎯 3. اختيار بيانات الوظيفة اللي هتتعرض للـ HR
                                // ==========================================
                                "jobDetails._id": 1,
                                "jobDetails.title": 1,
                                "jobDetails.department": 1,
                                "jobDetails.jobType": 1,
                            },
                        },
                    ],
                },
            },
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
                    limit,
                },
            },
        });
    }
);

export const getApplicantById = asyncWraper(async (req, res, next) => {
    const applicantId = req.params.id;

    // تم إضافة populate لجلب بيانات الوظيفة
    const applicant = await Applicant.findById(applicantId)
        .select("-__v")
        .populate({
            path: "jobId",
            select: "title department experienceLevel jobType workLocation", // الحقول اللي محتاجينها بس
        });

    if (!applicant) {
        const error = appErrors.create(
            404,
            "Applicant Not Found",
            httpResponseText.FAIL
        );
        return next(error);
    }

    res.json({
        status: httpResponseText.SUCCESS,
        data: { applicant },
    });
});

export const getApplicantsByJobId = asyncWraper(async (req, res, next) => {
    const jobId = req.params.jobId;

    const applicants = await Applicant.find({ jobId }, { __v: false })
        .sort({ atsScore: -1 })
        .populate({
            path: "jobId",
            select: "title department", // ببعت التايتل والقسم بس عشان حجم الريكوست ميكبرش
        });

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
    if (!job)
        return next(
            appErrors.create(404, "Job Not Found", httpResponseText.FAIL)
        );

    const oldApplicant = await Applicant.findOne({
        "personalInfo.email": req.body.personalInfo?.email,
        jobId: jobId,
    });
    if (oldApplicant)
        return next(
            appErrors.create(
                400,
                "Applicant Already Exists",
                httpResponseText.FAIL
            )
        );

    // 🧠 أ. مرحلة الـ Feature Engineering واستخراج الميزات الحية
    const skillsMatchScore = calculateSkillsMatch(
        job.requiredSkills,
        req.body.professionalInfo?.skills || []
    );

    // حماية ديناميكية للوظائف القديمة التي لا تحتوي على requiredExperienceYears لمنع الـ NaN
    const jobExp = job.requiredExperienceYears || 0;
    const applicantExp =
        parseFloat(req.body.professionalInfo?.yearsOfExperience) || 0;
    const experienceGap = applicantExp - jobExp;

    const educationMatch = calculateEducationMatch(
        job.requiredEducationLevel || "Bachelor's",
        req.body.professionalInfo?.educationLevel
    );

    // 🤖 ب. مرحلة تشغيل الموديل وحساب الـ Score عبر بيئة ONNX Runtime القياسية
    let atsScore = 0;
    try {
        const modelPath = path.resolve("./ml_models/ats_scorer.onnx");
        const session = await ort.InferenceSession.create(modelPath);

        const inputData = Float32Array.from([
            skillsMatchScore,
            experienceGap,
            educationMatch,
        ]);
        const tensor = new ort.Tensor("float32", inputData, [1, 3]);

        const results = await session.run({ float_input: tensor });
        const outputName = session.outputNames[0];

        atsScore = Math.round(results[outputName].data[0]);
        // التأكد من بقاء الرقم في النطاق السليم بين 0 و 100
        atsScore = Math.max(0, Math.min(100, atsScore));
    } catch (error) {
        console.error("ONNX ML Inference Error:", error);
        atsScore = 50; // سكور افتراضي آمن لحماية استقرار التطبيق في حالة أي خطأ تقني
    }

    // 💾 ج. مرحلة حفظ البيانات بالـ Score المستخرج لايف والـ Insights
    const newApplicant = new Applicant({
        ...req.body,
        jobId,
        atsScore: atsScore,
    });

    newApplicant.__v = undefined;
    await newApplicant.save();
    const io = req.app.get("io");
    if (io) {
        await sendNotification(io, {
            targetRoom: "HR_Room",
            sender: req.currentUser?.userId || newApplicant._id,
            title: "New Job Application",
            message: `A new application has been submitted for ${job.title} with an ATS Score of ${atsScore}%.`,
            type: "Recruitment",
            relatedId: newApplicant._id,
        });
    }

    res.status(201).json({
        status: httpResponseText.SUCCESS,
        data: {
            newApplicant,
            ml_insights: {
                atsScore,
                details: { skillsMatchScore, experienceGap, educationMatch },
            },
        },
    });
});

export const updateApplicant = asyncWraper(async (req, res, next) => {
    const applicantID = req.params.id;
    const { status, rejectionReason } = req.body;

    const applicant = await Applicant.findById(applicantID);
    if (!applicant) {
        return next(
            appErrors.create(404, "Applicant Not Found", httpResponseText.FAIL)
        );
    }

    if (applicant.status === "Hired") {
        return next(
            appErrors.create(
                400,
                "Cannot update an already hired applicant.",
                httpResponseText.FAIL
            )
        );
    }

    applicant.status = status;
    if (status === "Rejected" && rejectionReason) {
        applicant.rejectionReason = rejectionReason;
    }
    await applicant.save();

    const fullName = `${applicant.personalInfo.firstName} ${applicant.personalInfo.lastName}`;
    const userEmail = applicant.personalInfo.email;

    try {
        if (status === "Interviewing") {
            await sendEmail({
                email: userEmail,
                subject: "Update on your application - Interview Invitation",
                message: `Dear ${fullName},\n\nWe were impressed by your profile and would like to invite you for an interview. Our HR team will contact you shortly with the details.\n\nBest Regards,\nHR Team`,
            });
        } else if (status === "Rejected") {
            const reasonText = rejectionReason
                ? `\nFeedback: ${rejectionReason}\n`
                : "";
            await sendEmail({
                email: userEmail,
                subject: "Update on your application",
                message: `Dear ${fullName},\n\nThank you for taking the time to apply. After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.${reasonText}\nWe wish you the best in your job search.\n\nBest Regards,\nHR Team`,
            });
        }
    } catch (error) {
        console.error("Email Error:", error);
    }

    res.json({
        status: httpResponseText.SUCCESS,
        message: `Applicant status updated to ${status}.`,
        data: { applicant },
    });
});

export const onboardApplicant = asyncWraper(async (req, res, next) => {
    console.log("REQ BODY IS:", JSON.stringify(req.body, null, 2));
    const applicantId = req.params.id;
    const { general, experience, employee } = req.body;

    // 1. نتأكد إن المتقدم موجود
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
        if (general?.avatar) await deleteFromCloudinary(general.avatar);
        return next(
            appErrors.create(404, "Applicant Not Found", httpResponseText.FAIL)
        );
    }

    if (applicant.status === "Hired") {
        if (general?.avatar) await deleteFromCloudinary(general.avatar);
        return next(
            appErrors.create(
                400,
                "Applicant is already hired",
                httpResponseText.FAIL
            )
        );
    }

    // 2. التحقق من وجود المستخدم (Email)
    const oldUser = await User.findOne({ "general.email": general.email });
    if (oldUser) {
        if (general?.avatar) await deleteFromCloudinary(general.avatar);
        return next(
            appErrors.create(
                400,
                "User Email Already Exists",
                httpResponseText.FAIL
            )
        );
    }

    // 3. التحقق من الـ RFID
    if (general?.rfidTag) {
        const oldRfid = await User.findOne({
            "general.rfidTag": general.rfidTag,
        });
        if (oldRfid) {
            if (general?.avatar) await deleteFromCloudinary(general.avatar);
            return next(
                appErrors.create(
                    400,
                    "RFID Tag is already assigned",
                    httpResponseText.FAIL
                )
            );
        }
    }

    try {
        // 4. تجهيز كلمة السر والموظف الجديد
        const generatedPassword = crypto.randomBytes(4).toString("hex");
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        general.password = hashedPassword;

        const newUser = new User({ general, experience, employee });
        await newUser.save();

        // 5. تحديث حالة المتقدم
        applicant.status = "Hired";
        await applicant.save();

        // 6. إرسال الإيميل
        try {
            await sendEmail({
                email: newUser.general.email,
                subject: "Welcome to the Team - Your Account Details",
                message: `Dear ${newUser.general.firstName} ${newUser.general.lastName},\n\nYour account has been successfully created in the company's HR system.\n\nHere are your login credentials:\nEmail: ${newUser.general.email}\nTemporary Password: ${generatedPassword}\n\nPlease log in and change your password as soon as possible.\n\nBest Regards,\nHR Department`,
            });
        } catch (emailError) {
            // لو الإيميل فشل، نمسح اليوزر ونرجع الأبليكانت لحالته عشان الـ HR يعيد المحاولة
            await User.findByIdAndDelete(newUser._id);
            applicant.status = "Interviewing";
            await applicant.save();
            if (general?.avatar) await deleteFromCloudinary(general.avatar);

            return next(
                appErrors.create(
                    500,
                    "Failed to send welcome email. Onboarding aborted.",
                    httpResponseText.FAIL
                )
            );
        }

        newUser.general.password = undefined;
        newUser.__v = undefined;

        res.status(201).json({
            status: httpResponseText.SUCCESS,
            message: "Employee onboarded successfully and welcome email sent.",
            data: { newUser },
        });
    } catch (error) {
        if (general?.avatar) await deleteFromCloudinary(general.avatar);
        return next(error);
    }
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
                interviewing: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Interviewing"] }, 1, 0],
                    },
                },
                hired: {
                    $sum: { $cond: [{ $eq: ["$status", "Hired"] }, 1, 0] },
                },
                rejected: {
                    $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
                },
                applied: {
                    $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] },
                },
            },
        },
        {
            $project: { _id: 0 },
        },
    ]);

    const result = stats[0] || {
        totalApplicants: 0,
        interviewing: 0,
        hired: 0,
        rejected: 0,
        applied: 0,
    };

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { stats: result },
    });
});

export const searchApplicants = asyncWraper(async (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return res
            .status(200)
            .json({ status: httpResponseText.SUCCESS, data: { results: [] } });
    }

    const results = await Applicant.aggregate([
        {
            $match: {
                $or: [
                    {
                        "personalInfo.firstName": {
                            $regex: name,
                            $options: "i",
                        },
                    },
                    {
                        "personalInfo.lastName": {
                            $regex: name,
                            $options: "i",
                        },
                    },
                    {
                        $expr: {
                            $regexMatch: {
                                input: {
                                    $concat: [
                                        "$personalInfo.firstName",
                                        " ",
                                        "$personalInfo.lastName",
                                    ],
                                },
                                regex: name,
                                options: "i",
                            },
                        },
                    },
                ],
            },
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
                atsScore: 1, // إرفاق حقل السكور في نتائج البحث
                createdAt: 1,
            },
        },
        {
            $sort: { atsScore: -1 }, // ترتيب نتائج البحث تنازلياً للأجدر فالأقل
        },
    ]);

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: { results },
    });
});
