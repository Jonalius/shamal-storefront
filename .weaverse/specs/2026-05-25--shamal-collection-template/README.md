---
status: complete
owner: Jonathan Rahm
created: 2026-05-25
---

# Shamal Collection Template

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Context: The Shopify catalog is now set up:
> - 4 active products: Discovery Set (€80, in stock), First Voyage / Winter Voyage / Oodi Mökille (€100 each, tagged "pre-order" with "continue selling when out of stock")
> - 4 draft products: Löyly + 1 universal Refill product
> - 3 customer-facing collections: perfumes, discovery, home (home is intentionally empty for launch)
> - 1 internal pre-order collection (auto-tagged by "pre-order")
>
> Task: Build the Shamal collection template — path A from your earlier analysis.
>
> Create two new sections, both with enabledOn: { pages: ["COLLECTION"] }:
>
> 1. `app/sections/shamal-collection-hero.tsx` — editorial header for collection pages
>    - Full-width, bg-shamal-black, py-32 md:py-40, text-center
>    - Small gold label (uppercase tracked) — e.g. "01 · THE COLLECTION"
>    - Diamond divider (same motif as other sections)
>    - Large Cormorant headline — defaults to collection.title from Shopify but overridable
>    - Italic Cormorant subhead (small) — optional, schema field
>    - Narrative paragraph — defaults to collection.description but overridable
>    - Optional background image with dark overlay (same pattern as shamal-hero / shamal-discovery)
>    - IntersectionObserver fade-in-up reveal
>    - Weaverse schema: label, headline (with collection.title fallback), subhead, paragraph (with collection.description fallback), backgroundImage
>
> 2. `app/sections/shamal-collection-grid.tsx` — product grid pulling real Shopify data
>    - Uses useLoaderData from the collection route to access the products
>    - Renders products in a 3-column grid (1 col mobile) styled like shamal-shop-grid.tsx (bg-shamal-surface cards, gold accents, sharp corners)
>    - Each card: small "MOMENT 0X" label IF the product has voyage tag (use product tags), product image, name, italic short subtitle (use product.metafield or first line of description if available, else skip), price row, CTA button
>    - CTA logic: if product tags include "pre-order", button says "RESERVE YOUR VOYAGE" with "Ships end of June" small text below. Otherwise standard "ADD TO CART" or "ORDER NOW" linking to the product page
>    - Empty state: if products array is empty, render a centered editorial message — Cormorant italic "Coming later this year." plus small text "Join the waitlist to be the first to know when this collection arrives."
>    - IntersectionObserver fade-in-up reveal with staggered card delays
>
> Both sections registered in app/weaverse/components.ts.
>
> Also: in app/root.tsx, extend the isHomepage check to also hide Pilot Header/Footer/ScrollingAnnouncement on /collections/* routes. Generalize the variable name to something like isShamalRoute (or hideChrome) so it's cleaner.
>
> Run npm run typecheck when done. Don't modify the existing shamal-shop-grid.tsx on the homepage yet — we'll handle that separately.

## Summary

Adds the Shamal-branded collection page template via two Weaverse sections constrained to `COLLECTION` pages: an editorial hero (`shamal-collection-hero`) that defaults to Shopify's collection title/description but lets editors override, and a product grid (`shamal-collection-grid`) that reads the live `collection.products.nodes` from `useLoaderData` on the collection route and renders Shamal-styled cards with tag-aware "voyage" labels, pre-order vs. standard CTAs, and an editorial empty state. Also hides the inherited Pilot chrome (header/footer/announcement) on `/collections/*` so the Shamal layout owns the whole page, mirroring the homepage behaviour.
