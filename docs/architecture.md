# Architecture Reference

> **Quick links:**
> [`docs/codebase/ARCHITECTURE.md`](codebase/ARCHITECTURE. layer diagram, data flow, routing treemd) 
> [`docs/codebase/STACK.md`](codebase/STACK. full dependency inventorymd) 
> [`docs/codebase/CONCERNS.md`](codebase/CONCERNS. security risks and tech debtmd) 

## Overview

Eventudio is a **multi-tenant event management SPA** built with React 19, React Router 7, Zod 4, and Tailwind CSS 4. The application runs entirely in the  there is no backend. All data is stored in `localStorage` via a mock API layer designed to be replaced with a real HTTP API.browser 

**Core architecture concerns:**

1. **Multi- all data, branding, and routing is tenant-scopedtenancy** 
2. **Auth  session guard routes unauthenticated users to `/login`gate** 
 share public landing page

---

## Provider Hierarchy

Every request flows through two nested contexts before rendering any content:

```
BrowserRouter (basename="/live-events-dashboard")
  session state, login(), logout()AuthProvider          
  tenant resolved from hostname or path slugTenantProvider        
  blocks render until tenant resolvedTenantGate            
 AppShell   (protected routes)
 PublicLayout             (public event landing pages)         
```

---

## Routing

```
 LoginPage               (public)
 EventLandingPage        (public, tenant-scoped)
 TenantSlugWrapper       (path-based tenant override)

Protected (RequireAuth):
 DashboardPage
 EventListPage
 EventFormPage
 EventFormPage
 AdminDashboardPage
 SettingsPage
```

---

## Tenant Resolution

```
 use directly
 extract as slug
   Blocked: localhost, 127.0.0.1, *.github.io
 fallback "Eventudio"

 Tenant | undefined
 TenantGate shows error UI
```

**Source:** `src/features/tenants/context/TenantContext.tsx`

---

## Auth Flow

Auth is a **prototype implementation only**. Credentials are hardcoded:

```
username === "admin" && password === "admin"
 localStorage.setItem("auth.session", "1")

RequireAuth checks localStorage on every render
 redirect /login
 render children
```

 Must be replaced with real auth before any production use.> 
> See `docs/codebase/CONCERNS.1.md` 

**Source:** `src/features/auth/context/AuthContext.tsx`

---

## Event Data Model

Defined via Zod v4 schemas in `src/features/events/model/schemas.ts`:

```
EventData
 id, tenantId, title, slug
 status: "draft" | "published" | "archived"
 startAt, endAt (ISO 8601), timezone (IANA)
 venue?, description?, bannerUrl? (URL or base64)

 stream?
 provider: "youtube" | "vimeo" | "other"   
 embedUrl (validated HTTPS URL)   
 isLive?, replayUrl?   

 resources[]  { id, name, url, type }
 speakers[]   { id, name, title, company, headshotUrl?, bio? }
 sessions[]   { id, title, startAt, endAt, description?, speakerName? }
```

---

## Data Layer

All reads and writes go through `src/lib/api/mock/`:

| Function            | Behavior                                          |
| ------------------- | ------------------------------------------------- |
| `getEvents(tid)`    | Returns all events for a tenant from localStorage |
| `getEventById(id)`  | Returns a single event                            |
| `saveEvent(event)`  | Creates or updates (upsert) an event              |
| `deleteEvent(id)`   | Removes an event                                  |
| `getTenantBySlug()` | Looks up tenant from seed data                    |

 feature code is unchanged.

---

## Feature Module Boundaries

Source code is organized into feature-first modules under `src/features/`:

```
src/features/
 auth/      context/, routes/
 events/    model/, routes/, utils/
 tenants/   context/, model/
 admin/     routes/
 dashboard/ routes/
 settings/  routes/
```

**Rule:** Feature code may only import from another feature's `index.ts`  never from deep internal paths.barrel 

---

## Deployment

| Platform     | Method                                                              |
| ------------ | ------------------------------------------------------------------- |
 Pages |
| Base path    | `/live-events-dashboard` (Vite `base` + Router `basename`)          |
| SPA routing  | `public/404.html` rewrites 404s to `index.html`                     |

---

## Security Considerations

| Concern                       | Status                                               |
| ----------------------------- | ---------------------------------------------------- |
| Hardcoded auth   must replace before production        |CRITICAL credentials    | 
| Stream URL whitelist  `streamUrl.ts` validates providers  |Implemented           | 
| Tenant data isolation All mock API calls scoped by `tenantId`           |         | 
| Input validation Zod v4 schemas on all form inputs                 |              | 
| No global error   blank screen on unhandled render error  |Missing boundary      | 
| No Dependabot / security   add `.github/dependabot.yml`            |Missing scan | 

Full details: [`docs/codebase/CONCERNS.md`](codebase/CONCERNS.md)
