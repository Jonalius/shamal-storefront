---
status: complete
owner: Jonathan Rahm
created: 2026-04-24
---

# Shamal Story Section

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Create `app/sections/shamal-story.tsx` — the Our Story section, matching the Lovable design (second section after the hero).
>
> Visual structure:
> 1. Full-width dark section, bg-shamal-black, id="story"
> 2. Centered content, max-w-[860px] mx-auto, generous vertical padding (py-32 md:py-40)
> 3. Top label: "OUR STORY" — text-shamal-gold, text-[11px], tracking-[0.4em], uppercase
> 4. Diamond divider: the signature Shamal motif — two thin gold lines with a small diamond (◆) centered between them
> 5. Headline: "Where Nordic Silence Meets Eastern Mystery" — font-cormorant, text-5xl md:text-6xl, text-shamal-white, font-light, centered
> 6. Two body paragraphs, centered, max-w-[640px], text-shamal-white-dim, system sans, leading-relaxed:
>    - "Born in the quiet forests of Finland, Shamal draws its essence from the ancient perfume traditions of the East and the untouched wilderness of the North."
>    - "Each fragrance is handcrafted in our Lohja atelier, where we blend precious oud with Nordic botanicals, creating scents that tell stories of distant places and forgotten memories."
> 7. Diamond divider (same as above)
> 8. Three value pillars in a row (horizontal desktop, stacked mobile), separated by thin vertical gold lines:
>    - Icon + "HANDCRAFTED" + "Each bottle blended by hand at our Lohja atelier"
>    - Icon + "OUD & NORDIC BOTANICALS" + "Ancient Eastern resins meet Finnish forest ingredients"
>    - Icon + "LIMITED VOYAGES" + "Every fragrance is a small batch, numbered edition"
>    Use simple SVG icons inline (a hand, a leaf/botanical, and a number/batch icon) in text-shamal-gold
> 9. Diamond divider
> 10. Single CTA button: "Explore the Collection" — ghost style (border border-shamal-gold text-shamal-gold, hover:bg-shamal-gold/10), links to #shop
>
> Scroll-triggered fade-in-up animations using the existing animate-fade-in-up class with intersection observer (useEffect + IntersectionObserver, no external library). Elements animate in when they enter the viewport.
>
> Weaverse schema — expose:
> - label (default "OUR STORY")
> - headline
> - paragraph1, paragraph2
> - pill1Title, pill1Body, pill2Title, pill2Body, pill3Title, pill3Body
> - ctaText (default "Explore the Collection"), ctaLink (default "#shop")
>
> Use ref-as-prop pattern (React 19). Register in app/weaverse/components.ts. Run typecheck when done.

## Summary

Second homepage section — an editorial "Our Story" block with the Shamal brand narrative: gold top label, diamond dividers, a Cormorant headline, two body paragraphs, three value pillars (Handcrafted / Oud & Nordic Botanicals / Limited Voyages) with inline SVG icons, and a ghost CTA. Reveal animation is scroll-triggered via a one-shot `IntersectionObserver` that flips a `visible` state, after which the existing `animate-fade-in-up` class is applied with staggered per-element `animationDelay`. All copy and the CTA are Weaverse-editable.

## Notes / deviations from prompt

- Pillar separators use `md:border-r md:border-shamal-gold/30` on the first two pillars (stacked on mobile, no border). Preferred to a separate `<span>` line element because the grid gap is zero and the border visually coincides with the column edge — fewer DOM nodes, same result.
- Animation reveal uses a single `IntersectionObserver` on the inner content wrapper (not one-per-element). Once it intersects at 15% threshold, `setVisible(true)` flips every child's class from `opacity-0` to `animate-fade-in-up`; each child supplies its own `animationDelay` inline for the stagger. Observer disconnects after first hit — animation fires exactly once per page load.
- Internal `contentRef` is used for the observer rather than the Weaverse-owned `ref` prop, which is spread onto `<section>` for Studio compatibility.
- Icons are inline SVGs (hand, leaf, 3-line batch) rather than Phosphor imports — keeps the file self-contained and lets us size/stroke them precisely for the editorial feel.
