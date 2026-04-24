import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalDiscoveryProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  backgroundImage: WeaverseImage | string;
  productImage: WeaverseImage | string;
  label: string;
  headline: string;
  subheadline: string;
  bodyText: string;
  included1: string;
  included2: string;
  included3: string;
  price: string;
  shippingNote: string;
  ctaText: string;
  ctaLink: string;
  dispatchNote: string;
}

export default function ShamalDiscovery(props: ShamalDiscoveryProps) {
  const {
    ref,
    backgroundImage,
    productImage,
    label,
    headline,
    subheadline,
    bodyText,
    included1,
    included2,
    included3,
    price,
    shippingNote,
    ctaText,
    ctaLink,
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

  const included = [included1, included2, included3].filter(Boolean);

  return (
    <section
      ref={ref}
      {...rest}
      id="discovery"
      className="relative w-full overflow-hidden bg-shamal-surface py-32 text-shamal-white md:py-40"
    >
      {backgroundUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-shamal-surface/85"
      />
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-125 bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_70%)]"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt={headline}
                className="max-h-[60vh] w-auto object-contain"
              />
            )}
          </div>
          <p className="mt-8 font-cormorant text-sm text-shamal-white-dim italic">
            Handmade leather case · Three 5ml voyages
          </p>
        </div>

        <div ref={contentRef} className="flex flex-col">
          <span
            className={cn(
              "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {label}
          </span>

          <div className={cn("mt-6", revealClass())} style={revealStyle(120)}>
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

          <ul
            className={cn("mt-10 flex flex-col gap-3", revealClass())}
            style={revealStyle(600)}
          >
            {included.map((item) => (
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

          <div
            className={cn("mt-10 flex flex-col gap-1", revealClass())}
            style={revealStyle(720)}
          >
            <span className="font-cormorant text-4xl font-light text-shamal-gold">
              {price}
            </span>
            <span className="text-[11px] font-light text-shamal-white-dim">
              {shippingNote}
            </span>
          </div>

          <div className={cn("mt-8", revealClass())} style={revealStyle(840)}>
            <Link
              to={ctaLink}
              className="inline-flex w-full items-center justify-center bg-shamal-gold px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90 sm:w-auto"
            >
              {ctaText}
            </Link>
          </div>

          <p
            className={cn(
              "mt-4 text-[11px] font-light text-shamal-white-dim",
              revealClass(),
            )}
            style={revealStyle(960)}
          >
            {dispatchNote}
          </p>
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

export const schema = createSchema({
  type: "shamal-discovery",
  title: "Shamal Discovery",
  settings: [
    {
      group: "Background",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          defaultValue: "",
        },
      ],
    },
    {
      group: "Product",
      inputs: [
        {
          type: "image",
          name: "productImage",
          label: "Product image",
          defaultValue: "/placeholders/discovery-set.png",
        },
      ],
    },
    {
      group: "Label",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "THE DISCOVERY SET",
        },
      ],
    },
    {
      group: "Copy",
      inputs: [
        {
          type: "text",
          name: "headline",
          label: "Headline",
          defaultValue: "Begin Your Journey",
        },
        {
          type: "text",
          name: "subheadline",
          label: "Subheadline",
          defaultValue: "Your introduction to the world of Shamal",
        },
        {
          type: "textarea",
          name: "bodyText",
          label: "Body",
          defaultValue:
            "Each Discovery Set contains a handmade leather case crafted in our Helsinki atelier, housing three 5ml bottles of our current voyages. The perfect first step into the world of Shamal — and a beautiful object in its own right.",
        },
      ],
    },
    {
      group: "Included",
      inputs: [
        {
          type: "text",
          name: "included1",
          label: "Item 1",
          defaultValue: "Handmade leather case",
        },
        {
          type: "text",
          name: "included2",
          label: "Item 2",
          defaultValue:
            "First Voyage 5ml · Winter Voyage 5ml · Oodi Mökille 5ml",
        },
        {
          type: "text",
          name: "included3",
          label: "Item 3",
          defaultValue: "Free shipping to Finland & EU",
        },
      ],
    },
    {
      group: "Pricing",
      inputs: [
        {
          type: "text",
          name: "price",
          label: "Price",
          defaultValue: "€80",
        },
        {
          type: "text",
          name: "shippingNote",
          label: "Shipping note",
          defaultValue: "Free EU shipping",
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
          defaultValue: "Order the Discovery Set",
        },
        {
          type: "text",
          name: "ctaLink",
          label: "Link",
          defaultValue: "/products/discovery-set",
        },
        {
          type: "text",
          name: "dispatchNote",
          label: "Dispatch note",
          defaultValue: "Ships within 3–5 business days",
        },
      ],
    },
  ],
});
