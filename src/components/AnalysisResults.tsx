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
  Download,
} from 'lucide-react';
import { AnalysisResult, DecisionInput } from '../types/analysis';
import { Accordion } from './Accordion';
import { FlipTest } from './FlipTest';
import { generateAuditPDF } from '../utils/pdfExport';

interface AnalysisResultsProps {
  result: AnalysisResult;
  decisionInput?: DecisionInput | null;
}

const REFLECTION_QUESTIONS = [
  'Which assumption would most change your decision if proven wrong?',
  'What information would reduce your uncertainty the most?',
  'What would someone who disagrees with you point out?',
];

export const AnalysisResults: FC<AnalysisResultsProps> = ({ result, decisionInput }) => {
  const handleExportPDF = () => {
    generateAuditPDF(result, decisionInput);
  };
  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2
            id="results-heading"
            tabIndex={-1}
            className="text-2xl font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            Your Reasoning Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Objective decomposition of stated rationale, unstated assumptions, and blind spots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Export audit results as a printable PDF report"
        >
          <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Export PDF Report</span>
        </button>
      </div>

      {/* Decision Snapshot */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Decision Snapshot</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.decisionSummary}</p>
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
                className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"
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
                className="border-b border-slate-100 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.assumption}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Why it matters:</span> {item.whyItMatters}
                </p>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
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
                className="border-b border-slate-100 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.factor}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.whyItMayMatter}</p>
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
                className="border-b border-slate-100 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-amber-700 dark:text-amber-400">{item.conflict}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.explanation}</p>
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
                className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400 dark:bg-slate-600"
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
                className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              >
                <span className="mt-0.5 flex-shrink-0 rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
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
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {result.alternativePerspective}
          </p>
        </Accordion>
      </div>

      {/* Flip Test */}
      <FlipTest question={result.flipTest} />

      {/* Reflection Questions */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Reflection Questions</h3>
        </div>
        <ul className="space-y-2">
          {REFLECTION_QUESTIONS.map((question, index) => (
            <li
              key={index}
              className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400 dark:bg-slate-600"
                aria-hidden="true"
              />
              {question}
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory Disclaimer */}
      <div
        className="flex items-start gap-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
        role="note"
      >
        <ShieldAlert className="h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 mt-0.5" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{result.disclaimer}</p>
      </div>
    </section>
  );
};
