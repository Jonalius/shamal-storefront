---
status: complete
owner: jonathan.rahm@shamal.fi
created: 2026-04-16
---

# Design System Tokens

## Original Prompt

> You are working on the Shamal fragrance brand Shopify storefront. Read the CLAUDE.md file first to understand the project, then read the current project structure.
>
> Confirm you understand:
> 1. The brand identity and design system
> 2. The Weaverse schema requirement for all sections
> 3. The file structure conventions
>
> Once confirmed, your first task is to update the Tailwind configuration with the Shamal color palette and typography as defined in CLAUDE.md and in .claude/skills/design-system.md.
>
> Then update the global CSS to import Cormorant Garamond from Google Fonts as the primary heading font.
>
> Use context7 to verify current Tailwind v4 configuration syntax before making changes.

## Summary

Adds the Shamal brand color palette (`shamal-black`, `shamal-surface`, `shamal-gold`, `shamal-gold-dim`, `shamal-white`, `shamal-white-dim`) and `font-cormorant` typography token to the Tailwind v4 `@theme` block in `app.css`. Also adds the Google Fonts import for Cormorant Garamond and applies it as the default heading font stack.
