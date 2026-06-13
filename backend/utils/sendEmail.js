import sgMail from "@sendgrid/mail";

export const sendEmail = async (options) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // بنشوف هل الرسالة فيها كود ولا دي رسالة نصية عادية؟
    const isOTP = options.subject.includes("OTP");

    const msg = {
        to: options.email,
        from: process.env.EMAIL_USER,
        subject: options.subject,
        html: isOTP
            ? `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c3e50;">HRMS Security Team</h2>
                <p>Hello,</p>
                <p>We received a request. Your OTP code is:</p>
                <h1 style="color: #3498db; letter-spacing: 5px;">${options.message.split(": ")[1]}</h1>
            </div>`
            : `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                <p>${options.message.replace(/\n/g, "<br>")}</p>
            </div>`,
    };
    await sgMail.send(msg);
};
