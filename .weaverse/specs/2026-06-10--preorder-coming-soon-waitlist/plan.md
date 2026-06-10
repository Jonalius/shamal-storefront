# Plan

## Files touched

- `app/components/waitlist-form.tsx` (new) — shared client component owning the
  Web3Forms submission, email validation, and success/error/privacy UI. Accepts an
  optional `context` (product title) included in the signup email subject/body so
  homepage / section / per-product signups are distinguishable for info@. Accepts
  `className`/`style` so the host controls layout + reveal animations.
- `app/sections/shamal-waitlist.tsx` (edit) — drop the inline form state + handler +
  markup; render `<WaitlistForm>` instead. Section chrome (label/headline/subtext/
  divider/reveal) unchanged.
- `app/sections/shamal-product-main.tsx` (edit) — pre-order branch:
  - Hide price block when `isPreOrder`.
  - Quantity selector already gated to `isStandard` (stays hidden).
  - Replace the "RESERVE YOUR VOYAGE" AddToCartButton with: "Ships end of June"
    eyebrow + Weaverse-editable intro copy + `<WaitlistForm context={product.title}>`.
  - Schema: replace the old `preOrderCtaText` / `preOrderNote` Pre-order group with
    coming-soon + waitlist fields (`preOrderShipsText`, `preOrderWaitlistText`,
    `preOrderWaitlistPlaceholder`, `preOrderWaitlistButton`, `preOrderWaitlistSuccess`,
    `preOrderWaitlistPrivacy`).

## Out of scope / unchanged

- Standard and refill product flows (add-to-cart, qty, refill CTA) untouched.
- No GraphQL changes (`tags` already in the product fragment) → no codegen needed.
- `components.ts` registration unchanged (no new section; WaitlistForm is a plain
  component, not a Weaverse section).

## Verification

- `npm run typecheck`
- `npm run biome`
- `npm run build` (local prod build) — confirm it compiles.
- Do not deploy.
