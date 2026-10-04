import { type FC } from 'react';
import {
  FileText,
  CircleHelp,
  Eye,
  CircleAlert,
  Layers,
  ListChecks,
  MessageSquareText,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { AnalysisResult } from '../types/analysis';
import { Accordion } from './Accordion';
import { FlipTest } from './FlipTest';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const REFLECTION_QUESTIONS = [
  'Which assumption would most change your decision if proven wrong?',
  'What information would reduce your uncertainty the most?',
  'What would someone who disagrees with you point out?',
];

export const AnalysisResults: FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <h2
        id="results-heading"
        tabIndex={-1}
        className="text-2xl font-bold text-slate-900 focus:outline-none"
      >
        Your Reasoning Audit
      </h2>

      {/* Decision Snapshot */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-600">
          <FileText className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-slate-800">Decision Snapshot</h3>
        </div>
        <p className="text-base leading-relaxed text-slate-700">{result.decisionSummary}</p>
      </div>

      <div className="space-y-3">
        {/* Evidence / Stated Facts */}
        <Accordion
          title="What You've Stated"
          icon={<FileText className="h-5 w-5" />}
          defaultOpen={true}
        >
          <ul className="space-y-2">
            {result.evidence.map((item, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm leading-relaxed text-slate-700"
              >
                <span
                  className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"
                  aria-hidden="true"
                />
                {item.statement}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Assumptions */}
        <Accordion
          title="Assumptions"
          icon={<CircleHelp className="h-5 w-5" />}
          defaultOpen={true}
        >
          <ul className="space-y-4">
            {result.assumptions.map((item, index) => (
              <li
                key={index}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-800">{item.assumption}</p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium">Why it matters:</span> {item.whyItMatters}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium">Verification question:</span>{' '}
                  {item.verificationQuestion}
                </p>
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Potential Blind Spots */}
        <Accordion
          title="Potential Blind Spots"
          icon={<Eye className="h-5 w-5" />}
          defaultOpen={false}
        >
          <ul className="space-y-4">
            {result.blindSpots.map((item, index) => (
              <li
                key={index}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-800">{item.factor}</p>
                <p className="mt-1 text-sm text-slate-600">{item.whyItMayMatter}</p>
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Reasoning Conflicts */}
        <Accordion
          title="Reasoning Conflicts"
          icon={<CircleAlert className="h-5 w-5" />}
          defaultOpen={false}
        >
          <ul className="space-y-4">
            {result.reasoningConflicts.map((item, index) => (
              <li
                key={index}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-800">{item.conflict}</p>
                <p className="mt-1 text-sm text-slate-600">{item.explanation}</p>
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Missing Factors */}
        <Accordion
          title="Missing Factors"
          icon={<Layers className="h-5 w-5" />}
          defaultOpen={false}
        >
          <ul className="space-y-2">
            {result.missingFactors.map((factor, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm leading-relaxed text-slate-700"
              >
                <span
                  className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"
                  aria-hidden="true"
                />
                {factor}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Questions to Investigate */}
        <Accordion
          title="Questions to Investigate"
          icon={<ListChecks className="h-5 w-5" />}
          defaultOpen={true}
        >
          <ul className="space-y-3">
            {result.criticalQuestions.map((question, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm leading-relaxed text-slate-700"
              >
                <span className="mt-0.5 flex-shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                  {index === 0 ? 'Most decision-changing' : `Q${index + 1}`}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Alternative Perspective */}
        <Accordion
          title="Alternative Perspective"
          icon={<MessageSquareText className="h-5 w-5" />}
          defaultOpen={false}
        >
          <p className="text-sm leading-relaxed text-slate-700">
            {result.alternativePerspective}
          </p>
        </Accordion>
      </div>

      {/* Flip Test */}
      <FlipTest question={result.flipTest} />

      {/* Reflection Questions */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-slate-600">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-slate-800">Reflection Questions</h3>
        </div>
        <ul className="space-y-2">
          {REFLECTION_QUESTIONS.map((question, index) => (
            <li
              key={index}
              className="flex gap-2 text-sm leading-relaxed text-slate-700"
            >
              <span
                className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"
                aria-hidden="true"
              />
              {question}
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory Disclaimer */}
      <div
        className="flex items-start gap-3 rounded-lg bg-slate-100 p-4"
        role="note"
      >
        <ShieldAlert className="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-slate-600">{result.disclaimer}</p>
      </div>
    </section>
  );
};
