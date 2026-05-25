import { Money } from "@shopify/hydrogen";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import type {
  CollectionQuery,
  ProductCardFragment,
} from "storefront-api.generated";
import { cn } from "~/utils/cn";

const PRE_ORDER_TAG = "pre-order";
const VOYAGE_TAG_PATTERN = /^(?:voyage|moment)[-\s]?(\d+)$/i;

interface ShamalCollectionGridProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  emptyHeadline: string;
  emptySubtext: string;
  emptyCtaText: string;
  emptyCtaLink: string;
  preOrderShipNote: string;
}

export default function ShamalCollectionGrid(props: ShamalCollectionGridProps) {
  const {
    ref,
    emptyHeadline,
    emptySubtext,
    emptyCtaText,
    emptyCtaLink,
    preOrderShipNote,
    ...rest
  } = props;

  const data = useLoaderData<Partial<CollectionQuery>>();
  const products = data?.collection?.products?.nodes ?? [];

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

  if (products.length === 0) {
    return (
      <section
        ref={ref}
        {...rest}
        className="w-full bg-shamal-black py-24 text-shamal-white md:py-32"
      >
        <div
          ref={contentRef}
          className="mx-auto flex max-w-[640px] flex-col items-center px-6 text-center md:px-10"
        >
          <p
            className={cn(
              "font-cormorant text-4xl text-shamal-white italic md:text-5xl",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {emptyHeadline}
          </p>
          <p
            className={cn(
              "mt-6 font-cabin text-sm font-light text-shamal-white-dim leading-relaxed md:text-base",
              revealClass(),
            )}
            style={revealStyle(180)}
          >
            {emptySubtext}
          </p>
          {emptyCtaText && emptyCtaLink && (
            <Link
              to={emptyCtaLink}
              className={cn(
                "mt-10 inline-flex items-center justify-center border border-shamal-gold-dim/60 bg-transparent px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-gold uppercase transition-colors duration-300 hover:border-shamal-gold hover:bg-shamal-gold/10",
                revealClass(),
              )}
              style={revealStyle(360)}
            >
              {emptyCtaText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-shamal-black py-24 text-shamal-white md:py-32"
    >
      <div
        ref={contentRef}
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 md:grid-cols-3 md:px-10"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            preOrderShipNote={preOrderShipNote}
            className={revealClass()}
            style={revealStyle(index * 150)}
          />
        ))}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: ProductCardFragment;
  preOrderShipNote: string;
  className?: string;
  style?: React.CSSProperties;
}

function ProductCard({
  product,
  preOrderShipNote,
  className,
  style,
}: ProductCardProps) {
  const tags = product.tags ?? [];
  const isPreOrder = tags.some((tag) => tag.toLowerCase() === PRE_ORDER_TAG);
  const momentLabel = getMomentLabel(tags);
  const subtitle = getFirstDescriptionLine(product.description);
  const image = product.images?.nodes?.[0];
  const variant = product.selectedOrFirstAvailableVariant;
  const availableForSale = variant?.availableForSale ?? false;
  const href = `/products/${product.handle}`;

  return (
    <article
      className={cn("flex flex-col bg-shamal-surface", className)}
      style={style}
    >
      <div className="p-6 pb-0">
        {momentLabel ? (
          <span className="text-[10px] tracking-[0.35em] text-shamal-gold uppercase">
            {momentLabel}
          </span>
        ) : (
          <span className="block h-[14px]" aria-hidden="true" />
        )}
      </div>

      <Link
        to={href}
        className="relative mt-6 block aspect-[3/4] overflow-hidden bg-shamal-black"
      >
        {image?.url && (
          <img
            src={image.url}
            alt={image.altText || product.title}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 hover:opacity-90"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-cormorant text-2xl text-shamal-white">
          <Link
            to={href}
            className="transition-colors duration-300 hover:text-shamal-gold"
          >
            {product.title}
          </Link>
        </h3>
        {subtitle && (
          <p className="mt-1 font-cormorant text-sm text-shamal-white-dim italic">
            {subtitle}
          </p>
        )}
        <p className="mt-2 text-sm text-shamal-white-dim">
          <Money data={product.priceRange.minVariantPrice} />
        </p>

        {isPreOrder ? (
          <>
            <Link
              to={href}
              className="mt-6 inline-flex w-full items-center justify-center bg-shamal-gold px-4 py-3 text-[10px] font-medium tracking-[0.25em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90"
            >
              RESERVE YOUR VOYAGE
            </Link>
            {preOrderShipNote && (
              <p className="mt-3 text-center text-[10px] text-shamal-white-dim italic">
                {preOrderShipNote}
              </p>
            )}
          </>
        ) : availableForSale ? (
          <Link
            to={href}
            className="mt-6 inline-flex w-full items-center justify-center border border-shamal-gold-dim/60 px-4 py-3 text-[10px] font-medium tracking-[0.25em] text-shamal-gold uppercase transition-colors duration-300 hover:border-shamal-gold hover:bg-shamal-gold/10"
          >
            ORDER NOW
          </Link>
        ) : (
          <span className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center border border-shamal-white-dim/30 px-4 py-3 text-[10px] font-medium tracking-[0.25em] text-shamal-white-dim uppercase">
            SOLD OUT
          </span>
        )}
      </div>
    </article>
  );
}

function getMomentLabel(tags: string[]): string | null {
  for (const tag of tags) {
    const match = tag.match(VOYAGE_TAG_PATTERN);
    if (match) {
      const num = match[1].padStart(2, "0");
      return `MOMENT ${num}`;
    }
  }
  return null;
}

function getFirstDescriptionLine(description?: string | null): string | null {
  if (!description) return null;
  const firstLine = description
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  if (!firstLine) return null;
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine;
}

export const schema = createSchema({
  type: "shamal-collection-grid",
  title: "Shamal Collection Grid",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION"],
  },
  settings: [
    {
      group: "Pre-order",
      inputs: [
        {
          type: "text",
          name: "preOrderShipNote",
          label: "Ship note (pre-order)",
          defaultValue: "Ships end of June",
        },
      ],
    },
    {
      group: "Empty state",
      inputs: [
        {
          type: "text",
          name: "emptyHeadline",
          label: "Headline",
          defaultValue: "Coming later this year.",
        },
        {
          type: "textarea",
          name: "emptySubtext",
          label: "Subtext",
          defaultValue:
            "Join the waitlist to be the first to know when this collection arrives.",
        },
        {
          type: "text",
          name: "emptyCtaText",
          label: "CTA text",
          defaultValue: "Join the Waitlist",
        },
        {
          type: "text",
          name: "emptyCtaLink",
          label: "CTA link",
          defaultValue: "/#waitlist",
        },
      ],
    },
  ],
});
