import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Connect to test database
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to test database');
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
});

// Disconnect from test database
afterAll(async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from test database');
  } catch (error) {
    console.error('Test database disconnection error:', error);
  }
});

// Clear database between tests
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing database:', error);
  }
});