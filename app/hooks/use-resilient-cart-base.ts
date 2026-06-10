import { CartForm } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import { useFetchers } from "react-router";

/** Parse a cart's server `updatedAt` to epoch ms, or null if absent/invalid. */
function cartUpdatedAtMs(cart: unknown): number | null {
  const raw = (cart as { updatedAt?: string } | null | undefined)?.updatedAt;
  if (!raw) {
    return null;
  }
  const ms = Date.parse(raw);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Returns the cart that optimistic UI should treat as its base, hardened
 * against a cookie-timing race seen only on the live (Oxygen) site that affects
 * EVERY cart mutation (add / update / remove).
 *
 * The cart-id cookie is written by the `/cart` action response, but React
 * Router's Single Fetch dispatches the post-mutation root revalidation as a
 * *separate* request that can fire before the browser commits that cookie (and,
 * with a pending customer-account session, before the latest cart state is
 * readable). That revalidation's `cart.get()` then returns a stale or empty
 * cart, so the instant the fetcher settles to `idle` (dropping
 * `useOptimisticCart`'s overlay) the UI snaps back to that stale base: a first
 * add vanishes, a second add isn't shown, a removal reappears — until the next
 * navigation, when root data catches up. No server-side Set-Cookie fix can close
 * this window; it's the browser dispatching the revalidation before committing.
 *
 * The fix: remember the cart the most recent settled `/cart` action returned
 * (the full mutate fragment carries lines + `updatedAt`) and prefer it over the
 * base **whenever the base hasn't caught up to it** — i.e. the action cart's
 * `updatedAt` is strictly newer, or there is no base cart at all. `updatedAt` is
 * the server's monotonic freshness marker, so this works for every mutation
 * type, including removals (the action cart already omits the removed line, so
 * it disappears immediately rather than being reasserted). Once root data
 * reaches the same `updatedAt`, the base is used and there is no lingering
 * divergence.
 *
 * We never prefer the action cart while a mutation is in flight — there we
 * return the base and let `useOptimisticCart`'s overlay (which keys off
 * `fetcher.formData`, present through `submitting`/`loading`, cleared at `idle`)
 * apply the pending change exactly once, so it is never double-counted on top of
 * an action cart that already includes it.
 *
 * `useFetchers()` is global, so every consumer independently observes the same
 * fetchers and computes the same base — no shared store needed.
 */
export function useResilientCartBase<T extends { totalQuantity: number }>(
  baseCart: T | null,
): T | null {
  const fetchers = useFetchers();
  const [lastActionCart, setLastActionCart] = useState<T | null>(null);

  // A cart mutation is "in flight" while any fetcher carries cart form data —
  // this matches exactly when useOptimisticCart applies its overlay. While
  // in flight (incl. the `loading` phase, where the action result is already
  // available) capture the freshest action cart by `updatedAt`.
  let pendingMutation = false;
  let settledActionCart: T | null = null;
  for (const fetcher of fetchers) {
    if (!fetcher.formData) {
      continue;
    }
    const { action } = CartForm.getFormInput(fetcher.formData);
    if (!action) {
      continue;
    }
    pendingMutation = true;
    const cart = (fetcher.data as { cart?: T } | undefined)?.cart;
    if (
      cart &&
      (!settledActionCart ||
        (cartUpdatedAtMs(cart) ?? 0) >=
          (cartUpdatedAtMs(settledActionCart) ?? 0))
    ) {
      settledActionCart = cart;
    }
  }

  // Persist the freshest settled action cart so it survives the fetcher dropping
  // out of useFetchers() at idle. Only ever move forward in `updatedAt`.
  useEffect(() => {
    if (!settledActionCart) {
      return;
    }
    setLastActionCart((prev) =>
      !prev ||
      (cartUpdatedAtMs(settledActionCart) ?? 0) >= (cartUpdatedAtMs(prev) ?? 0)
        ? settledActionCart
        : prev,
    );
  }, [settledActionCart]);

  // While a mutation is pending, let the overlay drive the UI off the real base
  // — never the action cart (that would double-count the in-flight change).
  if (pendingMutation) {
    return baseCart;
  }

  // Settled: prefer the latest action cart whenever root data hasn't caught up
  // to it (no base, or the action cart's updatedAt is strictly newer).
  if (lastActionCart) {
    if (!baseCart) {
      return lastActionCart;
    }
    const actionTs = cartUpdatedAtMs(lastActionCart);
    const baseTs = cartUpdatedAtMs(baseCart);
    if (actionTs != null && (baseTs == null || actionTs > baseTs)) {
      return lastActionCart;
    }
  }
  return baseCart;
}
