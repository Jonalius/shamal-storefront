import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import {
  CartForm,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticData,
} from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import type { CartApiQueryFragment } from "storefront-api.generated";
import type { CartLayoutType } from "~/types/others";
import type { CartLineOptimisticData } from "./cart-line-item";

export function CartLineQuantityAdjust({
  line,
}: {
  line: OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];
  layout?: CartLayoutType;
}) {
  const optimisticId = line?.id;
  const optimisticData =
    useOptimisticData<CartLineOptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === "undefined") {
    return null;
  }

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const { id: lineId, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex min-w-30 items-center justify-evenly border border-shamal-gold/30">
        <UpdateCartButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            type="submit"
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="inline-flex size-9 items-center justify-center text-shamal-white-dim transition hover:text-shamal-gold disabled:cursor-not-allowed disabled:text-shamal-white-dim/30"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1 || isOptimistic}
          >
            <MinusIcon />
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: prevQuantity }}
            />
          </button>
        </UpdateCartButton>

        <div
          className="min-w-8 px-2 text-center font-cormorant text-lg text-shamal-white"
          data-test="item-quantity"
        >
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            type="submit"
            className="inline-flex size-9 items-center justify-center text-shamal-white-dim transition hover:text-shamal-gold disabled:cursor-not-allowed disabled:text-shamal-white-dim/30"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
            disabled={isOptimistic}
          >
            <PlusIcon />
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: nextQuantity }}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
