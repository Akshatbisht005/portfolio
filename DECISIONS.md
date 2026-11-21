# Technical & Product Decisions — Rohit Rawat Portfolio

## Architecture Overview
The portfolio is designed as a high-performance single-page application (public site at `/`) paired with a protected content management dashboard (at `/admin`). Content is served live from a Supabase Postgres database with automatic fallback to static seed data (`src/data/content.ts`) if the database is unreachable or keys are omitted.

---

## 1. Tech Stack Decisions
- **Framework**: Vite + React 19 + TypeScript for sub-second builds and static bundle optimization.
- **Styling**: Tailwind CSS v3 with custom palette tokens (`slate` dark/light neutrals, `violet-600` primary accent `#7c3aed`).
- **Animation System**: Framer Motion for scroll-triggered element reveals, staggered entrance animations, and modal transitions, fully respecting `prefers-reduced-motion`.
- **Database & Backend**: Supabase (PostgreSQL 15, Supabase Auth, Supabase Storage).
- **Client Cache**: `@tanstack/react-query` + React Context for live data re-fetching without full-page reloads.
- **Routing**: `react-router-dom` with client-side SPA rewrites configured in `vercel.json`.

---

## 2. Animation & UX Decisions (Audited from Reference Site)
Reference audit findings from `ANIMATION_SPEC.md` were modernized for 2026:
1. **Preloader**: Full-screen overlay displaying animated &quot;RR&quot; monogram with pulsing SVG rings; exits with a smooth 800ms fade on mount.
2. **Sticky Navigation**: Transparent header over hero; transitions to `bg-white/95` / `bg-slate-950/95` with subtle border and shadow once `scrollY > 50px`.
3. **Active Nav Spy**: Section indicator highlights active sections via `useScrollSpy` pill.
4. **Hero Entrance**: Staggered container entrance (avatar → greeting → headline → subtitle → CTAs) with infinite floating ambient gradients.
5. **Proficiency Fill Bars**: Replaced legacy percentage bars with semantic proficiency levels (`Strong`, `Proficient`, `Familiar`) animated via `useInView` width fill (0% to 100% over 2000ms).
6. **Tools Marquee**: Infinite CSS marquee strip for platforms (Jira, Figma, Claude, Lovable, Notion, ChatGPT); automatically pauses on hover.
7. **Project Interaction**: Image zoom and overlay reveal on card hover; clicking opens an accessible `AnimatePresence` modal with focus trap, ESC key close, and outcome metrics.
8. **Contact Form**: Animated floating labels, validation states, shake animation on error, and honeypot protection.

---

## 3. Database & Security Decisions
1. **Row Level Security (RLS)**: Enabled across all 10 tables:
   - Anonymous (`anon`) role: Read-only (`SELECT`) on rows where `is_published = true`.
   - Anonymous insert (`INSERT`) only permitted on `messages` table.
   - Admin role (`is_admin()` function): Full CRUD permissions on all tables.
2. **Admin Authentication**:
   - Seeded admin email: `rohanrwt9278@gmail.com`.
   - Public sign-ups disabled in Supabase Auth.
   - Support for both Password and Magic Link passwordless authentication.
3. **Contact Form Protection**:
   - Honeypot hidden input field catches automated spam bots.
   - Client-side 10-second submission throttle.
   - PostgreSQL trigger (`check_message_rate_limit`) rejects > 5 submissions per email within 1 hour.
4. **Asset Storage**:
   - Public Supabase bucket `site-assets` for images, PDFs, and resume files.
   - File size restricted to 5 MB per file; MIME types restricted to JPEG, PNG, WebP, GIF, PDF.

---

## 4. Fallback & Offline Resilience
- If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are unset, `src/lib/supabase.ts` gracefully activates fallback mode.
- All public components render seamlessly with pre-configured seed data matching Rohit Rawat's exact resume.
- Admin dashboard provides demo/preview functionality in offline mode.
