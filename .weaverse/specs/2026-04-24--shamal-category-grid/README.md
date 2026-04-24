---
status: complete
owner: Jonathan Rahm
created: 2026-04-24
---

# Shamal Category Grid Section

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Create `app/sections/shamal-category-grid.tsx` — the homepage category selector section. This replaces the previous product grid concept. Don't delete shamal-shop-grid.tsx yet — we'll remove it from the homepage in Weaverse Studio separately.
>
> Visual structure — full-width, bg-shamal-black, id="shop", py-24 md:py-32:
>
> 1. Centered header, max-w-[640px] mx-auto:
>    - Small label: "THE COLLECTION" — text-shamal-gold, text-[11px], tracking-[0.4em], uppercase
>    - Diamond divider (two gold lines + ◆ center)
>    - Headline: "Explore Shamal" — font-cormorant, text-5xl md:text-6xl, text-shamal-white, font-light, mt-6
>    - Subtext: "Three worlds. One atelier." — font-cormorant italic, text-xl, text-shamal-white-dim, mt-3
>
> 2. Three large category cards, grid-cols-1 md:grid-cols-3, gap-4, mt-16, max-w-[1400px] mx-auto px-6:
>    Each card:
>    - Wrapper: <Link> to category page, group class for hover states, relative block, aspect-[3/4]
>    - Background image: absolute inset-0, bg-cover bg-center, zoom slowly on hover (scale-105 transition-transform duration-700 group-hover:scale-110)
>    - Dark gradient overlay: bg-gradient-to-t from-shamal-black via-shamal-black/40 to-shamal-black/20
>    - Content: absolute inset-0, flex flex-col justify-end p-8 md:p-10
>      * Small gold label: "01" / "02" / "03" — text-[11px] tracking-[0.4em] uppercase text-shamal-gold
>      * Category name (large Cormorant): "Perfumes" / "Home" / "Discovery & Refills" — font-cormorant text-4xl md:text-5xl text-shamal-white font-light mt-3
>      * Italic subtitle: e.g. "The five voyages" / "Candles, soaps, room scents" / "Begin your journey" — font-cormorant italic text-shamal-white-dim mt-2
>      * Arrow indicator with underline: "Explore →" — text-[11px] tracking-[0.28em] uppercase text-shamal-gold mt-6, with a thin gold underline that extends on hover
>
> Weaverse schema:
> - Header group: label (default "THE COLLECTION"), headline (default "Explore Shamal"), subtext (default "Three worlds. One atelier.")
> - Category 1 group (Perfumes): cat1Number, cat1Name, cat1Subtitle, cat1Image, cat1Link (default "/collections/perfumes"), cat1Cta (default "Explore")
> - Category 2 group (Home): cat2Number, cat2Name, cat2Subtitle, cat2Image, cat2Link (default "/collections/home"), cat2Cta
> - Category 3 group (Discovery): cat3Number, cat3Name, cat3Subtitle, cat3Image, cat3Link (default "/collections/discovery"), cat3Cta
>
> Defaults:
> - cat1: number "01", name "Perfumes", subtitle "The five voyages"
> - cat2: number "02", name "Home", subtitle "Candles, soaps, room scents"
> - cat3: number "03", name "Discovery & Refills", subtitle "Begin your journey"
>
> IntersectionObserver reveal, staggered. React 19 ref-as-prop. Register in components.ts. Typecheck.

## Summary

Homepage category selector intended to replace the per-product shop grid. Full-bleed dark section with a centred editorial header (gold label → diamond divider → Cormorant headline → italic subhead), then three tall 3:4 image cards in a 1/3-column responsive grid. Each card is a `<Link>` wrapping a background image that subtly zooms on hover, a dark bottom-up gradient for legibility, and a bottom-aligned content block with number / name / italic subtitle / gold "Explore →" CTA whose gold underline widens on hover. Reveal uses the same one-shot `IntersectionObserver` pattern as the other Shamal sections; header stagger first, then the three cards at 300/450/600ms.

## Notes / deviations from prompt

- The existing `shamal-shop-grid` is left in place per the prompt; removal from the homepage is a Studio-side action.
- Both sections currently declare `id="shop"`. Two DOM elements with the same `id` on the same page is invalid HTML; this is only a problem if both are rendered together. Given the prompt explicitly says we'll delete the old one from Studio, the collision is transient. If they ever do co-render, the browser will only match the first `#shop` anchor — the nav link in shamal-hero still resolves, just to the first match. Flagged here so it's not a surprise.
- Underline "extends on hover" is implemented as a separate absolutely-positioned gold `span` under the CTA row that animates `w-8 → w-20` via `transition-all duration-500`. Preferred to an animated `border-bottom` because width transitions are cleaner and don't fight the text baseline.
- `DiamondDivider` is inlined again (matches shamal-discovery's decision). Three in-file callers now — a shared extraction is tracked as a follow-up, not blocking this task.
