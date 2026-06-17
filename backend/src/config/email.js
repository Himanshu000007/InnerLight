import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('EMAIL_USER =', process.env.EMAIL_USER);
console.log('EMAIL_FROM =', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    console.log(`📧 Sending email to ${to}...`);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email FULL:', error);
    throw new Error('Failed to send email');
  }
};

export const verifyEmailConnection = async () => {
  try {
    console.log('🔍 Checking email service connection...');

    await transporter.verify();

    console.log('✅ Email service ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error FULL:', error);
    return false;
  }
};

export const emailTemplates = {
  otpVerification: (otp, name) => `
    <h2>Welcome to InnerLight</h2>
    <p>Hi ${name},</p>
    <p>Your verification OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP expires in 10 minutes.</p>
  `,

  passwordReset: (resetLink, name) => `
    <h2>Password Reset</h2>
    <p>Hi ${name},</p>
    <a href="${resetLink}">Reset Password</a>
  `,

  welcome: (name) => `
    <h2>Welcome to InnerLight 🧘</h2>
    <p>Hi ${name},</p>
    <p>Thank you for joining InnerLight.</p>
  `,
};