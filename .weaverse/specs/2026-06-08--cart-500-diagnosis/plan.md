# Plan — surface the masked `/cart.data` 500

## Files touched
- `app/routes/cart/cart-page.tsx` — add `serializeError` + `logCartError` helpers; wrap the action's cart-mutation `switch` and the loader's `cart.get()` in try/catch that logs full detail then re-throws (behavior unchanged, still 500 — just logged).

## Logging approach
- `serializeError`: recursive (depth-capped, circular-safe) walk using `Object.getOwnPropertyNames` so non-enumerable props (`cause`, `graphQLErrors`, `errors`, `body`, `response`) are captured — plain `JSON.stringify(err)` drops these.
- `logCartError`: special-cases a thrown `Response` (or `err.cause` being a `Response`) and logs `status` / `statusText` / `headers` / awaited `body`, since a thrown `Response` is the prime suspect for the empty message.
- Both log under the `[cart-diag]` prefix for easy filtering in Oxygen logs.

## After diagnosis
- Remove both helpers and the try/catch wrappers (revert to plain loader/action).
- Apply the real fix once the trace identifies the cause (leading theory: `@inContext` country/locale mismatch on the live custom domain vs localhost).

## Verification
- `npm run typecheck` — passes.
- Deploy, reproduce add-to-cart on live, read `[cart-diag]` entries in Oxygen runtime logs.
