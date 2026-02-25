# Copilot Instructions — Eventudio Event Web App

## Product context
This is a multi-tenant event web app for AV production companies (Eventudio and future white-label tenants).
Core flow:
1) Client signs in
2) Client creates/edits an Event via a form
3) App generates a public Event Landing Page with stream embed + resources
4) Admin dashboard manages tenants, clients, events, publish state, and branding

## Non-goals (for now)
- No payments/ticketing
- No complex chat/Q&A (embed-only if needed)
- No heavy back-end assumptions unless explicitly requested

## Tech constraints
- Vite + React + TypeScript
- React Router for routing
- Zod for validation
- Prefer composition over inheritance
- Keep modules local-first: clean boundaries so backend can be swapped later

## Architecture rules
- Use feature-first modules under src/features/*
- Keep shared utilities in src/lib/*
- Keep pure UI components in src/components/ui/*
- Each feature should have:
  - components/
  - api/
  - model/ (types + zod schemas)
  - routes/ (route-level pages)
  - index.ts exports

## Multi-tenant model (assume)
- Tenant resolved by hostname or path prefix:
  - hostname: {tenant}.Eventudio.local OR custom domain
  - fallback: /t/:tenantSlug
- All tenant-scoped API calls must include tenantId/tenantSlug
- Branding is tenant-scoped (logo, colors, fonts, template selection)

## Event model (assume)
- EventStatus: draft | published | archived
- Fields: id, tenantId, title, slug, startAt, endAt, timezone, venue, description
- Stream: provider (youtube|vimeo|other), embedUrl, isLive (optional), replayUrl (optional)
- Resources: array of { id, name, url, type }
- Speakers: array of { name, title, company, headshotUrl?, bio? }

## Coding style
- Prefer small, testable functions and explicit types
- No implicit any
- Use named exports for utilities, default exports for route components only
- Use async/await, never mix with .then chains
- Avoid global state unless necessary; prefer React Query if added later

## Output expectations from Copilot
When generating code:
- Include types + zod schemas
- Include minimal UI scaffolding to demonstrate flow
- Include helpful inline comments only where behavior is non-obvious
- Provide realistic placeholder data for mock APIs when backend not present

## Security + privacy
- Assume events can be public or password-protected (phase later)
- Do not log sensitive data
- Sanitize user-provided URLs for embeds (whitelist providers)

## Testing guidance (optional)
- If tests are requested, use Vitest + React Testing Library
- Focus tests on validation and URL parsing first

## Toolchain + bootstrap
- Node version is pinned in `.nvmrc` (currently `22`). Use `nvm use` or the version from that file.
- pnpm is the primary and CI-supported package manager. npm may work but is not guaranteed; prefer pnpm and do **not** use yarn.
- pnpm is activated via Corepack — never install it globally with npm.
- All commands should be run from the **repo root**.

### Standard agent sequence
```sh
# 1. Install (only needed once, or after lockfile changes)
pnpm bootstrap   # runs: corepack enable && pnpm install --frozen-lockfile

# 2. Validate (lint + typecheck + build)
pnpm check       # runs: pnpm lint && pnpm typecheck && pnpm build
```

### Performance tips
- Skip `pnpm bootstrap` if `node_modules` is already up-to-date (lockfile unchanged).
- Prefer `pnpm lint` / `pnpm typecheck` / `pnpm build` individually when only one check is needed.