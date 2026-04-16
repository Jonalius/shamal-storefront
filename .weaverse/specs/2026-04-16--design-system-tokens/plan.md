# Plan

## Files touched

- `app/styles/app.css` — all changes live here

## Steps

1. Add Google Fonts `@import` for Cormorant Garamond at the top of the file (before `@import "tailwindcss"`)
2. Add Shamal color tokens inside the existing `@theme` block:
   - `--color-shamal-black: #0d0d0d`
   - `--color-shamal-surface: #161616`
   - `--color-shamal-gold: #C9A84C`
   - `--color-shamal-gold-dim: rgba(201, 168, 76, 0.6)`
   - `--color-shamal-white: #FFFFFF`
   - `--color-shamal-white-dim: rgba(255, 255, 255, 0.55)`
3. Add `--font-cormorant` font token in the existing `@theme` block
4. Add `@apply font-cormorant` to the heading selector block in `@layer utilities`
