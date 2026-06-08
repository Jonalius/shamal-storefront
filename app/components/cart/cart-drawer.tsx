import { HandbagIcon, XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { type CartReturn, useAnalytics } from "@shopify/hydrogen";
import clsx from "clsx";
import { useEffect } from "react";
import { useLocation, useRouteLoaderData } from "react-router";
import { CartMain } from "~/components/cart/cart-main";
import { OptimisticCartCount } from "~/components/cart/optimistic-cart-count";
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

  // Cart is loaded as critical (awaited) data in the root loader, so it is
  // always a resolved value here — no <Await>/<Suspense> needed. This is what
  // lets the drawer reconcile an optimistic add straight onto an up-to-date
  // base cart instead of a stale/empty deferred one, which previously made a
  // first-add item flash in and then vanish when the add fetcher settled.
  const cart = (rootData?.cart as CartReturn) ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: close on route change
  useEffect(() => {
    closeCartDrawer();
  }, [location.pathname, closeCartDrawer]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleCartDrawer}>
      <Dialog.Trigger
        onClick={() => publish("custom_sidecart_viewed", { cart })}
        className="relative flex h-8 w-8 items-center justify-center focus:ring-border"
      >
        <HandbagIcon className="h-5 w-5" />
        <OptimisticCartCount cart={cart}>
          {(count) =>
            count > 0 ? (
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
                <span>{count}</span>
              </div>
            ) : null
          }
        </OptimisticCartCount>
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
                  <OptimisticCartCount cart={cart}>
                    {(count) => (
                      <>
                        Cart
                        <span className="ml-2 text-xl text-shamal-white-dim italic">
                          ({count})
                        </span>
                      </>
                    )}
                  </OptimisticCartCount>
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
            <CartMain layout="drawer" cart={cart as CartReturn} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
