---
status: complete
owner: Jonathan Rahm
created: 2026-06-10
---

# Soft-launch homepage + nav (nav simplification, Refill section, category-grid confirm)

## Original prompt

> Three changes for the soft-launch homepage + nav. Context: only Discovery Set and
> Refill are buyable now; perfumes are coming-soon+waitlist. We're simplifying the
> homepage and nav for launch.
>
> CHANGE 1 — Nav (app/components/shamal-nav.tsx): Current links: Our Story (/#story),
> Nordic Seasons (/collections/perfumes), The Journal (/blogs/journal), Shop (/#shop).
> New nav link set: Home (/), Nordic Seasons (/collections/perfumes), The Journal
> (/blogs/journal). REMOVE "Shop" and REMOVE "Our Story" from the nav for now. ADD an
> explicit "Home" text link (→ /) as the first nav item, in addition to the existing
> logo image (keep the logo as a home link too — both should work). Style "Home"
> identically to the other nav text links. Apply the same link changes to the footer
> (app/sections/shamal-footer.tsx) Explore links if they mirror the nav — remove
> Shop/Our Story dead anchors, keep Nordic Seasons → /collections/perfumes and The
> Journal → /blogs/journal. Note the footer is Weaverse-driven so schema defaults only
> affect new instances; I'll update the live footer in Weaverse Studio after — just fix
> the schema defaults.
>
> CHANGE 2 — Homepage Refill section: The homepage needs a Refill section (buyable,
> €60, handle "refill", made-to-order). Currently there's a shamal-discovery.tsx
> section for Discovery Set. Build the Refill presentation parallel to Discovery —
> either by making a reusable section or adapting the discovery section pattern. It
> should pull the real "refill" product from Shopify, show price, and have a working Add
> to Cart (same buyable flow as Discovery Set). Keep the dark Shamal editorial styling,
> swappable image field, Weaverse-editable copy. IMPORTANT framing: Refill is our PROVEN
> repeat-purchase product (we've sold ~1000 bottles this past year) — so it deserves
> prominent, confident presentation, not a footnote. Copy should speak to existing
> customers refilling their bottle. The customer notes which voyage in order notes at
> checkout (one universal SKU) — surface that clearly (e.g. "Note your voyage at
> checkout"). Make it a proper Weaverse section (enabledOn INDEX or general), registered
> in app/weaverse/components.ts, so I can place/order it in Studio.
>
> CHANGE 3 — confirm the category grid: The homepage currently has
> shamal-category-grid.tsx (Perfumes/Home/Discovery cards). For the soft launch I'm
> removing it from the homepage in Weaverse Studio (Home collection is empty, Shop is
> hidden). You don't need to delete the component — just confirm removing the instance
> in Studio won't break anything, and that Discovery + Refill sections stand on their
> own. Flag if the grid is doing anything structurally important.
>
> Target homepage order (I'll arrange in Weaverse Studio): Hero → [Our Story hidden] →
> Discovery Set → Refill → Waitlist → Footer.
>
> Verify on local prod build: nav shows Home/Nordic Seasons/The Journal + working Home
> text link + logo-home link; Refill section renders the real refill product with
> working add-to-cart (add → cart persists); Discovery still works. Run typecheck +
> biome. Don't deploy — I will. Summarize, and tell me exactly what to arrange/hide in
> Weaverse Studio afterward.

## Summary

Simplified the soft-launch nav/footer (Home + Nordic Seasons + The Journal; removed
Shop and Our Story), and built a new `shamal-refill` Weaverse section that pulls the
live `refill` product from Shopify and adds it to cart inline (parallel to the
Discovery presentation but with a real buy flow, confident repeat-customer copy, and a
prominent "note your voyage at checkout" line). Confirmed `shamal-category-grid` is
purely presentational and safe to remove from the homepage in Studio.
