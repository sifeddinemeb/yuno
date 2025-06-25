# Developer Quick-Start Guide

Welcome! This document gets you from zero ➜ running in minutes.

---

## 1. Prerequisites

* Node.js **≥ 18 LTS** (verify with `node -v`)
* npm **≥ 9** (bundled with Node 18)
* Supabase CLI (`npm i -g supabase`) — required only if you want to run the backend locally.

## 2. Clone & Install

```bash
# 1. Clone
git clone <repo-url>
cd yuno-ai

# 2. Install deps
npm install
```

## 3. Environment Variables

Copy the template and fill in the blanks:

```bash
cp project-docs/.env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (optional — enables AI content generation) |

> All `VITE_*` variables are automatically exposed to the browser by Vite.

## 4. Key npm Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start Vite dev server at `localhost:5173` with hot-reload |
| `npm run build` | Production build (static assets in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint + TypeScript static analysis |
| `npm test` | Run Jest unit tests |

## 5. Optional: Run Supabase Locally

```bash
# Start the postgres + edge-runtime containers
supabase start

# Load migrations & types (runs automatically on first start)
```
* The SQL in `supabase/migrations/` will be applied.
* Edge Functions are served at `http://localhost:54321/functions/v1/`.

Stop everything with `supabase stop`.

## 6. Useful VS Code Extensions

* **ESLint** – on-save linting
* **Tailwind CSS IntelliSense** – utility autocomplete
* **Supabase** – database browser & SQL runner

## 7. Testing the App

1. Start backend (optional).
2. Run `npm run dev`.
3. Visit `http://localhost:5173`.
4. Sign-up with email+password — you’ll be seeded as `admin` by the first-run logic.

Happy hacking 🚀
