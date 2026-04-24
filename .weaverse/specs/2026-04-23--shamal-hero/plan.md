# Plan — Shamal Hero Section

## Files touched

- `app/sections/shamal-hero.tsx` — new
- `app/weaverse/components.ts` — add namespace import + entry in `components` array
- `app/styles/app.css` — add `fade-in-up` keyframe + `--animate-fade-in-up` token
- `public/placeholders/hero-forest.jpg` — new placeholder background image

## Implementation steps

1. **Placeholder image**
   - Download a misty-forest photograph with golden rim light from Unsplash to `public/placeholders/hero-forest.jpg`.

2. **Keyframes** in `app/styles/app.css`
   - Inside the existing `@theme inline` block, add:
     - `--animate-fade-in-up: fade-in-up 900ms cubic-bezier(0.22, 1, 0.36, 1) both;`
     - `@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }`
   - This exposes `animate-fade-in-up` as a Tailwind utility. Per-element stagger delays will use arbitrary `[animation-delay:Nms]` utilities on each animated child.

3. **`app/sections/shamal-hero.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps`, `WeaverseImage` from `@weaverse/hydrogen`; `useEffect`, `useState` from `react`; `Link` from `react-router`; `HandbagIcon` from `@phosphor-icons/react`; `cn` from `~/utils/cn`.
   - Props shape (TypeScript interface, not type alias — matches repo style):
     - `backgroundImage: WeaverseImage | string`
     - `wordmark: string`
     - `dividerSubtitle: string`
     - `headline: string`
     - `subtext: string`
     - `primaryCtaText: string`
     - `primaryCtaLink: string`
     - `secondaryCtaText: string`
     - `secondaryCtaLink: string`
     - `teaserText: string`
     - `showTeaser: boolean`
     - `ref: React.Ref<HTMLElement>` (React 19 pattern)
     - extends `HydrogenComponentProps`
   - Default export is a function declaration `ShamalHero(props)` — named defaults allowed on Weaverse sections per CLAUDE.md.
   - Destructure props, spread `{...rest}` on root `<section>`.
   - Inner structure:
     - `<nav>` — fixed/absolute inside hero, transparent until scroll > 50px (inline `useEffect` scroll listener setting local `scrolled` state). Renders SHAMAL wordmark + nav links + `HandbagIcon`.
     - Hero wrapper: `<div className="relative min-h-screen w-full overflow-hidden bg-shamal-black">`. Inline `style={{ backgroundImage: \`url(${imageUrl})\` }}` on a positioned child `<div>` (only place an inline style is allowed — it's dynamic).
     - Gradient overlay `<div>` with `bg-gradient-to-b from-shamal-black/40 via-shamal-black/30 to-shamal-black`.
     - Centered content `<div>` with `max-w-[640px]` mx-auto, items-center text-center.
     - CTAs in a flex container: `flex-col sm:flex-row gap-3`.
     - Teaser section (conditional on `showTeaser`).
     - Scroll indicator bottom-center `absolute bottom-10 left-1/2 -translate-x-1/2`.
   - Class composition via `cn()`. No inline styles except background image URL.
   - Add `TODO: replace with real Shamal photography` next to the schema default.
   - Export `schema` via `createSchema`, grouped: Background / Brand / Copy / Primary CTA / Secondary CTA / Teaser. `type: "switch"` for `showTeaser` (Weaverse Pilot convention).

4. **Register** in `app/weaverse/components.ts`
   - Namespace import: `import * as ShamalHero from "~/sections/shamal-hero";`
   - Push `ShamalHero` into the exported `components` array.

5. **Typecheck**
   - `npm run typecheck`. Fix anything that surfaces.

## Out of scope

- Story, voyage scenes, discovery, shop grid, journal, waitlist modal, footer — all deferred.
- Extracting nav into a shared header — later task.
- Real product photography — placeholder only for now.
