import { AnalysisResult, DecisionInput } from '../types/analysis';
import { MOCK_DELAY_MS } from '../constants/limits';

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  decisionSummary:
    'You are considering a 6-month internship that offers a Rs 25,000 stipend, is 12 km from home, and would give you industry experience, against the backdrop of an ongoing college schedule.',
  evidence: [
    { statement: 'The internship offers a stipend of Rs 25,000.', type: 'fact' },
    { statement: 'The internship is located 12 km from home.', type: 'fact' },
    { statement: 'The internship lasts 6 months.', type: 'fact' },
    { statement: 'There is an ongoing college schedule to coordinate with.', type: 'fact' },
  ],
  assumptions: [
    {
      assumption: 'Industry experience during an internship directly leads to career growth.',
      whyItMatters:
        'If this assumption does not hold, the primary motivation for taking the internship may be weaker than it appears.',
      verificationQuestion:
        'What evidence do you have that interns at this organisation have gone on to stronger career outcomes?',
    },
    {
      assumption: 'A stipend of Rs 25,000 is worthwhile for the duration and effort required.',
      whyItMatters:
        'The value of the stipend depends on your financial situation and on what else you would be doing during those 6 months.',
      verificationQuestion:
        'Have you compared the stipend against the opportunity cost of not spending that time on studies or other work?',
    },
    {
      assumption: 'Being 12 km from home is convenient enough to avoid disrupting your routine.',
      whyItMatters:
        'Distance affects daily energy, study time, and sustainability over 6 months, not just commute time on paper.',
      verificationQuestion:
        'Have you tested the actual commute during peak hours across several days?',
    },
  ],
  blindSpots: [
    {
      factor: 'Impact on academic performance',
      whyItMayMatter:
        'A 6-month commitment may overlap with exams, assignments, or attendance requirements in ways that are hard to recover from.',
    },
    {
      factor: 'Mentorship quality',
      whyItMayMatter:
        'Industry experience is valuable only if someone actively guides and reviews your work; the job title alone does not guarantee this.',
    },
    {
      factor: 'Post-internship prospects',
      whyItMayMatter:
        'Unless there is a clear path to a return offer or a strong referral, the internship may end without a next step.',
    },
    {
      factor: 'Skill development versus task repetition',
      whyItMayMatter:
        'You may end up doing repetitive work that does not build the skills you are hoping to develop.',
    },
  ],
  reasoningConflicts: [
    {
      conflict: 'Valuing the short distance from home while also seeking meaningful industry exposure.',
      explanation:
        'Proximity may be a comfort consideration, but the most growth-oriented role may not be the closest one. These two priorities can pull in different directions.',
    },
    {
      conflict: 'Wants industry experience while managing an ongoing college schedule.',
      explanation:
        'Full industry exposure often requires sustained time and focus, which may compete with academic responsibilities during the same 6-month period.',
    },
  ],
  missingFactors: [
    'The structure of mentorship and feedback during the internship',
    'The actual daily workload and whether it is sustainable alongside college',
    'The credibility and reputation of the organisation in your target industry',
    'Whether the internship leads to a verifiable certificate or referral',
    'The financial impact of travel and opportunity costs over 6 months',
  ],
  criticalQuestions: [
    'What does a typical week look like for an intern at this organisation?',
    'How have previous interns from this organisation progressed afterward?',
  ],
  alternativePerspective:
    'From the viewpoint of someone focused purely on long-term learning, the stipend and proximity may matter far less than the quality of mentorship and the kind of work you would actually do day to day. A role closer to home with a decent stipend but repetitive tasks may leave you less prepared than a farther, less-paid role with real responsibility and guidance.',
  flipTest:
    'If the stipend were Rs 0 and the internship were 25 km away, would you still take it for the industry experience alone? Why does your answer change, or not change?',
  disclaimer:
    'This analysis does not recommend a decision. It helps you examine what to think about before you decide.',
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeDecision(
  input: DecisionInput,
  signal?: AbortSignal
): Promise<AnalysisResult> {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  if (useMock) {
    await delay(MOCK_DELAY_MS);
    if (signal?.aborted) {
      throw new DOMException('Analysis was aborted', 'AbortError');
    }
    return MOCK_ANALYSIS_RESULT;
  }

  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const url = `${baseUrl}/api/analyze`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal,
    });

    if (response.ok) {
      const data: AnalysisResult = await response.json();
      return data;
    }

    // Handle structured error responses
    let errorMessage = 'An error occurred while analyzing your decision. Please try again.';
    try {
      const errorData = await response.json();
      if (response.status === 400) {
        if (errorData.details && Array.isArray(errorData.details)) {
          const fieldMsgs = errorData.details
            .map((d: { field?: string; message: string }) => d.message)
            .join(' ');
          errorMessage = fieldMsgs || errorData.error || 'Please check your inputs and try again.';
        } else {
          errorMessage = errorData.error || errorData.message || 'Please check your inputs and try again.';
        }
      } else if (response.status === 429) {
        errorMessage = errorData.error || 'Too many requests. Please slow down and try again in a minute.';
      } else if (response.status === 502 || response.status === 504) {
        errorMessage = errorData.error || 'The analysis service timed out or was temporarily unavailable. Please try again in a few moments.';
      } else {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
    } catch {
      if (response.status === 429) {
        errorMessage = 'Too many requests. Please slow down and try again in a minute.';
      } else if (response.status === 502 || response.status === 504) {
        errorMessage = 'The analysis service timed out or was temporarily unavailable. Please try again.';
      } else {
        errorMessage = `Server error (${response.status}). Please try again later.`;
      }
    }

    throw new Error(errorMessage);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error or server unreachable. Please check your connection.');
  }
}
