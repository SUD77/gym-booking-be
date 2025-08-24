# Gym Booking Monorepo — Developer Guide

Welcome! This repo is a **monorepo** with two apps and shared configs:

```
.
├─ apps/
│  ├─ api/   # Node.js + Express + TypeScript
│  └─ web/   # React + Vite + TypeScript
└─ packages/
   └─ tsconfig/ # Shared TypeScript base config
```

## Tech Stack
- **Node.js 22 LTS** + **npm workspaces**
- **Turborepo 2.x** (monorepo task runner)
- **TypeScript**
- **ESLint + Prettier**
- **Express** (API) & **React + Vite** (Web)
- **dotenv per app**

> ⚠️ We’ll add **Prisma + Postgres (Docker)** and **Redis** later in *Phase 0, Step 2+*. This guide will be updated as we go.

---

## Prerequisites
- **Node.js**: 22.x (LTS) — verify: `node -v`
- **npm**: 10.x or newer — verify: `npm -v`
- **Git**
- **Docker Desktop** *(optional for now; required from Phase 0 Step 2 for Postgres)*
- Recommended: **VS Code** with extensions: _ESLint_ and _Prettier_

---

## Quick Start

### 1) Install dependencies (single lockfile at root)
```bash
npm install
```

### 2) Create env files (per app)
```bash
# API (apps/api)
cp apps/api/.env.example apps/api/.env

# Web (apps/web)
cp apps/web/.env.example apps/web/.env
```
> On Windows PowerShell, use `Copy-Item`:
```powershell
Copy-Item .\apps\api\.env.example .\apps\api\.env
Copy-Item .\apps\web\.env.example .\apps\web\.env
```

### 3) Run both apps (root)
```bash
npm run dev
```
- **API** → http://localhost:3001/health  
- **Web** → Vite prints a URL, usually http://localhost:5173

---

## Scripts

### Root (runs tasks in each workspace via Turbo)
- `npm run dev` — start **api** and **web** in dev/watch mode
- `npm run build` — build all workspaces
- `npm run typecheck` — TypeScript check across workspaces
- `npm run lint` — ESLint across workspaces
- `npm run format` — Prettier write across the repo

### API (`apps/api`)
- `npm run dev` — run with tsx in watch mode
- `npm run build` — compile to `dist/`
- `npm start` — run compiled app (`dist/index.js`)
- `npm run typecheck` — TS type check
- `npm run lint` — ESLint over `src/**/*.{ts,tsx}`

**Env (apps/api/.env):**
```ini
API_PORT=3001
# API_DB_URL will be added when Postgres/Prisma arrive
```

### Web (`apps/web`)
(Default Vite scripts; may vary slightly by template)
- `npm run dev` — start Vite dev server
- `npm run build` — build the app
- `npm run preview` — preview the production build
- `npm run typecheck` — TS type check
- `npm run lint` — ESLint over `src/**/*.{ts,tsx,js,jsx}`

**Env (apps/web/.env):**
```ini
WEB_PORT=5173
WEB_API_BASE_URL=http://localhost:3001
```

---

## Troubleshooting

### Turbo complains about missing `packageManager`
Set it once at the root (adjust version to your `npm -v`):
```bash
npm pkg set packageManager="npm@$(npm -v)"
```

### Turbo 2.x expects `tasks` instead of `pipeline`
Ensure the root `turbo.json` uses:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": { ... }
}
```

### Ports already in use (3001 or 5173)
- Change `API_PORT` in `apps/api/.env` (e.g., 3002) and restart.
- For the web port, set `WEB_PORT` in `apps/web/.env` (e.g., 5174).

### PowerShell quoting
Prefer single quotes around values with double quotes inside, e.g.:
```powershell
npm --workspace @gym/api pkg set scripts.lint='eslint "src/**/*.{ts,tsx}"'
```

### Disable Turbo telemetry (optional)
```bash
npx turbo telemetry disable
```

---

## Development Conventions

- **Node version**: Use Node 22 LTS.
- **.env files**: Never commit `.env`; commit `.env.example` with placeholders.
- **Formatting**: Prettier is the source of truth; ESLint defers to Prettier where applicable.
- **Commits/branches**: Feature branches recommended (e.g., `feat/booking-form`); use clear commit messages.

---

## Roadmap (Phase 0)
This README will evolve as we implement each step.

- **Step 1 (you are here)**: Monorepo, TypeScript, ESLint/Prettier, dotenv per app ✅
- **Step 2**: Prisma + Postgres
  - Add `docker-compose.yml` (Postgres 16), `db:start|stop|reset` scripts
  - Prisma schema (user, tenant, location, resource, policy, tax_slab, schedule_rule, blackout_window, slot_instance, booking, payment, invoice)
  - Migrations + seeds
- **Step 3**: Auth & Tenancy
  - OTP (email/phone) + JWT
  - RBAC roles, tenant scoping middleware
  - Rate-limit OTP endpoints (Redis)
- **Step 4**: Observability
  - Structured logs, `request_id`
  - Basic metrics (hold latency, oversell attempts)
  - Standard error envelope

> When any of these land, remember to **update this README** (or ask the assistant to generate an updated section).

---
