# Integrations

## 1) External APIs and Services

**Currently: None.** The application has no live backend integrations. All data is read from and written to `localStorage` via the mock API layer at `src/lib/api/mock/`.

When a real backend is added, the functions in `src/lib/api/mock/` should be mirrored in `src/lib/api/real/` with identical signatures.

## 2) Storage

| Storage         | Used for                                         | Files involved                    |
| --------------- | ------------------------------------------------ | --------------------------------- |
| `localStorage`  | Auth session (`auth.session` key)                | `AuthContext.tsx`                 |
| `localStorage`  | Event data (keyed by tenant + event ID)          | `lib/api/mock/events.ts`          |
| `localStorage`  | Tenant data (seed loaded on first run)           | `lib/api/mock/tenants.ts`         |

Session key constant: `SESSION_KEY = "auth.session"` in `AuthContext.tsx`.

## 3) Authentication

| Aspect               | Current state (prototype)                                   |
| -------------------- | ----------------------------------------------------------- |
| Mechanism            | Hardcoded credentials: `admin` / `admin`                    |
| Session persistence  | `localStorage.setItem("auth.session", "1")`                 |
| Token type           | None — boolean flag only                                    |
| RBAC / roles         | None — single `isAuthenticated` boolean                     |
| Logout               | `localStorage.removeItem("auth.session")`                   |

> ⚠️ **Must be replaced** before any public or production deployment.
> Planned replacement: JWT-based auth with a real backend.
> See CONCERNS.md for the security impact.

## 4) Tenant Resolution

Tenant data is loaded from mock seed data (`data.ts`) and resolved on every page load:

| Resolution method       | Trigger                                              |
| ----------------------- | ---------------------------------------------------- |
| Hostname subdomain      | `*.eventudio.local` or custom domain (non-blocked)   |
| Path prefix             | `/t/:tenantSlug/*` routes                            |
| Fallback                | Always `"Eventudio"` when no other signal found      |
| Blocked hosts           | `localhost`, `127.0.0.1`, `*.github.io` → fallback   |

## 5) CI/CD Pipelines

| Workflow      | File                             | Trigger                  | Steps                                       |
| ------------- | -------------------------------- | ------------------------ | ------------------------------------------- |
| CI            | `.github/workflows/ci.yml`       | PRs to `main`            | `pnpm check` (lint + typecheck + build)     |
| Deploy        | `.github/workflows/deploy.yml`   | Push to `main` / manual  | `pnpm check` → build → GitHub Pages deploy  |

- GitHub Pages serves the built output from `dist/`.
- The base path `"/live-events-dashboard"` is configured in both `vite.config.ts` and the `BrowserRouter` `basename` prop.
- `public/404.html` rewrites all 404s to `index.html` to support client-side routing on GitHub Pages.

## 6) Copilot and Agent Ecosystem

The `.github/` directory contains a full Copilot coding assistant ecosystem:

| Asset type              | Location               | Count | Purpose                                    |
| ----------------------- | ---------------------- | ----- | ------------------------------------------ |
| Agent definitions       | `.github/agents/`      | 14    | Custom Copilot agents with specialized roles |
| Skill modules           | `.github/skills/`      | 200+  | Reusable task automation skill templates   |
| Instruction files       | `.github/instructions/`| 12    | Per-file-type coding and styling standards |
| Global instructions     | `.github/copilot-instructions.md` | 1 | Product context, tech constraints, vision |

Key agents: `architect`, `implementer`, `reviewer`, `critic`, `frontend-reviewer`, `devops-engineer`, `debugger`, `product-strategist`, `ui-engineer`, `test-engineer`, and more.

See `docs/AGENTS.md` for the full agent and skill reference.

## 7) Stream Embed Providers

The stream embed URL for public event landing pages is validated against a whitelist in `src/features/events/utils/streamUrl.ts`:

- Allowed providers: `youtube.com`, `youtu.be`, `vimeo.com`
- Provider `"other"` allows any HTTPS URL (user-provided)
- URL sanitization prevents arbitrary iframe injection

## 8) Image / Banner Uploads

Event banners are stored as base64 data URIs or validated HTTPS URLs (Zod `z.url()`). No CDN or object storage is used. Large base64 strings are stored directly in localStorage.

> ⚠️ This has a practical size limit — localStorage has a ~5MB quota per origin. See CONCERNS.md.

## 9) Future Integration Targets

| Integration             | Notes                                                     |
| ----------------------- | --------------------------------------------------------- |
| Real auth backend       | JWT + refresh tokens, RBAC (admin vs. client roles)       |
| REST or GraphQL API     | Replace `lib/api/mock/` with `lib/api/real/`              |
| File / image storage    | S3-compatible CDN instead of base64 localStorage          |
| Email / notifications   | Event reminders or password-protected landing page access |
| Analytics               | Track attendee engagement on public landing pages         |

## Evidence

- `src/features/auth/context/AuthContext.tsx` — localStorage session
- `src/features/tenants/context/TenantContext.tsx` — tenant resolution
- `src/lib/api/mock/` — all mock CRUD functions
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` — CI/CD
- `src/features/events/utils/streamUrl.ts` — stream URL validation
- `src/features/events/model/schemas.ts` — bannerUrl schema (URL or base64)
