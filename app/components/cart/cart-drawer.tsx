import { HandbagIcon, XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { type CartReturn, useAnalytics } from "@shopify/hydrogen";
import clsx from "clsx";
import { Suspense, useEffect, useRef } from "react";
import { Await, useLocation, useRouteLoaderData } from "react-router";
import { CartMain } from "~/components/cart/cart-main";
import type { RootLoader } from "~/root";
import { useCartDrawerStore } from "./store";

export function CartDrawer() {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const { publish } = useAnalytics();
  const {
    isOpen,
    close: closeCartDrawer,
    toggle: toggleCartDrawer,
  } = useCartDrawerStore();
  const location = useLocation();
  // Captured during the Await render so the trigger's analytics click can read
  // the resolved cart without needing the cart in scope at the Dialog.Root level.
  const cartRef = useRef<CartReturn | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close on route change
  useEffect(() => {
    closeCartDrawer();
  }, [location.pathname, closeCartDrawer]);

  // Dialog.Root is mounted unconditionally (NOT inside <Await>) so the
  // controlled `open` state set by AddToCartButton always reaches a live
  // dialog. Previously the dialog lived inside the deferred-cart <Await>; the
  // post-add-to-cart revalidation could re-suspend and unmount it at the exact
  // moment it was asked to open, dropping the open transition and leaving the
  // store stuck in an "open but not visible" state (fixed only by close +
  // re-add). The cart is now resolved only where its data is actually needed.
  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleCartDrawer}>
      <Dialog.Trigger
        onClick={() =>
          publish("custom_sidecart_viewed", { cart: cartRef.current })
        }
        className="relative flex h-8 w-8 items-center justify-center focus:ring-border"
      >
        <HandbagIcon className="h-5 w-5" />
        <Suspense fallback={null}>
          <Await resolve={rootData?.cart} errorElement={null}>
            {(cart) => {
              cartRef.current = (cart as CartReturn) ?? null;
              return cart && cart.totalQuantity > 0 ? (
                <div
                  className={clsx(
                    "cart-count",
                    "-right-1.5 absolute top-0",
                    "flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-center",
                    "text-center font-medium text-[13px] leading-none",
                    "transition-colors duration-300",
                    "group-hover/header:bg-(--color-header-text)",
                    "group-hover/header:text-(--color-header-bg)",
                  )}
                >
                  <span>{cart.totalQuantity}</span>
                </div>
              ) : null;
            }}
          </Await>
        </Suspense>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            "fixed inset-0 z-10 bg-shamal-black/70",
            "data-[state=open]:animate-[fade-in_150ms_ease-out]",
            "data-[state=closed]:animate-[fade-out_150ms_ease-in]",
          )}
        />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={clsx(
            "fixed inset-y-0 right-0 z-10 w-screen max-w-120 bg-shamal-black py-6 text-shamal-white",
            "border-shamal-gold/15 border-l",
            "data-[state=open]:animate-[enter-from-right_200ms_ease-out]",
            "data-[state=closed]:animate-[exit-to-right_200ms_ease-in]",
          )}
          aria-describedby={undefined}
        >
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-center justify-between gap-2 px-6">
              <Dialog.Title asChild>
                <span className="font-cormorant text-3xl text-shamal-white">
                  <Suspense fallback={<>Cart</>}>
                    <Await resolve={rootData?.cart} errorElement={<>Cart</>}>
                      {(cart) => (
                        <>
                          Cart
                          <span className="ml-2 text-xl text-shamal-white-dim italic">
                            ({cart?.totalQuantity || 0})
                          </span>
                        </>
                      )}
                    </Await>
                  </Suspense>
                </span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="translate-x-2 p-2 text-shamal-white-dim transition-colors duration-300 hover:text-shamal-gold"
                  aria-label="Close cart drawer"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <Suspense fallback={null}>
              <Await resolve={rootData?.cart} errorElement={null}>
                {(cart) => (
                  <CartMain layout="drawer" cart={cart as CartReturn} />
                )}
              </Await>
            </Suspense>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
