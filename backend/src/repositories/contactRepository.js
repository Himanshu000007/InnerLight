import Contact from '../models/Contact.js';

export class ContactRepository {
  async create(contactData) {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  async findById(id) {
    return await Contact.findById(id);
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments(filters);
    const contacts = await Contact.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments({ userId });
    const contacts = await Contact.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(id, updateData) {
    return await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Contact.findByIdAndDelete(id);
  }

  async findByStatus(status, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments({ status });
    const contacts = await Contact.find({ status })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}