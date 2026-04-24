---
status: in-progress
owner: Jonathan Rahm
created: 2026-04-23
---

# Shamal Hero Section

## Original prompt

> Create `app/sections/shamal-hero.tsx` — the homepage hero section, matching the Lovable design at https://preview--aroma-whispers-journey.lovable.app/ (first screen).
>
> Visual structure, centered, over a fullscreen background image:
>
> 1. Top nav bar — SHAMAL wordmark top-left in font-cormorant with wide letter-spacing, nav links "Our Story / The Voyages / The Journal / Shop" and a cart icon top-right. Transparent on load; switches to solid bg-shamal-black with a hairline bottom border after 50px scroll (useEffect + scroll listener, no external library). This nav lives inside the hero section for now; we'll extract it to a shared header in a later task.
>
> 2. Fullscreen hero container: min-h-screen, bg-shamal-black, editable background image covering the viewport. Dark gradient overlay (from-shamal-black/40 via-shamal-black/30 to-shamal-black) for text legibility.
>
> 3. Centered content column, max-width around 640px:
>    - SHAMAL wordmark: font-cormorant, tracking-[0.55em], text-shamal-gold, size text-5xl md:text-6xl, with ml-[0.55em] so the tracked caps visually center
>    - Thin gold divider: 1px tall, 200px wide, linear-gradient transparent → shamal-gold/55 → transparent
>    - Italic "— Helsinki —" in cormorant italic, text-shamal-white-dim, small, lightly letter-spaced
>    - Headline: "Where Nordic Silence Meets Eastern Mystery" — font-cormorant font-light, text-5xl md:text-6xl lg:text-7xl, text-shamal-white, leading-tight, mt-12
>    - Subtext: "Artisan fragrances handcrafted in Helsinki, blending ancient oud with the untouched Nordic wilderness." — system sans, text-base md:text-lg, text-shamal-white-dim, max-w-lg, leading-relaxed
>    - Two CTAs, horizontal desktop / stacked mobile, gap-3:
>      * Primary: "Begin Your Journey" — bg-shamal-gold text-shamal-black, px-10 py-4, text-xs font-medium tracking-[0.28em] uppercase, hover:bg-shamal-gold/90. Default link: `/products/discovery-set`.
>      * Secondary: "Join the Waitlist" — transparent bg, border border-shamal-gold-dim/60 text-shamal-gold, same padding and type scale, hover:bg-shamal-gold/10 hover:border-shamal-gold. Default link: `#waitlist` (will open the waitlist modal in a later task).
>    - Teaser line: two thin gold lines flanking "Summer Fragrance Löyly · Arriving Soon" — text-[10px] tracking-[0.4em] uppercase text-shamal-white-dim
>
> 4. Scroll indicator bottom-center: small "SCROLL" label (tracked, gold-dim) above a 1px × 36px gold gradient line.
>
> Motion: CSS animations only, no framer-motion. Fade-in-up on mount for wordmark, headline, subtext, buttons, teaser — staggered at ~150ms intervals. Add @keyframes to `app/styles/app.css` if Tailwind arbitrary utilities don't cover it.
>
> Weaverse schema — export `schema` via `createSchema` from `@weaverse/hydrogen`. Expose as editable inputs, grouped logically:
> - Background: backgroundImage (image picker)
> - Brand: wordmark (default "SHAMAL"), dividerSubtitle (default "— Helsinki —")
> - Copy: headline, subtext
> - Primary CTA: primaryCtaText (default "Begin Your Journey"), primaryCtaLink (default "/products/discovery-set")
> - Secondary CTA: secondaryCtaText (default "Join the Waitlist"), secondaryCtaLink (default "#waitlist")
> - Teaser: teaserText (default "Summer Fragrance Löyly · Arriving Soon"), showTeaser (boolean, default true)
>
> Export a forwardRef default component matching the Pilot theme's existing section conventions — check two or three files in `app/sections/` first for the reference pattern (props shape, ref typing, schema format). Preserve TypeScript strictness. No inline styles except where genuinely dynamic (the background-image URL).
>
> After creating the file:
> 1. Register it in `app/weaverse/components.ts` following the existing registration pattern.
> 2. Run `npm run typecheck` — fix any errors before finishing.
> 3. Confirm Biome format ran (the hook should handle it automatically).
>
> Placeholder background image: use an atmospheric photograph of misty Finnish forest with golden rim light — Unsplash search "misty forest golden hour" or "autumn forest rain" lands it. Download to `public/placeholders/hero-forest.jpg` and reference from there. Leave a `TODO: replace with real Shamal photography` comment next to the default image path in the schema so we remember.
>
> Do not build the other sections (story, voyage scenes, discovery, shop grid, journal, waitlist, footer) yet. Hero only. Report back when `typecheck` passes and the section renders in Weaverse Studio.

## Summary

Homepage hero section for Shamal's storefront matching the Lovable reference design: fullscreen dark hero with atmospheric Finnish forest background, centered SHAMAL wordmark, divider, cinematic headline, paired CTAs, scroll indicator, and a transparent-on-load top nav that solidifies after 50px of scroll. Motion is pure CSS (fade-in-up staggered), all copy and CTA links are schema-editable in Weaverse Studio, and the section is registered in `app/weaverse/components.ts`.

## Notes / deviations from prompt

- The Pilot theme does **not** use `forwardRef` — it uses the React 19 ref-as-prop pattern (`ref: React.Ref<HTMLElement>` on the props interface, destructured from props). Per CLAUDE.md and `.claude/skills/weaverse-patterns.md`, and consistent with every existing section in `app/sections/`. Confirmed with user before starting.
- The top nav is embedded in the hero component for now. Planned extraction to a shared header in a later task.
