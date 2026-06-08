# Cart `/cart.data` 500 — production diagnosis

- **Status:** Resolved (fix applied + verified locally; awaiting prod deploy)
- **Owner:** Jonathan Rahm
- **Created:** 2026-06-08

## Original prompt (verbatim)

> Got the production logs. When I add to cart, the Oxygen runtime logs show a burst of ~18 identical errors at the same timestamp, all masked as:
> ERROR { name: 'Error', message: '' }
> Request ID: 03722dc6-6c1e-46de-9ded-c244d2bccdf5-1780931847
>
> The error message is EMPTY — Oxygen is swallowing the real error detail in production. The cart.data loader is just cart.get() with no .catch, so whatever cart.get() throws is masked.
>
> I need to surface the real error. Please:
> 1. Add temporary error logging to the cart.data route loader (and/or the cart action in cart-page.tsx) that catches the error and logs its full detail — message, stack, cause, and if it's a GraphQL error, the graphQLErrors/response body. Something like try/catch that does console.error(JSON.stringify(err, Object.getOwnPropertyNames(err))) so even non-enumerable error properties show up.
> 2. Also check: Hydrogen/Shopify often wrap Storefront API errors in a way where the message is on err.cause or err.graphQLErrors rather than err.message — make sure the logging digs into those.
> 3. The empty message strongly suggests a thrown Response object (like throw new Response('', {status: 500})) or a GraphQL error array being thrown. Check what cart.get() and the CART_QUERY can throw.
> 4. Tell me what to deploy so the next time I reproduce on the live site, the logs show the actual error detail.
>
> Once I redeploy with this logging and reproduce, the logs will show the real cause. Make the logging change, run typecheck, and tell me to deploy.

## Summary

Adding to cart 500s only on the live Oxygen deployment (`/cart.data` loader + cart action), masked as `{ name: 'Error', message: '' }`. Confirmed earlier this session that the `.append` cookie fix IS live and all cart-critical env vars are set in production, so the cause is something `cart.get()` / the cart mutation throws at runtime. This spec covers temporary diagnostic logging that serializes non-enumerable error props (`cause`, `graphQLErrors`) and any thrown `Response` body so the real cause surfaces in Oxygen logs. **Logging is temporary and must be removed once the cause is found.**
