# Homepage cinematic visual pass — Layer 1

- **Status:** Layer 1 complete — typecheck/biome/build pass locally; awaiting live deploy + eyeball
- **Owner:** Jonathan Rahm
- **Created:** 2026-06-11

## Original prompt

> LAYER 1 of a cinematic visual pass on the homepage: section background overlays + section-to-section blending. Goal: the homepage should feel like one continuous cinematic piece, with sections bleeding into each other via gradient edges instead of hard cuts. Subtle, luxurious, restrained — this is a high-end fragrance brand.
>
> Homepage section order: Hero → Discovery Set (shamal-discovery.tsx) → Refill (shamal-refill.tsx) → Waitlist (shamal-waitlist.tsx) → Footer. All on the dark shamal-black palette.
>
> Do this:
> 1. DISCOVERY SET overlay (shamal-discovery.tsx): the background forest photo currently has a heavy flat dark overlay hiding the green. Replace with a TOP-TO-BOTTOM GRADIENT: more opaque shamal-black at the very top edge (to fade smoothly out of the hero above), lightening to a gentle ~25-35% dim over the rest so the green photo clearly shows ("medium" visibility). Keep headline/body/price/CTA readable — add a soft localized scrim behind the text column only if needed, not over the whole image.
> 2. SECTION BLENDING (all homepage sections): add subtle gradient transitions at the top and bottom edges of sections so adjacent sections bleed together instead of hard-cutting. Where a section meets another, the edges should fade through shamal-black so there's no visible seam. Keep it cohesive — same approach across Hero→Discovery, Discovery→Refill, Refill→Waitlist, Waitlist→Footer. The effect should be felt, not obvious.
> 3. Make sure backgrounds, gradients, and overlays use the existing CSS variables/design tokens (shamal-black, etc.) and don't break any existing Weaverse-editable backgroundImage fields.
>
> Constraints:
> - This is CSS/visual only — no data, logic, or schema-breaking changes.
> - Don't touch the cart, waitlist functionality, or product logic.
> - Don't add scroll animations yet — that's Layer 2.
> - Keep it tasteful and subtle; err toward less.
>
> Verify it renders (local dev/prod build), run typecheck + biome, don't deploy — I'll deploy and eyeball on the live site, then we'll iterate if needed.

## Summary

CSS/visual-only pass to make the homepage read as one continuous cinematic piece.
Replaces the flat photo overlays on the Discovery and Refill sections with
top-to-bottom gradients that go opaque-black at the section edges (so adjacent
sections bleed through `shamal-black` with no hard seam) and ease to a gentle dim
in the body. No data, logic, or schema changes; no scroll animations (Layer 2).
