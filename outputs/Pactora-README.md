# Pactora

The Pactora app source has been created in the workspace root.

Run it with:

```bash
npm install
npm run dev
```

Key files:

- `src/app/page.tsx`
- `src/app/dashboard/client/page.tsx`
- `src/app/dashboard/contractor/page.tsx`
- `src/app/dashboard/admin/page.tsx`
- `src/components`
- `src/lib/mock-data.ts`
- `src/lib/supabase.ts`
- `src/services`
- `src/hooks`
- `supabase/schema.sql`
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/seed.sql`

The dashboards now use Supabase-ready services and hooks with mock fallback data.
