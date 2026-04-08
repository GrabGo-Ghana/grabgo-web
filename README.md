# GrabGo Web

Monorepo for the GrabGo food delivery web applications — admin dashboard and marketing landing page.

---

## Project Structure

```
grabgo-web/
├── apps/
│   ├── admin/       # Admin dashboard (Next.js) — manage vendors, orders, users, analytics
│   └── landing/     # Marketing landing page (Next.js) — public-facing site
├── packages/
│   ├── ui/          # Shared React components and AuthContext
│   ├── utils/       # Shared API client, auth service, utilities
│   ├── config/      # Shared Tailwind and ESLint configs
│   └── types/       # Shared TypeScript types (WIP)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + custom components in `packages/ui` |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (configured in `packages/utils/src/api/client.ts`) |
| Charts | Recharts, TanStack Table |
| Package Manager | pnpm 9 |
| Monorepo Tooling | Turborepo |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9 (`npm install -g pnpm@9`)

### Install dependencies

```bash
pnpm install
```

### Set up environment variables

```bash
# Copy the example and fill in your values
cp .env.example apps/admin/.env.local
```

Edit `apps/admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run in development

```bash
# Run all apps
pnpm dev

# Run only admin
pnpm --filter @grabgo/admin dev

# Run only landing
pnpm --filter @grabgo/landing dev
```

Admin runs on `http://localhost:3000` by default.  
Landing runs on `http://localhost:3001` by default.

### Build for production

```bash
pnpm build
```

---

## Admin Dashboard

Located in `apps/admin/`. Requires a running GrabGo backend API.

### Features

| Feature | Status |
|---------|--------|
| Authentication (login/logout) | Real |
| Vendor list & detail view | Real (UI) — some actions use mock data |
| Vendor approve/reject/suspend | UI only — API calls are TODOs |
| Order list & detail view | Real (UI) — assign rider, cancel, refund are TODOs |
| Food items list & moderation | UI only — API calls are TODOs |
| User/customer management | UI only — API calls are TODOs |
| Analytics dashboard | Mock data |
| Live order notifications | Simulated (fake WebSocket via `useOrderUpdates`) |

> **Note for co-founder:** Files with `TODO: API call` comments are UI shells waiting for backend integration. The mock data files (`lib/mockOrderData.ts`, `lib/mockAnalyticsData.ts`) are placeholders and should be replaced with real API calls as the backend matures.

### Key files

- `app/(dashboard)/` — all dashboard pages
- `components/` — reusable UI components
- `hooks/` — custom React hooks
- `lib/` — mock data and utilities
- `packages/utils/src/api/` — API client and auth service

---

## Landing Page

Located in `apps/landing/`. Integrates pages exported from the Stitch design tool.

See `apps/landing/STITCH_INTEGRATION_NOTES.md` for details on the Stitch page integration approach.

---

## Deployment

The admin app is configured for deployment on Render.

See `apps/admin/RENDER_DEPLOY.md` for step-by-step instructions.

Required environment variable on Render:
- `NEXT_PUBLIC_API_URL` — the production backend API URL

---

## Shared Packages

### `@grabgo/ui`
React components and the `AuthContext` used across apps. Auth tokens are stored in `localStorage`.

### `@grabgo/utils`
- `src/api/client.ts` — Axios instance with auth token interceptors
- `src/api/auth.service.ts` — Login, logout, token management

### `@grabgo/config`
Shared Tailwind and ESLint configurations.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm clean` | Clean all build artifacts and caches |
