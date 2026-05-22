# Eventudio Live Events Monorepo

This repository is now a **pnpm monorepo** for the Eventudio platform.

## Workspace Apps

- **Dashboard (root app)**: multi-tenant operations dashboard for event teams (`/`)
- **Marketing site**: public landing page (`apps/marketing`)
- **API backend**: lightweight event API service (`apps/api`)
- **Shared contracts**: shared Zod schemas and types (`packages/contracts`)

## Tech Stack

- Node 22 + pnpm workspaces
- Dashboard + Marketing: Vite + React + TypeScript
- API: Node.js + TypeScript
- Shared contracts: TypeScript + Zod

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
| `pnpm --dir apps/api build` | Build API backend |
| `pnpm dev:api` | Build then run API app |
| `pnpm check` | Validate dashboard app |
| `pnpm check:all` | Validate dashboard + all workspace packages |
| `pnpm test` | Run dashboard tests |
| `pnpm test:all` | Run dashboard tests + all workspace tests (if present) |

## Monorepo Structure

```text
.
├── apps/
│   ├── api/
│   └── marketing/
├── packages/
│   └── contracts/
├── src/                     # Dashboard app source (existing app)
├── .github/workflows/       # CI + deploy workflows
└── pnpm-workspace.yaml
```

## Deployment

GitHub Pages deployment still publishes the dashboard app (`dist/`) while CI now validates the full workspace via `pnpm check:all`.

## License

[MIT](./LICENSE)
