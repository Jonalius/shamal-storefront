# Plan — Shamal Voyage Section

## Files touched

- `app/sections/shamal-voyage.tsx` — new
- `app/styles/app.css` — add `@keyframes bottle-float` + `--animate-bottle-float`
- `app/weaverse/components.ts` — namespace import + entry in `components` array

## Implementation steps

1. **`app/styles/app.css`**
   - Inside the existing `@theme` block, add:
     - `--animate-bottle-float: bottle-float 3s ease-in-out infinite alternate;`
     - `@keyframes bottle-float { 0% { transform: translateY(-12px); } 100% { transform: translateY(12px); } }`
   - Tailwind v4 exposes this as the `animate-bottle-float` utility automatically.

2. **`app/sections/shamal-voyage.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps`, `WeaverseImage` from `@weaverse/hydrogen`; `useEffect`, `useRef`, `useState` from `react`; `Link` from `react-router`; `cn` from `~/utils/cn`.
   - Props (extends `HydrogenComponentProps`):
     - `ref: React.Ref<HTMLElement>`
     - `backgroundImage: WeaverseImage | string`
     - `bottleImage: WeaverseImage | string`
     - `momentLabel`, `voyageName`, `voyageSubtitle`, `storyText`
     - `topNotes`, `heartNotes`, `baseNotes` (comma-separated strings)
     - `price`, `edition`
     - `ctaText`, `ctaLink`
     - `waitingCount`, `showSocialProof: boolean`
   - Default export function `ShamalVoyage(props)`.
   - Destructure all props including `ref`; spread `{...rest}` on root `<section>`.
   - Local state:
     - `visible` — flipped by one-shot `IntersectionObserver` on an internal `contentRef`, `threshold: 0.15`. Observer disconnects after first hit.
     - `notesOpen` — controls the expandable notes panel.
   - Helpers:
     - `revealClass()` — `"animate-fade-in-up"` when visible, else `"opacity-0"`.
     - `revealStyle(ms)` — `{ animationDelay: "Nms" }`.
     - `parseNotes(str)` — `str.split(",").map(s => s.trim()).filter(Boolean)`.
   - Layout:
     - `<section ref={ref} {...rest} className="relative min-h-screen w-full overflow-hidden bg-shamal-black text-shamal-white">`
     - Absolute background `<div>` with `backgroundImage: url(...)` and `bg-cover bg-center`.
     - Absolute overlay `<div>` with `bg-gradient-to-r from-shamal-black/80 via-shamal-black/40 to-transparent`.
     - Relative content grid: `mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32`.
     - **Left column** (`contentRef` lives here for IntersectionObserver):
       - Moment label, voyage name (`font-cormorant text-6xl md:text-7xl font-light leading-[1.05]`), italic subtitle, story paragraph (`max-w-md`), notes panel, price row, CTA, social proof. Each with staggered `revealStyle` delays (0, 120, 240, 360, 480, 600, 720, 840).
     - **Notes panel**:
       - Toggle `<button type="button" onClick={() => setNotesOpen(o => !o)}>` with `+` / `–` prefix and fixed-width span so layout doesn't jump.
       - Panel wrapper: `<div className={cn("grid overflow-hidden transition-[max-height] duration-500 ease-out", notesOpen ? "max-h-[400px]" : "max-h-0")}>` — inner padding top so the first row doesn't touch the button.
       - Inner grid `grid-cols-3 gap-6`; each column has a gold label (`text-[10px] tracking-[0.3em] text-shamal-gold uppercase`) and a `<ul>` of notes in `text-shamal-white-dim`.
     - **Price row**: `30ML` (small tracked), price (`font-cormorant text-4xl text-shamal-white`), italic edition text.
     - **CTA**: `<Link>` with `bg-shamal-gold text-shamal-black px-8 py-4 text-xs tracking-[0.28em] uppercase`.
     - **Social proof**: conditional on `showSocialProof`, renders `★ {waitingCount} people are waiting for this voyage`.
     - **Right column (bottle)**:
       - Outer flex wrapper centers the bottle.
       - Inner `relative` container with a soft radial glow `<div>` absolutely positioned behind: `bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_70%)]`.
       - `<img>` with `animate-bottle-float` class, `will-change-transform`, `max-h-[70vh]`, responsive sizing.
   - **Scroll indicator** — duplicated from hero: absolute bottom-center "SCROLL" label + gold gradient vertical line. Pointer-events-none.
   - Schema via `createSchema({ type: "shamal-voyage", title: "Shamal Voyage", settings: [...] })`, grouped: Background / Voyage / Notes / Bottle / Pricing / CTA / Social proof. Defaults from the prompt.

3. **Register** in `app/weaverse/components.ts`
   - Add `import * as ShamalVoyage from "~/sections/shamal-voyage";` near the other Shamal imports.
   - Add `ShamalVoyage,` to the `components` array near the other Shamal entries.

4. **Typecheck** — `npm run typecheck`.

## Out of scope

- Placing three voyage instances on the homepage via Weaverse Studio.
- Per-voyage-product data fetch (storyText/notes/prices are all schema inputs; product linkage is via `ctaLink`).
- Replacing `<img>` with Hydrogen's `Image` component — bottle image may be a raw URL or a Weaverse upload and a plain `<img>` keeps it simple; revisit if LCP requires srcset.
