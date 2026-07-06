# medicom

A modern telehealth platform for the Ghanaian market: secure video visits, AI-assisted triage, e-prescriptions, verified pharmacies, and Ghana-FDA drug authentication — built with Next.js 16, React 19, Tailwind CSS, and a warm brown-and-white design system.

> **Demo mode** — the app currently runs fully self-contained with no backend. Every screen works against a typed in-app data layer, and interactive flows (booking, cancelling, notifications) persist locally. See [Architecture](#architecture) for how a real backend plugs in.

## Quickstart

```bash
npm install
npm run dev          # from the repo root (turbo), or from apps/web
```

Open http://localhost:3000 and sign in with a **demo account** from the login page — one click, no credentials needed:

| Role    | What you can do |
|---------|-----------------|
| Patient | Book/cancel/reschedule visits, symptom checker, prescriptions, records, pharmacies, drug verification, billing |
| Doctor  | Live dashboard, appointment management, AI triage queue, patient charts, e-prescribing, clinical notes |
| Nurse / Midwife / Lawyer | Role-specific dashboards |

No environment variables are required for demo mode.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint 9 (flat config) — passes with 0 errors |
| `npm run type-check` | `tsc --noEmit` — passes clean |
| `npm run test:e2e` | Playwright smoke suite (chromium) |

## Architecture

```
apps/web
└── src
    ├── app/                  # Next.js App Router pages
    ├── components/           # UI kit (shadcn-style), layout shell, dashboard kit, toast
    ├── hooks/useAuth.ts      # Single auth hook: demo cookie OR Supabase session
    ├── lib/
    │   ├── data/index.ts     # ★ Central typed data layer — single source of truth
    │   ├── data/store.ts     # ★ Interactive demo store (zustand + localStorage)
    │   ├── auth-fresh.ts     # Auth functions (Supabase-backed when configured)
    │   ├── supabase/         # Lazy client — never crashes without env config
    │   └── ui/status.ts      # Shared accessible status-badge tokens
    └── proxy.ts              # Route guard (demo cookie / Supabase) + CSP header
```

**The two stars are the seam for a real backend.** Every page reads domain data (patients, providers, appointments, prescriptions, records, pharmacies, plans, transactions, triage, drug registry) from `lib/data`; mutable flows go through the zustand store. Replacing demo data with API calls means changing those two files — the UI is untouched.

### Auth

- **Demo:** an `mc-demo=<role>` cookie set by the login page. `proxy.ts` and `useAuth` honor it with zero network calls.
- **Real:** configure `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `apps/web/.env.example`) and the same code paths switch to Supabase SSR sessions.

### Payments

Stripe and Paystack integrations exist and initialize lazily — API routes return 503 until keys are configured, so builds and demo deployments never break.

## Design system

- **Espresso** (`#2B1D10` family) — sidebar, welcome banners, dark anchors
- **White / warm cream** surfaces with brown (`#8A5A2E`) primary actions
- Shared status tokens (`lib/ui/status.ts`) keep badges accessible (no light-on-white text)
- Toasts (`components/ui/toast.tsx`) replace every blocking `alert()`

## Reviving the real backend

Earlier iterations included an Express/Drizzle API and DB workspace (removed in the customer-ready cleanup — they were unreferenced). To go live:

1. Create a Supabase project; fill `apps/web/.env.example` values into `.env.local`.
2. Implement the accessors in `src/lib/data/index.ts` against your API/Supabase tables (they are already async-shaped).
3. Swap the zustand demo store mutations for API mutations (same action names).
4. Configure Stripe/Paystack keys to activate payment routes.

## Known demo limitations

- Data is per-browser (localStorage) — "Reset demo data" is available via `resetDemoData()` in the store.
- Video consultations render the call UI without a live WebRTC backend.
- AI symptom analysis and drug interactions are simulated in the UI (no LLM calls).
- Password reset simulates success when no auth backend is configured.
