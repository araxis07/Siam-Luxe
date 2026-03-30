# Production Checklist

This checklist is intentionally kept high-level so the repository does not expose sensitive operational detail.

## Platform Readiness

- [ ] Database migrations have been applied in the correct order
- [ ] Authentication works in the target environment
- [ ] Admin access is assigned only to the correct accounts
- [ ] Core business tables exist and are working correctly

## Environment Setup

- [ ] Public app configuration is set for the target environment
- [ ] Server-side credentials are configured only in environment variables
- [ ] Payment provider credentials are configured
- [ ] Email provider credentials are configured
- [ ] Background job credentials are configured

## Payments

- [ ] Test a successful payment flow
- [ ] Test a cancelled payment flow
- [ ] Confirm paid orders update correctly
- [ ] Confirm failed or cancelled payments do not corrupt order state

## Email Delivery

- [ ] Test reservation confirmation delivery
- [ ] Test order confirmation delivery
- [ ] Test loyalty or reward notification delivery
- [ ] Confirm delivery queue status updates correctly

## Background Jobs

- [ ] Email dispatch jobs can run successfully
- [ ] Reservation automation jobs can run successfully
- [ ] Failed background jobs are visible and recoverable

## Deployment

- [ ] Deploy the application to the target hosting environment
- [ ] Verify the main storefront pages load correctly
- [ ] Verify admin pages load correctly
- [ ] Verify health/status checks respond correctly

## Monitoring

- [ ] Error tracking is enabled
- [ ] Operational logs are reviewable
- [ ] Alerting exists for failed payment or delivery issues
- [ ] Routine health checks are configured

## Final QA

- [ ] Frontend smoke testing complete
- [ ] Backend smoke testing complete
- [ ] Admin workflows tested
- [ ] Reservation flow tested
- [ ] Checkout flow tested
- [ ] Review and moderation flow tested

## Security Reminder

Do not store any of the following in public-facing documentation:
- real API keys
- database secrets
- private webhook credentials
- production user data
- internal-only operational secrets
