# Siam Lux

Premium multilingual Thai ordering platform built with `Next.js`, `TypeScript`, `Supabase`, and `PostgreSQL`.

## Status

The project is now a real `full-stack` application, not just a frontend demo.

What is already in place:
- multi-language guest-facing frontend: `th`, `en`, `ja`, `zh`, `ko`
- auth and member profile sync with `Supabase Auth`
- transactional backend for `orders`, `reservations`, `reviews`, `favorites`
- loyalty, gift wallet, promos, notifications, payment attempts, email outbox
- admin operations for orders, reservations, reviews, promos, menu operations, loyalty, audit logs
- health and ops endpoints
- Playwright E2E coverage and CI workflow

What is still external/provider-dependent:
- live payment provider keys
- live email provider keys
- cron/background scheduling in deployment
- production deployment envs and monitoring

## Stack

### Frontend
- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `next-intl`
- `Zustand`
- `React Hook Form`
- `Zod`
- `Framer Motion`

### Backend
- `Next.js App Router` route handlers
- `Supabase Auth`
- `Supabase Postgres`
- `Supabase SSR`
- SQL migrations in [supabase/migrations](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations)

### Testing
- `Playwright`
- `ESLint`
- GitHub Actions CI in [.github/workflows/ci.yml](/Users/tundergod/Project-Coding/Siam-Lux/.github/workflows/ci.yml)

## Key Routes

### Guest / Customer
- `/[locale]`
- `/[locale]/menu`
- `/[locale]/checkout`
- `/[locale]/reservation`
- `/[locale]/tracking`
- `/[locale]/reviews`
- `/[locale]/gift-cards`
- `/[locale]/rewards`
- `/[locale]/auth`

### Admin
- `/[locale]/admin`

### API
- `/api/health`
- `/api/orders`
- `/api/reservations`
- `/api/reviews`
- `/api/promos/validate`
- `/api/payments/prepare`
- `/api/payments/confirm`
- `/api/internal/cron/email-outbox`
- `/api/internal/cron/reservations`

## Local Setup

1. Install dependencies
```bash
npm ci
```

2. Copy env values into [`.env.local`](/Users/tundergod/Project-Coding/Siam-Lux/.env.local)
Required base values:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Optional live integrations:
```env
APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
PAYMENT_PROVIDER_NAME=manual-card
STRIPE_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
INTERNAL_CRON_SECRET=
```

3. Run Supabase migrations in order
- [202603300001_create_profiles.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300001_create_profiles.sql)
- [202603300002_create_transactional_core.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300002_create_transactional_core.sql)
- [202603300003_add_payment_and_outbox.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300003_add_payment_and_outbox.sql)
- [202603300004_add_loyalty_and_menu_operations.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300004_add_loyalty_and_menu_operations.sql)
- [202603300005_add_operational_controls.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300005_add_operational_controls.sql)
- [202603300006_add_provider_delivery_hardening.sql](/Users/tundergod/Project-Coding/Siam-Lux/supabase/migrations/202603300006_add_provider_delivery_hardening.sql)

4. Start the app
```bash
npm run dev
```

## Verification

Run the standard checks:
```bash
npm run lint -- --quiet
npm run build
npm run test:e2e:list
npm run test:e2e:api
```

## Admin Access

Mark your account as admin in Supabase:
```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

## Remaining Work

The codebase is close to feature-complete. The remaining tasks are mostly operational:
- configure live payment provider
- configure live email sending
- configure cron/background jobs
- deploy production envs
- add monitoring and alerting

Detailed checklist:
- [docs/production-checklist.md](/Users/tundergod/Project-Coding/Siam-Lux/docs/production-checklist.md)
