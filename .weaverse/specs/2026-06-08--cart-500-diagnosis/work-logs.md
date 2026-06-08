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
