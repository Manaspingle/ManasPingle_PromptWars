import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { analyzeRateLimiter } from '../src/middleware/rateLimiter.js';

describe('Rate Limiter', () => {
  let testApp: express.Express;

  beforeEach(() => {
    testApp = express();
    testApp.use(express.json());
    testApp.post('/test-limit', analyzeRateLimiter, (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });
  });

  it('rateLimiterReturns429', async () => {
    // Send 10 requests within the limit
    for (let i = 0; i < 10; i++) {
      const res = await request(testApp).post('/test-limit').send({});
      expect(res.status).toBe(200);
    }

    // The 11th request should be rate limited and return 429
    const limitedRes = await request(testApp).post('/test-limit').send({});
    expect(limitedRes.status).toBe(429);
    expect(limitedRes.body).toHaveProperty('error');
    expect(limitedRes.body.error).toMatch(/too many requests/i);
  });
});
