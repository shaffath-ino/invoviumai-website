import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendEmail = async (to, subject, otpCode) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #ef4444; padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">InvoviumAI Security</h2>
        </div>
        <div style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Please use the verification code below to securely access your account.</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827;">${otpCode}</span>
            </div>
            <p style="font-size: 15px; color: #ef4444; margin-top: 24px; font-weight: 600;">Valid for 5 minutes.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"InvoviumAI Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate,
    });
    
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Nodemailer Error: Authentication or network issue ->', error.message);
    return false;
  }
};
