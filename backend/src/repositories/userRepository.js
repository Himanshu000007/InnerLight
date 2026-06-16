import User from '../models/User.js';

export class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email) {
  return await User.findOne({
    email: email.toLowerCase(),
  }).select('+password');
}

  async findByIdWithPassword(id) {
    return await User.findById(id).select('+password');
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = User.find(filters);
    const total = await User.countDocuments(filters);
    const users = await query.skip(skip).limit(limit).sort({ createdAt: -1 });

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  }

  async incrementStatistics(userId, field) {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { [`statistics.${field}`]: 1 } },
      { new: true }
    );
  }

  async decrementStatistics(userId, field) {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { [`statistics.${field}`]: -1 } },
      { new: true }
    );
  }

  async search(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}