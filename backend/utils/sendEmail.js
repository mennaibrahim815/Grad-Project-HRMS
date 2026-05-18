import sgMail from "@sendgrid/mail";

export const sendEmail = async (options) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: options.email,
        from: process.env.EMAIL_USER,
        subject: "HRMS - Password Reset OTP",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2c3e50;">HRMS Security Team</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Your OTP code is:</p>
            <h1 style="color: #3498db; letter-spacing: 5px;">${options.message.split(": ")[1]}</h1>
            <p style="color: #7f8c8d; font-size: 12px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
    `,
    };
    await sgMail.send(msg);
};
