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
│   └── marketing/           # Vite + React marketing site
│       ├── src/
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── packages/
│   └── contracts/           # Shared Zod contracts + TS types
│       ├── src/index.ts
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
