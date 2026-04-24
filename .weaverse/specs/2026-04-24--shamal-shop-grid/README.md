---
status: complete
owner: Jonathan Rahm
created: 2026-04-24
---

# Shamal Shop Grid Section

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Create `app/sections/shamal-shop-grid.tsx` — the shop grid section.
>
> Visual structure — full-width, bg-shamal-black, id="shop", generous padding py-24 md:py-32:
>
> 1. Centered header, max-w-[640px] mx-auto:
>    - Headline: "Three Voyages. Limited Edition." — font-cormorant, text-5xl md:text-6xl, text-shamal-white, font-light
>    - Subtext: "Each fragrance is handcrafted in small batches at our Lohja atelier. The first three voyages arrive soon. Reserve yours before the world knows." — system sans, text-shamal-white-dim, leading-relaxed, mt-4
>
> 2. Three-column product grid (3 cols desktop, 1 col mobile), gap-6, mt-16:
>    Each card — bg-shamal-surface, no rounded corners:
>    - Top label: "MOMENT 01" — text-shamal-gold, text-[10px], tracking-[0.35em], uppercase, p-6 pb-0
>    - Product image area: aspect-[3/4], bg-shamal-black, overflow-hidden, product image centered with object-contain
>    - Card body p-6:
>      * Product name — font-cormorant, text-2xl, text-shamal-white
>      * Italic subtitle — font-cormorant italic, text-sm, text-shamal-white-dim
>      * Price row: "€100 · 30ml" — text-shamal-white-dim, text-sm, mt-2
>      * "First edition · Small batch" — text-[10px] text-shamal-white-dim italic, mt-1
>      * CTA button full width: "RESERVE YOUR VOYAGE" — bg-shamal-gold text-shamal-black, text-[10px] tracking-[0.25em] uppercase, py-3, mt-6
>      * Waiting count: "★ 312 waiting" — text-[10px] text-shamal-white-dim, text-center, mt-3
>
> Weaverse schema — three product slots, each with:
> - moment1Label, moment2Label, moment3Label (defaults "MOMENT 01/02/03")
> - product1Name, product2Name, product3Name
> - product1Subtitle, product2Subtitle, product3Subtitle
> - product1Image, product2Image, product3Image
> - product1Price, product2Price, product3Price (default "€100")
> - product1Link, product2Link, product3Link
> - product1Waiting, product2Waiting, product3Waiting (default "312/248/189")
> - headline, subtext
> - showWaiting (switch, default true)
>
> Scroll-triggered fade-in-up via IntersectionObserver. React 19 ref-as-prop. Register in components.ts. Typecheck when done.

## Summary

Three-up product grid section for the homepage, `id="shop"` on `bg-shamal-black`. A centred Cormorant headline + dim subtext open the section, followed by a 1/3-column responsive grid of `bg-shamal-surface` product cards — each with a gold moment label, 3:4 image area, name, italic subtitle, price row, edition line, full-width gold CTA, and optional waiting-count footer. All copy, images, prices, links, and waiting counts are editable per slot; the waiting row can be globally toggled. Reveal uses the same one-shot `IntersectionObserver` pattern as the other Shamal sections — header first, then the three cards stagger in.

## Notes / deviations from prompt

- The three products are modeled as flat schema fields (`product1*`, `product2*`, `product3*`) per the prompt. Inside the component they are collapsed into a `[{ ... }, { ... }, { ... }]` array and rendered through a local `<ProductCard>` — saves 3× JSX duplication without changing the schema shape.
- CTA text is not schema-driven (matches the prompt — only `ctaLink` is per-slot via `product{n}Link`). If that needs to differ per card later, add a `product{n}CtaText`.
