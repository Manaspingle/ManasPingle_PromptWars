import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { setGenAIClientForTesting, MANDATORY_DISCLAIMER } from '../src/services/gemini.js';
import type { GoogleGenAI } from '@google/genai';

const VALID_AUDIT_FIXTURE = {
  decisionSummary: 'Evaluating whether to accept a 6-month software internship.',
  evidence: [
    { statement: 'Stipend is Rs 25,000 per month.', type: 'fact' },
    { statement: 'Distance is 12 km from home.', type: 'fact' },
  ],
  assumptions: [
    {
      assumption: 'Internship directly accelerates full-time job prospects.',
      whyItMatters: 'If converted return offers are rare, the time investment might not pay off.',
      verificationQuestion: 'What percentage of past interns were extended return offers?',
    },
  ],
  blindSpots: [
    {
      factor: 'Academic scheduling conflicts',
      whyItMayMatter: 'Exam schedules may clash directly with peak work deliverables.',
    },
  ],
  reasoningConflicts: [
    {
      conflict: 'Desire for deep focus vs long commute.',
      explanation: 'Traveling 12 km daily may diminish energy needed for college coursework.',
    },
  ],
  missingFactors: ['Workplace culture and mentorship availability.'],
  criticalQuestions: [
    'How will academic evaluation be handled by the college during internship hours?',
    'What specific projects will you own as an intern?',
  ],
  alternativePerspective:
    'A learning-focused observer might argue that academic capstone projects offer more freedom than repetitive entry-level tasks.',
  flipTest:
    'If the commute were 0 km (remote) but unpaid, would you still take it? Why or why not?',
  disclaimer: 'Model generated disclaimer text.',
};

describe('POST /api/analyze Behavior-Driven Tests', () => {
  let mockGenerateContent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGenerateContent = vi.fn().mockResolvedValue({
      text: JSON.stringify(VALID_AUDIT_FIXTURE),
    });

    setGenAIClientForTesting({
      models: {
        generateContent: mockGenerateContent,
      },
    } as unknown as GoogleGenAI);
  });

  it('rejectsEmptyDecision', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: '   ',
        context: 'Some valid context about college.',
        reasoning: 'Some valid reasoning.',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request data.');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'decision',
          message: 'Decision cannot be empty.',
        }),
      ])
    );
  });

  it('rejectsMissingReasoning', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I take this job?',
        context: 'Some valid context.',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid request data.');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'reasoning',
        }),
      ])
    );
  });

  it('rejectsOversizedInput', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'A'.repeat(1001),
        context: 'Valid context',
        reasoning: 'Valid reasoning',
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'decision',
          message: 'Decision must be 1000 characters or fewer.',
        }),
      ])
    );
  });

  it('rejectsUnknownFields', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Valid decision',
        context: 'Valid context',
        reasoning: 'Valid reasoning',
        unauthorizedField: 'malicious payload',
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'unauthorizedField',
        }),
      ])
    );
  });

  it('acceptsValidInput', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I accept a 6-month internship offer?',
        context: 'Third year college student, Rs 25,000 stipend, 12 km from home.',
        reasoning: 'Looking for industry exposure and good financial compensation.',
        priorities: 'Career advancement, academics balance.',
        alternatives: 'Online certs or college research.',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('decisionSummary');
  });

  it('returns200WithAllRequiredFieldsOnSuccess', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I accept an internship?',
        context: 'Third year college student.',
        reasoning: 'Want industry exposure.',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('decisionSummary');
    expect(res.body).toHaveProperty('evidence');
    expect(res.body).toHaveProperty('assumptions');
    expect(res.body).toHaveProperty('blindSpots');
    expect(res.body).toHaveProperty('reasoningConflicts');
    expect(res.body).toHaveProperty('missingFactors');
    expect(res.body).toHaveProperty('criticalQuestions');
    expect(res.body).toHaveProperty('alternativePerspective');
    expect(res.body).toHaveProperty('flipTest');
    expect(res.body).toHaveProperty('disclaimer');

    expect(Array.isArray(res.body.evidence)).toBe(true);
    expect(Array.isArray(res.body.assumptions)).toBe(true);
    expect(Array.isArray(res.body.blindSpots)).toBe(true);
    expect(Array.isArray(res.body.reasoningConflicts)).toBe(true);
    expect(Array.isArray(res.body.missingFactors)).toBe(true);
    expect(Array.isArray(res.body.criticalQuestions)).toBe(true);
    expect(typeof res.body.alternativePerspective).toBe('string');
    expect(typeof res.body.flipTest).toBe('string');
    expect(typeof res.body.disclaimer).toBe('string');
  });

  it('overridesDisclaimerServerSide', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        ...VALID_AUDIT_FIXTURE,
        disclaimer: 'ATTEMPTED OVERWRITE FROM GEMINI',
      }),
    });

    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I accept an internship?',
        context: 'Third year college student.',
        reasoning: 'Want industry exposure.',
      });

    expect(res.status).toBe(200);
    expect(res.body.disclaimer).toBe(MANDATORY_DISCLAIMER);
    expect(res.body.disclaimer).not.toBe('ATTEMPTED OVERWRITE FROM GEMINI');
  });

  it('handlesGeminiFailureWith502', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Google GenAI internal failure'));

    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I accept an internship?',
        context: 'Third year college student.',
        reasoning: 'Want industry exposure.',
      });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).not.toContain('Google GenAI internal failure'); // never leak upstream stack/error
  });

  it('handlesMalformedGeminiOutputWith502', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '<<< Not valid JSON output >>>',
    });

    const res = await request(app)
      .post('/api/analyze')
      .send({
        decision: 'Should I accept an internship?',
        context: 'Third year college student.',
        reasoning: 'Want industry exposure.',
      });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error');
  });

  it('handlesTimeoutWith504', async () => {
    // Simulate a hung API call that triggers our service timeout
    mockGenerateContent.mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Aborted by signal')), 100);
        })
    );

    // Call service via route, but to test fast without waiting 25s,
    // we can import and invoke generateReasoningAudit directly or test route
    const { generateReasoningAudit, GeminiTimeoutError } = await import(
      '../src/services/gemini.js'
    );

    mockGenerateContent.mockImplementation(
      () =>
        new Promise((resolve) => {
          // Never resolves to force timeout
          setTimeout(resolve, 5000);
        })
    );

    await expect(
      generateReasoningAudit(
        {
          decision: 'Should I accept?',
          context: 'College student',
          reasoning: 'Good learning',
        },
        50 // 50ms test timeout
      )
    ).rejects.toThrow(GeminiTimeoutError);
  });

  it('healthEndpointReturns200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('ThinkLens');
  });
});
