import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { analysisResultSchema } from '../src/schemas/analysis.js';
import { MANDATORY_DISCLAIMER } from '../src/services/gemini.js';

describe('Contract Integrity & Security Header Audits', () => {
  const app = createApp();

  it('verifies Helmet security headers are present on API responses', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    // Helmet headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-download-options']).toBe('noopen');
  });

  it('verifies that AnalysisResult contract schema enforces all required reasoning dimensions', () => {
    const sampleResult = {
      decisionSummary: 'Weighing job relocation versus family proximity.',
      evidence: [{ statement: 'Offered 20% salary increase', type: 'fact' as const }],
      assumptions: [
        {
          assumption: 'Living costs in new city are identical',
          whyItMatters: 'Net disposable income may actually decrease',
          verificationQuestion: 'Have you verified rent and tax differentials?',
        },
      ],
      blindSpots: [
        {
          factor: 'Commute time variation',
          whyItMayMatter: 'Higher transit fatigue reduces personal productivity',
        },
      ],
      reasoningConflicts: [
        {
          conflict: 'Valuing work-life balance while accepting longer on-site hours',
          explanation: 'Stated priority directly conflicts with commute duration',
        },
      ],
      missingFactors: ['Healthcare plan coverage', 'Relocation assistance allowance'],
      criticalQuestions: ['What is the net savings after local city taxes?'],
      alternativePerspective: 'Prioritizing current trajectory with local promotion opportunity.',
      flipTest: 'If the salary increase were only 5%, would you still consider relocating?',
      disclaimer: MANDATORY_DISCLAIMER,
    };

    const parsed = analysisResultSchema.safeParse(sampleResult);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.disclaimer).toBe(MANDATORY_DISCLAIMER);
      expect(parsed.data.evidence[0].type).toBe('fact');
      expect(parsed.data.flipTest).toContain('?');
    }
  });

  it('rejects an AnalysisResult if disclaimer or required reasoning fields are missing', () => {
    const incomplete = {
      decisionSummary: 'Test',
      evidence: [],
      // missing assumptions, blindSpots, flipTest
    };

    const parsed = analysisResultSchema.safeParse(incomplete);
    expect(parsed.success).toBe(false);
  });

  it('enforces character constraints on input payload boundaries', async () => {
    // Decision input exceeding 1000 characters
    const oversizedDecision = 'A'.repeat(1001);
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: oversizedDecision,
        context: 'Valid context',
        reasoning: 'Valid reasoning',
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
    expect(res.body.details[0].message).toContain('1000');
  });
});
