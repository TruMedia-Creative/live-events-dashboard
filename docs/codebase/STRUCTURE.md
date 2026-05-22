# Project Structure

## 1) Repository Root

```
live-events-dashboard/
├── .github/                      # GitHub + Copilot ecosystem
│   ├── agents/                   # 14 custom Copilot agent definitions
│   ├── skills/                   # 200+ reusable Copilot skill modules
│   ├── instructions/             # 12 coding instruction files
│   ├── workflows/                # CI/CD pipelines (ci.yml, deploy.yml)
│   ├── ISSUE_TEMPLATE/           # Bug + feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── copilot-instructions.md   # Global Copilot product context
│
├── docs/                         # Documentation
│   ├── codebase/                 # Codebase knowledge docs (this skill output)
│   │   ├── STACK.md              # Language, runtime, dependencies
│   │   ├── STRUCTURE.md          # This file — directory layout
│   │   ├── ARCHITECTURE.md       # Layers, patterns, data flow
│   │   ├── CONVENTIONS.md        # Naming, formatting, imports
│   │   ├── INTEGRATIONS.md       # External services, auth, CI/CD
│   │   ├── TESTING.md            # Test framework and strategy
│   │   └── CONCERNS.md           # Tech debt, security risks
│   └── architecture.md           # Comprehensive system architecture reference
│
├── public/                       # Static assets served verbatim
│   ├── 404.html                  # GitHub Pages SPA redirect (rewrites to index.html)
│   └── vite.svg                  # Favicon
│
├── src/                          # Application source code
│   ├── main.tsx                  # React root mount (createRoot)
│   ├── App.tsx                   # BrowserRouter, all routes, provider hierarchy
│   ├── index.css                 # Global CSS (Tailwind v4 imports)
│   ├── components/               # Shared components
│   │   ├── layout/               # Structural layout wrappers
│   │   └── ui/                   # Reusable presentational primitives
│   ├── features/                 # Feature-first domain modules
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── settings/
│   │   └── tenants/
│   └── lib/                      # Shared utilities and mock API
│       ├── api/
│       │   └── mock/             # localStorage-backed mock API
│       └── colorContrast.ts      # WCAG contrast ratio helper
│
├── index.html                    # Vite HTML entry
├── vite.config.ts                # Build configuration
├── eslint.config.js              # ESLint flat config
├── postcss.config.js             # Tailwind v4 PostCSS plugin
├── tsconfig.json                 # TypeScript root (composite)
├── tsconfig.app.json             # App source TypeScript config
├── tsconfig.node.json            # Node/Vite TypeScript config
├── package.json                  # Manifest and scripts
├── pnpm-lock.yaml                # pnpm lockfile (authoritative)
├── pnpm-workspace.yaml           # pnpm workspace definition
├── .nvmrc                        # Node version pin (22)
├── ProjectLayout.md              # Human-maintained directory guide
└── README.md                     # Project overview and getting started
```

## 2) Feature Module Layout

Every feature under `src/features/` follows this pattern. Not every folder is required — only add what's needed:

```
src/features/<feature>/
├── components/     # Feature-local UI components (not in shared components/)
├── api/            # API client functions (placeholder for future real backend)
├── model/
│   ├── schemas.ts  # Zod v4 schemas — single source of truth for types + validation
│   ├── types.ts    # TypeScript interfaces (may re-export inferred types from Zod)
│   └── index.ts   # Public model exports
├── routes/
│   ├── <PageName>.tsx  # Default export: route-level page component
│   └── index.ts       # Named re-exports for all route pages
├── context/        # React Context + Provider + hook (e.g., AuthContext, TenantContext)
├── utils/          # Pure utility functions local to this feature
└── index.ts        # Feature barrel — public API surface
```

## 3) Active Features

| Feature     | Folders present              | Purpose                                      |
| ----------- | ---------------------------- | -------------------------------------------- |
| `admin`     | `routes/`                    | Admin dashboard for tenant/event management  |
| `auth`      | `context/`, `routes/`        | Login, session, `RequireAuth` guard          |
| `dashboard` | `routes/`                    | Client-facing overview/home page             |
| `events`    | `model/`, `routes/`, `utils/`| Core feature: event CRUD, landing pages      |
| `settings`  | `routes/`                    | Tenant branding and user preferences         |
| `tenants`   | `context/`, `model/`         | Tenant resolution, context, and types        |

## 4) Shared Components

```
src/components/
├── layout/
│   ├── AppShell.tsx        # Authenticated app chrome (header, nav, dark mode)
│   ├── PublicLayout.tsx    # Minimal wrapper for public event landing pages
│   └── index.ts
└── ui/
    ├── BannerUpload.tsx    # Drag-and-drop image upload (returns base64)
    ├── LoadingSpinner.tsx  # Centered loading indicator
    └── index.ts
```

## 5) Mock API Layer

```
src/lib/api/mock/
├── data.ts       # Seed data: 2 tenants (Eventudio, Bright Lights AV), 4 events
├── events.ts     # CRUD: getEvents(), getEventById(), saveEvent(), deleteEvent()
├── tenants.ts    # Lookups: getTenantBySlug(), getTenantFromHostname()
└── index.ts      # Barrel exports
```

All reads/writes use `localStorage`. Each event is keyed by tenant ID. The mock shape mirrors the intended real API contract.

## 6) Key Entry Points

| File                                            | Role                                                      |
| ----------------------------------------------- | --------------------------------------------------------- |
| `src/main.tsx`                                  | React root mount; calls `createRoot`                      |
| `src/App.tsx`                                   | All routing, provider nesting, RequireAuth, TenantGate    |
| `src/features/auth/context/AuthContext.tsx`     | Session state, `useAuth()` hook, `AuthProvider`           |
| `src/features/tenants/context/TenantContext.tsx`| Tenant resolution from hostname/slug, `TenantProvider`    |
| `src/features/events/model/schemas.ts`          | Zod v4 schemas for all event sub-models                   |
| `src/lib/api/mock/data.ts`                      | Seed data for development                                 |

## Evidence

- `src/App.tsx` — full routing and provider hierarchy
- `src/features/` — confirmed directory contents
- `src/lib/api/mock/data.ts` — seed data structure
- `ProjectLayout.md` — human-maintained complement to this file
