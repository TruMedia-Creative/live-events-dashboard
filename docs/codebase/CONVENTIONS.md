# Conventions

## 1) Language and Style

- **TypeScript strict mode** — `"strict": true` in `tsconfig.app.json`. No implicit `any`.
- **ESM only** — all imports are ES module syntax. No `require()`.
- **async/await only** — `.then()` chains are not used anywhere in the codebase.
- **Functional components only** — no class components.

## 2) Exports

| Export type          | When to use                                               |
| -------------------- | --------------------------------------------------------- |
| **Default export**   | Route-level page components only (in `features/*/routes/`) |
| **Named export**     | Everything else: utilities, hooks, contexts, components, schemas |

```ts
// src/features/events/routes/EventListPage.tsx — GOOD: default export for route page
export default function EventListPage() { ... }

// src/lib/colorContrast.ts — GOOD: named export for utility
export function getContrastRatio(hex1: string, hex2: string): number { ... }

// src/features/events/model/schemas.ts — GOOD: named export for schema
export const createEventSchema = z.object({ ... });
```

## 3) Import Rules

- **No path aliases.** `@/` is NOT configured. Use relative paths only.
  - `import { useTenant } from "../../tenants/context/TenantContext"` ✅
  - `import { useTenant } from "@/features/tenants/context/TenantContext"` ❌
- **Import from feature index**, not from deep paths inside another feature:
  - `import { EventCard } from "../events"` ✅
  - `import { EventCard } from "../events/components/EventCard"` ❌
- **Mock API imports** go through the barrel: `import { getEvents } from "../../lib/api/mock"`.

## 4) File and Naming Conventions

| Item                    | Convention                              | Example                     |
| ----------------------- | --------------------------------------- | --------------------------- |
| React components        | PascalCase `.tsx`                       | `EventFormPage.tsx`         |
| Utility / helper files  | camelCase `.ts`                         | `colorContrast.ts`          |
| Context files           | PascalCase + `Context` suffix `.tsx`    | `AuthContext.tsx`           |
| Schema files            | `schemas.ts` inside `model/`            | `events/model/schemas.ts`   |
| Type files              | `types.ts` inside `model/`              | `tenants/model/types.ts`    |
| Barrel files            | `index.ts` at feature root              | `features/events/index.ts`  |
| Route page files        | PascalCase + `Page` suffix              | `DashboardPage.tsx`         |
| Route layout files      | PascalCase + `Shell`/`Layout` suffix    | `AppShell.tsx`              |

## 5) Component Conventions

```tsx
// GOOD: named props interface, named export for non-route component
interface EventCardProps {
  event: EventData;
  onEdit?: (id: string) => void;
}

export function EventCard({ event, onEdit }: EventCardProps) {
  return ( ... );
}
```

- Props interfaces are named `<ComponentName>Props`.
- Children components live in `features/<feature>/components/` — not in `components/ui/` unless truly reusable across features.

## 6) Form Patterns

React Hook Form + Zod v4 with manual validation (zodResolver is incompatible with Zod v4):

```tsx
const { register, handleSubmit, setError, formState: { errors } } = useForm<CreateEventInput>();

// Manual validation: parse schema, map errors to fields
const result = createEventSchema.safeParse(data);
if (!result.success) {
  result.error.issues.forEach(issue => {
    setError(issue.path[0] as keyof CreateEventInput, { message: issue.message });
  });
  return;
}
```

Do **not** use `zodResolver` — it is incompatible with Zod v4's `"zod/v4"` subpath.

## 7) Async Patterns

```tsx
// GOOD: cancellation flag prevents state update after unmount
useEffect(() => {
  let cancelled = false;
  async function load() {
    const events = await getEvents(tenant.id);
    if (!cancelled) setEvents(events);
  }
  load();
  return () => { cancelled = true; };
}, [tenant.id]);
```

Always include cleanup for async `useEffect` hooks.

## 8) Error Handling

- Page-level async errors are caught locally in the component and stored in component state.
- Form errors are surfaced via react-hook-form's `setError`.
- Unrecoverable tenant errors (unknown slug) are shown via TenantGate's error UI.
- There is no global error boundary yet — see CONCERNS.md.

## 9) ID Generation

Client-side IDs are generated with the Web Crypto API:

```ts
const id = crypto.randomUUID(); // for resources, speakers, sessions, new events
```

Do not use `Math.random()` or sequential counters for IDs.

## 10) CSS and Styling

- Tailwind v4 utility classes are used directly in JSX.
- No custom CSS files per component — all styling is via utility classes.
- Tenant branding colors (`primaryColor`) are applied via inline `style={{ color: ... }}` or CSS variables — not by generating Tailwind class names at runtime (class names are not generated from dynamic values).
- Dark mode is handled by AppShell via `data-theme` attribute and CSS variables.
- See `.github/instructions/styling.instructions.md` and `.github/instructions/tailwind.instructions.md`.

## Evidence

- `src/features/events/model/schemas.ts` — Zod v4 + named exports
- `src/features/auth/context/AuthContext.tsx` — async cancel flag pattern
- `src/components/ui/`, `src/components/layout/` — naming conventions
- `eslint.config.js` — enforced linting rules
- `.github/instructions/` — styling and Tailwind conventions
