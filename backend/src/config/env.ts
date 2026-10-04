import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config();

export interface AppEnv {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  ALLOWED_ORIGIN: string;
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
}

const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
const port = parseInt(process.env.PORT || '3000', 10);
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Fail fast in production or non-test environments if GEMINI_API_KEY is missing
if (nodeEnv !== 'test' && !geminiApiKey) {
  // If running in development without key, warn; in production, fail immediately
  if (nodeEnv === 'production') {
    throw new Error('FATAL: GEMINI_API_KEY environment variable is required in production.');
  } else {
    console.warn(
      '⚠️  [CONFIG WARNING] GEMINI_API_KEY is not set. Gemini API calls will fail unless configured in backend/.env'
    );
  }
}

export const env: AppEnv = {
  PORT: isNaN(port) ? 3000 : port,
  NODE_ENV: nodeEnv,
  ALLOWED_ORIGIN: allowedOrigin,
  GEMINI_API_KEY: geminiApiKey,
  GEMINI_MODEL: geminiModel,
};
