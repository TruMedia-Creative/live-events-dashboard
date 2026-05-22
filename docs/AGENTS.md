# Agent & Copilot Ecosystem

This repo ships a full GitHub Copilot CLI toolkit in `.github/`. This document is the reference for how to use it.

---

## Global Instructions

`.github/copilot-instructions.md` is automatically read by all Copilot agents. It establishes:

- Product context (multi-tenant AV event app for Eventudio)
- Non-goals (no payments, no complex chat)
- Tech constraints (Vite, React, TypeScript, Zod, pnpm)
- Architecture rules (feature-first modules, shared lib/, multi-tenant model)
- Event and Tenant data models
- Output expectations (types + Zod schemas, realistic mocks, minimal comments)
- Bootstrap sequence (`pnpm bootstrap`, `pnpm check`)

---

## Specialized Agents

14 custom agents live in `.github/agents/`. Each is a Markdown file with a system prompt that Copilot uses as a role. Invoke them from the Copilot Chat panel in VS Code by typing `@agent-name`.

| Agent                    | Best Used For                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `architect`              | Architecture planning, implementation planning, API design, data models, file impact analysis |
| `critic`                 | Pre-mortem analysis, hidden risk discovery, assumption stress-testing, scope-creep detection |
| `debugger`               | Diagnosing runtime bugs, stack traces, build failures, broken tests                    |
| `devops-engineer`        | CI/CD workflows, GitHub Actions hardening, deployment, environment config              |
| `frontend-reviewer`      | PR review: component correctness, accessibility, performance, framework-pattern compliance |
| `implementer`            | Focused implementation after a plan is  minimal, coherent, validated changes |approved 
| `nextjs-engineer`        | Next.js full-stack (App Router, server/client, server  not current stack     |actions) 
| `nuxt-engineer`          | Nuxt + Vue full- not current stack                                              |stack 
| `performance-engineer`   | Core Web Vitals diagnosis, rendering, caching, bundle size, runtime bottlenecks        |
| `product-strategist`     | MVP scoping, feature prioritization, user-story framing, acceptance criteria           |
| `repo-scaffolder`        | New project setup, baseline structure, CI, initial docs, agent toolkit assembly        |
| `reviewer`               | Production-readiness review of code, diffs, PRs,  severity-ordered findings |architecture 
| `test-engineer`          | Unit, integration, and Playwright test design and generation                           |
| `ui-engineer`            | Frontend UI implementation, responsive layout, design-system alignment, accessibility  |

### Example Invocations

```
# Plan a new feature before coding
@architect plan how to add password-protected events

# Stress-test a design before committing
@critic what could go wrong with our localStorage-based mock API?

# Review a PR for production readiness
@reviewer review the current diff for security and correctness

# Implement after a plan is approved
@implementer implement the plan in plan.md
```

---

## Skills

200+ reusable skill packages live in `.github/skills/`. A skill is invoked by the Copilot CLI agent framework. Key skills for this project:

| Skill                              | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
 7 docs in `docs/codebase/`            |
| `create-readme`                    | Generates a new project README from source analysis              |
| `create-architectural-decision-record` | Creates ADRs for significant decisions                       |
| `breakdown-epic-arch`              | Decomposes a feature epic into architecture tasks                 |
| `breakdown-feature-implementation` | Creates an implementation task breakdown                         |
| `breakdown-epic-pm`                | PM-style breakdown: stories, acceptance criteria                  |
| `playwright-automation-fill-in-form` | Generates Playwright E2E tests for forms                       |
| `pytest-coverage`                  | Test coverage analysis and reporting                              |
| `architecture-blueprint-generator` | Full project architecture diagrams + documentation               |
| `create-implementation-plan`       | Detailed, file-level implementation plan from a specification     |
| `create-specification`             | Writes a technical specification from user requirements           |
| `create-github-issue-feature-from-specification` | Converts a spec into GitHub issues               |

---

## Instruction Files

12 instruction files in `.github/instructions/` are auto-attached to Copilot context when file patterns match. They enforce code generation standards without requiring manual prompting.

| File                             | Applies To                         | Key Rules                                             |
| -------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `tailwind.instructions.md`       | `*.css`, `*.tsx`, `*.ts`, Vite config | Tailwind CSS v4 PostCSS setup, no `@tailwindcss/vite` |
| `styling.instructions.md`        | All frontend files                 | Token usage, responsive behavior, accessible design   |
| `frontend.instructions.md`       | `*.tsx`, `*.ts`, `*.vue`           | Component, page, layout, composable standards         |
| `docs.instructions.md`           | All source files + markdown        | Auto-update README when code changes                  |
| `agents.instructions.md`         | `*.agent.md`                       | How to create custom Copilot agent files              |
| `nextjs.instructions.md`         | Next.js projects                   | App Router, server/client, caching (not current stack)|
| `nextjs-tailwind.instructions.md`| Next.js + Tailwind projects        | Combined standards (not current stack)                |
| `nuxt.instructions.md`           | Nuxt/Vue projects                  | Nitro, composables, runtime config (not current stack)|

---

## Recommended Workflows

### Adding a New Feature

1. `@ plan the feature, identify files to change, design data modelarchitect` 
2. `@ stress-test the plan for risks and hidden scopecritic` 
3. `@ implement after plan is approved in `plan.md`implementer` 
4. `@frontend- review the diff for a11y, performance, correctnessreviewer` 
5. `@test- generate tests for validation and key user flowsengineer` 

### Documenting the Codebase

```bash
# Invoke the acquire-codebase-knowledge skill
# This regenerates all 7 docs in docs/codebase/
```

The skill runner will:
1. Run `scripts/scan.py` to collect repo metadata
2. Read all source files and config
3. Overwrite `docs/codebase/STACK.md`, `STRUCTURE.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `INTEGRATIONS.md`, `TESTING.md`, `CONCERNS.md`

### Debugging a Production Issue

```
@debugger I'm seeing [error message] when [user action]. Here's the stack trace: [paste]
```

### Reviewing for Production Readiness

```
@reviewer review the current branch diff for security, correctness, and CWV impact
```

---

## Adding a New Agent

1. Create `.github/agents/{name}.agent.md`
2. Follow the format from `agents.instructions.md`
3. Include: `description`, `tools`, `system` prompt, and `model` recommendation
4. Add it to the table in this file

---

## Codebase Knowledge Base

The `docs/codebase/` directory is maintained by the `acquire-codebase-knowledge` skill:

| File             | Contents                                                         |
| ---------------- | ---------------------------------------------------------------- |
| `STACK.md`       | Tech stack, runtime, commands, Tailwind v4 and Zod v4 notes     |
| `STRUCTURE.md`   | Directory layout, feature module pattern, entry points           |
| `ARCHITECTURE.md`| Provider flow diagrams, layers, tenant/auth/event model          |
| `CONVENTIONS.md` | Naming conventions, exports, imports, form/async patterns        |
| `INTEGRATIONS.md`| Storage, auth, CI/CD, stream embed security, Copilot ecosystem  |
| `TESTING.md`     | Current state (no tests), recommended stack, priority test areas |
| `CONCERNS.md`    | Security risks (hardcoded auth), tech debt, known issues         |

> **Note:** `docs/codebase/.codebase-scan.txt` is machine-generated by `scan.py` and should not be committed. Add it to `.gitignore`.
