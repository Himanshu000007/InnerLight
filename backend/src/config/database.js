import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'innerlight_v2',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
};