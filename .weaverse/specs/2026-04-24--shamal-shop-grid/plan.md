# Plan — Shamal Shop Grid Section

## Files touched

- `app/sections/shamal-shop-grid.tsx` — new
- `app/weaverse/components.ts` — namespace import + entry in `components` array

## Implementation steps

1. **`app/sections/shamal-shop-grid.tsx`**
   - Imports: `createSchema`, `HydrogenComponentProps`, `WeaverseImage` from `@weaverse/hydrogen`; `useEffect`, `useRef`, `useState` from `react`; `Link` from `react-router`; `cn` from `~/utils/cn`.
   - Props (extends `HydrogenComponentProps`):
     - `ref: React.Ref<HTMLElement>`
     - `headline`, `subtext`, `showWaiting: boolean`
     - `moment{N}Label`, `product{N}Name`, `product{N}Subtitle`, `product{N}Image`, `product{N}Price`, `product{N}Link`, `product{N}Waiting` for N ∈ {1,2,3}
   - Default export `ShamalShopGrid(props)`.
   - Destructure all props including `ref`; spread `{...rest}` on root `<section>`.
   - State: `visible`, flipped by one-shot `IntersectionObserver` on internal `contentRef`, `threshold: 0.15`.
   - Helpers: `revealClass()`, `revealStyle(ms)`, `imageUrl(value)` (narrows `WeaverseImage | string`).
   - Collapse three products into a `products` array:
     ```ts
     const products = [
       { momentLabel: moment1Label, name: product1Name, subtitle: product1Subtitle, image: product1Image, price: product1Price, link: product1Link, waiting: product1Waiting },
       // 2, 3
     ];
     ```
   - Layout:
     - `<section ref={ref} {...rest} id="shop" className="w-full bg-shamal-black py-24 text-shamal-white md:py-32">`
     - Inner wrapper `mx-auto max-w-[1400px] px-6 md:px-10`.
     - Header block `mx-auto max-w-[640px] text-center` — headline (Cormorant, text-5xl md:text-6xl) + subtext (Cabin, text-shamal-white-dim, leading-relaxed). Delays 0 / 150.
     - `ref={contentRef}` lives on the outer wrapper so the observer trips once the header enters view.
     - Grid `mt-16 grid grid-cols-1 gap-6 md:grid-cols-3`; each child is `<ProductCard />` with its own stagger delay (300, 450, 600).
   - `ProductCard` local component props: `{ momentLabel, name, subtitle, image, price, link, waiting, showWaiting, reveal, style }`. Renders:
     - `<article className="flex flex-col bg-shamal-surface">`
     - Label `p-6 pb-0` — `text-[10px] tracking-[0.35em] text-shamal-gold uppercase`.
     - Image area — `relative aspect-[3/4] overflow-hidden bg-shamal-black`, image `absolute inset-0 h-full w-full object-contain`.
     - Body `flex flex-1 flex-col p-6`:
       - Name (`font-cormorant text-2xl text-shamal-white`).
       - Subtitle (`font-cormorant text-sm text-shamal-white-dim italic mt-1`).
       - Price row `mt-2 text-sm text-shamal-white-dim` — `{price} · 30ml`.
       - Edition `mt-1 text-[10px] text-shamal-white-dim italic` — `First edition · Small batch`.
       - `<Link to={link} className="mt-6 inline-flex w-full items-center justify-center bg-shamal-gold px-4 py-3 text-[10px] font-medium tracking-[0.25em] text-shamal-black uppercase hover:bg-shamal-gold/90">RESERVE YOUR VOYAGE</Link>`.
       - Waiting row conditional on `showWaiting && waiting` — `mt-3 text-center text-[10px] text-shamal-white-dim`, gold star prefix.
     - Applied reveal class + inline delay via the `reveal` / `style` props.
   - Schema via `createSchema({ type: "shamal-shop-grid", title: "Shamal Shop Grid", settings: [...] })`, grouped: Header / Moment 1 / Moment 2 / Moment 3 / Social proof.

2. **Register** in `app/weaverse/components.ts`
   - `import * as ShamalShopGrid from "~/sections/shamal-shop-grid";` alphabetically between `ShamalHero` and `ShamalStory`.
   - Add `ShamalShopGrid,` to the `components` array next to the other Shamal entries.

3. **Typecheck** — `npm run typecheck`.

## Out of scope

- Pulling the three products from Shopify by handle (moment-01-first-voyage etc.) via a `loader`. Current design is schema-driven to match the prompt; can layer in a loader later without breaking schema compatibility.
- Extracting `ProductCard` into a shared component file. It's small and tightly coupled to this grid; no callers yet.
- Placing the shop-grid instance on the homepage in Weaverse Studio.
