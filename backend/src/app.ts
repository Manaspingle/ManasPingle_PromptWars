import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { analyzeRouter } from './routes/analyze.js';
import { analyzeRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Security headers via Helmet
  app.use(helmet());

  // CORS configuration: flexible localhost in development, strict ALLOWED_ORIGIN in production
  const allowedOrigins = env.ALLOWED_ORIGIN.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server) in non-production
        if (!origin) {
          if (env.NODE_ENV === 'production') {
            return callback(new Error('CORS origin is required.'));
          }
          return callback(null, true);
        }
        // In development, automatically allow localhost and 127.0.0.1 on any port
        if (env.NODE_ENV !== 'production') {
          if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
          }
        }
        // Automatically allow Vercel deployment domains
        if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) {
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error('CORS_FORBIDDEN'));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    })
  );

  // Parse JSON payloads with strict 20kb limit
  app.use(express.json({ limit: '20kb' }));

  // Privacy-preserving request logger (NEVER log request bodies or sensitive decision texts)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      // Log ONLY method, path, status, and duration
      console.log(`[REQ] ${req.method} ${req.path} -> ${res.statusCode} (${durationMs}ms)`);
    });
    next();
  });

  // Health check endpoint (supports both /api/health and /health)
  app.get(['/api/health', '/health'], (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'ThinkLens Reasoning Audit Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Reasoning analysis endpoint with IP rate limiter (supports both /api/analyze and /analyze)
  app.use(['/api/analyze', '/analyze'], analyzeRateLimiter, analyzeRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
