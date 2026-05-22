# Eventudio Live Events Monorepo

This repository is now a **pnpm monorepo** for the Eventudio platform.

## Workspace Apps

- **Dashboard (root app)**: multi-tenant operations dashboard for event teams (`/`)
- **Marketing site**: public landing page (`apps/marketing`)
- **Admin panel app**: dedicated control-plane shell (`apps/admin`)
- **Docs app**: documentation portal shell (`apps/docs`)
- **API backend**: lightweight event API service (`apps/api`)
- **Shared contracts**: shared Zod schemas and types (`packages/contracts`)
- **DB package**: shared database abstractions/adapters (`packages/db`)

## Tech Stack

- Node 22 + pnpm workspaces
- Dashboard + Marketing + Admin + Docs: Vite + React + TypeScript
- API: Node.js + TypeScript
- Shared packages: TypeScript + Zod

## Quick Start

```bash
nvm use
pnpm bootstrap
```

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Run dashboard app (root) |
| `pnpm dev:marketing` | Run marketing app |
| `pnpm dev:admin` | Run admin panel app |
| `pnpm dev:docs` | Run docs app |
| `pnpm --dir apps/api build` | Build API backend |
| `pnpm dev:api` | Build then run API app |
| `pnpm check` | Validate dashboard app |
| `pnpm check:all` | Validate dashboard + all workspace packages |
| `pnpm test` | Run dashboard tests in watch mode |
| `pnpm test:watch` | Run dashboard tests in watch mode |
| `pnpm test:all` | Run dashboard tests + all workspace tests (if present) |

## Monorepo Structure

```text
.
├── apps/
│   ├── api/
│   ├── admin/
│   ├── docs/
│   └── marketing/
├── packages/
│   ├── contracts/
│   └── db/
├── src/                     # Dashboard app source (existing app)
├── .github/workflows/       # CI + deploy workflows
└── pnpm-workspace.yaml
```

## Deployment

GitHub Pages deployment publishes only the root dashboard app (`dist/`), while CI validates the full workspace via `pnpm check:all`.
The marketing, admin, docs, and API workspace apps are intended for separate hosting targets (for example Vercel/Netlify for frontend apps and a Node host/container platform for API).

## License

[MIT](./LICENSE)
