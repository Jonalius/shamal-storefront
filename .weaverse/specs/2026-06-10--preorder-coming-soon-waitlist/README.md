---
status: complete
owner: Jonathan Rahm
created: 2026-06-10
---

# Pre-order Coming-Soon + Inline Waitlist

## Original prompt

> Continue the soft-launch coming-soon + waitlist build for perfume product pages,
> exactly as we discussed: pre-order-tagged products hide price + add-to-cart + qty
> and show "Ships end of June" + inline waitlist (Web3Forms key
> eb9f21a4-8439-4def-929c-b1f030d20f82, product-context copy, Weaverse-editable);
> non-pre-order products unchanged; extract a shared WaitlistForm component. Verify
> on local prod build, run typecheck + biome, don't deploy.

## Summary

For the soft launch, products tagged `pre-order` become a coming-soon experience: the
price, add-to-cart button, and quantity selector are hidden, replaced by a "Ships end
of June" eyebrow and an inline waitlist form that posts to Web3Forms (delivered to
info@shamal.fi) with the product title as context. Standard and refill products are
untouched. The Web3Forms submission logic is extracted into a shared `WaitlistForm`
component reused by both the standalone `shamal-waitlist` section and the new inline
product waitlist.
