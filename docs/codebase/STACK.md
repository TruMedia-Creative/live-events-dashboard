# Technology Stack

## 1) Runtime Summary

| Area                | Value                    | Evidence                          |
| ------------------- | ------------------------ | --------------------------------- |
| Primary language    | TypeScript ~5.9          | `tsconfig.json`                   |
| Runtime + version   | Node.js 22               | `.nvmrc`                          |
| Package manager     | pnpm 10.0.0 via Corepack | `package.json` (`packageManager`) |
| Module/build system | Vite 7.3.1               | `vite.config.ts`                  |
| Deployment target   | GitHub Pages (static SPA)| `.github/workflows/deploy.yml`    |

## 2) Production Dependencies

| Dependency            | Version  | Role                                          |
| --------------------- | -------- | --------------------------------------------- |
| `react`               | ^19.2    | UI component model and rendering              |
| `react-dom`           | ^19.2    | DOM reconciler                                |
| `react-router-dom`    | ^7.13    | Client-side routing, nested routes, guards    |
| `react-hook-form`     | ^7.71    | Form state, submission, and manual validation |
| `zod`                 | ^4.3     | Schema validation and type inference (v4 API) |
| `tailwindcss`         | ^4.2     | Utility-first CSS styling                     |

## 3) Dev / Build Toolchain

| Tool                      | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `@vitejs/plugin-react-swc`| Fast JSX transform via SWC (replaces Babel)       |
| `@tailwindcss/postcss`    | Tailwind v4 PostCSS plugin (NOT `@tailwindcss/vite`) |
| `typescript`              | Static type checking                              |
| `eslint`                  | Linting (`eslint.config.js`)                      |
| `eslint-plugin-react-hooks`| React hooks rule enforcement                     |
| `eslint-plugin-react-refresh`| Vite HMR compatibility checks                  |
| `typescript-eslint`       | TypeScript-aware ESLint rules                     |
| `autoprefixer`            | CSS vendor prefix injection (via PostCSS)         |

## 4) Key Commands

```bash
# Bootstrap (first time or after lockfile changes)
pnpm bootstrap       # corepack enable && pnpm install --frozen-lockfile

# Validate everything (lint + typecheck + build)
pnpm check

# Dev server
pnpm dev

# Production build
pnpm build

# Lint only
pnpm lint

# Typecheck only
pnpm typecheck
```

> **Note:** pnpm is the only supported package manager. npm may work but is not guaranteed.
> Corepack must be enabled before running pnpm: `corepack enable`.

## 5) Environment Configuration

- No `.env` file is required for local development (the mock API uses localStorage).
- `VITE_` env vars can be added to `.env.local` when a real backend is introduced.
- The Vite `base` path is `"/live-events-dashboard"` (set in `vite.config.ts`).
- `BrowserRouter` uses `basename="/live-events-dashboard"` to match the GitHub Pages deploy path.

## 6) Tailwind v4 Notes

Tailwind v4 uses a **PostCSS plugin** integration, not the Vite plugin:

```js
// postcss.config.js
export default {
  plugins: { "@tailwindcss/postcss": {} }
}
```

The `@tailwindcss/vite` plugin mentioned in some documentation does **not** apply here.
See `.github/instructions/tailwind.instructions.md` for project-specific Tailwind conventions.

## 7) Zod v4 Notes

Zod v4 imports use the `"zod/v4"` subpath to access stable v4 APIs:

```ts
import { z } from "zod/v4";
```

`z.url()` is used instead of `z.string().url()`. The `zodResolver` from `@hookform/resolvers`
is **not compatible** with Zod v4 — forms use manual `setError()` calls instead.

## Evidence

- `package.json` — all dependencies and scripts
- `.nvmrc` — Node 22 pin
- `vite.config.ts` — build configuration
- `postcss.config.js` — Tailwind v4 PostCSS integration
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `src/features/events/model/schemas.ts` — Zod v4 API usage
