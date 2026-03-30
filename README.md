# ✨ Siam Lux

Siam Lux is a premium multilingual Thai food ordering platform designed to feel elegant, immersive, and production-ready.

It combines a polished guest-facing experience with a real full-stack foundation for authentication, ordering, reservations, reviews, loyalty, and admin operations.

## 🌏 Highlights

- 🍽️ Premium Thai dining and ordering experience
- 🌐 Multi-language support
- 🛒 Cart, checkout, and order tracking
- 📅 Reservations and guest management
- 🎁 Rewards, gift cards, and promotions
- 👤 Member accounts and profile sync
- ⭐ Reviews and favorites
- 🛠️ Admin and operational tooling

## 🧱 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- next-intl
- Zustand
- React Hook Form
- Zod
- Framer Motion

### Backend
- Next.js route handlers
- Supabase Auth
- PostgreSQL via Supabase
- SQL migrations

### Quality
- ESLint
- Playwright
- GitHub Actions

## 🗂️ What The Project Includes

- A premium guest-facing storefront
- Multi-locale content and navigation
- Account, loyalty, and saved preferences
- Reservation and order flows
- Admin-facing operational controls
- Database-backed business logic
- Testing and CI foundations

## 🚀 Local Setup

1. Install dependencies

```bash
npm ci
```

2. Create your local environment file

Use `.env.example` as the template for `.env.local`, then fill in your own local values.

Important:
- Never commit `.env.local`
- Never put real credentials directly into documentation

3. Apply the database migrations

Run the SQL files inside `supabase/migrations` against your own Supabase project in order.

4. Start the development server

```bash
npm run dev
```

## ✅ Verification

Run the main checks:

```bash
npm run lint -- --quiet
npm run build
npm run test:e2e:list
```

If you also want the backend API check:

```bash
npm run test:e2e:api
```

## 🎯 Current Project Status

This project is already beyond a frontend prototype.

It now has:
- a substantial frontend experience
- a working full-stack backend foundation
- real authentication and database integration
- operational admin tooling
- production-oriented QA and hardening work

## 🔐 Security Note

This repository should only contain code, templates, and placeholder configuration.

Do not place any of the following directly into public-facing docs:
- real API keys
- database credentials
- service role secrets
- private webhook secrets
- personal production data

## 📌 Notes

Siam Lux is best treated as a serious full-stack product foundation.

At this stage, the main work left is usually:
- connecting live providers
- deployment setup
- monitoring and production operations

Not large missing frontend feature work.
