import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env file!');
    throw new Error('MONGODB_URI not found');
  }

  console.log('🔄 Connecting to MongoDB Atlas...');
  // Show partial URI for debugging (hide password)
  const safeUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`📡 URI: ${safeUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Connection refused. Check if your IP is whitelisted in MongoDB Atlas Network Access.');
    } else if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('💡 Tip: Authentication failed. Check your username and password in MONGODB_URI.');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timed out')) {
      console.error('💡 Tip: Connection timed out. Your IP may not be whitelisted in MongoDB Atlas.');
      console.error('   → Go to Atlas → Network Access → Add IP Address → Add Current IP (or 0.0.0.0/0 for dev)');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('💡 Tip: DNS resolution failed. Check your internet connection or the cluster hostname.');
    }

    throw error;
  }
};

export default connectDB;
