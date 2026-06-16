import { ContactService } from '../services/contactService.js';

const contactService = new ContactService();

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const result = await contactService.createContact({
      userId,
      ...req.body,
    });

    res.status(201).json({
      status: 'success',
      message: result.message,
      contactId: result.contactId,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const filters = {};
    if (status) filters.status = status;

    const result = await contactService.getContacts(page, limit, filters);

    res.status(200).json({
      status: 'success',
      data: result.contacts,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactService.getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactService.updateContact(contactId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { response } = req.body;

    const result = await contactService.respondToContact(contactId, response);

    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};