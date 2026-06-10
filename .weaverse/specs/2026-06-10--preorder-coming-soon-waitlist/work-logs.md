# Work logs

## 2026-06-10

- Extracted `app/components/waitlist-form.tsx` — shared client form owning the
  Web3Forms submission, email validation, and success/error/privacy UI. Added an
  optional `context` prop (product title) that flows into the signup email subject +
  `product` field so per-product signups are distinguishable for info@.
- Refactored `app/sections/shamal-waitlist.tsx` to render `<WaitlistForm>` instead of
  its own inline form/state/handler. Section chrome unchanged.
- Reworked the pre-order branch in `app/sections/shamal-product-main.tsx`:
  - Price block gated behind `!isPreOrder`.
  - Quantity selector already gated to `isStandard` (stays hidden for pre-order).
  - Replaced the "RESERVE YOUR VOYAGE" add-to-cart with a "Ships end of June" eyebrow
    + editable intro copy + `<WaitlistForm context={product.title}>`.
  - Swapped schema `preOrderCtaText`/`preOrderNote` for the coming-soon + waitlist
    fields (ships eyebrow, intro copy, placeholder, button, success, privacy).

### Verification (local prod build, not deployed)

- `npm run typecheck` — clean.
- `npm run biome` — no new diagnostics in changed files (only pre-existing repo-wide
  warnings: noImgElement, useBlockStatements, etc.).
- `npm run build` — production build succeeded.
- `npm run start` (MiniOxygen prod preview) curl probes:
  - Real perfume handles are `first-voyage`, `winter-voyage`, `oodi-mokille`
    (pre-order-tagged) and `discovery-set` (standard) — note these differ from the
    handles listed in CLAUDE.md.
  - Pre-order pages: no qty selector, no `ADD TO CART`, section price-span absent;
    render "Ships end of June" + intro copy + waitlist (Notify Me / email field).
  - `discovery-set`: `ADD TO CART` + qty selector + price present, no waitlist —
    unchanged.
- Did not deploy.
