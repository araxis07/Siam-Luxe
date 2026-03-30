# ✨ Siam Lux

**Siam Lux** is a premium multilingual Thai food ordering platform built as a personal full-stack portfolio project.

It started as a frontend-focused concept and evolved into a much larger product system with authentication, database-backed transactions, admin operations, and production-oriented QA foundations.

## 🌟 Project Overview

Siam Lux was designed to feel more like a polished digital dining product than a simple restaurant website.

The goal of this project was to build a premium guest-facing experience while also proving end-to-end full-stack capability across:

- 🌐 multilingual product experience
- 🍽️ menu discovery and food ordering
- 🛒 cart and checkout flows
- 📅 reservation and guest management
- 👤 authentication and member profiles
- 🎁 rewards, gift cards, and promotions
- ⭐ reviews and favorites
- 🛠️ admin operations and business tooling

## 👨‍💻 My Role

This was built as a personal project, and I handled the product across both frontend and backend layers.

I was responsible for:

- designing the overall product structure and user flows
- implementing the full guest-facing frontend experience
- building multilingual pages and localized UI flows
- wiring authentication and member state
- integrating Supabase and PostgreSQL for real backend workflows
- creating transactional backend flows for orders, reservations, reviews, favorites, and loyalty
- building admin-facing operations for moderation and business control
- adding testing, CI, and backend hardening foundations

## 🚀 Key Features

- 🍜 Premium Thai menu browsing with rich product presentation
- 🌍 Multi-language support across customer-facing flows
- 🛒 Cart, checkout, and order tracking
- 📅 Reservation flow with scheduling support
- ❤️ Favorites and saved account state
- 🎁 Rewards, gift cards, and promo handling
- ⭐ Review submission and moderation flow
- 👤 Member account and profile sync
- 🛠️ Admin workspace for operational control

## 🧱 Technical Highlights

- Built with a modern `Next.js + TypeScript` architecture
- Uses `Supabase Auth` and `PostgreSQL` for real data-backed workflows
- Includes backend transaction handling for core customer flows
- Supports admin operations beyond the storefront experience
- Includes Playwright E2E coverage and CI workflow
- Added backend hardening such as:
  - rate limiting
  - health and operational status endpoints
  - email queue retry foundations
  - payment preparation and confirmation flow foundations
  - admin and automation support

## 🛠️ Tech Stack

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

## 🗂️ Scope

This project includes:

- a guest-facing storefront
- account and member flows
- cart and checkout
- reservations
- reviews and favorites
- loyalty and gift card flows
- admin and operational tooling
- testing and CI foundations

## 🧪 Local Setup

1. Install dependencies

```bash
npm ci
```

2. Create a local environment file

Use `.env.example` as the template for `.env.local`, then fill in your own local values.

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

Optional backend API check:

```bash
npm run test:e2e:api
```

## 🎯 Current Status

Siam Lux is no longer just a frontend showcase.

It now stands as a real **full-stack portfolio project** with:

- a substantial customer-facing frontend
- real authentication and database integration
- backend business flows
- admin operations
- QA and CI foundations
- production-oriented hardening work

## 🔐 Security Note

This repository should only contain source code, placeholders, and safe setup guidance.

It should never expose:

- real API keys
- production credentials
- private webhook secrets
- internal-only operational secrets
- personal production data

## 📌 Final Note

This project is best viewed as a serious full-stack product foundation and a strong portfolio piece that demonstrates the ability to build beyond UI alone.

At this stage, the remaining work is mostly related to live provider setup, deployment, and production operations rather than missing major product features.
