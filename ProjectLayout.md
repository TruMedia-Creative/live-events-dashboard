# Project Layout

This document explains the directory structure of the Eventudio Live Events Dashboard, where everything lives, and how the pieces fit together.

## Top-Level Files

| File | Purpose |
|------|---------|
| `index.html` | Vite entry HTML — includes SPA redirect script for GitHub Pages |
| `vite.config.ts` | Vite configuration (base path, React SWC plugin) |
| `tsconfig.json` | Root TypeScript config (references app + node configs) |
| `tsconfig.app.json` | TypeScript config for the app source (`src/`) |
| `tsconfig.node.json` | TypeScript config for Node-side files (vite config, etc.) |
| `eslint.config.js` | ESLint flat config with React hooks and refresh plugins |
| `postcss.config.js` | PostCSS config (Tailwind CSS + Autoprefixer) |
| `package.json` | Dependencies and scripts |
| `pnpm-lock.yaml` | pnpm lock file |
| `pnpm-workspace.yaml` | pnpm workspace settings (built dependency allowlist) |

## Directory Structure

```
src/
├── main.tsx                  # React entry point (createRoot)
├── App.tsx                   # Router setup, tenant resolution, auth gates
├── index.css                 # Global styles (Tailwind imports)
│
├── components/               # Shared, reusable UI components
│   ├── layout/
│   │   ├── AppShell.tsx      # Authenticated app chrome (header, nav, theme)
│   │   ├── PublicLayout.tsx   # Layout wrapper for public event pages
│   │   └── index.ts          # Barrel exports
│   └── ui/
│       ├── BannerUpload.tsx   # Drag-and-drop image upload (base64)
│       ├── LoadingSpinner.tsx  # Loading indicator
│       └── index.ts           # Barrel exports
│
├── features/                 # Feature-first modules
│   ├── auth/                 # Authentication
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # AuthProvider + useAuth hook
│   │   ├── routes/
│   │   │   └── LoginPage.tsx    # Login form page
│   │   └── index.ts             # Public exports
│   │
│   ├── tenants/              # Multi-tenant support
│   │   ├── context/
│   │   │   ├── TenantContext.tsx      # TenantProvider component
│   │   │   ├── tenantContextValue.ts  # Context value type + createContext
│   │   │   ├── useTenant.ts           # useTenant() hook
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── types.ts       # Tenant, TenantBranding types
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── events/               # Event management (core feature)
│   │   ├── model/
│   │   │   ├── types.ts       # Event, EventResource, Speaker, Session types
│   │   │   ├── schemas.ts     # Zod v4 validation schemas
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── EventListPage.tsx      # List all events for the tenant
│   │   │   ├── EventFormPage.tsx      # Create / edit event form
│   │   │   ├── EventLandingPage.tsx   # Public event page (stream + resources)
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── streamUrl.ts   # URL validation (HTTPS, stream provider whitelist)
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── dashboard/            # Client dashboard
│   │   ├── routes/
│   │   │   ├── DashboardPage.tsx  # Overview / home page
│   │   │   └── index.ts
│   │   └── (no model — uses events data)
│   │
│   ├── admin/                # Admin dashboard
│   │   ├── routes/
│   │   │   ├── AdminDashboardPage.tsx  # Tenant + event management
│   │   │   └── index.ts
│   │   └── (no model — uses tenants + events data)
│   │
│   └── settings/             # User settings
│       ├── routes/
│       │   ├── SettingsPage.tsx  # Theme + accent color settings
│       │   └── index.ts
│       └── (no model)
│
├── lib/                      # Shared utilities and services
│   ├── api/
│   │   └── mock/
│   │       ├── data.ts        # Seed data (tenants, events)
│   │       ├── events.ts      # Mock event CRUD (localStorage-backed)
│   │       ├── tenants.ts     # Mock tenant lookup
│   │       └── index.ts
│   └── colorContrast.ts      # WCAG contrast ratio helper
│
public/
├── 404.html                  # GitHub Pages SPA redirect
└── vite.svg                  # Favicon

docs/
└── architecture.md           # High-level architecture notes
```

## Feature Module Convention

Each feature under `src/features/` follows this structure where applicable:

| Folder | Contents |
|--------|----------|
| `model/` | TypeScript types and Zod schemas |
| `routes/` | Route-level page components (default exports) |
| `context/` | React context providers and hooks |
| `utils/` | Pure utility functions |
| `components/` | Feature-specific UI components (when needed) |
| `api/` | API call functions (when backend exists) |
| `index.ts` | Barrel file re-exporting the public API |

Not every feature needs all folders — only add what's used.

## Routing

Routes are defined in `src/App.tsx`:

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/login` | `LoginPage` | No | Login form |
| `/t/:tenantSlug/*` | Tenant routes | — | Tenant resolved from URL slug |
| `/` | `DashboardPage` | Yes | Client dashboard home |
| `/events` | `EventListPage` | Yes | List events |
| `/events/new` | `EventFormPage` | Yes | Create new event |
| `/events/:eventId/edit` | `EventFormPage` | Yes | Edit existing event |
| `/admin` | `AdminDashboardPage` | Yes | Admin panel |
| `/settings` | `SettingsPage` | Yes | Theme & preferences |
| `/e/:eventSlug` | `EventLandingPage` | No | Public event page |

## Data Layer

The app currently uses a **mock API** layer (`src/lib/api/mock/`) backed by `localStorage`. This simulates CRUD operations so the UI can be developed independently of a backend.

- `data.ts` — seed tenants and events
- `events.ts` — `getEvents()`, `getEventById()`, `saveEvent()`, `deleteEvent()`
- `tenants.ts` — `getTenantBySlug()`, `getTenantFromHostname()`

The mock layer is designed to be swapped for a real API by replacing the implementations behind the same interfaces.

## Styling

- **Tailwind CSS v4** is used for all styling
- Dark mode is implemented via a `theme` state in `AppShell` and passed through `useOutletContext`
- Tenant branding (primary color) is applied as inline styles after WCAG contrast checking

## Key Patterns

- **Zod v4 validation**: Form data is validated with `safeParse()` + manual `setError()` instead of `zodResolver` (due to Zod v4 compatibility)
- **URL security**: Stream embed URLs and banner URLs are validated against an HTTPS whitelist before rendering
- **Collection IDs**: Resources, speakers, and sessions use `crypto.randomUUID()` for client-side IDs
- **Async cleanup**: `useEffect` hooks use cancellation flags (`let cancelled = false`) to prevent state updates after unmount
