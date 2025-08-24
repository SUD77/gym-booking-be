# Gym Booking Monorepo — Developer Setup

Monorepo with two apps and shared configs:

```
.
├─ apps/
│  ├─ api/   # Node.js + Express + TypeScript + Prisma
│  └─ web/   # React + Vite + TypeScript
└─ packages/
   └─ tsconfig/  # Shared TypeScript base config
```

## Prerequisites
- **Node.js 22 LTS** and **npm 10+**  
  Check: `node -v` and `npm -v`
- **Git**
- **Docker Desktop** (for local Postgres). Make sure Docker is running before starting the DB.
- Editor: **VS Code** with _ESLint_ and _Prettier_ extensions (recommended).

---

## 1) Install dependencies (root)
```sh
npm install
```

> Uses a single lockfile at the repo root with **npm workspaces** and **Turborepo**.

---

## 2) Environment files (per app)

Create env files from the provided examples.

**macOS/Linux**
```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**Windows PowerShell**
```powershell
Copy-Item .\apps\api\.env.example .\apps\api\.env
Copy-Item .\apps\web\.env.example .\apps\web\.env
```

**Defaults used by the repo**
- `apps/api/.env`
  ```ini
  API_PORT=3001
  API_DB_URL=postgresql://dev:dev@localhost:5432/gym_app?schema=public
  ```
- `apps/web/.env`
  ```ini
  WEB_PORT=5173
  WEB_API_BASE_URL=http://localhost:3001
  ```

> If you change the Postgres host port (see next step), update `API_DB_URL` accordingly.

---

## 3) Start Postgres (Docker)

From the repo root:
```sh
npm run db:start
```
This uses the root `docker-compose.yml` to start **Postgres 16** with:
- user: `dev`, password: `dev`, database: `gym_app`
- host: `localhost`, port: **5432**

**If 5432 is already in use**
1. Edit `docker-compose.yml` and change:
   ```yaml
   ports:
     - "5433:5432"
   ```
2. Update `apps/api/.env`:
   ```ini
   API_DB_URL=postgresql://dev:dev@localhost:5433/gym_app?schema=public
   ```
3. Restart:
   ```sh
   npm run db:stop
   npm run db:start
   ```

---

## 4) Apply Prisma migrations (API workspace)

```sh
npx -w @gym/api prisma migrate dev --name init
npx -w @gym/api prisma generate
```

(Optional UI to view/edit data)
```sh
npm run -w @gym/api prisma:studio
```

---

## 5) Run the apps (root)

```sh
npm run dev
```
- **API** → http://localhost:3001/health  
- **Web** → Vite prints a URL (usually http://localhost:5173)

---

## Useful Scripts

**Root (via Turborepo)**
- `npm run dev` — start **api** & **web** in watch mode
- `npm run build` — build all workspaces
- `npm run typecheck` — TypeScript checks
- `npm run lint` — ESLint across workspaces
- `npm run format` — Prettier write

**Database**
- `npm run db:start` — start Postgres
- `npm run db:stop` — stop containers
- `npm run db:reset` — **wipe** DB volume and start fresh

**API only**
```sh
npm run -w @gym/api dev
npm run -w @gym/api build
npm run -w @gym/api start
npm run -w @gym/api prisma:studio
```

**Web only**
```sh
npm run -w @gym/web dev
npm run -w @gym/web build
npm run -w @gym/web preview
```

---

## Troubleshooting

**Turbo requires `packageManager`**
```sh
npm pkg set packageManager="npm@$(npm -v)"
```

**Turbo 2.x config**
Root `turbo.json` uses `"tasks"` (not `pipeline`).

**Port conflicts**
- Change `API_PORT` in `apps/api/.env`
- Change `WEB_PORT` in `apps/web/.env`
- Change Postgres host port mapping in `docker-compose.yml` and update `API_DB_URL`

**PowerShell quoting when setting scripts**
```powershell
npm --workspace @gym/api pkg set scripts.lint='eslint "src/**/*.{ts,tsx}"'
```

**Disable Turbo telemetry (optional)**
```sh
npx turbo telemetry disable
```

---

## Keep in mind
- `.env` files **must not** be committed. Only commit the `.env.example` templates.
- Use **Node 22 LTS** for consistent behavior across machines.


TestAgain4