# Plan — Shamal Discovery Section

## Files touched

- `app/sections/shamal-discovery.tsx` — new
- `app/weaverse/components.ts` — namespace import + entry in `components` array

## Implementation steps

1. **`app/sections/shamal-discovery.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps`, `WeaverseImage` from `@weaverse/hydrogen`; `useEffect`, `useRef`, `useState` from `react`; `Link` from `react-router`; `cn` from `~/utils/cn`.
   - Props (extends `HydrogenComponentProps`):
     - `ref: React.Ref<HTMLElement>`
     - `productImage: WeaverseImage | string`
     - `label`, `headline`, `subheadline`, `bodyText`
     - `included1`, `included2`, `included3`
     - `price`, `shippingNote`
     - `ctaText`, `ctaLink`
     - `dispatchNote`
   - Default export `ShamalDiscovery(props)` (function declaration).
   - Destructure including `ref`; spread `{...rest}` on root `<section>`.
   - State: `visible`, flipped by one-shot `IntersectionObserver` on internal `contentRef`, `threshold: 0.15`.
   - Helpers: `revealClass()`, `revealStyle(ms)`.
   - Layout:
     - `<section ref={ref} {...rest} id="discovery" className="w-full bg-shamal-surface py-32 text-shamal-white md:py-40">`
     - Inner grid: `mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-10`
     - **Left (image)**:
       - Column wrapper with `flex flex-col items-center`.
       - Relative bottle-style container: radial glow behind (`bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_70%)]`, absolute, scale-125), `<img>` on top with `max-h-[60vh]` and `object-contain`.
       - Caption below: italic `font-cormorant text-sm text-shamal-white-dim`, centered.
     - **Right (content)** — this holds `contentRef` for IntersectionObserver:
       - Gold label (delay 0), diamond divider (120), headline (240), italic subhead (360), body paragraph (480), included list (600), price block (720), CTA (840), dispatch note (960).
       - Included list is a `<ul>` with `flex flex-col gap-3`, each `<li>` using `flex items-start gap-3`, a `◆` glyph `text-shamal-gold text-[10px] mt-1.5` as the bullet, body text `font-cabin text-shamal-white-dim leading-relaxed`.
       - Price block: `<span className="font-cormorant text-4xl font-light text-shamal-gold">{price}</span>` on top, small `shippingNote` in `text-[11px] text-shamal-white-dim` below.
       - CTA: `<Link>` with `inline-flex w-full items-center justify-center bg-shamal-gold px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-black uppercase hover:bg-shamal-gold/90 sm:w-auto`.
       - Dispatch note: `text-[11px] text-shamal-white-dim`, same column alignment as CTA (left on desktop; we won't center since the content column is left-aligned).
   - Local `DiamondDivider` sub-component (same two-gold-lines + `◆` used in shamal-story). Width tightened to `w-16` to sit naturally in the narrower column.
   - Schema via `createSchema({ type: "shamal-discovery", title: "Shamal Discovery", settings: [...] })`, grouped: Product / Label / Copy / Included / Pricing / CTA.

2. **Register** in `app/weaverse/components.ts`
   - `import * as ShamalDiscovery from "~/sections/shamal-discovery";` alphabetically between `ShamalBrand`-area imports (directly after `ShamalVoyage`).
   - Add `ShamalDiscovery,` in the `components` array next to the other Shamal entries.

3. **Typecheck** — `npm run typecheck`.

## Out of scope

- Linking the CTA to a real Shopify product via loader. `ctaLink` defaults to `/products/discovery-set`; actual wiring happens when the Shopify product exists.
- Extracting `DiamondDivider` / reveal helpers into shared modules — tracked as a follow-up if a fourth section needs them.
- Placing the discovery section on the homepage in Weaverse Studio.
