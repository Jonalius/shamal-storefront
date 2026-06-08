import { HandbagIcon } from "@phosphor-icons/react";
import type { CartReturn } from "@shopify/hydrogen";
import { useRouteLoaderData } from "react-router";
import { OptimisticCartCount } from "~/components/cart/optimistic-cart-count";
import { useCartDrawerStore } from "~/components/cart/store";
import type { RootLoader } from "~/root";
import { cn } from "~/utils/cn";

/**
 * Shared Shamal bag-icon button. Opens the cart drawer (same Zustand store the
 * AddToCartButton uses) and shows a gold item-count badge when the cart is not
 * empty. Used in the Shamal hero nav and reusable on collection/product pages.
 */
export function ShamalCartTrigger({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const openCartDrawer = useCartDrawerStore((state) => state.open);
  const rootData = useRouteLoaderData<RootLoader>("root");
  // Cart is critical (awaited) root data, so it is always resolved here.
  const cart = (rootData?.cart as CartReturn) ?? null;

  return (
    <button
      type="button"
      aria-label="Open cart"
      onClick={openCartDrawer}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center text-shamal-white transition-colors duration-300 hover:text-shamal-gold",
        className,
      )}
    >
      <HandbagIcon className={cn("h-5 w-5", iconClassName)} weight="light" />
      <OptimisticCartCount cart={cart}>
        {(count) =>
          count > 0 ? (
            <span className="-top-0.5 -right-1 absolute font-medium text-[10px] text-shamal-gold leading-none tabular-nums">
              {count}
            </span>
          ) : null
        }
      </OptimisticCartCount>
    </button>
  );
}
