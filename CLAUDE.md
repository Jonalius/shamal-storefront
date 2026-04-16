# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Identity

**Shamal** is a Finnish artisan fragrance brand based in Helsinki.
Positioning: *"Where Nordic Silence Meets Eastern Mystery"*

Stack: Shopify Hydrogen (React 19) + Weaverse Pilot theme + Tailwind CSS v4 + Vercel/Oxygen

## Products

| Handle | Name | Tagline | Price |
|--------|------|---------|-------|
| `moment-01-first-voyage` | Moment 01: First Voyage | Autumn forest after rain | €100 |
| `moment-02-winter-voyage` | Moment 02: Winter Voyage | From cold into warmth | €100 |
| `moment-03-oodi-mokille` | Moment 03: Oodi Mökille | Spring's first bloom | €100 |

## Design System

| Token | Value |
|-------|-------|
| Background | `#0d0d0d` |
| Gold accent | `#C9A84C` |
| Text | `#FFFFFF` |
| Subtle text | `rgba(255,255,255,0.55)` |
| Card surface | `#161616` |

**Headings**: Cormorant Garamond (serif)

**Aesthetic**: Dark cinematic editorial luxury — minimal, no clutter. Gold is used sparingly as an accent only, never as a fill or background. Every component should feel intentional and unhurried.

## What NOT to Do

- Do not install new npm packages without confirming with the user first
- Do not use inline styles — use Tailwind classes via `cn()` exclusively
- Do not create new Weaverse section components without a `schema` export
- Do not use `pnpm` — use `npm`
- Do not add routes via the file system — register them in `app/routes.ts`
- Do not use `useMemo` or `useCallback` — React 19 compiler handles optimization
- Do not use barrel exports (`index.ts` re-export files)
- Do not import from `'react-router-dom'` — use `'react-router'`

---

## Technical Architecture

### Stack

Shopify Hydrogen storefront (based on the **Pilot** theme) built with React 19, TypeScript, React Router 7, Tailwind CSS v4, and **Weaverse** (visual page builder). Runs on Node.js 20+. Biome for linting/formatting.

### Commands

```bash
npm run dev          # Dev server on port 3456 (includes GraphQL codegen watch)
npm run build        # Production build (runs codegen first)
npm run typecheck    # TypeScript type checking
npm run codegen      # Regenerate GraphQL types after query/fragment changes
npm run biome        # Lint/format check
npm run biome:fix    # Auto-fix lint issues
npm run format       # Format with Biome
npm run e2e          # Playwright E2E tests
npm run e2e:ui       # Playwright with UI
```

**After modifying any GraphQL query or fragment, always run `npm run codegen`.**

Dev tools available at runtime:
- GraphiQL: `http://localhost:3456/graphiql`
- Network inspector: `http://localhost:3456/debug-network`

### Routing

Routes are defined **programmatically** in `app/routes.ts` using `route()`, `index()`, `layout()`, and `prefix()` from `@react-router/dev/routes`, wrapped by Hydrogen's `hydrogenRoutes`. This is **not** file-based routing. All user-facing routes are nested under the `:locale?` prefix for i18n.

### Data Loading

Every page route loads Weaverse data alongside Shopify GraphQL queries using `Promise.all()`:

```typescript
const [{ product }, weaverseData] = await Promise.all([
  storefront.query(PRODUCT_QUERY, { variables }),
  weaverse.loadPage({ type: "PRODUCT", handle }),
]);
```

### Weaverse Sections

`/app/sections/` contains Weaverse visual-builder sections. Each section file exports:

1. `default` — React component (function declaration, not arrow)
2. `schema` — editor config via `createSchema()`
3. `loader` (optional) — server-side data fetch

**Every new section must be registered** in `app/weaverse/components.ts` using a namespace import:

```typescript
import * as MySection from "~/sections/my-section";
```

Spread `{...rest}` on the section's root element (required for Weaverse Studio). Render `{children}` if the section accepts child components.

### GraphQL

- Fragments: `app/graphql/fragments.ts`
- Queries: `app/graphql/queries.ts`
- Two codegen outputs:
  - `storefront-api.generated.d.ts` — all routes
  - `customer-account-api.generated.d.ts` — **only** `*.account*.{ts,tsx,js,jsx}` files

### Key Integrations

- **Judge.me** reviews: `app/utils/judgeme.ts`
- **Combined Listings** (product grouping): `app/utils/combined-listings.ts`
- **Radix UI**: accessible primitives (accordion, dialog, dropdown, etc.)
- **Zustand**: lightweight state management
- **Swiper**: carousels/slideshows
- **Customer Account API**: OAuth-based, only used in account-named files

### Code Conventions

- `const` + `ALL_CAPS` for constants; `let` for everything else
- Function declarations (`function foo()`) not arrow expressions — **except** route `meta`/`loader`/`action` exports
- Named exports only — **exceptions**: route components, Weaverse sections, Weaverse-registered components
- Files: `kebab-case.tsx` | Components: `PascalCase` | Functions: `camelCase` | Constants: `UPPER_SNAKE_CASE`
- Use `cn()` from `~/utils/cn` for all dynamic classes; `cva` for component variants
- Biome auto-sorts Tailwind classes inside `cn()`, `clsx()`, and `cva()` calls

### Spec-Driven Development (SDD)

**Every feature must have a spec folder** at `.weaverse/specs/` before writing code.

Folder naming: `{YYYY-MM-DD}--{kebab-case-title}` (e.g. `2026-04-16--hero-redesign`)

Each spec folder contains:
- `README.md` (required) — status, owner, created date, **exact original prompt** (never paraphrase), 2–3 sentence summary
- `plan.md` (required) — implementation plan under 500 lines, must list all files/folders touched
- `work-logs.md` (optional) — append-only timeline of work done

When working on an existing feature, read its spec first and update it if scope or status changes.

### Common Pitfalls

- Run `npm run codegen` after any GraphQL change
- Use `routeHeaders` export for cache control in route files
- Customer Account API queries only in `*.account*.{ts,tsx}` files
