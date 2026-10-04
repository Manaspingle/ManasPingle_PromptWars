import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  GeminiTimeoutError,
  GeminiUpstreamError,
  GeminiParseError,
} from '../services/gemini.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // If response has already started sending, delegate to default express handler
  if (res.headersSent) {
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => {
      let field = e.path.join('.');
      if (!field && 'keys' in e && Array.isArray((e as { keys?: unknown[] }).keys)) {
        field = ((e as { keys: string[] }).keys).join(', ');
      }
      return {
        field,
        message: e.message,
      };
    });
    res.status(400).json({
      error: 'Invalid request data.',
      details,
    });
    return;
  }

  // Handle Gemini Timeout (504)
  if (err instanceof GeminiTimeoutError) {
    res.status(504).json({
      error: 'The reasoning audit request timed out. Please try again.',
    });
    return;
  }

  // Handle Gemini Upstream Failure (502)
  if (err instanceof GeminiUpstreamError) {
    res.status(502).json({
      error: 'Reasoning audit service is temporarily unavailable. Please try again.',
    });
    return;
  }

  // Handle Gemini Parse or Schema Failure (502)
  if (err instanceof GeminiParseError) {
    res.status(502).json({
      error: 'Unable to process the reasoning audit results. Please try again.',
    });
    return;
  }

  // Handle Body-parser payload too large or invalid JSON
  if (err && typeof err === 'object') {
    const errorObj = err as { type?: string; status?: number; statusCode?: number };
    if (errorObj.type === 'entity.too.large') {
      res.status(413).json({
        error: 'Request payload exceeds the maximum allowed size (20kb).',
      });
      return;
    }
    if (errorObj.type === 'entity.parse.failed') {
      res.status(400).json({
        error: 'Malformed JSON payload.',
      });
      return;
    }
  }

  // Generic fallback: never expose raw message or stack trace
  console.error('[SERVER ERROR CODE: 500]', err instanceof Error ? err.name : 'UnknownError');
  res.status(500).json({
    error: 'An internal server error occurred. Please try again later.',
  });
}
