import { z } from 'zod';
import { Type, type Schema } from '@google/genai';

// Zod Response Schema for runtime validation
export const evidenceItemSchema = z.object({
  statement: z.string().min(1, 'Evidence statement cannot be empty'),
  type: z.literal('fact'),
});

export const assumptionItemSchema = z.object({
  assumption: z.string().min(1, 'Assumption cannot be empty'),
  whyItMatters: z.string().min(1, 'Why it matters cannot be empty'),
  verificationQuestion: z.string().min(1, 'Verification question cannot be empty'),
});

export const blindSpotItemSchema = z.object({
  factor: z.string().min(1, 'Blind spot factor cannot be empty'),
  whyItMayMatter: z.string().min(1, 'Why it may matter cannot be empty'),
});

export const reasoningConflictItemSchema = z.object({
  conflict: z.string().min(1, 'Reasoning conflict cannot be empty'),
  explanation: z.string().min(1, 'Reasoning conflict explanation cannot be empty'),
});

export const analysisResultSchema = z.object({
  decisionSummary: z.string().min(1, 'Decision summary is required'),
  evidence: z.array(evidenceItemSchema),
  assumptions: z.array(assumptionItemSchema),
  blindSpots: z.array(blindSpotItemSchema),
  reasoningConflicts: z.array(reasoningConflictItemSchema),
  missingFactors: z.array(z.string()),
  criticalQuestions: z.array(z.string()),
  alternativePerspective: z.string().min(1, 'Alternative perspective is required'),
  flipTest: z.string().min(1, 'Flip test is required'),
  disclaimer: z.string().min(1, 'Disclaimer is required'),
});

export type BackendAnalysisResult = z.infer<typeof analysisResultSchema>;

// Gemini Response Schema for @google/genai structured output
export const geminiAnalysisResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    decisionSummary: {
      type: Type.STRING,
      description: 'A concise, neutral summary of the user decision under consideration.',
    },
    evidence: {
      type: Type.ARRAY,
      description: 'Only facts explicitly stated by the user in their text.',
      items: {
        type: Type.OBJECT,
        properties: {
          statement: { type: Type.STRING, description: 'Explicit stated fact.' },
          type: { type: Type.STRING, description: 'Always "fact".' },
        },
        required: ['statement', 'type'],
      },
    },
    assumptions: {
      type: Type.ARRAY,
      description: 'Unstated assumptions underlying the reasoning.',
      items: {
        type: Type.OBJECT,
        properties: {
          assumption: { type: Type.STRING, description: 'The unstated belief or assumption.' },
          whyItMatters: { type: Type.STRING, description: 'Why this assumption is pivotal.' },
          verificationQuestion: {
            type: Type.STRING,
            description: 'Actionable question to test this assumption.',
          },
        },
        required: ['assumption', 'whyItMatters', 'verificationQuestion'],
      },
    },
    blindSpots: {
      type: Type.ARRAY,
      description: 'Consequential unconsidered factors or external risks.',
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: 'The overlooked factor or risk.' },
          whyItMayMatter: { type: Type.STRING, description: 'Why this factor could be material.' },
        },
        required: ['factor', 'whyItMayMatter'],
      },
    },
    reasoningConflicts: {
      type: Type.ARRAY,
      description: 'Internal contradictions between stated priorities and reasoning.',
      items: {
        type: Type.OBJECT,
        properties: {
          conflict: { type: Type.STRING, description: 'The specific tension or conflict.' },
          explanation: { type: Type.STRING, description: 'Explanation of how priorities clash.' },
        },
        required: ['conflict', 'explanation'],
      },
    },
    missingFactors: {
      type: Type.ARRAY,
      description: 'Crucial factors missing from the user description.',
      items: { type: Type.STRING },
    },
    criticalQuestions: {
      type: Type.ARRAY,
      description: 'High-leverage questions to investigate, with the most decision-changing one first.',
      items: { type: Type.STRING },
    },
    alternativePerspective: {
      type: Type.STRING,
      description: 'A different stakeholder or value-system perspective on the decision.',
    },
    flipTest: {
      type: Type.STRING,
      description: 'One counterfactual question testing the user strongest reasoning anchor.',
    },
    disclaimer: {
      type: Type.STRING,
      description: 'The mandatory neutral reasoning audit disclaimer.',
    },
  },
  required: [
    'decisionSummary',
    'evidence',
    'assumptions',
    'blindSpots',
    'reasoningConflicts',
    'missingFactors',
    'criticalQuestions',
    'alternativePerspective',
    'flipTest',
    'disclaimer',
  ],
};
