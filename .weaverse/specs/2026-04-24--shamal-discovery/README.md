---
status: complete
owner: Jonathan Rahm
created: 2026-04-24
---

# Shamal Discovery Section

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Create `app/sections/shamal-discovery.tsx` — the Discovery Set feature section.
>
> Visual structure — full-width dark section, bg-shamal-surface, id="discovery":
>
> 1. Two-column layout on desktop (50/50), single column on mobile (image top, text bottom).
>
> 2. Left column — product image area:
>    - Large editable product image, centered, with a subtle radial gold glow behind it (same pattern as voyage bottle)
>    - Below image: small text "Handmade leather case · Three 5ml voyages" in text-shamal-white-dim, centered, italic, text-sm
>
> 3. Right column — content:
>    - Top label: "THE DISCOVERY SET" — text-shamal-gold, text-[11px], tracking-[0.4em], uppercase
>    - Diamond divider (same motif as story section — two lines + ◆)
>    - Headline: "Begin Your Journey" — font-cormorant, text-5xl md:text-6xl, text-shamal-white, font-light
>    - Subheadline: "Your introduction to the world of Shamal" — font-cormorant italic, text-xl, text-shamal-white-dim
>    - Body paragraph: "Each Discovery Set contains a handmade leather case crafted in our Helsinki atelier, housing three 5ml bottles of our current voyages. The perfect first step into the world of Shamal — and a beautiful object in its own right."
>    - What's included list (3 items with gold dot bullets):
>      · Handmade leather case
>      · First Voyage 5ml · Winter Voyage 5ml · Oodi Mökille 5ml
>      · Free shipping to Finland & EU
>    - Price: "€80" large, font-cormorant, text-shamal-gold, text-4xl + "Free EU shipping" small text-shamal-white-dim below
>    - Primary CTA: "Order the Discovery Set" — bg-shamal-gold text-shamal-black, full width on mobile, auto on desktop
>    - Secondary text: "Ships within 3–5 business days" — text-[11px] text-shamal-white-dim, centered
>
> 4. Scroll-triggered fade-in-up animations via IntersectionObserver (same pattern as other sections).
>
> Weaverse schema:
> - productImage
> - label (default "THE DISCOVERY SET")
> - headline (default "Begin Your Journey")
> - subheadline
> - bodyText
> - included1, included2, included3 (the three bullet points)
> - price (default "€80")
> - shippingNote (default "Free EU shipping")
> - ctaText (default "Order the Discovery Set"), ctaLink (default "/products/discovery-set")
> - dispatchNote (default "Ships within 3–5 business days")
>
> React 19 ref-as-prop. Register in app/weaverse/components.ts. Run typecheck.

## Summary

Feature section for the Discovery Set product, placed between the three voyage scenes and the collection grid. Two-column editorial layout: left column is a Weaverse-editable product image floating over a soft radial gold glow with a small italic caption; right column carries the gold label → diamond divider → Cormorant headline → italic subhead → body copy → gold-dot "included" list → price block → primary gold CTA → dispatch note. All copy is schema-driven. Reveal uses the same one-shot `IntersectionObserver` pattern as shamal-story and shamal-voyage.

## Notes / deviations from prompt

- `DiamondDivider` is inlined here rather than extracted. Shamal-story's plan flagged extraction "once a second section needs it"; this is that second caller, but the divider is five lines of JSX and extracting it would mean choosing a home for it (`app/components/shamal/`?) that doesn't exist yet. Keeping it inline for now — revisit if a third caller appears.
- The "included" list uses a small gold `◆` glyph as the bullet (matches the diamond divider motif) rather than a generic `•` dot. Reads as intentional within the Shamal visual language.
