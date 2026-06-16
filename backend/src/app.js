import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cookieParser());
// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(mongoSanitize());

// ============================================
// COMPRESSION & LOGGING MIDDLEWARE
// ============================================

app.use(compression());
app.use(morgan('combined'));
app.use(requestLogger);

// ============================================
// BODY PARSER MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// RATE LIMITING
// ============================================

app.use('/api/', rateLimiter);

// ============================================
// ROUTES
// ============================================

app.use('/api/v1', routes);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'InnerLight V2 Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE (MUST BE LAST)
// ============================================

app.use(errorHandler);

export default app;