# Testing

## 1) Current State

**No automated tests exist in this repository.** There are no test files, no test framework is installed, and no test scripts are defined in `package.json`.

> This is a significant gap. See CONCERNS.md for the full risk assessment.

## 2) Recommended Testing Stack

Per `.github/copilot-instructions.md` and the project's test-engineer agent:

| Tool                    | Role                                              |
| ----------------------- | ------------------------------------------------- |
| **Vitest**              | Test runner — integrates directly with Vite config |
| **React Testing Library** | Component testing with user-centric queries    |
| **Playwright**          | End-to-end browser automation                     |

### Setup (when adding tests)

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom
```

Add to `vite.config.ts`:

```ts
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./src/test/setup.ts"],
}
```

## 3) Priority Test Areas

In priority order based on current risk:

### High Priority

1. **Zod v4 schema validation** — `src/features/events/model/schemas.ts`
   - Required field validation
   - URL field validation (`z.url()`)
   - Stream provider whitelist
   - Date ordering (startAt < endAt)
   - Status enum values

2. **Stream URL parsing** — `src/features/events/utils/streamUrl.ts`
   - YouTube URL normalization
   - Vimeo URL normalization
   - Rejected non-whitelisted URLs
   - Rejected non-HTTPS URLs

3. **Tenant resolution** — `src/features/tenants/context/TenantContext.tsx`
   - Subdomain extraction from hostname
   - Blocked host fallback (localhost, *.github.io)
   - Unknown slug → error state
   - Known slug → correct tenant loaded

### Medium Priority

4. **Auth flow** — `src/features/auth/context/AuthContext.tsx`
   - Login with correct credentials → isAuthenticated = true
   - Login with wrong credentials → error thrown
   - Logout clears localStorage session
   - Session persists on reload (localStorage read)

5. **Color contrast utility** — `src/lib/colorContrast.ts`
   - WCAG AA pass/fail calculation
   - Edge cases (black on black, white on white)

6. **RequireAuth guard** — redirect to `/login` when unauthenticated

### Lower Priority

7. **EventFormPage** — submit with valid data → event saved
8. **EventListPage** — shows events for current tenant only
9. **EventLandingPage** — renders correct event by slug

## 4) File Organization

When tests are added:

```
src/
└── __tests__/          # Integration / component tests
    ├── features/
    │   ├── events/
    │   └── auth/
    └── lib/
        └── api/

src/features/*/utils/
└── *.test.ts           # Collocated unit tests for utils

tests/                  # Playwright E2E tests (root level)
└── *.spec.ts
```

## 5) Mocking Strategy

- **Mock API:** Already present — `src/lib/api/mock/` with localStorage backend.
- **Tenant context:** Use `TenantProvider` wrapper in tests with a test tenant object.
- **Auth context:** Use `AuthProvider` wrapper or mock `useAuth()` for component tests.
- **localStorage:** Use `vi.stubGlobal('localStorage', ...)` or in-memory mock in Vitest.
- **Routing:** Wrap with `MemoryRouter` for route-dependent component tests.

## 6) Test Writing Guidelines

From `.github/instructions/` (Playwright spec):

- **Locators:** prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors.
- **Assertions:** use web-first auto-retrying assertions (`await expect(...).toHaveText()`).
- **Structure:** group with `test.describe`, use `beforeEach` for shared setup.
- **Steps:** use `test.step()` to group interactions for readability in reports.

## Evidence

- `package.json` — no test dependencies or scripts exist
- `.github/copilot-instructions.md` — recommends Vitest + React Testing Library
- `.github/agents/test-engineer.agent.md` — test generation agent
- `.github/instructions/` — Playwright test writing instructions
