# Plan

## Files touched

- `app/components/shamal-nav.tsx` (edit) — `NAV_LINKS` → Home (/), Nordic Seasons
  (/collections/perfumes), The Journal (/blogs/journal). Removed Our Story + Shop.
  Home is the first item, rendered through the same `<a>` map so it's styled
  identically; logo stays a `Link to="/"`. Both are home links.
- `app/sections/shamal-footer.tsx` (edit) — Explore schema defaults mirror the nav:
  link1 Home (/), link2 Nordic Seasons, link3 The Journal, link4 emptied. Added a
  `.filter()` so blank link slots don't render dead `<li>` anchors. (Weaverse-driven:
  schema defaults affect new instances only; live footer updated in Studio by owner.)
- `app/sections/shamal-refill.tsx` (new) — Weaverse section, general (no enabledOn),
  with a same-file `loader` that queries `PRODUCT_QUERY` for the `refill` handle
  (`productHandle` field, default "refill"). Renders live price via `<Money>` and a
  real `<AddToCartButton>` (variant `selectedOrFirstAvailableVariant`). Dark editorial
  styling parallel to Discovery (content-left / image-right, bg-shamal-black to
  alternate against Discovery's bg-shamal-surface). Confident repeat-customer copy +
  social-proof eyebrow + highlighted "note your voyage at checkout" box. Swappable
  image fields, all copy Weaverse-editable. Falls back to a `/products/refill` Link if
  the product can't load, and a sold-out state if unavailable.
- `app/weaverse/components.ts` (edit) — import + register `ShamalRefill`.

## Not changed / confirmed

- No GraphQL changes — reused existing `PRODUCT_QUERY` (already production-safe, no
  `quantityAvailable`). No codegen needed.
- `shamal-category-grid.tsx` — left as-is. Confirmed purely presentational: no loader,
  no data fetch, no shared state, no side effects. Its only structural artifact is the
  `id="shop"` anchor, whose inbound links (nav/footer "Shop") were removed this change.
  Safe to remove the instance in Studio. Discovery (`id="discovery"`) and Refill
  (`id="refill"`) are self-contained.

## Verification

- `npm run typecheck`, `npm run biome`
- `npm run build` + `npm run start` (MiniOxygen prod preview):
  - Nav renders Home / Nordic Seasons / The Journal; Home → /, logo → /.
  - Refill section renders the live refill product, price, working add-to-cart.
  - Discovery still works.
- Do not deploy.
