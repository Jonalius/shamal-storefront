---
status: complete
owner: Jonathan Rahm
created: 2026-04-24
---

# Shamal Voyage Section

## Original prompt

> Read CLAUDE.md, .claude/skills/design-system.md, and .claude/skills/weaverse-patterns.md before starting.
>
> Task: Create `app/sections/shamal-voyage.tsx` — a reusable fragrance scene section. This will be used 3 times on the homepage, once per voyage.
>
> Visual structure — fullscreen section, min-h-screen, relative, overflow-hidden:
>
> 1. Background: fullscreen background image with bg-cover bg-center, editable via schema. Dark overlay gradient: bg-gradient-to-r from-shamal-black/80 via-shamal-black/40 to-transparent (heavier on left where text lives).
>
> 2. Two-column layout (on desktop): left ~50% for text, right ~50% for bottle image. On mobile: single column, text on top, bottle below.
>
> 3. Left column content (top to bottom):
>    - Moment label: "MOMENT 01" — text-shamal-gold, text-[11px], tracking-[0.4em], uppercase
>    - Large serif name: e.g. "First Voyage" — font-cormorant, text-6xl md:text-7xl, text-shamal-white, font-light
>    - Italic subtitle: e.g. "Autumn forest after rain" — font-cormorant italic, text-xl, text-shamal-white-dim
>    - Story paragraph — system sans, text-shamal-white-dim, leading-relaxed, max-w-md
>    - Expandable fragrance notes panel (collapsed by default, toggled by clicking "+ VIEW FRAGRANCE NOTES"):
>      * Toggle button: text-[11px] tracking-[0.28em] uppercase text-shamal-white, with a + / – prefix
>      * When expanded: three columns (TOP / HEART / BASE), each with a gold label and notes listed below in text-shamal-white-dim
>      * Smooth height transition (max-height CSS transition, not framer-motion)
>    - Price row: "30ML" label small + "€100" large in text-shamal-white + "First edition · small batch" italic small text-shamal-white-dim
>    - CTA button: "RESERVE YOUR VOYAGE" — bg-shamal-gold text-shamal-black, px-8 py-4, text-xs tracking-[0.28em] uppercase
>    - Social proof: "★ 312 people are waiting for this voyage" — text-[11px] text-shamal-white-dim
>
> 4. Right column: bottle image with gold glow effect behind it (radial gradient, shamal-gold/20) and continuous floating animation (gentle up-down, CSS keyframes only). Image is editable via schema.
>
> 5. Scroll indicator between sections (same as hero): "SCROLL" label + gold gradient line, bottom-center.
>
> Animations: fade-in-up on scroll entry via IntersectionObserver (same pattern as shamal-story.tsx). Bottle float: add @keyframes bottle-float to app/styles/app.css — gentle 3s ease-in-out infinite alternate, translateY(-12px) to translateY(12px).
>
> Weaverse schema:
> - Background: backgroundImage
> - Voyage: momentLabel (default "MOMENT 01"), voyageName (default "First Voyage"), voyageSubtitle (default "Autumn forest after rain"), storyText
> - Notes: topNotes, heartNotes, baseNotes (all text fields, comma-separated values)
> - Bottle: bottleImage
> - Pricing: price (default "€100"), edition (default "First edition · small batch")
> - CTA: ctaText (default "Reserve Your Voyage"), ctaLink (default "/products/first-voyage")
> - Social proof: waitingCount (default "312"), showSocialProof (switch, default true)
>
> React 19 ref-as-prop pattern. Register in app/weaverse/components.ts. Run typecheck when done.

## Summary

A reusable fullscreen fragrance-scene section intended to be placed three times on the homepage (one per Moment). Left column carries the editorial copy — gold moment label, large Cormorant voyage name, italic subtitle, story paragraph, an expandable fragrance-notes panel (controlled, CSS `max-height` transition), price/edition row, primary CTA, and optional social proof. Right column carries a Weaverse-editable bottle image floating over a soft radial gold glow with a continuous `bottle-float` keyframe animation. Reveal is scroll-triggered via a one-shot `IntersectionObserver`, matching the shamal-story pattern.
