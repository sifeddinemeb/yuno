# Yuno – Human Verification as a Service

Yuno is a modern, **AI-augmented CAPTCHA alternative** that verifies a visitor’s humanity through micro-challenges instead of distorted text.  The project ships as a split-stack application:

* **Frontend:** React + TypeScript + Vite + Tailwind  
  Delivers an embeddable widget (`<YunoWidget />`) and an admin dashboard.
* **Backend:** Supabase (PostgreSQL + Row-Level Security)  
  Provides authentication, a JSON-friendly schema for challenges & responses, and serverless Edge Functions.
* **ML / AI:**  Google Gemini or OpenAI completions drive automated challenge generation and evaluation.

Target users:

* **Site owners / developers** who need a friction-less bot-mitigation solution.
* **End users** who simply solve one micro-challenge to proceed, instead of deciphering antiquated CAPTCHAs.

Key features already present:

1. Admin CRUD UI for challenges & analytics.
2. 6 base challenge types (image select, slider, quick math, etc.).
3. Advanced behavioural & fingerprint signals (FPJS + timing).
4. PKCE email login for admins; anon session for visitors.
5. Fully typed SDK (`supabase.ts`) & RLS-secured tables.
