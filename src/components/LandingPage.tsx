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
  LogIn,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThinkLensLogo } from './ThinkLensLogo';

interface LandingPageProps {
  onStartEngine: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEngine,
  onOpenAuth,
}) => {
  const { user } = useAuth();

  const handlePrimaryAction = () => {
    if (user) {
      onStartEngine();
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* ============================================================== */}
      {/* GOOGLE GEMINI AMBIENT GLOW MESH (Both Light & Dark)           */}
      {/* ============================================================== */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 -z-10 w-[720px] sm:w-[1000px] h-[550px] pointer-events-none">
        {/* Orb 1: Celestial Cyan (Top Left) */}
        <div className="absolute top-10 left-1/4 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-cyan-400/20 dark:bg-cyan-500/12 blur-[90px] sm:blur-[130px] motion-safe:animate-pulse" />
        {/* Orb 2: Royal Indigo Core (Center) */}
        <div className="absolute top-20 left-1/3 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full bg-indigo-500/25 dark:bg-indigo-600/18 blur-[100px] sm:blur-[140px]" />
        {/* Orb 3: Cosmic Violet (Top Right) */}
        <div className="absolute top-8 right-1/4 w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full bg-purple-500/20 dark:bg-purple-600/14 blur-[90px] sm:blur-[130px]" />
        {/* Orb 4: Gentle Periwinkle Ground (Bottom) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[220px] rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-[80px] sm:blur-[110px]" />
      </div>

      {/* ============================================================== */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Google Ecosystem Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-8 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin motion-safe:duration-1000" />
            <span>Powered by Google Gemini 3.8 Flash & Firebase Auth</span>
          </div>

          {/* Main Title with soothing Gemini gradient */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18] sm:leading-[1.15]">
            Audit Your Reasoning{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Before You Decide
            </span>
          </h1>

          {/* Subtitle with eye-comfort contrast */}
          <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Most AI tools tell you what to choose. ThinkLens acts as a neutral cognitive mirror.
            It separates stated facts from unstated assumptions, detects reasoning conflicts, and runs the counterfactual Flip Test.
          </p>

          {/* Primary Action Button (Secured behind Login/Signup) */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            {user ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Reasoning Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Audit Your Reasoning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <a
              href="#manifesto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm"
            >
              Why We Never Recommend
            </a>
          </div>

          {!user && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Sign in with Google, email, or use instant Evaluator Guest Access.
            </p>
          )}

          {/* Micro Assurance Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero Database Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>Strict Prompt Boundaries</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Single Deterministic AI Call</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* FEATURED VISUAL: PRISM OF REASONING (Intuitive for Non-Tech)   */}
          {/* ============================================================== */}
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl">
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-md overflow-hidden group">
              <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src="/images/thinklens_hero_prism.jpg"
                  alt="ThinkLens Prism of Reasoning: Tangled human thoughts entering a glowing prism lens and exiting as clear, organized streams of light"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 sm:p-6 text-left">
                  <div className="max-w-xl">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/80 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5 backdrop-blur-sm">
                      How It Works In Simple Terms
                    </span>
                    <h3 className="text-white font-bold text-sm sm:text-lg">
                      Turn tangled dilemmas into structured mental clarity
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 line-clamp-2">
                      You enter what you're thinking. ThinkLens acts like an optical prism: it refracts your rationale into explicit evidence, hidden assumptions, and blind spots—leaving the final decision entirely in your hands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* COGNITIVE MIRROR INTERACTIVE PREVIEW CARD                      */}
      {/* ============================================================== */}
      <section className="py-14 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Visual Demonstration
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              The ThinkLens Cognitive Mirror
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              How ThinkLens transforms ambiguous rationale into structured diagnostic clarity anyone can understand
            </p>
          </div>

          {/* Visual Concept Illustration Card */}
          <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-md border border-slate-200/60 dark:border-slate-800/60">
                <img
                  src="/images/thinklens_cognitive_mirror.jpg"
                  alt="A user looking at a digital cognitive mirror displaying organized cards for Facts, Assumptions, and Blind Spots"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>The 3 Essential Columns</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  See what you actually know vs. what you just assume
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  When facing a tough choice (a new job, moving cities, choosing a university), our minds mix up established facts with wishful assumptions. ThinkLens puts up a cognitive mirror:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Stated Facts:</strong> Verifiable truths you explicitly mentioned.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">ℹ</span>
                    <span><strong>Unstated Assumptions:</strong> Things you are taking for granted without proof.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Hidden Blind Spots:</strong> Secondary impacts and dependencies you didn't account for.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Comparison: Dilemma vs Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Raw Dilemma */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  User Stated Rationale
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  Internship Dilemma
                </span>
              </div>

              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-2.5">
                "Should I accept a 6-month internship offer?"
              </h3>

              <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                "Offers Rs 25,000/mo and is 12 km away. I want to accept because the money helps and I want industry experience, but I need to keep my 8.5 GPA during 3rd year exams."
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <span>⚠️</span>
                <span>Unstated assumption: industry exposure automatically translates to career acceleration, regardless of work quality.</span>
              </div>
            </div>

            {/* Right: Decomposed Output */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/60 p-5 sm:p-7 shadow-sm relative overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Reasoning Audit Output
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Evidence vs Assumption:</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Fact: Rs 25k stipend & 12 km distance. Assumption: Exam leaves and attendance waivers will be granted by the employer.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Reasoning Conflict:</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Committing to fixed off-campus hours directly conflicts with university attendance criteria for the 8.5 GPA target.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/70">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">The Flip Test:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5 italic">
                    "If the company required mandatory 40hr on-site weeks with zero exam leave, would you still accept? Why or why not?"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {user ? 'Launch engine now' : 'Sign in to audit your own logic'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MANIFESTO: WHY WE NEVER RECOMMEND                             */}
      {/* ============================================================== */}
      <section id="manifesto" className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              Non-Negotiable Product Rule
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why ThinkLens Never Recommends
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              When AI recommends what you should do, it strips your agency and injects algorithmic hallucination.
              ThinkLens does the opposite: it surfaces how you think so you can make your own sound decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Facts vs Assumptions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Only explicit assertions are cataloged as facts. Unverified assumptions are paired with targeted verification questions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-indigo-400/50 dark:hover:border-indigo-600/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Blind Spot Detection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Surfaces second-order impacts, administrative dependencies, and opportunity costs before you lock in a commitment.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-purple-400/50 dark:hover:border-purple-600/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                The Flip Test
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates one targeted counterfactual question directly testing your strongest reasoning anchor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CALL TO ACTION (Secured behind Auth)                     */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 text-center bg-slate-100/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ThinkLensLogo size="lg" className="justify-center mb-5" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to audit your next major decision?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Take 60 seconds to inspect what you know versus what you assume.
          </p>

          <div className="mt-7">
            {user ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45"
              >
                <Sparkles className="w-4 h-4" />
                Launch Reasoning Engine
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/45"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
