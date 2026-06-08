# Work logs

## 2026-06-08 — round 1: cart route diagnostics (commit d36352e3)
- Wrapped cart action + `/cart.data` loader in try/catch with deep error logging.
- Deployed; reproduced add-to-cart. **No `[cart-diag]` lines appeared.** Verified the diagnostic build WAS live via `npx shopify hydrogen list` (latest deploy = "add temporary cart.data error diagnostics", matches local main tip d36352e3).
- Conclusion: error is thrown OUTSIDE the cart route. Logs show ~18 identical masked errors `{ name: 'Error', message: '' }` during a `/products/*.data` request.

## 2026-06-08 — round 2: widen the net
- Root cause of the masking found: `entry.server.tsx` `onError` did a bare `console.error(error)` for SSR render errors — Oxygen serialized only `{name, message}`. The 18× burst = render-time errors (per failing component/Suspense boundary), not loader throws.
- Added `app/utils/serialize-error.ts` (`serializeError`, `logErrorSync`, `logError`) — recursive, captures non-enumerable props (cause/graphQLErrors/errors) and thrown Response bodies.
- Wired into `entry.server.tsx`: deep-log in render `onError`, and new `handleError` export (catch-all for loader/action/data-request errors — covers Weaverse loaders).
- Refactored `cart-page.tsx` to use the shared util.
- `npm run typecheck` passes. Awaiting redeploy + reproduce.

## 2026-06-08 — round 3: ROOT CAUSE FOUND + fixed
- Stopped fighting Oxygen log masking. Ran a LOCAL PRODUCTION BUILD (`npm run build && npm run start`, MiniOxygen on :3000) using the production token from local .env. Reproduced add-to-cart — server console showed the real, unmasked error:
  `GraphQLError: [h2:error:storefront.query] Access denied for quantityAvailable field. Required access: unauthenticated_read_product_inventory access scope.`
- Stack traces: app/routes/products/product.tsx:30 (PRODUCT_QUERY) and recommended-product.ts:11 — both inherit `quantityAvailable` via PRODUCT_VARIANT_FRAGMENT (fragments.ts:5). The Storefront token lacks the inventory scope. Add-to-cart revalidates the product route loaders → they 500 → optimistic cart line can't reconcile → "line vanishes". The ~18x burst = product + each recommended product + collection cards. NOT an env-var issue; the cart fragments don't even include the field (so /cart.data was a red herring).
- FIX (Option B, user-chosen): removed `quantityAvailable` from PRODUCT_VARIANT_FRAGMENT; simplified the `=== -1` consumer at single-product/index.tsx:71 to rely on `availableForSale` ("Unavailable" label collapses to "Sold Out"). Only 2 references existed codebase-wide. Ran `npm run codegen`.
- Removed ALL temporary diagnostics: deleted app/utils/serialize-error.ts; reverted entry.server.tsx onError + removed handleError; unwrapped cart-page.tsx try/catch. `git diff e55c0a98` for those two files is empty (back to baseline).
- Verified on rebuilt prod preview: add-to-cart → POST 200 /cart.data, no errors, cart badge "1", cart page shows Discovery set qty 1 €80, valid checkout URL. `npm run typecheck` passes.
- NEXT: commit + deploy to production.
