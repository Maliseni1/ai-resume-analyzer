# Resumind

AI-powered resume analyzer. Upload a resume, get instant feedback on ATS
compatibility, tone, structure, content, and skill matching.

Built with React Router 7, Tailwind CSS 4, and Supabase (auth, database,
storage). The project is run on free-tier infrastructure, so architecture
choices favor services with generous free plans over cost or scale.

## Status

This project is under active rebuild. Rough roadmap:

- [x] **Phase 0 — Operational fixes**: env var wiring, dead routes, repo
  hygiene, baseline legal pages.
- [ ] **Phase 1 — Architecture**: finalize the Supabase schema (resumes,
  feedback, trial state) and pick a free-tier AI provider for resume
  analysis.
- [ ] **Phase 2 — Core feature**: real upload → parse → AI analysis →
  persisted, per-user dashboard (replacing the current mock data in
  `constants/index.ts`).
- [ ] **Phase 3 — Polish**: navbar/user menu, toasts, dark mode, CI, tests.

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

### 3. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Other scripts

```bash
npm run typecheck   # react-router typegen + tsc
npm run build       # production build
npm run start       # serve the production build
```

## Tech stack

- [React Router 7](https://reactrouter.com/) (framework mode, SSR)
- [Supabase](https://supabase.com/) — auth, Postgres database, file storage
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) for client state (auth store)
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) for client-side PDF parsing

## Deployment

### Docker

```bash
docker build -t resumind .
docker run -p 3000:3000 --env-file .env resumind
```

### DIY

Build with `npm run build`, then serve `build/server/index.js` with Node 20+.
Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build
time (they're inlined into the client bundle by Vite).

## Legal

- [Privacy Policy](/privacy)
- [Terms of Service](/terms)

These are early-stage template pages, not reviewed by a lawyer — see the
disclaimer on each page before relying on them for a real launch.
