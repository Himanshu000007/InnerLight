import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/database.js';
import { verifyEmailConnection } from './config/email.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ============================================
    // CONNECT TO DATABASE
    // ============================================
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // ============================================
    // VERIFY EMAIL SERVICE
    // ============================================
    await verifyEmailConnection();

    // ============================================
    // START SERVER
    // ============================================
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║   🧘 INNERLIGHT V2 - BACKEND RUNNING   ║
║                                       ║
║   Server: http://localhost:${PORT}     ║
║   Environment: ${process.env.NODE_ENV}        ║
║   Database: Connected                ║
╚═══════════════════════════════════════╝
      `);
    });

    console.log('JWT_ACCESS_SECRET =', process.env.JWT_ACCESS_SECRET);
    console.log('JWT_REFRESH_SECRET =', process.env.JWT_REFRESH_SECRET);

    // ============================================
    // GRACEFUL SHUTDOWN
    // ============================================
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();