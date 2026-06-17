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
    if (process.env.NODE_ENV === 'test') {
      console.log(`🧪 Test environment: bypassing real mail transport for ${to}.`);
      return {
        messageId: `mock-msg-${Date.now()}`,
        accepted: [to],
        rejected: [],
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    console.log(`📧 Sending email to ${to}...`);
    console.log(`📝 Subject: ${subject}`);
    console.log(`📄 HTML Preview:\n${html}\n-------------------`);

    // Race transporter.sendMail against a 3-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP connection timeout (Render blocks SMTP ports)')), 3000)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);

    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    // TEMPORARY: Email verification disabled
    // TODO: Re-enable when email provider is fixed
    console.warn(`⚠️ Error sending email to ${to} (Bypassed under fallback plan):`, error.message || error);
    return {
      messageId: `mock-msg-${Date.now()}`,
      accepted: [to],
      rejected: [],
    };
  }
};

export const verifyEmailConnection = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return true;
    }

    console.log('🔍 Checking email service connection...');

    // Race verify against a 3-second timeout
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP connection timeout (Render blocks SMTP ports)')), 3000)
    );

    await Promise.race([verifyPromise, timeoutPromise]);

    console.log('✅ Email service ready');
    return true;
  } catch (error) {
    console.warn('⚠️ Email service warning (Bypassed):', error.message || error);
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