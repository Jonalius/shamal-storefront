---
status: complete
owner: Jonathan Rahm
created: 2026-05-25
---

# Shamal Product Template

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Build a Shamal product page template — similar pattern to how we built the Shamal collection template. Two new sections, both with enabledOn: { pages: ["PRODUCT"] }.
>
> The product page currently uses the default Pilot template (PILOT header, white background, generic layout). We need it to match the rest of the Shamal site — dark, cinematic, editorial.
>
> Section 1: `app/sections/shamal-product-main.tsx` — the main product display section
>    - Full-width, bg-shamal-black, min-h-screen, py-20
>    - Two-column layout on desktop (50/50), stacked on mobile
>    - Left column: large product image gallery — main image with thumbnails below if multiple images. Uses product.images from useLoaderData. Subtle gold glow behind the main image.
>    - Right column: editorial content stack
>      - Small gold label (uses product.productType or first tag, uppercase tracked, e.g. "PERFUME" or "DISCOVERY SET")
>      - Cormorant headline: product.title
>      - Italic Cormorant subtitle: pulled from product.description first line OR a metafield (optional)
>      - Body: rich product.descriptionHtml rendered with prose styling (dark prose — text-shamal-white-dim for paragraphs, font-cormorant italic for emphasis)
>      - Diamond divider
>      - Price section: large €X in Cormorant text-shamal-white
>      - CTA section with logic:
>        - If product tags include "refill" → "REFILL YOUR MOMENT" gold button + "Crafted to order" subtext
>        - If product tags include "pre-order" → "RESERVE YOUR VOYAGE" gold button + "Ships end of June" subtext
>        - Otherwise → "ADD TO CART" gold button (uses Hydrogen CartForm or addToCart hook from the existing pilot product handling — look at the existing product route for the right way to add to cart)
>      - Quantity selector (only for normal products, not pre-orders)
>      - Shipping note: "Free shipping within Finland & EU" small text-shamal-white-dim
>
> Section 2: `app/sections/shamal-product-details.tsx` — expandable details / fragrance notes section
>    - Below the main section, full-width, bg-shamal-surface, py-20
>    - Centered max-w-[860px] mx-auto
>    - Title: "THE NOTES" or "DETAILS" (gold label uppercase tracked) — editable
>    - If product is a perfume (tag voyage), render three columns: TOP / HEART / BASE notes (pulled from metafields if available, otherwise editable Weaverse fields)
>    - If product is Discovery Set or Refill, render different content: "What's included" or "How it works" - editable Weaverse text blocks
>    - Diamond divider
>    - "Crafted in Helsinki" footer line
>
> Both sections registered in app/weaverse/components.ts.
>
> Update app/root.tsx hideChrome to also hide Pilot chrome on /products/* routes — same pattern.
>
> Run typecheck when done.

## Summary

Adds a Shamal-branded product page template via two Weaverse sections constrained to `PRODUCT` pages. `shamal-product-main` is a 50/50 split — a gallery with main image + thumbnail strip (with a soft gold radial glow behind the hero shot) on the left, and an editorial copy/price/CTA column on the right (label from `productType`, Cormorant title, italic subtitle from first description line, rich `descriptionHtml`, tag-aware CTA branching refill → pre-order → AddToCartButton, integer quantity selector for normal products only, shipping note). `shamal-product-details` is a dark-surface band below it that switches between a TOP / HEART / BASE notes layout for voyages and a generic "What's included / How it works" block list for other product types, all editable via the Weaverse schema with sensible defaults per product type. Also extends the `hideChrome` check in `app/root.tsx` so `/products/*` hides the inherited Pilot header/footer/announcement, matching the homepage and collection routes.
