import OpenAI from "openai";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import appErrors from "../utils/errors.js";
import { httpResponseText } from "../utils/httpResponseText.js";

// تعديل الـ Client عشان يكلم Groq بدل OpenAI
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY, // تأكد إنك حاطط المفتاح في الـ .env بالاسم ده
    baseURL: "https://api.groq.com/openai/v1",
});

export const askChatbot = asyncWraper(async (req, res, next) => {
    const { message } = req.body;
    const userRole = req.currentUser.role;

    if (!message) {
        return next(
            appErrors.create(400, "Message is required", httpResponseText.FAIL)
        );
    }

    let systemPrompt = `You are the 'Staffly AI Assistant', an intelligent HR expert integrated into the Staffly HRMS system. 
    The Staffly system features: RFID-based Attendance, Automated Payroll, Leave Management, Task Tracking, and an end-to-end Hiring process.
    Be concise, professional, and helpful. You must respond in the same language the user speaks to you (Arabic or English).`;

    if (userRole === "HR" || userRole === "MANAGER") {
        systemPrompt += `\nYou are talking to an HR Admin. Help them manage the workforce, review payroll, manage job posts, analyze attendance data, and assign tasks.`;
    } else {
        systemPrompt += `\nYou are talking to an Employee. Guide them on requesting leaves, checking attendance, viewing tasks, and payroll slips. Do not reveal sensitive HR configuration data.`;
    }

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    res.status(200).json({
        status: httpResponseText.SUCCESS,
        data: {
            reply: aiResponse,
        },
    });
});
