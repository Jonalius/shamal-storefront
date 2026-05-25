import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import type { CollectionQuery } from "storefront-api.generated";
import { cn } from "~/utils/cn";

interface ShamalCollectionHeroProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  backgroundImage: WeaverseImage | string;
  label: string;
  headline: string;
  subhead: string;
  paragraph: string;
}

export default function ShamalCollectionHero(props: ShamalCollectionHeroProps) {
  const { ref, backgroundImage, label, headline, subhead, paragraph, ...rest } =
    props;

  const data = useLoaderData<Partial<CollectionQuery>>();
  const collection = data?.collection ?? null;

  const resolvedHeadline = headline?.trim() || collection?.title || "";
  const resolvedParagraph = paragraph?.trim() || collection?.description || "";

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

  const backgroundUrl =
    typeof backgroundImage === "string"
      ? backgroundImage
      : backgroundImage?.url;

  return (
    <section
      ref={ref}
      {...rest}
      className="relative w-full overflow-hidden bg-shamal-black py-32 text-shamal-white md:py-40"
    >
      {backgroundUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      {backgroundUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-shamal-black/80"
        />
      )}

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-6 text-center md:px-10"
      >
        {label && (
          <span
            className={cn(
              "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {label}
          </span>
        )}

        <div className={cn("mt-6", revealClass())} style={revealStyle(120)}>
          <DiamondDivider />
        </div>

        {resolvedHeadline && (
          <h1
            className={cn(
              "mt-8 font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl lg:text-7xl",
              revealClass(),
            )}
            style={revealStyle(240)}
          >
            {resolvedHeadline}
          </h1>
        )}

        {subhead && (
          <p
            className={cn(
              "mt-4 font-cormorant text-xl text-shamal-white-dim italic md:text-2xl",
              revealClass(),
            )}
            style={revealStyle(360)}
          >
            {subhead}
          </p>
        )}

        {resolvedParagraph && (
          <p
            className={cn(
              "mt-8 max-w-[640px] font-cabin text-base font-light text-shamal-white-dim leading-relaxed md:text-lg",
              revealClass(),
            )}
            style={revealStyle(480)}
          >
            {resolvedParagraph}
          </p>
        )}
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
  type: "shamal-collection-hero",
  title: "Shamal Collection Hero",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION"],
  },
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
      group: "Label",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "01 · THE COLLECTION",
        },
      ],
    },
    {
      group: "Copy",
      inputs: [
        {
          type: "text",
          name: "headline",
          label: "Headline (defaults to collection title)",
          defaultValue: "",
        },
        {
          type: "text",
          name: "subhead",
          label: "Italic subhead (optional)",
          defaultValue: "",
        },
        {
          type: "textarea",
          name: "paragraph",
          label: "Paragraph (defaults to collection description)",
          defaultValue: "",
        },
      ],
    },
  ],
});
