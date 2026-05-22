# Project Layout

This repository is organized as a pnpm monorepo.

## Top-Level Structure

```text
.
├── apps/
│   ├── api/                 # Node + TypeScript API backend
│   │   ├── src/server.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── admin/               # Vite + React admin control-plane shell
│   │   ├── src/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── docs/                # Vite + React documentation portal shell
│   │   ├── src/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── marketing/           # Vite + React marketing site
│       ├── src/
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── packages/
│   ├── contracts/           # Shared Zod contracts + TS types
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/                  # Shared DB abstractions + in-memory adapter scaffold
│       ├── src/index.ts
│       ├── src/adapters/memory.ts
│       ├── src/repositories/events.ts
│       ├── src/types.ts
│       ├── package.json
│       └── tsconfig.json
├── src/                     # Existing dashboard app (Vite + React)
├── public/                  # Dashboard static assets
├── .github/workflows/       # CI and Pages deployment workflows
├── package.json             # Dashboard package + workspace orchestration scripts
└── pnpm-workspace.yaml      # Workspace package definitions
```

## Workspace Membership

Configured in `pnpm-workspace.yaml`:

- `.` (dashboard app at repo root)
- `apps/*`
- `packages/*`

## Validation Strategy

- Dashboard-only: `pnpm check`
- Whole monorepo: `pnpm check:all`
- Dashboard tests: `pnpm test`
- Whole monorepo tests (if present): `pnpm test:all`
- App development shortcuts: `pnpm dev:marketing`, `pnpm dev:admin`, `pnpm dev:docs`, `pnpm dev:api`
