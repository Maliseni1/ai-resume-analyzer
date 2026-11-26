# Resumind

[![CI](https://github.com/Maliseni1/ai-resume-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/Maliseni1/ai-resume-analyzer/actions/workflows/ci.yml)

AI-powered resume analyzer. Upload a resume, get instant feedback on ATS
compatibility, tone, structure, content, and skill matching — optionally
tailored to a specific job, which you can fill in by hand or auto-fill by
uploading the job posting itself (PDF, DOCX, or an image/screenshot).

Built with React Router 7, Tailwind CSS 4, Supabase (auth, database,
storage), and Groq (AI analysis). The project is run on free-tier
infrastructure, so architecture choices favor services with generous free
plans over cost or scale.

## Status

- [x] **Phase 0 — Operational fixes**: env var wiring, dead routes, repo
  hygiene, baseline legal pages.
- [x] **Phase 1 — Architecture**: Supabase schema for resumes (`supabase/schema.sql`)
  and Groq as the AI provider (`app/lib/groq.server.ts`). Trial state continues
  to live on the Supabase auth user's metadata, no separate table needed.
- [x] **Phase 2 — Core feature**: real upload → parse → AI analysis →
  persisted, per-user dashboard. Includes deleting a resume and
  auto-filling the job title/description/company from an uploaded job
  posting file.
- [x] **Phase 3 — Polish**: Navy & Gold theme + dark mode, fixed navbar with
  a user menu, toast notifications, a branded splash screen, CI, and a
  starter test suite (`npm test`).

Everything here runs on free tiers: Supabase's free project plan and Groq's
free API tier. Keep that in mind before picking models/features that assume
paid-tier rate limits or storage.

Docs are updated as each phase lands — this file, and the legal pages below,
are the source of truth for current state, not an upfront spec.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase (free tier)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, go to **Settings → API** and copy the **Project URL**
   and **anon public** key.
3. Copy `.env.example` to `.env` and fill in both values:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. (Optional, for "Continue with Google") enable the Google provider under
   **Authentication → Providers** in Supabase, and set the redirect URL to
   `<your-app-url>/auth/callback`.
5. Open the **SQL Editor** in your Supabase project, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates
   the `resumes` table (with row-level security) and a private `resumes`
   storage bucket, scoped so each user can only read/write their own files.

### 3. Set up Groq (free tier)

1. Create a free account and API key at [console.groq.com](https://console.groq.com).
2. Add it to `.env`:

```
GROQ_API_KEY=your-groq-api-key
```

This key is read server-side only (`app/lib/groq.server.ts`) and is never
sent to the browser — don't rename it to `VITE_GROQ_API_KEY`, which would
bundle it into client JS.

### 4. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Other scripts

```bash
npm run typecheck   # react-router typegen + tsc
npm test            # vitest, run once (CI uses this)
npm run build       # production build
npm run start       # serve the production build
```

## Testing & CI

`npm test` runs the Vitest suite (`*.test.ts` files next to the code they
cover) — mostly pure logic: score-color thresholds, feedback/job-info shape
validation, the DB row → `Resume` mapping, trial day math, and the toast/theme
stores. It intentionally doesn't hit Supabase or Groq.

GitHub Actions (`.github/workflows/ci.yml`) runs `typecheck`, `test`, and
`build` on every push to `main` and every pull request. No repo secrets are
needed for CI — missing Supabase/Groq env vars don't fail the build, they
just fall back to a placeholder client at runtime.

## Tech stack

- [React Router 7](https://reactrouter.com/) (framework mode, SSR)
- [Supabase](https://supabase.com/) — auth, Postgres database, file storage
- [Groq](https://groq.com/) — AI resume analysis (`openai/gpt-oss-120b`) and
  job-posting image extraction (`qwen/qwen3.8-27b`, vision-capable)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) for client state (auth, theme, toast stores)
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) for client-side PDF parsing
- [mammoth](https://github.com/mwilliamson/mammoth.js) for client-side `.docx` text extraction (lazy-loaded)
- [Vitest](https://vitest.dev/) for tests

## Deployment

### Docker

```bash
docker build -t resumind .
docker run -p 3000:3000 --env-file .env resumind
```

### DIY

Build with `npm run build`, then serve `build/server/index.js` with Node 20+.
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set at build time
(they're inlined into the client bundle by Vite). `GROQ_API_KEY` only needs
to be set at runtime, on the server.

## Legal

- [Privacy Policy](/privacy)
- [Terms of Service](/terms)

These are early-stage template pages, not reviewed by a lawyer — see the
disclaimer on each page before relying on them for a real launch.
