import { Money } from "@shopify/hydrogen";
import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { ProductQuery } from "storefront-api.generated";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { cn } from "~/utils/cn";

// The refill is a single universal SKU; the customer notes which voyage in the
// order notes at checkout. We pull the live product so price + buy flow are real.
const DEFAULT_REFILL_HANDLE = "refill";

type RefillProduct = NonNullable<ProductQuery["product"]>;

interface RefillLoaderData {
  product: RefillProduct | null;
}

interface ShamalRefillData {
  productHandle: string;
  backgroundImage: WeaverseImage | string;
  productImage: WeaverseImage | string;
  socialProof: string;
  label: string;
  headline: string;
  subheadline: string;
  bodyText: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  voyageNote: string;
  priceFallback: string;
  shippingNote: string;
  ctaText: string;
  soldOutText: string;
  dispatchNote: string;
}

interface ShamalRefillProps
  extends HydrogenComponentProps<RefillLoaderData>,
    ShamalRefillData {
  ref: React.Ref<HTMLElement>;
}

export default function ShamalRefill(props: ShamalRefillProps) {
  const {
    ref,
    loaderData,
    productHandle: _productHandle,
    backgroundImage,
    productImage,
    socialProof,
    label,
    headline,
    subheadline,
    bodyText,
    benefit1,
    benefit2,
    benefit3,
    voyageNote,
    priceFallback,
    shippingNote,
    ctaText,
    soldOutText,
    dispatchNote,
    ...rest
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function revealClass() {
    return visible ? "animate-fade-in-up" : "opacity-0";
  }

  function revealStyle(delayMs: number): React.CSSProperties {
    return { animationDelay: `${delayMs}ms` };
  }

  const imageUrl =
    typeof productImage === "string" ? productImage : productImage?.url;
  const backgroundUrl =
    typeof backgroundImage === "string"
      ? backgroundImage
      : backgroundImage?.url;

  const benefits = [benefit1, benefit2, benefit3].filter(Boolean);

  const product = loaderData?.product ?? null;
  const variant = product?.selectedOrFirstAvailableVariant;
  const price = variant?.price ?? product?.priceRange?.minVariantPrice ?? null;
  const availableForSale = variant?.availableForSale ?? false;

  return (
    <section
      ref={ref}
      {...rest}
      id="refill"
      className="relative w-full overflow-hidden bg-shamal-black py-32 text-shamal-white md:py-40"
    >
      {backgroundUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-shamal-black/85" />
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        {/* Content first on desktop (image to the right) to alternate against Discovery. */}
        <div ref={contentRef} className="flex flex-col md:order-1">
          {socialProof && (
            <span
              className={cn(
                "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
                revealClass(),
              )}
              style={revealStyle(0)}
            >
              {socialProof}
            </span>
          )}

          <span
            className={cn(
              "mt-3 font-cormorant text-sm text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(80)}
          >
            {label}
          </span>

          <div className={cn("mt-6", revealClass())} style={revealStyle(160)}>
            <DiamondDivider />
          </div>

          <h2
            className={cn(
              "mt-8 font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl",
              revealClass(),
            )}
            style={revealStyle(240)}
          >
            {headline}
          </h2>

          <p
            className={cn(
              "mt-4 font-cormorant text-xl text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(360)}
          >
            {subheadline}
          </p>

          <p
            className={cn(
              "mt-8 max-w-lg font-cabin text-base font-light text-shamal-white-dim leading-relaxed",
              revealClass(),
            )}
            style={revealStyle(480)}
          >
            {bodyText}
          </p>

          {benefits.length > 0 && (
            <ul
              className={cn("mt-10 flex flex-col gap-3", revealClass())}
              style={revealStyle(600)}
            >
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 text-[10px] text-shamal-gold"
                  >
                    ◆
                  </span>
                  <span className="font-cabin text-base font-light text-shamal-white-dim leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {voyageNote && (
            <p
              className={cn(
                "mt-8 border border-shamal-gold-dim/30 bg-shamal-surface/60 px-5 py-4 font-cabin text-sm font-light text-shamal-white leading-relaxed",
                revealClass(),
              )}
              style={revealStyle(680)}
            >
              {voyageNote}
            </p>
          )}

          <div
            className={cn("mt-10 flex flex-col gap-1", revealClass())}
            style={revealStyle(760)}
          >
            <span className="font-cormorant text-4xl font-light text-shamal-gold">
              {price ? <Money data={price} /> : priceFallback}
            </span>
            <span className="text-[11px] font-light text-shamal-white-dim">
              {shippingNote}
            </span>
          </div>

          <div className={cn("mt-8", revealClass())} style={revealStyle(860)}>
            {variant && availableForSale ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: variant.id,
                    quantity: 1,
                    selectedVariant: variant,
                  },
                ]}
                className="!h-auto w-full !justify-center !rounded-none !border-0 !bg-shamal-gold !px-10 !py-4 !text-xs !font-medium !tracking-[0.28em] !text-shamal-black uppercase transition-colors duration-300 hover:!bg-shamal-gold/90 hover:!text-shamal-black sm:w-auto"
              >
                {ctaText}
              </AddToCartButton>
            ) : product ? (
              <span className="inline-flex w-full cursor-not-allowed items-center justify-center border border-shamal-white-dim/30 px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-white-dim uppercase sm:w-auto">
                {soldOutText}
              </span>
            ) : (
              // Loader returned no product (handle missing / fetch failed) — fall
              // back to the product page so the CTA is never a dead end.
              <Link
                to={`/products/${DEFAULT_REFILL_HANDLE}`}
                className="inline-flex w-full items-center justify-center bg-shamal-gold px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90 sm:w-auto"
              >
                {ctaText}
              </Link>
            )}
          </div>

          {dispatchNote && (
            <p
              className={cn(
                "mt-4 text-[11px] font-light text-shamal-white-dim",
                revealClass(),
              )}
              style={revealStyle(960)}
            >
              {dispatchNote}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center md:order-2">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-125 bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_70%)]"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt={product?.title || headline}
                className="max-h-[60vh] w-auto object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiamondDivider() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-shamal-gold/55" />
      <span className="text-[10px] text-shamal-gold">◆</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-shamal-gold/55" />
    </div>
  );
}

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<ShamalRefillData>): Promise<RefillLoaderData> => {
  const { storefront } = weaverse;
  const { language, country } = storefront.i18n;
  const handle = data?.productHandle?.trim() || DEFAULT_REFILL_HANDLE;

  const result = await storefront
    .query<ProductQuery>(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: [], country, language },
    })
    .catch(() => null);

  return { product: result?.product ?? null };
};

export const schema = createSchema({
  type: "shamal-refill",
  title: "Shamal Refill",
  settings: [
    {
      group: "Product",
      inputs: [
        {
          type: "text",
          name: "productHandle",
          label: "Product handle",
          defaultValue: "refill",
          helpText:
            "Shopify handle of the universal refill product. Price and Add to Cart are pulled live from this product.",
        },
        {
          type: "image",
          name: "productImage",
          label: "Product image",
          defaultValue: "/placeholders/refill.png",
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          defaultValue: "",
        },
      ],
    },
    {
      group: "Copy",
      inputs: [
        {
          type: "text",
          name: "socialProof",
          label: "Social proof eyebrow",
          defaultValue: "OVER 1,000 BOTTLES REFILLED THIS YEAR",
        },
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "The Refill",
        },
        {
          type: "text",
          name: "headline",
          label: "Headline",
          defaultValue: "Refill Your Moment",
        },
        {
          type: "text",
          name: "subheadline",
          label: "Subheadline",
          defaultValue: "For the bottle you've already made yours",
        },
        {
          type: "textarea",
          name: "bodyText",
          label: "Body",
          defaultValue:
            "You know your voyage. Keep it close. Each refill is blended to order at our Lohja atelier in the same small batches as the original — so the scent you've lived with returns exactly as you remember it, at a price that rewards coming back.",
        },
      ],
    },
    {
      group: "Why refill",
      inputs: [
        {
          type: "text",
          name: "benefit1",
          label: "Benefit 1",
          defaultValue: "Made to order in small batches — never from stock",
        },
        {
          type: "text",
          name: "benefit2",
          label: "Benefit 2",
          defaultValue:
            "The same fragrance, kinder to your bottle and the planet",
        },
        {
          type: "text",
          name: "benefit3",
          label: "Benefit 3",
          defaultValue: "Loved by returning collectors across Finland & the EU",
        },
      ],
    },
    {
      group: "Voyage note",
      inputs: [
        {
          type: "textarea",
          name: "voyageNote",
          label: "Voyage note (highlighted)",
          defaultValue:
            "One universal refill for every scent. Just note your voyage — First Voyage, Winter Voyage or Oodi Mökille — in the order notes at checkout.",
        },
      ],
    },
    {
      group: "Pricing",
      inputs: [
        {
          type: "text",
          name: "priceFallback",
          label: "Price fallback (if product can't load)",
          defaultValue: "€60",
        },
        {
          type: "text",
          name: "shippingNote",
          label: "Shipping note",
          defaultValue: "Free shipping within Finland & EU",
        },
      ],
    },
    {
      group: "CTA",
      inputs: [
        {
          type: "text",
          name: "ctaText",
          label: "Button text",
          defaultValue: "Add Refill to Cart",
        },
        {
          type: "text",
          name: "soldOutText",
          label: "Sold-out button text",
          defaultValue: "Currently Unavailable",
        },
        {
          type: "text",
          name: "dispatchNote",
          label: "Dispatch note",
          defaultValue: "Made to order · ships within 3–5 business days",
        },
      ],
    },
  ],
});
