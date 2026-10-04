# ThinkLens 🔍

> **A decision reasoning audit tool built for hackathons.**  
> Audits *how* you think before you decide. ThinkLens surfaces evidence vs assumptions, blind spots, reasoning conflicts, missing factors, critical questions, an alternative perspective, and a counterfactual "Flip Test".

---

## 🎯 Product Rules & Alignment (Non-Negotiable)

- **NEVER recommends, ranks, scores, or decides for the user.**
- **NEVER uses directive language** such as *"you should choose"*, *"option A is best"*, or *"we recommend"*.
- **Strictly separates facts from assumptions**: Only explicit user assertions are cataloged as `fact`.
- **Surfaces cognitive friction**: Highlights tensions between stated reasoning and stated priorities.
- **Single decision-changing anchor**: Surfaces 1 sharp "Flip Test" counterfactual targeting the user's primary assumption.
- **Server-enforced disclaimer**: Fixed server-side disclaimer is always returned on every analysis.

---

## 📐 Architecture

```mermaid
flowchart LR
    subgraph Browser ["Frontend (React + Vite + TypeScript)"]
        UI["Decision Form & Audit UI"]
        API_CLIENT["analysisApi.ts (Client)"]
    end

    subgraph Server ["Backend (Node.js + Express + TypeScript)"]
        PROXY["Vite Dev Proxy / Cloud Run"]
        SEC["Helmet + CORS + RateLimiter (10/min)"]
        VAL["Zod Strict Schema Validation (20kb limit)"]
        SAN["sanitize.ts (Delimiter & Control Char Neutralization)"]
        SRV["gemini.ts (Single GenerateContent Call)"]
    end

    subgraph Google ["Google Cloud Services"]
        GEMINI["Google Gemini API (Official @google/genai SDK)"]
        SM["Google Secret Manager (GEMINI_API_KEY)"]
    end

    UI --> API_CLIENT
    API_CLIENT --> PROXY
    PROXY --> SEC
    SEC --> VAL
    VAL --> SAN
    SAN --> SRV
    SRV -->|Structured JSON Output (25s timeout)| GEMINI
    SM -.->|Injects API Key| SRV
```

### 🧠 Architectural Decision: "One Gemini Call per Analysis"
ThinkLens deliberately executes **EXACTLY ONE** `generateContent` call per request.
- **Zero multi-step chaining / Zero autonomous loops**: Prevents latency inflation, non-deterministic drift, runaway API costs, and evaluation hallucination.
- **Strict Structured Outputs**: Uses Gemini's native `responseMimeType: "application/json"` and `responseSchema` with `@google/genai` type definitions.
- **Behavioral System Instruction**: The entire reasoning audit role, security boundary, and product constraints reside in `systemInstruction`, completely isolating instructions from untrusted user text.

---

## 🛡️ Security Implementation

- **Strict Prompt Boundary**: Untrusted user text is delimited inside `<user_input>` with field tags (`<decision>`, `<context>`, `<reasoning>`, `<priorities>`, `<alternatives>`).
- **Tag & Control Character Sanitization (`src/utils/sanitize.ts`)**: All closing XML delimiter tags (e.g., `</user_input>`, `</decision>`) and ASCII non-printable control characters are neutralized before prompt assembly.
- **Helmet**: Secures HTTP response headers against clickjacking, sniffing, and cross-site scripting.
- **Strict CORS**: Restricted via `ALLOWED_ORIGIN` (wildcards prohibited in production).
- **Body Parser Limits**: Strict `20kb` payload limit (`express.json({ limit: "20kb" })`).
- **IP-Based Rate Limiting**: `express-rate-limit` enforces 10 requests per minute per IP on `/api/analyze`.
- **Strict Schema Enforcement**: Zod `.strict()` rejects unexpected or injected fields with field-level 400 errors.
- **Zero Sensitive Logging**: Request bodies containing personal decisions are **never** logged to disk or console. Only method, path, HTTP status, and duration are recorded.
- **Zero Persistence**: No database or storage layer is connected. User decisions exist purely in memory during processing.
- **Secret Isolation**: `GEMINI_API_KEY` is never exposed to the frontend or checked into version control. Production builds have **0 vulnerabilities** (`npm audit --omit=dev`).

---

## 📁 Repository Structure

```
ThinkLens/
├── src/                          # React + Vite frontend
│   ├── components/               # Accessible UI components (DecisionForm, AnalysisResults, Accordion, etc.)
│   ├── constants/                # Limits (decision: 1000, context: 5000, reasoning: 5000 chars)
│   ├── hooks/                    # useAnalysis hook with AbortController support
│   ├── services/                 # analysisApi.ts (mock & backend API integration)
│   ├── types/                    # TypeScript interfaces (AnalysisResult, DecisionInput)
│   ├── App.tsx                   # Main layout with skip link and focus management
│   ├── main.tsx                  # React DOM entrypoint
│   └── index.css                 # Tailwind CSS styles
├── backend/                      # Node.js + Express backend
│   ├── src/
│   │   ├── config/env.ts         # Validated environment variables (fails fast if key missing)
│   │   ├── middleware/           # errorHandler.ts, rateLimiter.ts
│   │   ├── prompts/              # reasoningAudit.ts (system instruction + prompt builder)
│   │   ├── routes/               # analyze.ts (POST /api/analyze)
│   │   ├── schemas/              # decision.ts (Zod request), analysis.ts (Zod response + Gemini schema)
│   │   ├── services/             # gemini.ts (official @google/genai SDK integration)
│   │   ├── utils/                # sanitize.ts (delimiter injection neutralization)
│   │   ├── app.ts                # Express app builder (exported for Supertest)
│   │   └── server.ts             # Server startup & graceful shutdown
│   ├── tests/                    # Behavior-driven Vitest test suite
│   ├── Dockerfile                # Multi-stage production container
│   ├── .dockerignore
│   └── .env.example
├── package.json                  # Root scripts to test & build all
├── vite.config.ts                # Dev server with proxy to backend (/api)
└── README.md                     # Documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env` / Cloud Run)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** (in production/live mode) | — | Official Google Gemini API key from Google AI Studio |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model name |
| `ALLOWED_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin for CORS (comma-separated if multiple) |
| `PORT` | No | `3000` | Port for Express backend server |

### Frontend (`.env` / Hosting)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_USE_MOCK` | No | `false` | Set to `true` to use client-side mock data without a backend |
| `VITE_API_URL` | No | `""` (empty for dev) | Production backend URL (leave empty in dev to use Vite proxy) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### 2. Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Local Development

In terminal 1 (Backend):
```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY to backend/.env
npm run dev
```

In terminal 2 (Frontend):
```bash
# Starts Vite dev server with proxy /api -> http://localhost:3000
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Running Tests

The test suite is behavior-driven, asserting all critical security and functional contracts:
- `rejectsEmptyDecision` (400 validation)
- `rejectsMissingReasoning` (400 validation)
- `rejectsOversizedInput` (400 length limit)
- `rejectsUnknownFields` (400 strict object)
- `acceptsValidInput` (200 success)
- `returns200WithAllRequiredFieldsOnSuccess` (full AnalysisResult contract)
- `overridesDisclaimerServerSide` (tamper-proof disclaimer enforcement)
- `handlesGeminiFailureWith502` (safe generic error, no stack leak)
- `handlesMalformedGeminiOutputWith502` (safe JSON parse handling)
- `handlesTimeoutWith504` (25-second timeout enforcement)
- `rateLimiterReturns429` (IP-based throttle)
- `sanitizeNeutralizesDelimiterInjection` (boundary breakout defense)
- `promptContainsNoRecommendationInstructionAndIncludesBoundary` (anti-recommendation system rule)
- `healthEndpointReturns200` (GET /api/health)

```bash
# Run all backend tests from root:
npm test

# Run tests directly in backend:
cd backend
npm test

# Run build verification for both frontend & backend:
npm run build:all
```

---

## 🚢 Production Deployment

### 1. Backend: Deploy to Google Cloud Run

#### A. Store API Key in Google Secret Manager
```bash
# Create the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# Add the secret version
echo -n "your_actual_gemini_api_key" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
```

#### B. Build & Deploy Container to Cloud Run
```bash
cd backend

# Build and submit the container to Google Artifact Registry
gcloud builds submit --tag gcr.io/[PROJECT_ID]/thinklens-backend:latest .

# Deploy to Cloud Run mounting Secret Manager
gcloud run deploy thinklens-backend \
  --image gcr.io/[PROJECT_ID]/thinklens-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,ALLOWED_ORIGIN="https://your-frontend.web.app" \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### 2. Frontend: Deploy to Firebase Hosting (or any static host)

Set the production backend URL in your environment before building:
```bash
# Set backend URL
export VITE_API_URL="https://thinklens-backend-xxxxxx-uc.a.run.app"
export VITE_USE_MOCK="false"

# Build static bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## ♿ Accessibility & Usability (WCAG 2.1 AA)

- **Skip to Main Content Link**: Keyboard-accessible bypass block at the top of the DOM.
- **Focus Management**: Focus automatically transitions to the `<h2 id="results-heading" tabIndex={-1}>` upon successful audit completion.
- **Form Controls & ARIA**: All inputs have associated labels, character counters via `aria-describedby`, error alerts with `aria-invalid`, and live regions for dynamic announcements.
- **Semantic Structure**: Collapsible audit sections use `aria-expanded`, `aria-controls`, and `role="region"` with `aria-labelledby`.
- **Keyboard Navigation**: Complete keyboard-only traversal through form fields, example buttons, accordions, and audit results.
