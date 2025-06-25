# Project Structure

```
yuno-ai/
├── index.html                 # Root HTML served by Vite in dev/prod
├── package.json               # NPM dependencies & scripts
├── vite.config.ts             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS design system
├── tsconfig*.json             # TS compiler settings (app, node)
├── supabase/                  # Backend: Postgres schema & Edge Functions
│   ├── migrations/            # Version-controlled SQL migrations (DDL + RLS)
│   └── functions/             # Deno Edge Functions (serverless API)
├── src/                       # Front-end React + TypeScript source
│   ├── App.tsx                # Application shell & router outlet
│   ├── main.tsx               # Vite bootstrap (hydrate React)
│   ├── index.css              # Tailwind base + global styles
│   ├── components/            # Re-usable UI blocks
│   │   ├── ui/                # Atomic design (Button, Modal, etc.)
│   │   ├── widget/            # Public Yuno CAPTCHA widget
│   │   └── admin/             # Admin dashboard widgets
│   ├── pages/                 # Route-level components (React-Router)
│   ├── hooks/                 # Custom React hooks (e.g. `useAuth`)
│   ├── store/                 # Global zustand store
│   ├── lib/                   # Client helpers (Supabase client, Gemini API)
│   └── types/                 # Shared TypeScript interfaces & enums
├── .bolt/                     # Turborepo / Bolt task cache
├── node_modules/              # Installed dependencies (git-ignored)
└── project-docs/              # 📚 ← THIS folder: living documentation
```

> The diagram shows only the first three levels for brevity. All other generated assets (build, coverage, etc.) are git-ignored via `.gitignore`.
