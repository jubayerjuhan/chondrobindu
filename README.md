# Chondrobindu

Demo-only slot cabinet built with Next.js (App Router) and Tailwind. No real money, no withdrawals. RTP is simulated for entertainment only.

## Setup

1. Install deps: `npm install`
2. Create `.env.local` with:
   - `MONGODB_URI=`
   - `AUTH_SECRET=` (random strong string)
   - `STRIPE_SECRET_KEY=` (test key)
   - `STRIPE_WEBHOOK_SECRET=` (from Stripe CLI)
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
3. Run dev server: `npm run dev`

## Stripe (cosmetic only)
- Create checkout session: `/api/stripe/create-checkout`
- Webhook: `/api/stripe/webhook`
- Example CLI forward: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Notes
- RTP target is hardcoded at 0.92 with simple resampling to avoid wins. Demo-only.
- Rate limiting is in-memory; replace with Redis for production.
- Supporter packs unlock themes only; they never grant coins or payouts.
- Slot cabinet requires login; unauthenticated visitors are redirected to login with `next=/slot`.
# chondrobindu
