import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import type { loader as productRouteLoader } from "~/routes/products/product";
import { cn } from "~/utils/cn";

const VOYAGE_TAG_PATTERN = /^(?:voyage|moment)[-\s]?(\d+)$/i;

interface ShamalProductDetailsProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  label: string;
  topHeading: string;
  topNotes: string;
  heartHeading: string;
  heartNotes: string;
  baseHeading: string;
  baseNotes: string;
  includedHeading: string;
  included1: string;
  included2: string;
  included3: string;
  craftedNote: string;
}

export default function ShamalProductDetails(props: ShamalProductDetailsProps) {
  const {
    ref,
    label,
    topHeading,
    topNotes,
    heartHeading,
    heartNotes,
    baseHeading,
    baseNotes,
    includedHeading,
    included1,
    included2,
    included3,
    craftedNote,
    ...rest
  } = props;

  const { product } = useLoaderData<typeof productRouteLoader>();
  const tags = product?.tags ?? [];
  const isVoyage = tags.some((tag) => VOYAGE_TAG_PATTERN.test(tag));

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

  const includedItems = [included1, included2, included3].filter(
    (item) => item && item.trim().length > 0,
  );

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-shamal-surface py-20 text-shamal-white md:py-28"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-[860px] flex-col items-center px-6 text-center md:px-10"
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

        {isVoyage ? (
          <div
            className={cn(
              "mt-10 grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:gap-12",
              revealClass(),
            )}
            style={revealStyle(180)}
          >
            <NoteColumn heading={topHeading} body={topNotes} />
            <NoteColumn heading={heartHeading} body={heartNotes} />
            <NoteColumn heading={baseHeading} body={baseNotes} />
          </div>
        ) : (
          <div
            className={cn(
              "mt-10 flex w-full flex-col items-center gap-6",
              revealClass(),
            )}
            style={revealStyle(180)}
          >
            {includedHeading && (
              <h3 className="font-cormorant text-3xl text-shamal-white md:text-4xl">
                {includedHeading}
              </h3>
            )}
            {includedItems.length > 0 && (
              <ul className="flex w-full max-w-[520px] flex-col gap-3 text-left">
                {includedItems.map((item) => (
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
          </div>
        )}

        <div className={cn("mt-14", revealClass())} style={revealStyle(360)}>
          <DiamondDivider />
        </div>

        {craftedNote && (
          <p
            className={cn(
              "mt-6 font-cormorant text-sm text-shamal-white-dim italic md:text-base",
              revealClass(),
            )}
            style={revealStyle(480)}
          >
            {craftedNote}
          </p>
        )}
      </div>
    </section>
  );
}

interface NoteColumnProps {
  heading: string;
  body: string;
}

function NoteColumn({ heading, body }: NoteColumnProps) {
  if (!heading && !body) return null;
  return (
    <div className="flex flex-col items-center gap-3">
      {heading && (
        <span className="text-[10px] tracking-[0.35em] text-shamal-gold uppercase">
          {heading}
        </span>
      )}
      {body && (
        <p className="font-cormorant text-lg text-shamal-white-dim italic leading-relaxed">
          {body}
        </p>
      )}
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

export const schema = createSchema({
  type: "shamal-product-details",
  title: "Shamal Product Details",
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  settings: [
    {
      group: "Label",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "THE NOTES",
        },
      ],
    },
    {
      group: "Voyage notes",
      inputs: [
        {
          type: "text",
          name: "topHeading",
          label: "Top heading",
          defaultValue: "TOP",
        },
        {
          type: "textarea",
          name: "topNotes",
          label: "Top notes",
          defaultValue: "Bergamot, sea salt, pink pepper",
        },
        {
          type: "text",
          name: "heartHeading",
          label: "Heart heading",
          defaultValue: "HEART",
        },
        {
          type: "textarea",
          name: "heartNotes",
          label: "Heart notes",
          defaultValue: "Iris, damask rose, violet leaf",
        },
        {
          type: "text",
          name: "baseHeading",
          label: "Base heading",
          defaultValue: "BASE",
        },
        {
          type: "textarea",
          name: "baseNotes",
          label: "Base notes",
          defaultValue: "Vetiver, sandalwood, ambroxan",
        },
      ],
    },
    {
      group: "What's included",
      inputs: [
        {
          type: "text",
          name: "includedHeading",
          label: "Heading",
          defaultValue: "What's included",
        },
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
          defaultValue: "Free shipping within Finland & EU",
        },
      ],
    },
    {
      group: "Footer",
      inputs: [
        {
          type: "text",
          name: "craftedNote",
          label: "Crafted note",
          defaultValue: "Crafted in Helsinki",
        },
      ],
    },
  ],
});
