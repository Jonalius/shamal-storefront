import { CartForm } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import { useFetchers } from "react-router";

/**
 * Returns the cart that optimistic UI should treat as its base, hardened
 * against a first-add race seen only on the live (Oxygen) site.
 *
 * On a first add to an empty cart the cart-id cookie is written by the `/cart`
 * action response, but React Router's Single Fetch dispatches the root-loader
 * revalidation as a *separate* request that can fire before the browser has
 * committed that cookie. That revalidation's `cart.get()` then reads no cookie
 * and returns an empty cart, so the instant the add fetcher settles to `idle`
 * (dropping `useOptimisticCart`'s overlay) the freshly-added line collapses
 * onto an empty base and momentarily vanishes — until the next navigation, when
 * the cookie is present and root data catches up. No server-side Set-Cookie fix
 * can close this window: it's the browser dispatching the revalidation before
 * committing the cookie.
 *
 * The fix: remember the cart returned by the most recent settled `/cart` action
 * and, *only when the base cart is empty*, fall back to it. We never prefer the
 * action cart while a cart mutation is in flight, so `useOptimisticCart`'s
 * overlay (which keys off `fetcher.formData`, present through `submitting` and
 * `loading`, cleared at `idle`) is never double-counted on top of an action
 * cart that already includes the pending line. Once root data reflects the cart
 * again (cookie committed on the next navigation), the base is non-empty and the
 * action cart is ignored — the UI reconciles seamlessly.
 *
 * `useFetchers()` is global, so every consumer of this hook independently
 * observes the same fetchers and computes the same base — no shared store
 * needed.
 */
export function useResilientCartBase<T extends { totalQuantity: number }>(
  baseCart: T | null,
): T | null {
  const fetchers = useFetchers();
  const [lastActionCart, setLastActionCart] = useState<T | null>(null);

  // A cart mutation is "in flight" while any fetcher carries cart form data.
  // This matches exactly when useOptimisticCart applies its overlay.
  let pendingMutation = false;
  // During the `loading` phase the action has already returned its result (the
  // cart including the new line) while revalidation is still running. Capture
  // it so it survives the fetcher going `idle` (when it leaves `useFetchers()`).
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
    if (cart) {
      settledActionCart = cart;
    }
  }

  useEffect(() => {
    if (settledActionCart) {
      setLastActionCart(settledActionCart);
    }
  }, [settledActionCart]);

  // While a mutation is pending, let the overlay drive the count off the real
  // base — never the action cart (that would double-count the in-flight line).
  if (pendingMutation) {
    return baseCart;
  }

  // Settled: if the base came back empty (revalidation read no cookie) but a
  // recent action produced a non-empty cart, render that until root catches up.
  const baseEmpty = !baseCart || baseCart.totalQuantity === 0;
  if (baseEmpty && lastActionCart && lastActionCart.totalQuantity > 0) {
    return lastActionCart;
  }
  return baseCart;
}
