import OTP from '../models/OTP.js';

export class OTPRepository {
  async create(otpData) {
    const otp = new OTP(otpData);
    return await otp.save();
  }

  async findLatestByEmail(email, type) {
    return await OTP.findOne({ email, type }).sort({ createdAt: -1 });
  }

  async findByEmailAndOTP(email, otp) {
    return await OTP.findOne({ email, otp });
  }

  async markAsUsed(otpId) {
    return await OTP.findByIdAndUpdate(otpId, { isUsed: true }, { new: true });
  }

  async incrementAttempts(otpId) {
    return await OTP.findByIdAndUpdate(
      otpId,
      { $inc: { attempts: 1 } },
      { new: true }
    );
  }

  async deleteByEmail(email) {
    return await OTP.deleteMany({ email });
  }

  async deleteExpired() {
    return await OTP.deleteMany({ expiresAt: { $lt: new Date() } });
  }

  async findById(id) {
    return await OTP.findById(id);
  }
}