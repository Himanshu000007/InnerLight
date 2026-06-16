import { ContactRepository } from '../repositories/contactRepository.js';
import { sendEmail, emailTemplates } from '../config/email.js';

const contactRepository = new ContactRepository();

export class ContactService {
  async createContact(contactData) {
    try {
      const contact = await contactRepository.create(contactData);

      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">We received your message</h2>
            <p style="color: #666; font-size: 16px;">Hi ${contactData.name},</p>
            <p style="color: #666; font-size: 16px;">Thank you for contacting InnerLight. We will review your message and get back to you soon.</p>
            <p style="color: #666; font-size: 14px;">Reference ID: ${contact._id}</p>
            <p style="color: #666; font-size: 14px;">Best regards,<br>InnerLight Team</p>
          </div>
        </div>
      `;

      await sendEmail(
        contactData.email,
        'We received your message - InnerLight',
        html
      );

      return {
        success: true,
        message: 'Message sent successfully',
        contactId: contact._id,
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async getContacts(page = 1, limit = 10, filters = {}) {
    try {
      return await contactRepository.findAll(page, limit, filters);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getContactById(contactId) {
    try {
      return await contactRepository.findById(contactId);
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async updateContact(contactId, updateData) {
    try {
      return await contactRepository.update(contactId, updateData);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async respondToContact(contactId, response) {
    try {
      const contact = await contactRepository.update(contactId, {
        response,
        status: 'resolved',
        respondedAt: new Date(),
      });

      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Response to your inquiry</h2>
            <p style="color: #666; font-size: 16px;">${response}</p>
            <p style="color: #666; font-size: 14px;">Best regards,<br>InnerLight Support Team</p>
          </div>
        </div>
      `;

      await sendEmail(contact.email, 'Response to your inquiry - InnerLight', html);

      return {
        success: true,
        message: 'Response sent successfully',
      };
    } catch (error) {
      console.error('Error responding to contact:', error);
      throw error;
    }
  }
}