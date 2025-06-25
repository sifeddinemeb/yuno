# Issues & Technical Debt Log

_Last updated: 2025-06-24_

## 1. Bugs

| ID | Description | Repro Steps | Location |
|----|-------------|-------------|----------|
| ~~B-1~~ | Supabase env vars missing threw hard error & white-screen before UI loads. **Fixed in 0.1.0** | — | — |
| ~~B-2~~ | Loading spinner hung forever when offline. **Fixed in 0.1.0** | — | — |

## 2. UI / UX Gaps

| ID | Description | Impact |
|----|-------------|--------|
| U-1 | Widget accessibility needs ARIA labels for challenge elements. | Screen-reader users cannot solve. |
| U-2 | Mobile viewport overflow on `/admin/challenges` table. | Horizontal scroll appears. |

## 3. Technical Debt

| ID | Area | Detail |
|----|------|--------|
| D-1 | Testing | No unit/e2e tests; 0% coverage. |
| D-2 | State Management | Some duplicated auth state between React context and Zustand. |
| D-3 | Edge Functions | Only 1 function; API logic such as analytics export still in client. |
| D-4 | Build Size | Tailwind purge not configured fully; dev build ~4 MB. |
| D-5 | AI Error Handling | Gemini API wrapper retries but lacks exponential backoff & quota awareness. |

> Track fixes by referencing the IDs (e.g., `Fixes #B-1`) in PR titles.
