# Plan — Shamal Category Grid Section

## Files touched

- `app/sections/shamal-category-grid.tsx` — new
- `app/weaverse/components.ts` — namespace import + entry in `components` array

## Implementation steps

1. **`app/sections/shamal-category-grid.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps`, `WeaverseImage` from `@weaverse/hydrogen`; `useEffect`, `useRef`, `useState` from `react`; `Link` from `react-router`; `cn` from `~/utils/cn`.
   - Props (extends `HydrogenComponentProps`):
     - `ref: React.Ref<HTMLElement>`
     - `label`, `headline`, `subtext`
     - For N ∈ {1,2,3}: `cat{N}Number`, `cat{N}Name`, `cat{N}Subtitle`, `cat{N}Image`, `cat{N}Link`, `cat{N}Cta`
   - Default export `ShamalCategoryGrid(props)`.
   - Destructure all props including `ref`; spread `{...rest}` on root `<section>`.
   - State: `visible`, flipped by one-shot `IntersectionObserver` on internal `contentRef`, `threshold: 0.15`.
   - Helpers: `revealClass()`, `revealStyle(ms)`.
   - Collapse three categories into a `categories` array of `{ number, name, subtitle, image, link, cta }` — lets us map for rendering without duplicating JSX.
   - Layout:
     - `<section ref={ref} {...rest} id="shop" className="w-full bg-shamal-black py-24 text-shamal-white md:py-32">`
     - Inner wrapper `mx-auto max-w-[1400px] px-6 md:px-10` holding `contentRef`.
     - Header: `mx-auto max-w-[640px] text-center flex flex-col items-center`.
       - Gold label (`text-[11px] tracking-[0.4em] text-shamal-gold uppercase`) — delay 0.
       - `<DiamondDivider />` wrapper `mt-6` — delay 120.
       - Headline `mt-6 font-cormorant text-5xl md:text-6xl font-light text-shamal-white` — delay 240.
       - Subtext `mt-3 font-cormorant text-xl text-shamal-white-dim italic` — delay 360.
     - Grid `mt-16 grid grid-cols-1 gap-4 md:grid-cols-3`. Each item is a `<CategoryCard />` with its own reveal class + delay (480 / 630 / 780).
   - `CategoryCard` local component props: `{ number, name, subtitle, image, link, cta, className, style }`. Renders:
     - `<Link to={link} className={cn("group relative block aspect-[3/4] overflow-hidden", className)} style={style}>`
     - Background: `<div aria-hidden className="absolute inset-0 scale-105 bg-center bg-cover transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${imageUrl})` }} />` — rendered only when `imageUrl` exists to avoid `url(undefined)`.
     - Overlay: `<div aria-hidden className="absolute inset-0 bg-gradient-to-t from-shamal-black via-shamal-black/40 to-shamal-black/20" />`.
     - Content: `<div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">`
       - Number span `text-[11px] tracking-[0.4em] text-shamal-gold uppercase`.
       - Name `h3` Cormorant, `mt-3 text-4xl md:text-5xl font-light`.
       - Italic subtitle `mt-2 font-cormorant text-shamal-white-dim italic`.
       - CTA row `mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-shamal-gold` — label + `→` glyph.
       - Underline: `<span aria-hidden className="mt-2 block h-px w-8 bg-shamal-gold transition-all duration-500 group-hover:w-20" />`.
   - `DiamondDivider` — same two-gold-lines + `◆` motif, `w-16` per card.
   - Schema via `createSchema({ type: "shamal-category-grid", title: "Shamal Category Grid", settings: [...] })`, grouped: Header / Category 1 / Category 2 / Category 3.

2. **Register** in `app/weaverse/components.ts`
   - Add `import * as ShamalCategoryGrid from "~/sections/shamal-category-grid";` (alphabetically after `ShamalDiscovery`).
   - Add `ShamalCategoryGrid,` in the `components` array.

3. **Typecheck** — `npm run typecheck`.

## Out of scope

- Removing the `shamal-shop-grid` instance from the homepage. Per the prompt, that happens in Weaverse Studio, not here.
- Linking to real Shopify collection data. The schema stores plain URLs (`/collections/perfumes` etc.); wiring loader-driven counts or featured-product strips can come later without breaking the schema.
- Deleting `shamal-shop-grid.tsx` — explicitly deferred by the prompt.
