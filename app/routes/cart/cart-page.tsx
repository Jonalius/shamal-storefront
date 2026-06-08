import {
  Analytics,
  CartForm,
  type CartQueryDataReturn,
} from "@shopify/hydrogen";
import type {
  CartBuyerIdentityInput,
  CartLineInput,
  CartLineUpdateInput,
} from "@shopify/hydrogen/storefront-api-types";
import {
  type ActionFunctionArgs,
  data,
  Link,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router";
import invariant from "tiny-invariant";
import { CartMain } from "~/components/cart/cart-main";
import { logError } from "~/utils/serialize-error";

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action: cartFormAction, inputs } = CartForm.getFormInput(formData);

  invariant(cartFormAction, "No cartAction defined");

  const status = 200;
  let result: CartQueryDataReturn;

  try {
    switch (cartFormAction) {
      case CartForm.ACTIONS.LinesAdd:
        result = await cart.addLines(inputs.lines as CartLineInput[]);
        break;
      case CartForm.ACTIONS.LinesUpdate:
        result = await cart.updateLines(inputs.lines as CartLineUpdateInput[]);
        break;
      case CartForm.ACTIONS.LinesRemove:
        result = await cart.removeLines(inputs.lineIds as string[]);
        break;
      case CartForm.ACTIONS.NoteUpdate: {
        const cartNote = inputs.cartNote as string;
        if (cartNote) {
          result = await cart.updateNote(cartNote);
        }
        break;
      }
      case CartForm.ACTIONS.DiscountCodesUpdate: {
        const formDiscountCode = inputs.discountCode;
        const discountCodes = (
          formDiscountCode ? [formDiscountCode] : []
        ) as string[];
        discountCodes.push(...(inputs.discountCodes as string[]));
        result = await cart.updateDiscountCodes(discountCodes);
        break;
      }
      case CartForm.ACTIONS.GiftCardCodesAdd: {
        const giftCardCodes = (inputs.giftCardCodes as string[]) || [];
        result = await cart.addGiftCardCodes(giftCardCodes);
        break;
      }
      case CartForm.ACTIONS.GiftCardCodesUpdate: {
        // Just keep this for backward compatibility, same as add gift card codes
        const giftCardCodes = (inputs.giftCardCodes as string[]) || [];
        result = await cart.addGiftCardCodes(giftCardCodes);
        break;
      }
      case CartForm.ACTIONS.GiftCardCodesRemove: {
        const giftCardIds = inputs.giftCardCodes as string[];
        result = await cart.removeGiftCardCodes(giftCardIds);
        break;
      }
      case CartForm.ACTIONS.BuyerIdentityUpdate:
        result = await cart.updateBuyerIdentity({
          ...(inputs.buyerIdentity as CartBuyerIdentityInput),
        });
        break;
      default:
        console.error("Unknown cart action:", cartFormAction);
        console.error("Available actions:", Object.keys(CartForm.ACTIONS));
        invariant(false, `${cartFormAction} cart action is not defined`);
    }
  } catch (err) {
    await logError(`cart action: ${cartFormAction}`, err);
    throw err;
  }

  let headers = {};
  if (result?.cart?.id) {
    headers = cart.setCartId(result.cart.id);
  }

  const redirectTo = formData.get("redirectTo") ?? null;
  if (typeof redirectTo === "string" && isLocalPath(redirectTo)) {
    return redirect(redirectTo);
  }

  const { cart: cartResult, errors, userErrors } = result || {};

  return data({ cart: cartResult, userErrors, errors }, { status, headers });
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart } = context;

  try {
    return {
      cart: await cart.get(),
    };
  } catch (err) {
    await logError("cart.data loader cart.get()", err);
    throw err;
  }
}

export default function CartRoute() {
  const { cart } = useLoaderData<typeof loader>();
  const itemCount = cart?.totalQuantity || 0;

  return (
    <div className="flex min-h-screen flex-col bg-shamal-black text-shamal-white">
      <section className="grow pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <header className="flex flex-col items-center text-center">
            <span className="text-[10px] font-light tracking-[0.4em] text-shamal-gold uppercase">
              Your Selection
            </span>
            <div aria-hidden="true" className="mt-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-shamal-gold/55" />
              <span className="text-[10px] text-shamal-gold">◆</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-shamal-gold/55" />
            </div>
            <h1 className="mt-6 font-cormorant text-5xl font-light text-shamal-white md:text-6xl">
              Cart
              {itemCount > 0 && (
                <span className="ml-3 align-middle font-cormorant text-2xl text-shamal-white-dim italic md:text-3xl">
                  ({itemCount})
                </span>
              )}
            </h1>
          </header>

          <div className="mt-16 md:mt-20">
            <CartMain layout="page" cart={cart} />
            <Analytics.CartView />
          </div>
        </div>
      </section>

      <CartFooter />
    </div>
  );
}

function CartFooter() {
  return (
    <footer className="border-shamal-gold/15 border-t bg-shamal-black px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-xs font-light text-shamal-white-dim">
          © 2026 Shamal. All rights reserved.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-light tracking-[0.2em] text-shamal-white-dim uppercase">
          <li>
            <Link
              to="/policies/shipping-policy"
              className="transition-colors duration-300 hover:text-shamal-gold"
            >
              Shipping
            </Link>
          </li>
          <li>
            <Link
              to="/policies/privacy-policy"
              className="transition-colors duration-300 hover:text-shamal-gold"
            >
              Privacy
            </Link>
          </li>
          <li>
            <Link
              to="/policies/terms-of-service"
              className="transition-colors duration-300 hover:text-shamal-gold"
            >
              Terms
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

function isLocalPath(url: string) {
  try {
    new URL(url);
  } catch (e) {
    return true;
  }
  return false;
}
