import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { ValidatedDecisionInput } from '../schemas/decision.js';
import {
  analysisResultSchema,
  geminiAnalysisResponseSchema,
  type BackendAnalysisResult,
} from '../schemas/analysis.js';
import { SYSTEM_INSTRUCTION, buildPrompt } from '../prompts/reasoningAudit.js';

export const MANDATORY_DISCLAIMER =
  'This analysis does not recommend a decision. It helps you examine what to think about before you decide.';

export class GeminiTimeoutError extends Error {
  statusCode = 504;
  constructor(message = 'The reasoning audit service timed out. Please try again.') {
    super(message);
    this.name = 'GeminiTimeoutError';
  }
}

export class GeminiUpstreamError extends Error {
  statusCode = 502;
  constructor(message = 'Reasoning audit service is temporarily unavailable. Please try again.') {
    super(message);
    this.name = 'GeminiUpstreamError';
  }
}

export class GeminiParseError extends Error {
  statusCode = 502;
  constructor(message = 'Unable to process the reasoning audit results. Please try again.') {
    super(message);
    this.name = 'GeminiParseError';
  }
}

// Singleton client initialization
let aiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return aiClient;
}

export function setGenAIClientForTesting(client: GoogleGenAI | null): void {
  aiClient = client;
}

function isTransientError(error: unknown): boolean {
  if (!error) return false;
  const errStr = String(error).toLowerCase();
  const status = (error as { status?: number; statusCode?: number })?.status ||
    (error as { status?: number; statusCode?: number })?.statusCode;

  return (
    status === 429 ||
    status === 503 ||
    errStr.includes('429') ||
    errStr.includes('503') ||
    errStr.includes('resource_exhausted') ||
    errStr.includes('unavailable')
  );
}

/**
 * Executes a single generateContent call with a hard timeout.
 */
async function callGeminiOnce(promptText: string, timeoutMs: number): Promise<string> {
  const ai = getGenAIClient();
  const controller = new AbortController();

  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new GeminiTimeoutError());
    }, timeoutMs);
  });

  try {
    const apiCallPromise = (async () => {
      const response = await ai.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: promptText,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: geminiAnalysisResponseSchema,
          temperature: 0.2,
          maxOutputTokens: 4096,
          abortSignal: controller.signal,
        },
      });

      const text = response.text;
      if (!text) {
        throw new GeminiParseError('Gemini returned an empty response.');
      }
      return text;
    })();

    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    return result;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Generates reasoning audit for a validated user decision.
 * EXACTLY ONE generateContent call per request (with at most 1 retry on transient 429/503).
 */
export async function generateReasoningAudit(
  input: ValidatedDecisionInput,
  timeoutMs = 25000
): Promise<BackendAnalysisResult> {
  const promptText = buildPrompt(input);
  let rawText: string;

  try {
    try {
      rawText = await callGeminiOnce(promptText, timeoutMs);
    } catch (firstErr) {
      if (firstErr instanceof GeminiTimeoutError) {
        throw firstErr;
      }
      // Check if transient error eligible for single retry
      if (isTransientError(firstErr)) {
        // Wait 1 second before retry
        await new Promise((res) => setTimeout(res, 1000));
        rawText = await callGeminiOnce(promptText, timeoutMs);
      } else {
        throw firstErr;
      }
    }
  } catch (err: unknown) {
    if (err instanceof GeminiTimeoutError) {
      throw err;
    }
    if (err instanceof GeminiParseError) {
      throw err;
    }
    // Mask raw upstream errors from the caller
    throw new GeminiUpstreamError(
      'The reasoning audit service encountered an upstream error. Please try again.'
    );
  }

  // Parse JSON
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    throw new GeminiParseError('Failed to parse reasoning audit JSON response.');
  }

  // Validate against Zod schema
  const parseResult = analysisResultSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    throw new GeminiParseError('Reasoning audit response did not match the expected schema.');
  }

  const analysis = parseResult.data;

  // Always overwrite the disclaimer field server-side
  analysis.disclaimer = MANDATORY_DISCLAIMER;

  return analysis;
}
