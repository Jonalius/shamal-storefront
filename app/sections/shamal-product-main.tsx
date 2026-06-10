import {
  getAdjacentAndFirstAvailableVariants,
  Money,
  useOptimisticVariant,
} from "@shopify/hydrogen";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { WaitlistForm } from "~/components/waitlist-form";
import type { loader as productRouteLoader } from "~/routes/products/product";
import { cn } from "~/utils/cn";

const PRE_ORDER_TAG = "pre-order";
const REFILL_TAG = "refill";

interface ShamalProductMainProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  subtitle: string;
  addToCartText: string;
  soldOutText: string;
  preOrderShipsText: string;
  preOrderWaitlistText: string;
  preOrderWaitlistPlaceholder: string;
  preOrderWaitlistButton: string;
  preOrderWaitlistSuccess: string;
  preOrderWaitlistPrivacy: string;
  refillCtaText: string;
  refillNote: string;
  shippingNote: string;
}

export default function ShamalProductMain(props: ShamalProductMainProps) {
  const {
    ref,
    subtitle,
    addToCartText,
    soldOutText,
    preOrderShipsText,
    preOrderWaitlistText,
    preOrderWaitlistPlaceholder,
    preOrderWaitlistButton,
    preOrderWaitlistSuccess,
    preOrderWaitlistPrivacy,
    refillCtaText,
    refillNote,
    shippingNote,
    ...rest
  } = props;

  const { product } = useLoaderData<typeof productRouteLoader>();

  const selectedVariant = useOptimisticVariant(
    product?.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
      { threshold: 0.1 },
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

  if (!product) {
    return <section ref={ref} {...rest} />;
  }

  const tags = product.tags ?? [];
  const lowerTags = tags.map((tag) => tag.toLowerCase());
  const isRefill = lowerTags.includes(REFILL_TAG);
  const isPreOrder = !isRefill && lowerTags.includes(PRE_ORDER_TAG);
  const isStandard = !isRefill && !isPreOrder;

  const galleryImages =
    product.images?.nodes && product.images.nodes.length > 0
      ? product.images.nodes
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const activeImage =
    galleryImages[activeImageIndex] ?? galleryImages[0] ?? null;

  const label = (product.productType || tags[0] || "SHAMAL").toUpperCase();

  const resolvedSubtitle =
    subtitle?.trim() || getFirstDescriptionLine(product.description);

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const availableForSale = selectedVariant?.availableForSale ?? false;

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-shamal-black py-20 text-shamal-white md:py-28"
    >
      <div
        ref={contentRef}
        className="mx-auto grid min-h-[80vh] max-w-[1400px] grid-cols-1 items-start gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-10"
      >
        <div className={cn("flex flex-col gap-6", revealClass())}>
          <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-shamal-surface">
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_65%)]"
            />
            {activeImage?.url && (
              <img
                src={activeImage.url}
                alt={activeImage.altText || product.title}
                className="relative z-10 max-h-full max-w-full object-contain"
              />
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden border bg-shamal-surface transition-colors duration-300",
                    activeImageIndex === index
                      ? "border-shamal-gold"
                      : "border-shamal-white/10 hover:border-shamal-white/40",
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  {image.url && (
                    <img
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-contain p-2"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span
            className={cn(
              "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {label}
          </span>

          <h1
            className={cn(
              "mt-4 font-cormorant text-4xl font-light text-shamal-white leading-tight md:text-5xl lg:text-6xl",
              revealClass(),
            )}
            style={revealStyle(120)}
          >
            {product.title}
          </h1>

          {resolvedSubtitle && (
            <p
              className={cn(
                "mt-3 font-cormorant text-xl text-shamal-white-dim italic",
                revealClass(),
              )}
              style={revealStyle(240)}
            >
              {resolvedSubtitle}
            </p>
          )}

          {product.descriptionHtml && (
            <div
              className={cn(
                "mt-8 max-w-[520px] font-cabin text-base font-light text-shamal-white-dim leading-relaxed",
                "[&_p]:mb-4 [&_em]:font-cormorant [&_em]:text-shamal-white [&_em]:not-italic [&_em]:text-lg",
                "[&_strong]:font-medium [&_strong]:text-shamal-white",
                "[&_a]:text-shamal-gold [&_a]:underline [&_a]:underline-offset-4",
                "[&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0",
                "[&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-2 [&_li]:before:left-0 [&_li]:before:text-[8px] [&_li]:before:text-shamal-gold [&_li]:before:content-['◆']",
                revealClass(),
              )}
              style={revealStyle(360)}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Shopify-controlled descriptionHtml
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}

          <div className={cn("mt-10", revealClass())} style={revealStyle(480)}>
            <DiamondDivider />
          </div>

          {!isPreOrder && (
            <div
              className={cn("mt-8 flex items-baseline gap-3", revealClass())}
              style={revealStyle(600)}
            >
              <span className="font-cormorant text-4xl font-light text-shamal-white">
                <Money data={price} />
              </span>
              {selectedVariant?.compareAtPrice && (
                <span className="font-cabin text-base text-shamal-white-dim line-through">
                  <Money data={selectedVariant.compareAtPrice} />
                </span>
              )}
            </div>
          )}

          <div
            className={cn("mt-8 flex flex-col gap-3", revealClass())}
            style={revealStyle(720)}
          >
            {isStandard && availableForSale && (
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            )}

            {isRefill ? (
              <>
                <AddToCartButton
                  disabled={!availableForSale}
                  lines={[
                    {
                      merchandiseId: selectedVariant?.id,
                      quantity,
                      selectedVariant,
                    },
                  ]}
                  className="!h-auto w-full !justify-center !rounded-none !border-0 !bg-shamal-gold !px-10 !py-4 !text-xs !font-medium !tracking-[0.28em] !text-shamal-black uppercase transition-colors duration-300 hover:!bg-shamal-gold/90 hover:!text-shamal-black"
                >
                  {refillCtaText}
                </AddToCartButton>
                {refillNote && (
                  <p className="text-[11px] text-shamal-white-dim italic">
                    {refillNote}
                  </p>
                )}
              </>
            ) : isPreOrder ? (
              <div className="flex flex-col gap-5">
                {preOrderShipsText && (
                  <span className="text-[11px] tracking-[0.32em] text-shamal-gold uppercase">
                    {preOrderShipsText}
                  </span>
                )}
                {preOrderWaitlistText && (
                  <p className="max-w-[440px] font-cabin text-sm font-light text-shamal-white-dim leading-relaxed">
                    {preOrderWaitlistText}
                  </p>
                )}
                <WaitlistForm
                  context={product.title}
                  placeholder={preOrderWaitlistPlaceholder}
                  buttonText={preOrderWaitlistButton}
                  successMessage={preOrderWaitlistSuccess}
                  privacyNote={preOrderWaitlistPrivacy}
                  className="max-w-[440px]"
                />
              </div>
            ) : availableForSale ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant?.id,
                    quantity,
                    selectedVariant,
                  },
                ]}
                className="!h-auto w-full !justify-center !rounded-none !border-0 !bg-shamal-gold !px-10 !py-4 !text-xs !font-medium !tracking-[0.28em] !text-shamal-black uppercase transition-colors duration-300 hover:!bg-shamal-gold/90 hover:!text-shamal-black"
              >
                {addToCartText}
              </AddToCartButton>
            ) : (
              <span className="inline-flex w-full cursor-not-allowed items-center justify-center border border-shamal-white-dim/30 px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-white-dim uppercase">
                {soldOutText}
              </span>
            )}
          </div>

          {shippingNote && (
            <p
              className={cn(
                "mt-6 text-[11px] font-light text-shamal-white-dim",
                revealClass(),
              )}
              style={revealStyle(840)}
            >
              {shippingNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  onChange: (next: number) => void;
}

function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  function dec() {
    if (quantity > 1) onChange(quantity - 1);
  }
  function inc() {
    if (quantity < 10) onChange(quantity + 1);
  }
  return (
    <div className="inline-flex w-fit items-center border border-shamal-white/15">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={dec}
        disabled={quantity <= 1}
        className="flex h-11 w-11 items-center justify-center text-shamal-white transition-colors duration-300 hover:text-shamal-gold disabled:opacity-40"
      >
        −
      </button>
      <span className="flex h-11 min-w-[3rem] items-center justify-center font-cormorant text-lg text-shamal-white">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={inc}
        disabled={quantity >= 10}
        className="flex h-11 w-11 items-center justify-center text-shamal-white transition-colors duration-300 hover:text-shamal-gold disabled:opacity-40"
      >
        +
      </button>
    </div>
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

function getFirstDescriptionLine(description?: string | null): string | null {
  if (!description) return null;
  const firstLine = description
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  if (!firstLine) return null;
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}…` : firstLine;
}

export const schema = createSchema({
  type: "shamal-product-main",
  title: "Shamal Product Main",
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  settings: [
    {
      group: "Copy",
      inputs: [
        {
          type: "text",
          name: "subtitle",
          label: "Italic subtitle (defaults to first description line)",
          defaultValue: "",
        },
      ],
    },
    {
      group: "Add to cart",
      inputs: [
        {
          type: "text",
          name: "addToCartText",
          label: "Add-to-cart button text",
          defaultValue: "ADD TO CART",
        },
        {
          type: "text",
          name: "soldOutText",
          label: "Sold-out button text",
          defaultValue: "SOLD OUT",
        },
      ],
    },
    {
      group: "Pre-order (coming soon + waitlist)",
      inputs: [
        {
          type: "text",
          name: "preOrderShipsText",
          label: "Ships eyebrow",
          defaultValue: "Ships end of June",
        },
        {
          type: "textarea",
          name: "preOrderWaitlistText",
          label: "Waitlist intro copy",
          defaultValue:
            "This voyage is crafted to order. Join the waitlist and you'll be the first to know the moment it's ready to ship.",
        },
        {
          type: "text",
          name: "preOrderWaitlistPlaceholder",
          label: "Email placeholder",
          defaultValue: "Your email address",
        },
        {
          type: "text",
          name: "preOrderWaitlistButton",
          label: "Button text",
          defaultValue: "Notify Me",
        },
        {
          type: "text",
          name: "preOrderWaitlistSuccess",
          label: "Success message",
          defaultValue:
            "You're on the list. We'll let you know the moment this voyage ships.",
        },
        {
          type: "text",
          name: "preOrderWaitlistPrivacy",
          label: "Privacy note",
          defaultValue: "Notification only. No spam.",
        },
      ],
    },
    {
      group: "Refill",
      inputs: [
        {
          type: "text",
          name: "refillCtaText",
          label: "Button text",
          defaultValue: "REFILL YOUR MOMENT",
        },
        {
          type: "text",
          name: "refillNote",
          label: "Note below button",
          defaultValue: "Crafted to order",
        },
      ],
    },
    {
      group: "Shipping",
      inputs: [
        {
          type: "text",
          name: "shippingNote",
          label: "Shipping note",
          defaultValue: "Free shipping within Finland & EU",
        },
      ],
    },
  ],
});
