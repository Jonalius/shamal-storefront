# Plan — Homepage cinematic visual pass, Layer 1

## Approach

The homepage stacks: **Hero → Discovery → Refill → Waitlist → Footer**, all on the
`shamal-black` (#0d0d0d) palette. To make sections bleed instead of hard-cut, each
photo-backed section's overlay is made **opaque `shamal-black` at its top and bottom
edges** and lighter in the body. Because every section sits on the same black, edges
that resolve to `shamal-black` dissolve into the neighbouring section with no seam.

Seam-by-seam:

- **Hero → Discovery** — Hero already ends in solid `shamal-black`
  (`bg-gradient-to-b ... to-shamal-black`, `shamal-hero.tsx:58`). Discovery's new
  overlay is opaque black at its top edge → seamless. No Hero change.
- **Discovery → Refill** — Discovery's new overlay fades back to black at its foot;
  Refill's new overlay is opaque black at its top edge → seamless.
- **Refill → Waitlist** — Refill's new overlay fades to black at its foot; Waitlist
  is solid `bg-shamal-black` → seamless. No Waitlist change.
- **Waitlist → Footer** — Both already solid `bg-shamal-black` (identical colour) →
  already seamless. No change. (Erring toward less per the brief.)

All gradients reference the existing token via `var(--color-shamal-black)` and
`color-mix(... transparent)` for partial opacity, expressed as Tailwind arbitrary
values (no inline styles). The Weaverse-editable `backgroundImage` fields are
untouched — only the sibling overlay `<div>` changes.

## Files touched

- `app/sections/shamal-discovery.tsx`
  - Replace flat `bg-shamal-surface/85` overlay with a top→bottom gradient:
    opaque black `0%` → ~30% black `18%–78%` → opaque black `100%`.
  - Switch section root fallback bg `bg-shamal-surface` → `bg-shamal-black` so a
    missing photo still reads as black (better blend, no surface band).
  - Add a soft localized radial scrim behind the text column (`-z-10`, inside the
    `z-10` grid so it sits above the photo overlay and behind the copy) for
    headline/body/price/CTA contrast over the now-visible forest.
- `app/sections/shamal-refill.tsx`
  - Replace flat `bg-shamal-black/85` overlay with a top→bottom gradient:
    opaque black at both edges, holding ~82% black in the body (photo stays a quiet
    texture; copy remains fully readable).

## Out of scope

- No Hero / Waitlist / Footer code changes (already seamless).
- No scroll animations (Layer 2).
- No cart, waitlist, or product logic changes.
- No schema / GraphQL changes (so no codegen needed).

## Verification

- `npm run typecheck`
- `npm run biome`
- `npm run build` (prod build renders)
