import { Router, Request, Response, NextFunction } from 'express';
import { decisionSchema } from '../schemas/decision.js';
import { generateReasoningAudit } from '../services/gemini.js';

export const analyzeRouter = Router();

analyzeRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body using strict Zod schema
      const validatedInput = decisionSchema.parse(req.body);

      // Execute exactly one reasoning audit call
      const analysisResult = await generateReasoningAudit(validatedInput);

      res.status(200).json(analysisResult);
    } catch (error) {
      next(error);
    }
  }
);
