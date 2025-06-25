# Sprint Roadmap

This roadmap converts the audit findings into **focused, test-driven** iterations. Each sprint is assumed **1 week** long.

---

## Sprint 1: Stabilize Auth & Critical Bugs [X] Complete

**Goals**
* No hard crashes when env vars missing.
* Authentication gracefully handles offline / slow networks.

**Tasks**
- [X] Fix #B-1 – add fallback UI + .env check (#ui)
- [X] Fix #B-2 – timeout & retry logic in `useAuth` (#api)
- [X] Add Jest test for env-var guard (#test)

**Testing / Validation**
* Run unit tests; CI passes.
* Manual QA: run without `.env` → user-friendly message.

**Risk**: Low; contained to auth layer.

---

## Sprint 2: Accessibility & Mobile Polish

**Goals**
* Widget WCAG AA compliant.
* Admin pages fully responsive.

**Tasks**
- [~] Address #U-1 – ARIA labels, focus management (#ui) – core widgets & nav covered
- [ ] Fix #U-2 – flex/table overflow (#ui)
- [ ] Add Playwright accessibility scan (#test)

**Testing / Validation**
* Lighthouse a11y score ≥ 95.
* Passes iPhone 12 viewport screenshot review.

**Risk**: Medium – layout refactor may break existing CSS.

---

## Sprint 3: Analytics MVP

**Goals**
* Daily metrics SQL view + API export.

**Tasks**
- [ ] Write migration for `daily_metrics_view` (#db)
- [ ] Build Edge Function `export-metrics` returning CSV (#api)
- [ ] Dashboard UI chart integration (#ui)

**Testing / Validation**
* Supabase local run shows view populated.
* API returns valid CSV with auth.

**Risk**: Medium – need to optimise SQL for large tables.

---

## Sprint 4: AI Challenge Generator 1.0

**Goals**
* Fully functional Gemini-powered generation with admin review.

**Tasks**
- [ ] Implement review queue schema (`ai_generated` flag) (#db)
- [ ] Extend `gemini-api.ts` with exponential back-off (#api)
- [ ] Admin UI for approve / reject (#ui)
- [ ] Rate-limit generation per admin (#api)

**Testing / Validation**
* Generate ≥ 10 challenges; approve; widget displays.
* Unit test stubs for Gemini responses.

**Risk**: High – external API quotas & billing.

---

## Sprint 5: Client SDK & Integration Docs

**Goals**
* Publish npm package `@yuno/widget`.

**Tasks**
- [ ] Extract widget to standalone TS lib (#build)
- [ ] Add peer deps & bundling via tsup (#build)
- [ ] Write README & usage examples (#docs)

**Testing / Validation**
* Install in sample Next.js app; verification works.

**Risk**: Medium – bundle size constraints.

---

## Sprint 6: Test Coverage & CI Hardening

**Goals**
* ≥ 70% unit coverage; e2e smoke tests.

**Tasks**
- [ ] Configure Jest + React Testing Library (#test)
- [ ] Add Playwright flows for widget & admin (#test)
- [ ] GitHub Actions: lint, test, build (#ci)

**Testing / Validation**
* CI green on every PR.

**Risk**: Low – mostly infra.
