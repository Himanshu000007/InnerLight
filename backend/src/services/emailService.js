import { sendEmail, emailTemplates } from '../config/email.js';

export class EmailService {
  /**
   * Send verification email
   */
  async sendVerificationEmail(email, name, otp) {
    try {
      const html = emailTemplates.otpVerification(otp, name);
      await sendEmail(email, 'Verify Your Email - InnerLight', html);

      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, name, resetLink) {
    try {
      const html = emailTemplates.passwordReset(resetLink, name);
      await sendEmail(email, 'Reset Your Password - InnerLight', html);

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email, name) {
    try {
      const html = emailTemplates.welcome(name);
      await sendEmail(email, 'Welcome to InnerLight!', html);

      return {
        success: true,
        message: 'Welcome email sent',
      };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send contact confirmation email
   */
  async sendContactConfirmationEmail(email, name, contactId) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">We received your message</h2>
            <p style="color: #666; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; font-size: 16px;">Thank you for contacting InnerLight. We will review your message and get back to you soon.</p>
            <p style="color: #999; font-size: 14px;">Reference ID: ${contactId}</p>
            <p style="color: #666; font-size: 14px;">Best regards,<br>InnerLight Team</p>
          </div>
        </div>
      `;

      await sendEmail(email, 'We received your message - InnerLight', html);

      return {
        success: true,
        message: 'Contact confirmation email sent',
      };
    } catch (error) {
      console.error('Error sending contact confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  /**
   * Send admin response email
   */
  async sendAdminResponseEmail(email, name, response) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Response to your inquiry</h2>
            <p style="color: #666; font-size: 16px;">Hi ${name},</p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #666; font-size: 14px;">${response}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Best regards,<br>InnerLight Support Team</p>
          </div>
        </div>
      `;

      await sendEmail(email, 'Response to your inquiry - InnerLight', html);

      return {
        success: true,
        message: 'Response email sent',
      };
    } catch (error) {
      console.error('Error sending response email:', error);
      throw new Error('Failed to send response email');
    }
  }

  /**
   * Send account suspension email
   */
  async sendAccountSuspensionEmail(email, name, reason) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">Account Suspended</h2>
            <p style="color: #666; font-size: 16px;">Hi ${name},</p>
            <p style="color: #666; font-size: 16px;">Your account has been suspended due to the following reason:</p>
            <p style="background-color: #fff3cd; padding: 15px; border-radius: 5px; color: #856404;">${reason}</p>
            <p style="color: #666; font-size: 14px;">If you believe this is a mistake, please contact support.</p>
            <p style="color: #666; font-size: 14px;">Best regards,<br>InnerLight Team</p>
          </div>
        </div>
      `;

      await sendEmail(email, 'Account Suspended - InnerLight', html);

      return {
        success: true,
        message: 'Suspension email sent',
      };
    } catch (error) {
      console.error('Error sending suspension email:', error);
      throw new Error('Failed to send suspension email');
    }
  }
}