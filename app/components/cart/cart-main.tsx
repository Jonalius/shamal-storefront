import { useOptimisticCart } from "@shopify/hydrogen";
import clsx from "clsx";
import { useRef } from "react";
import { Link as RouterLink } from "react-router";
import useScroll from "react-use/esm/useScroll";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { ScrollArea } from "~/components/scroll-area";
import { useResilientCartBase } from "~/hooks/use-resilient-cart-base";
import type { CartLayoutType } from "~/types/others";
import { CartLineItem } from "./cart-line-item";
import { CartSummary } from "./cart-summary";

function CartEmpty({
  hidden = false,
  layout = "drawer",
  onClose,
}: {
  hidden: boolean;
  layout?: CartLayoutType;
  onClose?: () => void;
}) {
  const scrollRef = useRef(null);

  if (layout === "page") {
    return (
      <div
        ref={scrollRef}
        hidden={hidden}
        className="flex w-full flex-col items-center gap-6 py-16 text-center"
      >
        <p className="font-cormorant text-2xl text-shamal-white-dim italic md:text-3xl">
          Your cart is empty.
        </p>
        <RouterLink
          to="/collections/perfumes"
          className="group/cta inline-flex items-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase"
        >
          <span className="relative">
            Discover Nordic Seasons
            <span className="-bottom-1 absolute right-0 left-0 h-px origin-left scale-x-0 bg-shamal-gold transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
          </span>
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex h-screen-dynamic flex-col content-start justify-center gap-6 overflow-y-scroll px-6 pb-6 text-center"
      hidden={hidden}
    >
      <p className="font-cormorant text-2xl text-shamal-white-dim italic">
        Your cart is empty.
      </p>
      <RouterLink
        to="/collections/perfumes"
        onClick={onClose}
        className="group/cta inline-flex items-center justify-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase"
      >
        <span className="relative">
          Discover Nordic Seasons
          <span className="-bottom-1 absolute right-0 left-0 h-px origin-left scale-x-0 bg-shamal-gold transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
        </span>
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  );
}

export function CartMain({
  layout,
  onClose,
  cart: originalCart,
}: {
  layout: CartLayoutType;
  onClose?: () => void;
  cart: CartApiQueryFragment;
}) {
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);
  const base = useResilientCartBase<CartApiQueryFragment>(originalCart);
  const cart = useOptimisticCart<CartApiQueryFragment>(base);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = Boolean(cart) && cart.totalQuantity > 0;

  return (
    <>
      <CartEmpty hidden={linesCount} onClose={onClose} layout={layout} />
      <div
        className={clsx(
          layout === "drawer" &&
            "grid grow grid-cols-1 grid-rows-[1fr_auto] px-6",
          layout === "page" && [
            "w-full",
            linesCount &&
              "grid items-start gap-12 md:gap-12 lg:grid-cols-[1fr_440px]",
          ],
        )}
      >
        <div
          ref={scrollRef}
          className={clsx([
            layout === "page" && linesCount && "pb-4",
            layout === "drawer" && "-mx-6 pb-4 transition",
            layout === "drawer" && y > 0 && "border-shamal-gold/15 border-t",
          ])}
        >
          <ScrollArea
            className={clsx(layout === "drawer" && "max-h-[calc(100vh-312px)]")}
            size="sm"
          >
            <ul
              className={clsx(
                "grid divide-y divide-shamal-gold/15 border-shamal-gold/15 border-y",
                layout === "drawer" && "px-6",
              )}
            >
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </ScrollArea>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </>
  );
}
