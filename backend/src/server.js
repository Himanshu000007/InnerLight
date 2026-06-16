import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ============================================
    // CONNECT TO DATABASE
    // ============================================
    await connectDatabase();
    console.log('✅ Database connected successfully');

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