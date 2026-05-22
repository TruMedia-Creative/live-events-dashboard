#  Live Events DashboardEventudio 

A **multi-tenant event web app** for AV production companies.
Clients create branded event landing pages (livestream + resources) through a self-serve portal.
Admins manage tenants, clients, events, and publish state.

## Core Features

- **Client  create and manage eventsdashboard** 
- **Event landing  auto-generated public pages with stream embed + resourcespages** 
- **Stream  YouTube, Vimeo, or custom providers (URL-validated)embeds** 
- **Resource  PDFs, slide decks, links attached to eventsdownloads** 
- **Speaker & session  per-event bios and schedulesmanagement** 
- **Admin  multi-tenant event and branding managementdashboard** 
- **Multi-tenant  tenant resolved from hostname subdomain or `/t/:tenantSlug`foundation** 
- **Light / dark  user-selectable with WCAG-checked tenant accent colorstheme** 

## Tech Stack

| Layer      | Tool                                    |
| ---------- | --------------------------------------- |
| Build      | [Vite 7](https://vite.dev) + SWC        |
| UI         | React 19 + TypeScript ~5.9              |
| Routing    | React Router v7                         |
| Forms      | React Hook Form 7                       |
| Validation | Zod v4 (`import { z } from "zod/v4"`)   |
| Styling    | Tailwind CSS v4 (PostCSS plugin)        |
| Deployment | GitHub Pages (SPA via `404.html`)       |

## Quick Start

### Prerequisites

- **Node 22** (pinned in `.nvmrc`)
- **pnpm** via Corepack (do not use npm or yarn)

```bash
# Activate correct Node version
nvm use

# Enable Corepack and install dependencies (run once, or after lockfile changes)
pnpm bootstrap

# Start the dev server
pnpm dev
```

### Available Commands

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `pnpm bootstrap`  | `corepack enable && pnpm install --frozen-lockfile` |
| `pnpm dev`        | Start the Vite dev server                    |
| `pnpm build`      | Type-check and build for production          |
| `pnpm preview`    | Preview the production build locally         |
| `pnpm lint`       | Run ESLint                                   |
| `pnpm typecheck`  | Run TypeScript type checking (`tsc --noEmit`)|
| `pnpm check`      | `pnpm lint && pnpm typecheck && pnpm build`  |

## Project Structure

See **[ProjectLayout.md](./ProjectLayout.md)** for a full directory walkthrough and **[docs/architecture.md](./docs/architecture.md)** for the system architecture reference.

```
src/
 App.tsx             # Router, TenantGate, RequireAuth
 features/           # Feature-first modules
 auth/           # AuthProvider, LoginPage   
 events/         # Event model, CRUD pages, stream validation   
 tenants/        # TenantProvider, tenant model   
 admin/          # Admin dashboard   
 dashboard/      # Client dashboard home   
 settings/       # Theme settings   
 components/         # Shared UI (AppShell, PublicLayout, BannerUpload)
 lib/                # API mock layer, color contrast utils
```

## Multi-Tenant Model

Tenants are resolved in priority order:

1. **Route  `/t/:tenantSlug/*`slug** 
2. **Hostname  `{tenant}.eventudio.local` (blocked for `localhost`, `127.0.0.1`, `*.github.io`)subdomain** 
3. ** "Eventudio" default tenantFallback** 

Each tenant has isolated events and custom branding (`primaryColor`, `logoUrl`, `fontFamily`).

## Development Notes

- **Zod v4 imports:** use `import { z } from "zod/v4"` (not the bare `"zod"` package)
- **No path aliases:** `@/` is not  use relative imports onlyconfigured 
- **Mock API:** all data lives in `localStorage`; swap `src/lib/api/mock/` with `src/lib/api/real/` to connect a real backend
- **No tests yet:** Vitest + React Testing Library is the recommended addition (see `docs/codebase/TESTING.md`)

## Agent & Copilot Ecosystem

This repo ships with a full Copilot CLI toolkit in `.github/`:

| Path                       | Contents                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `.github/agents/`          | 14 specialized agents (architect, ui-engineer, ) |reviewer, 
| `.github/skills/`          | 200+ reusable skills (codebase mapping, )    |scaffolding, 
| `.github/instructions/`    | 12 instruction files (styling, frontend, )  |architecture, 
| `.github/copilot-instructions.md` | Global product context and vision                   |

See **[docs/AGENTS.md](./docs/AGENTS.md)** for a full reference.

## Deployment

The app deploys automatically to GitHub Pages on push to `main`:

1. `.github/workflows/deploy.yml` runs `pnpm check` then `pnpm build`
2. Output is published to the `gh-pages` branch
3. `public/404.html` rewrites 404s to `index.html` for SPA client-side routing
4. Base path: `/live-events-dashboard` (set in `vite.config.ts` and React Router `basename`)

## Roadmap

**Phase 1 ( Mock/Prototype**current) 
-  Multi-tenant routing + branding
-  Event CRUD with full Zod schema validation
-  Public event landing pages with stream embeds
-  Speaker, session, and resource management
-  Dark mode + WCAG-checked accent colors

**Phase  Production Foundation**2 
- [ ] Replace hardcoded auth with real auth (JWT, Supabase, Auth.js)
 `src/lib/api/real/`)
- [ ] Add automated tests (Vitest + Playwright)
- [ ] Upload banners to object storage (S3/R2) instead of base64 localStorage
- [ ] Add Dependabot + security scanning

**Phase  Multi-Tenant Hosting**3 
- [ ] Deploy to platform with custom domain per tenant (Vercel/Cloudflare)
- [ ] Role-based access control (admin vs. client)
- [ ] Password-protected event landing pages

## License

[MIT](./LICENSE)
