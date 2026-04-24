# Plan — Shamal Story Section

## Files touched

- `app/sections/shamal-story.tsx` — new
- `app/weaverse/components.ts` — add namespace import + entry in `components` array

## Implementation steps

1. **`app/sections/shamal-story.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps` from `@weaverse/hydrogen`; `useEffect`, `useRef`, `useState` from `react`; `Link` from `react-router`; `cn` from `~/utils/cn`.
   - Props shape (TypeScript interface, extends `HydrogenComponentProps`):
     - `ref: React.Ref<HTMLElement>` (React 19 ref-as-prop pattern)
     - `label`, `headline`, `paragraph1`, `paragraph2`
     - `pill1Title`, `pill1Body`, `pill2Title`, `pill2Body`, `pill3Title`, `pill3Body`
     - `ctaText`, `ctaLink`
   - Default export: function declaration `ShamalStory(props)`.
   - Destructure props including `ref`, spread `{...rest}` on root `<section>`.
   - State: `visible` boolean, flipped to `true` by a one-shot `IntersectionObserver` observing an internal `contentRef` at `threshold: 0.15`; observer disconnects after first hit so the reveal is a one-time animation.
   - Helpers:
     - `revealClass()` → returns `"animate-fade-in-up"` when visible, `"opacity-0"` otherwise.
     - `revealStyle(delayMs)` → returns `{ animationDelay: "Nms" }` inline style object. Inline style is acceptable here: the delay is genuinely per-instance dynamic, matching the hero's pattern.
   - Layout:
     - `<section id="story" className="relative w-full bg-shamal-black py-32 text-shamal-white md:py-40">`
     - Inner `<div ref={contentRef} className="mx-auto flex max-w-[860px] flex-col items-center px-6 text-center">`
     - Label (`text-[11px] tracking-[0.4em] text-shamal-gold uppercase`) → `<DiamondDivider />` → headline (`font-cormorant text-5xl md:text-6xl font-light text-shamal-white leading-tight`) → two paragraphs in a `max-w-[640px]` column (`font-cabin text-base md:text-lg text-shamal-white-dim leading-relaxed`) → `<DiamondDivider />` → three `<Pillar />`s in a `grid md:grid-cols-3` with `md:border-r md:border-shamal-gold/30` on the first two → `<DiamondDivider />` → ghost CTA `<Link>` (`border border-shamal-gold text-shamal-gold px-10 py-4 text-xs tracking-[0.28em] uppercase hover:bg-shamal-gold/10`).
     - Each animated child gets `className={cn("...base...", revealClass())}` and `style={revealStyle(Nms)}`. Stagger: 0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500.
   - Local components in the same file:
     - `DiamondDivider` — two `h-px w-24` gold-gradient lines flanking a `◆` glyph.
     - `Pillar({ icon, title, body, className, style })` — icon in gold, uppercase tracked title, dim body.
   - Inline SVG icons (no external dependency):
     - `HandIcon` — four-finger hand outline, 1px stroke.
     - `LeafIcon` — simple leaf with stem, 1px stroke.
     - `BatchIcon` — square with three horizontal lines (label stack), 1px stroke, sharp corners (no `rx`).
   - Schema via `createSchema({ type: "shamal-story", title: "Shamal Story", settings: [...] })`, grouped: Label / Copy / Pillar 1 / Pillar 2 / Pillar 3 / CTA. Defaults hard-coded from the prompt.

2. **Register** in `app/weaverse/components.ts`
   - Add `import * as ShamalStory from "~/sections/shamal-story";` directly after the existing `ShamalHero` import.
   - Add `ShamalStory,` to the `components` array directly after `ShamalHero,`.

3. **Typecheck**
   - `npm run typecheck` — passed clean.

## Out of scope

- Adding a `shamal-story` instance to the INDEX page in Weaverse Studio. The section is registered and available in the Studio's insert menu; placement is done by whoever edits the homepage in Studio.
- Voyage scenes, discovery, shop grid, journal, waitlist, footer sections — later tasks.
- Extracting `DiamondDivider` into a shared component. Revisit once a second section needs it.
