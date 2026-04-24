import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalShopGridProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  headline: string;
  subtext: string;
  showWaiting: boolean;
  moment1Label: string;
  product1Name: string;
  product1Subtitle: string;
  product1Image: WeaverseImage | string;
  product1Price: string;
  product1Link: string;
  product1Waiting: string;
  moment2Label: string;
  product2Name: string;
  product2Subtitle: string;
  product2Image: WeaverseImage | string;
  product2Price: string;
  product2Link: string;
  product2Waiting: string;
  moment3Label: string;
  product3Name: string;
  product3Subtitle: string;
  product3Image: WeaverseImage | string;
  product3Price: string;
  product3Link: string;
  product3Waiting: string;
}

export default function ShamalShopGrid(props: ShamalShopGridProps) {
  const {
    ref,
    headline,
    subtext,
    showWaiting,
    moment1Label,
    product1Name,
    product1Subtitle,
    product1Image,
    product1Price,
    product1Link,
    product1Waiting,
    moment2Label,
    product2Name,
    product2Subtitle,
    product2Image,
    product2Price,
    product2Link,
    product2Waiting,
    moment3Label,
    product3Name,
    product3Subtitle,
    product3Image,
    product3Price,
    product3Link,
    product3Waiting,
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

  const products = [
    {
      momentLabel: moment1Label,
      name: product1Name,
      subtitle: product1Subtitle,
      image: product1Image,
      price: product1Price,
      link: product1Link,
      waiting: product1Waiting,
    },
    {
      momentLabel: moment2Label,
      name: product2Name,
      subtitle: product2Subtitle,
      image: product2Image,
      price: product2Price,
      link: product2Link,
      waiting: product2Waiting,
    },
    {
      momentLabel: moment3Label,
      name: product3Name,
      subtitle: product3Subtitle,
      image: product3Image,
      price: product3Price,
      link: product3Link,
      waiting: product3Waiting,
    },
  ];

  return (
    <section
      ref={ref}
      {...rest}
      id="shop"
      className="w-full bg-shamal-black py-24 text-shamal-white md:py-32"
    >
      <div ref={contentRef} className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <h2
            className={cn(
              "font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {headline}
          </h2>
          <p
            className={cn(
              "mt-4 font-cabin text-base font-light text-shamal-white-dim leading-relaxed",
              revealClass(),
            )}
            style={revealStyle(150)}
          >
            {subtext}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.momentLabel || index}
              momentLabel={product.momentLabel}
              name={product.name}
              subtitle={product.subtitle}
              image={product.image}
              price={product.price}
              link={product.link}
              waiting={product.waiting}
              showWaiting={showWaiting}
              className={revealClass()}
              style={revealStyle(300 + index * 150)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  momentLabel: string;
  name: string;
  subtitle: string;
  image: WeaverseImage | string;
  price: string;
  link: string;
  waiting: string;
  showWaiting: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function ProductCard({
  momentLabel,
  name,
  subtitle,
  image,
  price,
  link,
  waiting,
  showWaiting,
  className,
  style,
}: ProductCardProps) {
  const imageSrc = typeof image === "string" ? image : image?.url;

  return (
    <article
      className={cn("flex flex-col bg-shamal-surface", className)}
      style={style}
    >
      <div className="p-6 pb-0">
        <span className="text-[10px] tracking-[0.35em] text-shamal-gold uppercase">
          {momentLabel}
        </span>
      </div>

      <div className="relative mt-6 aspect-[3/4] overflow-hidden bg-shamal-black">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-cormorant text-2xl text-shamal-white">{name}</h3>
        <p className="mt-1 font-cormorant text-sm text-shamal-white-dim italic">
          {subtitle}
        </p>
        <p className="mt-2 text-sm text-shamal-white-dim">{price} · 30ml</p>
        <p className="mt-1 text-[10px] text-shamal-white-dim italic">
          First edition · Small batch
        </p>
        <Link
          to={link}
          className="mt-6 inline-flex w-full items-center justify-center bg-shamal-gold px-4 py-3 text-[10px] font-medium tracking-[0.25em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90"
        >
          RESERVE YOUR VOYAGE
        </Link>
        {showWaiting && waiting && (
          <p className="mt-3 text-center text-[10px] text-shamal-white-dim">
            <span className="mr-1 text-shamal-gold">★</span>
            {waiting} waiting
          </p>
        )}
      </div>
    </article>
  );
}

export const schema = createSchema({
  type: "shamal-shop-grid",
  title: "Shamal Shop Grid",
  settings: [
    {
      group: "Header",
      inputs: [
        {
          type: "text",
          name: "headline",
          label: "Headline",
          defaultValue: "Three Voyages. Limited Edition.",
        },
        {
          type: "textarea",
          name: "subtext",
          label: "Subtext",
          defaultValue:
            "Each fragrance is handcrafted in small batches at our Lohja atelier. The first three voyages arrive soon. Reserve yours before the world knows.",
        },
      ],
    },
    {
      group: "Moment 1",
      inputs: [
        {
          type: "text",
          name: "moment1Label",
          label: "Moment label",
          defaultValue: "MOMENT 01",
        },
        {
          type: "text",
          name: "product1Name",
          label: "Name",
          defaultValue: "First Voyage",
        },
        {
          type: "text",
          name: "product1Subtitle",
          label: "Subtitle",
          defaultValue: "Autumn forest after rain",
        },
        {
          type: "image",
          name: "product1Image",
          label: "Product image",
          defaultValue: "/placeholders/moment-01.png",
        },
        {
          type: "text",
          name: "product1Price",
          label: "Price",
          defaultValue: "€100",
        },
        {
          type: "text",
          name: "product1Link",
          label: "Link",
          defaultValue: "/products/moment-01-first-voyage",
        },
        {
          type: "text",
          name: "product1Waiting",
          label: "Waiting count",
          defaultValue: "312",
        },
      ],
    },
    {
      group: "Moment 2",
      inputs: [
        {
          type: "text",
          name: "moment2Label",
          label: "Moment label",
          defaultValue: "MOMENT 02",
        },
        {
          type: "text",
          name: "product2Name",
          label: "Name",
          defaultValue: "Winter Voyage",
        },
        {
          type: "text",
          name: "product2Subtitle",
          label: "Subtitle",
          defaultValue: "From cold into warmth",
        },
        {
          type: "image",
          name: "product2Image",
          label: "Product image",
          defaultValue: "/placeholders/moment-02.png",
        },
        {
          type: "text",
          name: "product2Price",
          label: "Price",
          defaultValue: "€100",
        },
        {
          type: "text",
          name: "product2Link",
          label: "Link",
          defaultValue: "/products/moment-02-winter-voyage",
        },
        {
          type: "text",
          name: "product2Waiting",
          label: "Waiting count",
          defaultValue: "248",
        },
      ],
    },
    {
      group: "Moment 3",
      inputs: [
        {
          type: "text",
          name: "moment3Label",
          label: "Moment label",
          defaultValue: "MOMENT 03",
        },
        {
          type: "text",
          name: "product3Name",
          label: "Name",
          defaultValue: "Oodi Mökille",
        },
        {
          type: "text",
          name: "product3Subtitle",
          label: "Subtitle",
          defaultValue: "Spring's first bloom",
        },
        {
          type: "image",
          name: "product3Image",
          label: "Product image",
          defaultValue: "/placeholders/moment-03.png",
        },
        {
          type: "text",
          name: "product3Price",
          label: "Price",
          defaultValue: "€100",
        },
        {
          type: "text",
          name: "product3Link",
          label: "Link",
          defaultValue: "/products/moment-03-oodi-mokille",
        },
        {
          type: "text",
          name: "product3Waiting",
          label: "Waiting count",
          defaultValue: "189",
        },
      ],
    },
    {
      group: "Social proof",
      inputs: [
        {
          type: "switch",
          name: "showWaiting",
          label: "Show waiting counts",
          defaultValue: true,
        },
      ],
    },
  ],
});
