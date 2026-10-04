import { useState, useEffect, useId, type FC, type FormEvent } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { DecisionInput } from '../types/analysis';
import { LIMITS, LimitKey, REQUIRED_FIELDS } from '../constants/limits';

interface DecisionFormProps {
  onSubmit: (data: DecisionInput) => void;
  isLoading: boolean;
  preservedValues?: DecisionInput | null;
}

interface FormFieldConfig {
  id: LimitKey;
  label: string;
  required: boolean;
  placeholder: string;
  rows: number;
}

const FORM_FIELDS: FormFieldConfig[] = [
  {
    id: 'decision',
    label: 'What decision are you considering?',
    required: true,
    placeholder: 'e.g. Should I accept a 6-month internship?',
    rows: 2,
  },
  {
    id: 'context',
    label: 'Tell us about your situation',
    required: true,
    placeholder:
      'e.g. I am a third-year student. The internship offers Rs 25,000, is 12 km from home, and lasts 6 months during my ongoing college schedule.',
    rows: 4,
  },
  {
    id: 'reasoning',
    label: 'Why are you leaning the way you are?',
    required: true,
    placeholder:
      'e.g. I like the stipend, the short distance from home, and the chance to gain industry experience.',
    rows: 4,
  },
  {
    id: 'priorities',
    label: 'What matters most to you?',
    required: false,
    placeholder: 'e.g. Career growth, financial independence, and not falling behind in college.',
    rows: 3,
  },
  {
    id: 'alternatives',
    label: 'What alternatives are you considering?',
    required: false,
    placeholder:
      'e.g. Staying focused on academics, taking an online certification, or finding a part-time role.',
    rows: 3,
  },
];

export const SAMPLE_DECISION: DecisionInput = {
  decision:
    'Should I accept a 6-month internship that pays Rs 25,000 and is 12 km from home?',
  context:
    'I am a third-year engineering student. The internship would last 6 months and overlaps with my ongoing college schedule. It pays a stipend of Rs 25,000 and is located 12 km from my home.',
  reasoning:
    'I am leaning towards accepting it because I like the stipend of Rs 25,000, the short 12 km distance from home, and the opportunity to gain industry experience.',
  priorities:
    'Career growth, some financial independence, and staying on track with my college coursework.',
  alternatives:
    'I could instead focus fully on academics, take an online certification course, or look for a part-time role closer to campus.',
};

function initFormData(initial?: DecisionInput | null): DecisionInput {
  if (initial) return { ...initial };
  return {
    decision: '',
    context: '',
    reasoning: '',
    priorities: '',
    alternatives: '',
  };
}

function validateField(key: LimitKey, value: string): string | null {
  const trimmed = value.trim();
  const limit = LIMITS[key];
  if (REQUIRED_FIELDS.includes(key) && trimmed === '') {
    return 'This field is required.';
  }
  if (value.length > limit) {
    return `This field must be ${limit} characters or fewer.`;
  }
  return null;
}

function validateForm(formData: DecisionInput): {
  valid: boolean;
  errors: Partial<Record<LimitKey, string>>;
} {
  const errors: Partial<Record<LimitKey, string>> = {};
  let hasError = false;

  for (const key of Object.keys(LIMITS) as LimitKey[]) {
    const val = formData[key] ?? '';
    const err = validateField(key, val);
    if (err) {
      errors[key] = err;
      hasError = true;
    }
  }

  return hasError ? { valid: false, errors } : { valid: true, errors: {} };
}

export const DecisionForm: FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  preservedValues,
}) => {
  const [formData, setFormData] = useState<DecisionInput>(() =>
    initFormData(preservedValues)
  );
  const [errors, setErrors] = useState<Partial<Record<LimitKey, string>>>({});
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const statusId = useId();

  useEffect(() => {
    if (preservedValues) {
      setFormData({ ...preservedValues });
    }
  }, [preservedValues]);

  const handleChange = (field: LimitKey, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleFillSample = () => {
    setFormData({ ...SAMPLE_DECISION });
    setErrors({});
    setLiveAnnouncement('Sample internship decision loaded into form.');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      const firstError = Object.values(result.errors).filter(Boolean)[0];
      setLiveAnnouncement(
        firstError ? `Please correct the following: ${Object.values(result.errors).join(' ')}` : ''
      );
      return;
    }

    setErrors({});
    setLiveAnnouncement('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div
        id={statusId}
        className="sr-only"
        aria-live="assertive"
        role="status"
      >
        {liveAnnouncement}
      </div>

      {FORM_FIELDS.map((field) => {
        const errorId = `${field.id}-error`;
        const counterId = `${field.id}-counter`;
        const value = formData[field.id] || '';
        const error = errors[field.id];
        const limit = LIMITS[field.id];

        return (
          <div key={field.id} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label
                htmlFor={field.id}
                className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                {field.label}
                {field.required && (
                  <span className="ml-1 text-slate-400 dark:text-slate-500" aria-hidden="true">
                    (required)
                  </span>
                )}
              </label>
              <span
                id={counterId}
                className="text-xs tabular-nums text-slate-400 dark:text-slate-500 font-mono"
              >
                {value.length}/{limit}
              </span>
            </div>

            <textarea
              id={field.id}
              name={field.id}
              value={value}
              required={field.required}
              maxLength={limit + 100}
              disabled={isLoading}
              placeholder={field.placeholder}
              rows={field.rows}
              aria-describedby={`${counterId}${error ? ` ${errorId}` : ''}`}
              aria-invalid={error ? true : undefined}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full resize-y rounded-xl border bg-white dark:bg-slate-900/90 px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400 ${
                error
                  ? 'border-amber-400 dark:border-amber-500 focus-visible:ring-amber-400'
                  : 'border-slate-300 dark:border-slate-750'
              }`}
            />

            {error && (
              <p id={errorId} className="text-xs text-amber-600 dark:text-amber-400">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <button
          type="button"
          onClick={handleFillSample}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <span>Try an example</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>{isLoading ? 'Analyzing Reasoning…' : 'Audit My Decision'}</span>
        </button>
      </div>
    </form>
  );
};
