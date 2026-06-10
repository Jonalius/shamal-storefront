# Work logs

## 2026-06-10

- Nav (`shamal-nav.tsx`): `NAV_LINKS` → Home (/) / Nordic Seasons / The Journal.
  Removed Our Story + Shop. Home is first, rendered via the same `<a>` map (identical
  styling); logo remains `Link to="/"`. Updated the explanatory comment.
- Footer (`shamal-footer.tsx`): Explore schema defaults now Home / Nordic Seasons /
  The Journal, link4 emptied. Added `.filter()` on `exploreLinks` so blank slots don't
  render dead anchors. (Live footer instance to be updated in Studio by owner.)
- New `shamal-refill.tsx`: general Weaverse section with same-file loader querying
  `PRODUCT_QUERY` for the `refill` handle. Live `<Money>` price + real
  `<AddToCartButton>`. Confident repeat-customer copy, social-proof eyebrow,
  highlighted "note your voyage at checkout" box, swappable images, all copy editable.
  Registered in `components.ts`.
- `shamal-category-grid.tsx`: confirmed purely presentational (no loader / data / state /
  side effects). Only structural artifact is `id="shop"`, whose inbound links were
  removed. Safe to drop the instance in Studio.

### Verification (local prod build via MiniOxygen, not deployed)

- `npm run typecheck` — clean.
- `npm run biome` — only pre-existing `noImgElement` / image-dimension warnings (same
  as Discovery and the rest of the repo); no errors.
- `npm run build` — succeeded.
- Nav: homepage + /cart render `HOME / NORDIC SEASONS / THE JOURNAL`; "Our Story"
  gone; `href="/"` present for logo + Home text + footer Home. Discovery section
  (`id="discovery"`) still renders.
- Refill section: not on `/` yet (new Weaverse section — must be placed in Studio).
  Wiring verified via the refill PDP, which uses the same `PRODUCT_QUERY` variant +
  `AddToCartButton`: real product "Refill", SKU `SHAMAL-REFILL-001`, price €60.00,
  variant `gid://shopify/ProductVariant/57944482120067`.
- Add → cart persists: POSTed the refill variant to `/cart`; `/cart` then shows
  `Cart(1) · Refill · €60 · total €60.00` after navigation. Buy flow + persistence
  confirmed.
- NOTE: in this local "Weaverse Hydrogen Demo Store" the refill (and discovery)
  variants report `availableForSale:false`, so the UI add button renders disabled.
  This is a dev-store inventory condition, not a code issue — the cart API still
  accepted the add. In the production store (where Refill is buyable) the button
  enables.
- Did not deploy.
