import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Split,
  Eye,
  Shuffle,
  Lock,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { ThinkLensLogo } from './ThinkLensLogo';

interface LandingPageProps {
  onStartEngine: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEngine,
}) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow background effects */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Powered by Google Gemini 3.8 Flash & Firebase</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Audit Your Reasoning{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Before You Decide
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Most AI tools try to make your decision for you. ThinkLens acts as a rigorous cognitive mirror.
            It isolates stated facts from assumptions, uncovers blind spots, and subjects your logic to the counterfactual Flip Test.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartEngine}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Sparkles className="w-4 h-4" />
              <span>Audit Your Decision Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#manifesto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-800"
            >
              Why We Never Recommend
            </a>
          </div>

          {/* Micro Guarantee Tags */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero Database Persistence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>Strict Prompt Boundaries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>Single Deterministic Gemini Call</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Teaser Feature Card */}
      <section className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              The ThinkLens Cognitive Mirror
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              How ThinkLens transforms raw human rationale into structured reasoning clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Raw User Input */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    User Input
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    Internship Offer
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-2">
                  "Should I accept a 6-month internship?"
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                  "It pays Rs 25,000 and is 12 km from home. I'm leaning yes because the stipend is good, the commute is short, and I want industry experience alongside my 3rd year college coursework."
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                ⚠️ Contains unstated assumptions & conflicting priorities between travel, focus, and coursework.
              </div>
            </div>

            {/* Right: ThinkLens Decomposition */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Reasoning Audit Output
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                    Gemini 3.8 Flash
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs rounded-lg p-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Stated Facts vs Assumptions:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      You assume an internship title directly yields career growth, regardless of task quality or active mentorship.
                    </p>
                  </div>

                  <div className="text-xs rounded-lg p-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-amber-700 dark:text-amber-400">Reasoning Conflict:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      Seeking deep industry exposure while managing ongoing university lectures creates time competition.
                    </p>
                  </div>

                  <div className="text-xs rounded-lg p-2.5 bg-blue-100/60 dark:bg-blue-950/60 border border-blue-300/60 dark:border-blue-800/60">
                    <span className="font-bold text-blue-800 dark:text-blue-300">The Flip Test:</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 italic">
                      "If the stipend were Rs 0 and the commute was 25 km, would you still accept for the experience alone?"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onStartEngine}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Test your own reasoning <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Non-Negotiable Manifesto */}
      <section id="manifesto" className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              The Product Philosophy
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Why ThinkLens Never Recommends
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              When AI recommends what you should do, it strips you of agency and introduces hidden algorithmic bias.
              ThinkLens does the opposite: it surfaces what you are thinking so you can make your own informed decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Facts vs Assumptions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Only statements you explicitly confirmed are marked as facts. Unverified assumptions are challenged with concrete verification questions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Blind Spot Detection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates your situation against second-order effects, opportunity costs, and unconsidered external risks before you commit.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                The Flip Test
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates a single counterfactual scenario directly probing your strongest reasoning pillar to reveal your true underlying motivation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Cloud Services Architecture Callout */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
              Technical Infrastructure
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Built on the Google Ecosystem
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
              Every Google service in ThinkLens is purposefully integrated to deliver speed, security, and intelligence without bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-blue-400 font-bold text-sm mb-1">Gemini 3.8 Flash</div>
              <div className="text-xs text-slate-400">
                Single deterministic call with strict JSON Schema output and zero prompt leakage.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-amber-400 font-bold text-sm mb-1">Firebase Auth</div>
              <div className="text-xs text-slate-400">
                Client authentication with Google Sign-In, Email/Password, and anonymous guest support.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-indigo-400 font-bold text-sm mb-1">Cloud Run</div>
              <div className="text-xs text-slate-400">
                Containerized Node/Express backend deployed with non-root security and auto-scaling.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="text-emerald-400 font-bold text-sm mb-1">Secret Manager</div>
              <div className="text-xs text-slate-400">
                Zero hardcoded keys. Secrets are injected at runtime into Cloud Run environment.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ThinkLensLogo size="lg" className="justify-center mb-6" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to test your reasoning?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            It takes less than 60 seconds to uncover unstated assumptions in your next major decision.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={onStartEngine}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              <Sparkles className="w-4 h-4" />
              Start Reasoning Audit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
