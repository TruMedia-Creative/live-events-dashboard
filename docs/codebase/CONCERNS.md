# Known Concerns

## 1) CRITICAL: Hardcoded Authentication Credentials

**Risk:** `HIGH — Blocks production use`

**Location:** `src/features/auth/context/AuthContext.tsx`

The auth system uses a hardcoded username and password directly in TypeScript source code:

```ts
if (username === "admin" && password === "admin") {
  localStorage.setItem("auth.session", "1");
}
```

**Impact:**

- Anyone who can access the deployed application can log in.
- Any developer with repo access can see the credentials.
- No token expiry, no CSRF protection, no secure cookie — session is a plain string in localStorage.
- Session can be forged by setting `localStorage.setItem("auth.session", "1")` in the browser console.
- No roles or RBAC — every authenticated user has full access to all data.

**Resolution path:**

1. Replace `AuthContext.tsx` with a real auth provider (e.g., Supabase Auth, Auth.js, or a custom JWT backend).
2. Use `httpOnly` cookies or short-lived JWTs with refresh tokens.
3. Introduce at minimum two roles: `admin` (all access) and `client` (own events only).
4. Remove hardcoded credentials entirely.

---

## 2) CRITICAL: No Automated Tests

**Risk:** `HIGH — Regression and reliability risk`

**Location:** Entire codebase (`package.json` — no test scripts)

Zero test coverage. No unit tests, no integration tests, no end-to-end tests.

**Impact:**

- Any refactor or new feature can silently break existing behavior.
- Zod v4 schema validation edge cases are untested.
- Stream URL sanitization (security-relevant) is untested.
- Tenant resolution logic is untested.

**Resolution path:**

1. Add Vitest + React Testing Library (see `docs/codebase/TESTING.md` for setup).
2. Start with schema validation tests and stream URL sanitization.
3. Add auth flow and tenant resolution tests.
4. Add Playwright E2E tests for the critical user journeys.

---

## 3) HIGH: All Data in localStorage — No Backend

**Risk:** `HIGH — Not suitable for production or multi-device use`

**Location:** `src/lib/api/mock/`

All event and tenant data is stored in browser `localStorage`. This means:

- Data is **per-browser, per-device** — no sharing across users or sessions.
- Clearing browser storage wipes all events.
- The ~5MB localStorage quota can be exhausted by large base64 banner images.
- No concurrent access, no server-side validation, no audit log.

**Resolution path:**

1. Build `src/lib/api/real/` with the same function signatures as `src/lib/api/mock/`.
2. Swap exports in `src/lib/api/index.ts`.
3. Feature code does not need to change — the mock API was designed for this migration.

---

## 4) HIGH: Base64 Banner Images in localStorage

**Risk:** `HIGH — Storage quota exhaustion`

**Location:** `src/features/events/model/schemas.ts` (bannerUrl field), `src/components/ui/BannerUpload.tsx`

Event banners can be stored as base64-encoded data URIs in localStorage. A single high-resolution image can be 2–5MB. With multiple events, the 5MB localStorage quota per origin will be exhausted, causing silent write failures.

**Resolution path:**

1. Upload banners to an object storage service (S3, Cloudflare R2, Supabase Storage).
2. Store the public URL in the event's `bannerUrl` field instead of base64.
3. Add client-side image compression (e.g., `browser-image-compression`) before upload until CDN is available.

---

## 5) MEDIUM: Zod v4 + zodResolver Incompatibility

**Risk:** `MEDIUM — Developer experience and future regression risk`

**Location:** `src/features/events/routes/EventFormPage.tsx`

`@hookform/resolvers/zod` is **incompatible** with Zod v4's `"zod/v4"` subpath imports. The form uses manual `setError()` calls instead. This is fragile:

- Easy to forget to map a new schema field to a form error.
- Validation error paths from Zod nested schemas require careful manual traversal.
- Any upgrade or refactor of the form must maintain this manual pattern.

**Resolution path:**

- Option A: Wait for `@hookform/resolvers` to officially support Zod v4, then migrate.
- Option B: Write a thin adapter that converts `ZodError` issues to react-hook-form `FieldErrors`.
- Mitigate: add unit tests for form validation to catch silent failures.

---

## 6) MEDIUM: No Global Error Boundary

**Risk:** `MEDIUM — Poor error UX`

**Location:** `src/App.tsx`, `src/main.tsx`

There is no React `ErrorBoundary` wrapping the application. Unhandled render errors will show a blank screen with no user-facing message.

**Resolution path:**

Add an `ErrorBoundary` component at the `App.tsx` root and at `TenantGate` boundaries.

---

## 7) MEDIUM: No Security Scanning or Dependabot

**Risk:** `MEDIUM — Vulnerable dependencies may go undetected`

**Location:** `.github/workflows/` — no Dependabot config, no `SECURITY.md`, no Snyk

**Resolution path:**

1. Add `.github/dependabot.yml` to auto-PR dependency updates.
2. Add `SECURITY.md` with a vulnerability disclosure policy.
3. Consider Snyk or GitHub's built-in dependency scanning.

---

## 8) LOW: No Dark Mode Per-Tenant

**Risk:** `LOW — UX consistency gap`

AppShell implements a dark mode toggle, but tenant branding (`primaryColor`) is not adjusted for dark mode. A tenant's `primaryColor` may have poor contrast on dark backgrounds.

The `src/lib/colorContrast.ts` utility exists but is not fully applied across all tenants in dark mode.

**Resolution path:**

Use `colorContrast.ts` to compute and apply an accessible color variant for dark mode contexts.

---

## 9) LOW: GitHub Pages Only — No Multi-Tenant Subdomain Support in Production

**Risk:** `LOW — Limits real multi-tenant deployment`

GitHub Pages serves from a single domain (`*.github.io`). The subdomain-based tenant resolution (`subdomain.eventudio.com`) cannot work from GitHub Pages. Tenant resolution correctly falls back for `.github.io` hosts, but this means subdomains cannot be used in the current deployment environment.

**Resolution path:**

Deploy to a platform that supports custom domains per tenant (Vercel, Netlify, Cloudflare Pages) when real multi-tenant support is required.

---

## Summary Table

| # | Concern                              | Severity | Blocks Production? |
| - | ------------------------------------ | -------- | ------------------ |
| 1 | Hardcoded auth credentials           | CRITICAL | Yes                |
| 2 | No automated tests                   | CRITICAL | Yes (quality risk) |
| 3 | All data in localStorage             | HIGH     | Yes                |
| 4 | Base64 banners in localStorage       | HIGH     | Yes                |
| 5 | Zod v4 / zodResolver incompatibility | MEDIUM   | No                 |
| 6 | No global error boundary             | MEDIUM   | No                 |
| 7 | No security scanning / Dependabot    | MEDIUM   | No                 |
| 8 | Dark mode tenant branding gap        | LOW      | No                 |
| 9 | GitHub Pages multi-tenant limits     | LOW      | No                 |

## Evidence

- `src/features/auth/context/AuthContext.tsx` — hardcoded credentials
- `package.json` — no test scripts or test dependencies
- `src/lib/api/mock/` — localStorage-only data layer
- `src/features/events/model/schemas.ts` — base64 bannerUrl schema
- `src/features/events/routes/EventFormPage.tsx` — manual setError() workaround
- `.github/workflows/` — no Dependabot or security scanning
