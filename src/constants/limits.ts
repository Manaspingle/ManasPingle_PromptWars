export const LIMITS = {
  decision: 1000,
  context: 5000,
  reasoning: 5000,
  priorities: 2000,
  alternatives: 2000,
} as const;

export type LimitKey = keyof typeof LIMITS;

export const REQUIRED_FIELDS: readonly LimitKey[] = ['decision', 'context', 'reasoning'] as const;

export const MOCK_DELAY_MS = 1500;
