# Architecture

## 1) Architectural Classification

**Feature-first client-rendered SPA with a swappable mock data layer.**

The application is a fully client-side React SPA organized around domain features. There is no server component. All data persistence is handled by a mock API backed by `localStorage`, designed to be replaced by a real HTTP API without changing feature code.

The system has three structural concerns:

1. **Multi-tenancy** — all data, branding, and routing is scoped to a tenant resolved from the URL.
2. **Auth gate** — a simple session guard routes unauthenticated users to `/login`.
3. **Event lifecycle** — the core product flow: create event → publish → share public landing page.

## 2) Provider and Request Flow

```
URL Arrives
    │
    ├─ basename="/live-events-dashboard" (Vite + BrowserRouter)
    │
    ▼
AuthProvider (wraps entire app)
    │  • reads localStorage("auth.session")
    │  • exposes isAuthenticated, login(), logout()
    │
    ├─ /login ──────────────────────────→ LoginPage (no auth, no tenant)
    │
    ├─ /t/:tenantSlug/* ─────────────────→ TenantProvider(slug=tenantSlug)
    │                                              │
    └─ /* ───────────────────────────────→ TenantProvider(slug=undefined)
                                                   │ resolveSlugFromHostname()
                                                   │ OR fallback "Eventudio"
                                                   │
                                                   ▼
                                             TenantGate
                                               │  loading → <LoadingSpinner />
                                               │  not found → Error UI
                                               │
                                               ▼
                                          ┌──────────────────────────────────┐
                                          │  RequireAuth → AppShell          │
                                          │  ├─ /              DashboardPage │
                                          │  ├─ /events        EventListPage │
                                          │  ├─ /events/new    EventFormPage │
                                          │  ├─ /events/:id/edit EventFormPage│
                                          │  ├─ /admin         AdminDashboard│
                                          │  └─ /settings      SettingsPage  │
                                          ├──────────────────────────────────┤
                                          │  PublicLayout (no auth)          │
                                          │  └─ /e/:eventSlug  LandingPage   │
                                          └──────────────────────────────────┘
```

## 3) Layer Responsibilities

| Layer                         | Owns                                             | Must NOT own                             |
| ----------------------------- | ------------------------------------------------ | ---------------------------------------- |
| `features/*/model/`           | Zod schemas, TypeScript types, inferred types    | UI, API calls, routing                   |
| `features/*/routes/`          | Page-level route components (default export)     | Direct API calls, business logic         |
| `features/*/context/`         | React context, providers, hooks                  | Schema definitions, non-UI logic         |
| `lib/api/mock/`               | All data reads/writes (localStorage)             | UI rendering, routing decisions          |
| `components/layout/`          | AppShell, PublicLayout — structural wrappers     | Feature-specific logic or state          |
| `components/ui/`              | Pure presentational primitives                   | Feature state, context consumption       |
| `lib/`                        | Cross-cutting utilities (colorContrast, etc.)    | Feature-specific concerns                |

## 4) Tenant Resolution

Tenant resolution is handled in `TenantContext.tsx` before any authenticated content renders:

```
1. If slug prop provided (from /t/:tenantSlug route) → use it directly
2. Else, inspect window.location.hostname:
   - Blocked: localhost, 127.0.0.1, *.github.io → null
   - Subdomain present (parts[0] !== "www") → use it as slug
   - Otherwise → null
3. If null → fall back to "Eventudio"

Resolved slug → getTenantBySlug(slug) → mock API → Tenant | undefined
```

## 5) Auth Flow

```
User visits protected route
    │
    ├─ RequireAuth checks useAuth().isAuthenticated
    │     false → Navigate to /login (state: { from: current path })
    │     true  → render children
    │
LoginPage submits (username, password)
    │
    ├─ AuthContext.login()
    │     username === "admin" && password === "admin"
    │       true  → localStorage.setItem("auth.session", "1") → isAuthenticated = true
    │       false → throws Error (rendered as form error)
    │
    └─ Navigate to location.state.from ?? "/"
```

> ⚠️ **This is a prototype auth implementation.** Credentials are hardcoded in source code.
> Must be replaced with a real auth system before any public deployment.

## 6) Event Data Model

The event model (defined in `src/features/events/model/schemas.ts`) is the core data structure:

```
EventData
├── id: string
├── tenantId: string              # Required for all tenant-scoped operations
├── title: string
├── slug: string                  # URL-safe identifier for public landing page
├── status: "draft" | "published" | "archived"
├── startAt: ISO 8601 datetime
├── endAt: ISO 8601 datetime
├── timezone: string              # IANA timezone (e.g., "America/New_York")
├── venue?: string
├── description?: string
├── bannerUrl?: URL | base64      # Accepts HTTPS URL or base64 data URI
│
├── stream?:
│   ├── provider: "youtube" | "vimeo" | "other"
│   ├── embedUrl: URL             # Validated HTTPS URL
│   ├── isLive?: boolean
│   └── replayUrl?: URL
│
├── resources[]:
│   └── { id, name, url, type }   # Downloadable files and links
│
├── speakers[]:
│   └── { id, name, title, company, headshotUrl?, bio? }
│
└── sessions[]:
    └── { id, title, startAt, endAt, description?, speakerName? }
```

## 7) Reused Patterns

| Pattern             | Where                                               | Why                                               |
| ------------------- | --------------------------------------------------- | ------------------------------------------------- |
| Context + Provider  | `auth/context/`, `tenants/context/`                 | Global state shared across tree without prop drilling |
| Route guard         | `RequireAuth` in `App.tsx`                          | Centralised auth enforcement with return-URL preservation |
| Tenant gate         | `TenantGate` in `App.tsx`                           | Blocks render until tenant resolves; handles unknown tenants |
| Feature barrel      | `features/*/index.ts`                               | Single public API per feature; prevents deep import coupling |
| Schema-first types  | `events/model/schemas.ts`                           | `z.infer<typeof schema>` keeps types and validation in sync |
| Mock adapter        | `lib/api/mock/`                                     | Real API shape behind a fake implementation; swappable |
| Async cancel flag   | `useEffect` in route components                     | Prevents state updates after component unmounts |

## 8) Mock → Real API Migration Path

The mock API is designed for clean replacement:

1. Each function in `lib/api/mock/` (`getEvents`, `saveEvent`, etc.) is a plain async function.
2. Create `lib/api/real/` with identical function signatures calling a real HTTP API.
3. Update `lib/api/index.ts` to export from `real/` instead of `mock/`.
4. Feature code imports from `lib/api/` — no feature files need to change.

## Evidence

- `src/App.tsx` — routing, provider hierarchy, RequireAuth, TenantGate
- `src/features/tenants/context/TenantContext.tsx` — tenant resolution logic
- `src/features/auth/context/AuthContext.tsx` — auth session pattern
- `src/features/events/model/schemas.ts` — full event Zod schema
- `src/lib/api/mock/` — all mock CRUD implementations
- `src/lib/api/mock/data.ts` — seed data (2 tenants, 4 events)
