import { TrashIcon } from "@phosphor-icons/react";
import {
  CartForm,
  Money,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
import clsx from "clsx";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { RevealUnderline } from "~/components/reveal-underline";
import { Skeleton } from "~/components/skeleton";
import type { CartLayoutType } from "~/types/others";
import { calculateAspectRatio } from "~/utils/image";
import { CartLineQuantityAdjust } from "./cart-line-qty-adjust";
import { useCartDrawerStore } from "./store";

type CartLine = OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];

export type CartLineOptimisticData = {
  action?: string;
  quantity?: number;
};

export function CartLineItem({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayoutType;
}) {
  const { close: closeCartDrawer } = useCartDrawerStore();
  const optimisticData = useOptimisticData<CartLineOptimisticData>(line?.id);

  if (!line?.id) {
    return null;
  }

  const { id, quantity, merchandise, isOptimistic: lineOptimistic } = line;
  /**
   * Determines if the current line item is in an optimistic state.
   * Note: The isOptimistic field on the line does not update as documented
   * in https://shopify.dev/docs/api/hydrogen/latest/hooks/useoptimisticcart#useOptimisticCart-returns,
   * so we manually check it via the optimisticData object when lineOptimistic is undefined.
   */
  const isOptimistic =
    lineOptimistic === undefined
      ? JSON.stringify(optimisticData) !== "{}"
      : lineOptimistic;

  if (typeof quantity === "undefined" || !merchandise?.product) {
    return null;
  }

  const { image, title, product, selectedOptions } = merchandise;
  let url = `/products/${product.handle}`;
  if (selectedOptions?.length) {
    const params = new URLSearchParams();
    for (const option of selectedOptions) {
      params.append(option.name, option.value);
    }
    url += `?${params.toString()}`;
  }
  let isDefaultVariant = false;
  if (selectedOptions?.length === 1) {
    const { name, value } = selectedOptions[0];
    isDefaultVariant = name === "Title" && value === "Default Title";
  }

  const isPage = layout === "page";
  return (
    <li
      className={clsx("flex gap-4", isPage && "py-6 md:gap-8 md:py-8")}
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: optimisticData?.action === "remove" ? "none" : "flex",
      }}
    >
      <div className={clsx("relative shrink-0", isPage && "bg-shamal-surface")}>
        {image && (
          <Image
            width={250}
            height={250}
            data={image}
            className={clsx("h-auto", isPage ? "w-28 md:w-32" : "w-24")}
            alt={title}
            aspectRatio={calculateAspectRatio(image, "adapt")}
          />
        )}
      </div>
      <div className="flex grow flex-col gap-3">
        <div className="flex justify-between gap-4">
          <div>
            <div
              className={clsx(
                isPage &&
                  "font-cormorant text-2xl text-shamal-white md:text-3xl",
              )}
            >
              {product?.handle ? (
                <Link
                  to={url}
                  className={clsx(
                    "inline-block",
                    isPage &&
                      "transition-colors duration-300 hover:text-shamal-gold",
                  )}
                  onClick={closeCartDrawer}
                >
                  {isPage ? (
                    product?.title || ""
                  ) : (
                    <RevealUnderline>{product?.title || ""}</RevealUnderline>
                  )}
                </Link>
              ) : (
                <p>{product?.title || ""}</p>
              )}
            </div>
            {!isDefaultVariant && (
              <div
                className={clsx(
                  "space-y-0.5 text-sm",
                  isPage
                    ? "mt-2 text-[11px] tracking-[0.2em] text-shamal-white-dim uppercase"
                    : "text-gray-500",
                )}
              >
                {title}
              </div>
            )}
          </div>
          {layout === "drawer" && (
            <ItemRemoveButton lineId={id} className="-mt-1.5 -mr-2" />
          )}
        </div>
        <div
          className={clsx(
            "flex items-center gap-2",
            layout === "drawer" && "justify-between",
            isPage && "mt-2 justify-between",
          )}
        >
          <div className="flex items-center gap-4">
            <CartLineQuantityAdjust line={line} layout={layout} />
            {layout === "page" && (
              <ItemRemoveButton lineId={id} layout="page" />
            )}
          </div>
          <CartLinePrice
            line={line}
            isOptimistic={isOptimistic}
            layout={layout}
          />
        </div>
      </div>
    </li>
  );
}

function ItemRemoveButton({
  lineId,
  layout,
  className,
}: {
  lineId: CartLine["id"];
  layout?: CartLayoutType;
  className?: string;
}) {
  const isPage = layout === "page";
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds: [lineId] }}
    >
      {isPage ? (
        <button
          className={clsx(
            "text-[11px] font-light tracking-[0.28em] text-shamal-white-dim uppercase transition-colors duration-300 hover:text-shamal-gold",
            className,
          )}
          type="submit"
        >
          Remove
        </button>
      ) : (
        <button
          className={clsx(
            "flex h-8 w-8 items-center justify-center border-none",
            className,
          )}
          type="submit"
        >
          <span className="sr-only">Remove</span>
          <TrashIcon aria-hidden="true" className="size-4.5" />
        </button>
      )}
      <OptimisticInput id={lineId} data={{ action: "remove" }} />
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = "regular",
  isOptimistic,
  layout,
}: {
  line: CartLine;
  priceType?: "regular" | "compareAt";
  isOptimistic?: boolean;
  layout?: CartLayoutType;
}) {
  if (!(line?.cost?.amountPerQuantity && line?.cost?.totalAmount)) {
    return null;
  }

  const moneyV2 =
    priceType === "regular"
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  const isPage = layout === "page";

  if (isOptimistic) {
    return (
      <Skeleton
        as="span"
        className={clsx(
          "ml-auto h-4 w-16 rounded",
          isPage && "bg-shamal-white-dim/15",
        )}
      />
    );
  }
  return (
    <Money
      withoutTrailingZeros
      as="span"
      data={moneyV2}
      className={clsx(
        "ml-auto",
        isPage && "font-cormorant text-xl text-shamal-white md:text-2xl",
      )}
    />
  );
}
