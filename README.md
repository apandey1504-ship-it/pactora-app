# Pactora

Pactora is a premium SaaS fintech-style contract assurance web app built with Next.js, React, TypeScript, Tailwind CSS, and Supabase-ready structure.

## Pages

- Landing page
- Login page
- Signup page
- Client dashboard
- Contractor dashboard
- Admin dashboard
- Project details page
- Milestones page
- Change requests page
- Messages page
- Payments placeholder page
- Trust score page

## Backend-ready Structure

The Supabase client lives in `src/lib/supabase.ts`.

The Supabase schema is managed through migrations:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/seed.sql`

Tables:

- profiles
- companies
- company_members
- projects
- project_participants
- milestones
- change_requests
- change_request_comments
- messages
- documents
- payments
- disputes
- trust_scores
- audit_logs
- notifications

Storage:

- `pactora-documents`

Database types for the frontend live in `src/types/database.ts`.

## Data Layer

The dashboard pages now load through services and hooks. Supabase is used when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. If either value is missing, the hooks return sample data so the UI remains usable.

Services:

- `src/services/projects.ts`
- `src/services/milestones.ts`
- `src/services/change-requests.ts`
- `src/services/messages.ts`
- `src/services/documents.ts`
- `src/services/trust-scores.ts`

Hooks:

- `src/hooks/use-projects.ts`
- `src/hooks/use-milestones.ts`
- `src/hooks/use-change-requests.ts`
- `src/hooks/use-messages.ts`
- `src/hooks/use-documents.ts`
- `src/hooks/use-trust-scores.ts`
- `src/hooks/use-auth.ts`

Mock auth is in `src/lib/auth.ts` and currently returns a client user until Supabase Auth is configured.

## Local Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

To connect Supabase, copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
