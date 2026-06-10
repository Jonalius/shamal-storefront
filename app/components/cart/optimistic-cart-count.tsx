import { type CartReturn, useOptimisticCart } from "@shopify/hydrogen";
import { useResilientCartBase } from "~/hooks/use-resilient-cart-base";

/**
 * Computes the optimistic total quantity from a resolved cart and hands it to a
 * render prop. Calling useOptimisticCart here — rather than reading the raw
 * resolved `totalQuantity` — means the count reflects in-flight add/remove/update
 * submissions immediately. In particular the first add to a previously-empty
 * cart shows 1 right away instead of briefly showing 0 until the server
 * round-trip lands. Pass the resolved `rootData.cart` (critical data).
 *
 * `useResilientCartBase` keeps the count correct after a first add even when the
 * post-add revalidation reads no cart cookie (see that hook for the full race).
 */
export function OptimisticCartCount({
  cart,
  children,
}: {
  cart: CartReturn | null;
  children: (count: number) => React.ReactNode;
}) {
  const base = useResilientCartBase<CartReturn>(cart);
  const optimisticCart = useOptimisticCart<CartReturn>(base);
  return <>{children(optimisticCart?.totalQuantity ?? 0)}</>;
}
