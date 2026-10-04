export interface EvidenceItem {
  statement: string;
  type: 'fact';
}

export interface AssumptionItem {
  assumption: string;
  whyItMatters: string;
  verificationQuestion: string;
}

export interface BlindSpotItem {
  factor: string;
  whyItMayMatter: string;
}

export interface ReasoningConflictItem {
  conflict: string;
  explanation: string;
}

export interface AnalysisResult {
  decisionSummary: string;
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  blindSpots: BlindSpotItem[];
  reasoningConflicts: ReasoningConflictItem[];
  missingFactors: string[];
  criticalQuestions: string[];
  alternativePerspective: string;
  flipTest: string;
  disclaimer: string;
}

export interface DecisionInput {
  decision: string;
  context: string;
  reasoning: string;
  priorities?: string;
  alternatives?: string;
}
