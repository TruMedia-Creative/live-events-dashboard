# Eventudio — Live Events Dashboard

A multi-tenant event web app for AV production companies.
Clients can create branded event landing pages (livestream + resources) through a self-serve portal.
Admins can manage tenants, clients, events, and publishing.

## Core Features

- **Client dashboard** — create and edit events
- **Event landing pages** — auto-generated public pages with stream embed + resources
- **Stream embeds** — YouTube, Vimeo, or custom providers
- **Resource downloads** — PDFs, slide decks, links
- **Speaker & session management** — per-event speaker bios and session schedules
- **Admin dashboard** — manage tenants, events, and publish state
- **Multi-tenant foundation** — tenant resolved from hostname or `/t/:tenantSlug` route
- **Light / dark theme** — user-selectable with accent color customization

## Tech Stack

| Layer | Tool |
|-------|------|
| Build | [Vite](https://vite.dev) |
| UI | React 19 + TypeScript |
| Routing | React Router v7 |
| Forms | React Hook Form |
| Validation | Zod v4 |
| Styling | Tailwind CSS v4 |
| Deployment | GitHub Pages (SPA via `404.html` redirect) |

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or pnpm

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Multi-Tenant Model

Tenants are resolved in two ways:

1. **Hostname** — `{tenant}.eventudio.local` (or a custom domain)
2. **Route prefix** — `/t/:tenantSlug/*`

Each tenant has its own branding (logo, primary color, font) applied through `TenantContext`.

## Project Layout

See **[ProjectLayout.md](./ProjectLayout.md)** for a detailed explanation of the directory structure, feature modules, and how everything connects.

## Deployment

The app is deployed to GitHub Pages via a GitHub Actions workflow (`.github/workflows/deploy.yml`). A `public/404.html` file redirects unknown routes to `index.html` to support client-side routing.

## License

[MIT](./LICENSE)