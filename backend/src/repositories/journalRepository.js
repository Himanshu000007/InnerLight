import Journal from '../models/Journal.js';

export class JournalRepository {
  async create(journalData) {
    const journal = new Journal(journalData);
    return await journal.save();
  }

  async findById(id) {
    return await Journal.findById(id).populate('userId', 'firstName lastName email');
  }

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Journal.countDocuments({ userId });
    const journals = await Journal.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      journals,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByUserIdAndFavorite(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Journal.countDocuments({ userId, isFavorite: true });
    const journals = await Journal.find({ userId, isFavorite: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      journals,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async update(id, updateData) {
    return await Journal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Journal.findByIdAndDelete(id);
  }

  async search(userId, searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = {
      userId,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [searchTerm] } },
      ],
    };

    const total = await Journal.countDocuments(query);
    const journals = await Journal.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      journals,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async toggleFavorite(id) {
    const journal = await Journal.findById(id);
    journal.isFavorite = !journal.isFavorite;
    return await journal.save();
  }
}