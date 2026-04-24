import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalCategoryGridProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  label: string;
  headline: string;
  subtext: string;
  cat1Number: string;
  cat1Name: string;
  cat1Subtitle: string;
  cat1Image: WeaverseImage | string;
  cat1Link: string;
  cat1Cta: string;
  cat2Number: string;
  cat2Name: string;
  cat2Subtitle: string;
  cat2Image: WeaverseImage | string;
  cat2Link: string;
  cat2Cta: string;
  cat3Number: string;
  cat3Name: string;
  cat3Subtitle: string;
  cat3Image: WeaverseImage | string;
  cat3Link: string;
  cat3Cta: string;
}

export default function ShamalCategoryGrid(props: ShamalCategoryGridProps) {
  const {
    ref,
    label,
    headline,
    subtext,
    cat1Number,
    cat1Name,
    cat1Subtitle,
    cat1Image,
    cat1Link,
    cat1Cta,
    cat2Number,
    cat2Name,
    cat2Subtitle,
    cat2Image,
    cat2Link,
    cat2Cta,
    cat3Number,
    cat3Name,
    cat3Subtitle,
    cat3Image,
    cat3Link,
    cat3Cta,
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

  const categories = [
    {
      number: cat1Number,
      name: cat1Name,
      subtitle: cat1Subtitle,
      image: cat1Image,
      link: cat1Link,
      cta: cat1Cta,
    },
    {
      number: cat2Number,
      name: cat2Name,
      subtitle: cat2Subtitle,
      image: cat2Image,
      link: cat2Link,
      cta: cat2Cta,
    },
    {
      number: cat3Number,
      name: cat3Name,
      subtitle: cat3Subtitle,
      image: cat3Image,
      link: cat3Link,
      cta: cat3Cta,
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
        <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
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
              "mt-6 font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl",
              revealClass(),
            )}
            style={revealStyle(240)}
          >
            {headline}
          </h2>

          <p
            className={cn(
              "mt-3 font-cormorant text-xl text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(360)}
          >
            {subtext}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.number || index}
              number={category.number}
              name={category.name}
              subtitle={category.subtitle}
              image={category.image}
              link={category.link}
              cta={category.cta}
              className={revealClass()}
              style={revealStyle(480 + index * 150)}
            />
          ))}
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

interface CategoryCardProps {
  number: string;
  name: string;
  subtitle: string;
  image: WeaverseImage | string;
  link: string;
  cta: string;
  className?: string;
  style?: React.CSSProperties;
}

function CategoryCard({
  number,
  name,
  subtitle,
  image,
  link,
  cta,
  className,
  style,
}: CategoryCardProps) {
  const imageUrl = typeof image === "string" ? image : image?.url;

  return (
    <Link
      to={link}
      className={cn(
        "group relative block aspect-[3/4] overflow-hidden",
        className,
      )}
      style={style}
    >
      {imageUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-shamal-black via-shamal-black/40 to-shamal-black/20"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        <span className="text-[11px] tracking-[0.4em] text-shamal-gold uppercase">
          {number}
        </span>
        <h3 className="mt-3 font-cormorant text-4xl font-light text-shamal-white md:text-5xl">
          {name}
        </h3>
        <p className="mt-2 font-cormorant text-shamal-white-dim italic">
          {subtitle}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase">
          {cta}
          <span aria-hidden="true">→</span>
        </span>
        <span
          aria-hidden="true"
          className="mt-2 block h-px w-8 bg-shamal-gold transition-all duration-500 ease-out group-hover:w-20"
        />
      </div>
    </Link>
  );
}

export const schema = createSchema({
  type: "shamal-category-grid",
  title: "Shamal Category Grid",
  settings: [
    {
      group: "Header",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "THE COLLECTION",
        },
        {
          type: "text",
          name: "headline",
          label: "Headline",
          defaultValue: "Explore Shamal",
        },
        {
          type: "text",
          name: "subtext",
          label: "Subtext",
          defaultValue: "Three worlds. One atelier.",
        },
      ],
    },
    {
      group: "Category 1",
      inputs: [
        {
          type: "text",
          name: "cat1Number",
          label: "Number",
          defaultValue: "01",
        },
        {
          type: "text",
          name: "cat1Name",
          label: "Name",
          defaultValue: "Perfumes",
        },
        {
          type: "text",
          name: "cat1Subtitle",
          label: "Subtitle",
          defaultValue: "The five voyages",
        },
        {
          type: "image",
          name: "cat1Image",
          label: "Image",
          defaultValue: "/placeholders/category-perfumes.jpg",
        },
        {
          type: "text",
          name: "cat1Link",
          label: "Link",
          defaultValue: "/collections/perfumes",
        },
        {
          type: "text",
          name: "cat1Cta",
          label: "CTA text",
          defaultValue: "Explore",
        },
      ],
    },
    {
      group: "Category 2",
      inputs: [
        {
          type: "text",
          name: "cat2Number",
          label: "Number",
          defaultValue: "02",
        },
        {
          type: "text",
          name: "cat2Name",
          label: "Name",
          defaultValue: "Home",
        },
        {
          type: "text",
          name: "cat2Subtitle",
          label: "Subtitle",
          defaultValue: "Candles, soaps, room scents",
        },
        {
          type: "image",
          name: "cat2Image",
          label: "Image",
          defaultValue: "/placeholders/category-home.jpg",
        },
        {
          type: "text",
          name: "cat2Link",
          label: "Link",
          defaultValue: "/collections/home",
        },
        {
          type: "text",
          name: "cat2Cta",
          label: "CTA text",
          defaultValue: "Explore",
        },
      ],
    },
    {
      group: "Category 3",
      inputs: [
        {
          type: "text",
          name: "cat3Number",
          label: "Number",
          defaultValue: "03",
        },
        {
          type: "text",
          name: "cat3Name",
          label: "Name",
          defaultValue: "Discovery & Refills",
        },
        {
          type: "text",
          name: "cat3Subtitle",
          label: "Subtitle",
          defaultValue: "Begin your journey",
        },
        {
          type: "image",
          name: "cat3Image",
          label: "Image",
          defaultValue: "/placeholders/category-discovery.jpg",
        },
        {
          type: "text",
          name: "cat3Link",
          label: "Link",
          defaultValue: "/collections/discovery",
        },
        {
          type: "text",
          name: "cat3Cta",
          label: "CTA text",
          defaultValue: "Explore",
        },
      ],
    },
  ],
});
