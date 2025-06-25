# System Design

## 1. Architectural Overview

```
Browser ⇆ React (Vite) ⇆ Supabase JS SDK ──┐
                                          │
                                          │  Row-Level-Secured Postgres
Widget  ⇆ YunoWidget (iframe / direct) ⇆  │  + Supabase Auth (PKCE)
                                          │
Edge Functions (Deno)  ⇆  get-env-var  ───┘
```

* **Frontend** – SPA served statically by Vite. Uses `react-router-dom` for routing and Zustand for global state.
* **Backend** – Supabase manages authentication, Postgres storage, and serverless Edge Functions. All tables are protected via RLS policies.
* **AI Services** – Optional Gemini / OpenAI keys retrieved via the `get-env-var` Edge Function to keep secrets server-side.

---

## 2. Authentication Flow

1. **Visitor / Widget**  
   • No auth – solves challenge anonymously.  
   • Response recorded in `user_responses` table.

2. **Admin**  
   • Email + password → `supabase.auth.signInWithPassword`.  
   • On first login, a row is created in `admin_users` (see hook `useAuth`).  
   • Session JWT is stored in localStorage; SDK auto-refreshes.

3. **Protected Routes**  
   • React checks `adminUser` from `useAuth`.  
   • If absent, redirects to `/auth/login`.  
   • Navigation drawer & dashboard visible only when authenticated.

4. **RBAC**  
   • RLS policies ensure admins can read/write; visitors can only insert `user_responses`.

---

## 3. Data Layer

| Table | Purpose |
|-------|---------|
| `admin_users` | Tracks admin profile + role. PK = auth user id. |
| `challenges` | Challenge bank. JSON `content` + `correct_answer`. |
| `user_responses` | All widget attempts including timing & fingerprint meta. |
| `api_keys` | Allows 3rd-party sites to embed widget & query analytics. |

Views:

* `challenge_performance_view` – aggregated stats for dashboard.
* `daily_metrics_view` – (future) daily roll-ups.

---

## 4. API & Core Logic

### Edge Functions

| Path | Method | Description |
|------|--------|-------------|
| `/functions/v1/get-env-var` | POST | Securely returns selective env vars to frontend (`GEMINI_API_KEY`, etc.). |

### Front-end Services

* **Supabase Client** (`src/lib/supabase.ts`) – typed accessors for tables & views.
* **GeminiApi** (`src/lib/gemini-api.ts`) – wraps Google Gemini completions for AI challenge generation.

### Business Flows

1. **Challenge Lifecycle**  
   Admin creates or AI-generates a challenge → sets `is_active`.
2. **Widget Solve**  
   Widget fetches an active challenge → collects signals & answer → inserts into `user_responses`.  
   Supabase RLS allows insert even if unauthenticated.
3. **Analytics**  
   Dashboard queries `challenge_performance_view` to show success rates, response times, pass/fail split.

---

## 5. Security Measures

* **RLS everywhere** – no direct DB access without policy match.
* **supabase-js PKCE** – mitigates OAuth token interception.
* **Edge Functions** – secrets never touch the browser; CORS locked down.
* **FingerprintJS** – extra bot signals captured client-side.

---

## 6. Deployment

* **Frontend** – Static build (`npm run build`) deployable to Vercel, Netlify or Supabase Hosting.
* **Backend** – Supabase project; migrations in `supabase/migrations/` applied via `supabase db push`.
