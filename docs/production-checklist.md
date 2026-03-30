# Production Checklist

This document tracks what is still left after the full-stack core has been completed.

## 1. Supabase

- [ ] Confirm migrations `001` to `006` are applied
- [ ] Confirm your admin account has `role = 'admin'`
- [ ] Confirm `profiles`, `orders`, `reservations`, `reviews`, `payment_attempts`, `email_outbox`, `audit_logs`, `menu_dishes` all exist
- [ ] Review RLS policies once more before deployment

Quick check:
```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

## 2. Required Env Values

### Base
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Background / automation
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `INTERNAL_CRON_SECRET`

### Email
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`

### Payment
- [ ] `APP_URL`
- [ ] `PAYMENT_PROVIDER_NAME`
- [ ] `STRIPE_SECRET_KEY` if using Stripe checkout
- [ ] `PAYMENT_WEBHOOK_SECRET`

## 3. Payment Go-Live

Recommended path:
1. Set `PAYMENT_PROVIDER_NAME=stripe-checkout`
2. Add `APP_URL`
3. Add `STRIPE_SECRET_KEY`
4. Restart app
5. Place a card order
6. Confirm the redirect returns to `/[locale]/checkout`
7. Confirm payment status changes from `pending` to `paid`

If you do not want live payment yet:
- keep `PAYMENT_PROVIDER_NAME=manual-card`

## 4. Email Go-Live

1. Add `RESEND_API_KEY`
2. Add `RESEND_FROM_EMAIL`
3. Restart app
4. Trigger:
   - reservation confirmation
   - order confirmation
   - reward redemption
5. Check `email_outbox` in Supabase
6. Confirm rows move to `sent`

## 5. Cron / Background Jobs

Current internal cron routes:
- `/api/internal/cron/email-outbox`
- `/api/internal/cron/reservations`

To use them in production:
1. set `SUPABASE_SERVICE_ROLE_KEY`
2. set `INTERNAL_CRON_SECRET`
3. schedule requests from your host
4. include header:
```text
x-internal-cron-secret: <INTERNAL_CRON_SECRET>
```

## 6. Deployment

- [ ] Create production project/envs
- [ ] Put envs into hosting provider
- [ ] Deploy app
- [ ] Run smoke checks:
  - `/api/health`
  - `/th`
  - `/th/menu`
  - `/th/checkout`
  - `/th/reservation`
  - `/th/admin`

## 7. Monitoring

Still recommended after deploy:
- [ ] error tracking
- [ ] server log review
- [ ] alerting for failed payment/email queues
- [ ] routine health checks against `/api/health`

## 8. Final QA

Run:
```bash
npm run lint -- --quiet
npm run build
npm run test:e2e:list
npm run test:e2e:api
```

Manual checks:
- [ ] card checkout
- [ ] cash checkout
- [ ] reservation create/cancel/reschedule
- [ ] review submit/moderate
- [ ] promo validate
- [ ] admin status changes
- [ ] email cron route
- [ ] reservation automation cron route

## Reality Check

At this point the project is already full-stack.

What remains is mostly:
- provider configuration
- deployment setup
- ops and monitoring

Not large new feature work.
