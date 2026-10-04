import { z } from 'zod';

export const DECISION_LIMITS = {
  decision: 1000,
  context: 5000,
  reasoning: 5000,
  priorities: 2000,
  alternatives: 2000,
} as const;

export const decisionSchema = z
  .object({
    decision: z
      .string({
        required_error: 'Decision is required.',
        invalid_type_error: 'Decision must be a string.',
      })
      .trim()
      .min(1, 'Decision cannot be empty.')
      .max(
        DECISION_LIMITS.decision,
        `Decision must be ${DECISION_LIMITS.decision} characters or fewer.`
      ),
    context: z
      .string({
        required_error: 'Context is required.',
        invalid_type_error: 'Context must be a string.',
      })
      .trim()
      .min(1, 'Context cannot be empty.')
      .max(
        DECISION_LIMITS.context,
        `Context must be ${DECISION_LIMITS.context} characters or fewer.`
      ),
    reasoning: z
      .string({
        required_error: 'Reasoning is required.',
        invalid_type_error: 'Reasoning must be a string.',
      })
      .trim()
      .min(1, 'Reasoning cannot be empty.')
      .max(
        DECISION_LIMITS.reasoning,
        `Reasoning must be ${DECISION_LIMITS.reasoning} characters or fewer.`
      ),
    priorities: z
      .string({
        invalid_type_error: 'Priorities must be a string.',
      })
      .trim()
      .max(
        DECISION_LIMITS.priorities,
        `Priorities must be ${DECISION_LIMITS.priorities} characters or fewer.`
      )
      .optional(),
    alternatives: z
      .string({
        invalid_type_error: 'Alternatives must be a string.',
      })
      .trim()
      .max(
        DECISION_LIMITS.alternatives,
        `Alternatives must be ${DECISION_LIMITS.alternatives} characters or fewer.`
      )
      .optional(),
  })
  .strict({
    message: 'Unknown fields are not allowed in request body.',
  });

export type ValidatedDecisionInput = z.infer<typeof decisionSchema>;
