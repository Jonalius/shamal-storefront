import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalVoyageProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  backgroundImage: WeaverseImage | string;
  bottleImage: WeaverseImage | string;
  momentLabel: string;
  voyageName: string;
  voyageSubtitle: string;
  storyText: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  price: string;
  edition: string;
  ctaText: string;
  ctaLink: string;
  waitingCount: string;
  showSocialProof: boolean;
}

export default function ShamalVoyage(props: ShamalVoyageProps) {
  const {
    ref,
    backgroundImage,
    bottleImage,
    momentLabel,
    voyageName,
    voyageSubtitle,
    storyText,
    topNotes,
    heartNotes,
    baseNotes,
    price,
    edition,
    ctaText,
    ctaLink,
    waitingCount,
    showSocialProof,
    ...rest
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

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
  const bottleUrl =
    typeof bottleImage === "string" ? bottleImage : bottleImage?.url;

  const topList = parseNotes(topNotes);
  const heartList = parseNotes(heartNotes);
  const baseList = parseNotes(baseNotes);

  return (
    <section
      ref={ref}
      {...rest}
      className="relative min-h-screen w-full overflow-hidden bg-shamal-black text-shamal-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-shamal-black/80 via-shamal-black/40 to-transparent"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 md:gap-10 md:px-10 md:py-32">
        <div ref={contentRef} className="flex flex-col">
          <span
            className={cn(
              "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {momentLabel}
          </span>

          <h2
            className={cn(
              "mt-6 font-cormorant text-6xl font-light text-shamal-white leading-[1.05] md:text-7xl",
              revealClass(),
            )}
            style={revealStyle(120)}
          >
            {voyageName}
          </h2>

          <p
            className={cn(
              "mt-4 font-cormorant text-xl text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(240)}
          >
            {voyageSubtitle}
          </p>

          <p
            className={cn(
              "mt-8 max-w-md font-cabin text-base font-light text-shamal-white-dim leading-relaxed",
              revealClass(),
            )}
            style={revealStyle(360)}
          >
            {storyText}
          </p>

          <div
            className={cn("mt-10 max-w-md", revealClass())}
            style={revealStyle(480)}
          >
            <button
              type="button"
              onClick={() => setNotesOpen((o) => !o)}
              aria-expanded={notesOpen}
              className="flex items-center gap-3 text-[11px] font-light tracking-[0.28em] text-shamal-white uppercase transition-colors duration-300 hover:text-shamal-gold"
            >
              <span className="inline-flex w-3 justify-center text-shamal-gold">
                {notesOpen ? "–" : "+"}
              </span>
              <span>
                {notesOpen ? "Hide fragrance notes" : "View fragrance notes"}
              </span>
            </button>

            <div
              className={cn(
                "grid overflow-hidden transition-[max-height] duration-500 ease-out",
                notesOpen ? "max-h-[400px]" : "max-h-0",
              )}
            >
              <div className="grid grid-cols-3 gap-6 pt-8">
                <NotesColumn label="Top" notes={topList} />
                <NotesColumn label="Heart" notes={heartList} />
                <NotesColumn label="Base" notes={baseList} />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2",
              revealClass(),
            )}
            style={revealStyle(600)}
          >
            <span className="text-[11px] font-light tracking-[0.28em] text-shamal-white-dim uppercase">
              30ML
            </span>
            <span className="font-cormorant text-4xl font-light text-shamal-white">
              {price}
            </span>
            <span className="font-cormorant text-sm text-shamal-white-dim italic">
              {edition}
            </span>
          </div>

          <div className={cn("mt-8", revealClass())} style={revealStyle(720)}>
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center bg-shamal-gold px-8 py-4 text-xs font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90"
            >
              {ctaText}
            </Link>
          </div>

          {showSocialProof && (
            <p
              className={cn(
                "mt-6 text-[11px] font-light text-shamal-white-dim",
                revealClass(),
              )}
              style={revealStyle(840)}
            >
              <span className="mr-2 text-shamal-gold">★</span>
              {waitingCount} people are waiting for this voyage
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-125 bg-[radial-gradient(circle,rgba(201,168,76,0.2)_0%,transparent_70%)]"
            />
            {bottleUrl && (
              <img
                src={bottleUrl}
                alt={voyageName}
                className="max-h-[70vh] w-auto animate-bottle-float object-contain will-change-transform"
              />
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.4em] text-shamal-gold-dim uppercase">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="h-9 w-px bg-gradient-to-b from-shamal-gold to-transparent"
        />
      </div>
    </section>
  );
}

function parseNotes(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
}

interface NotesColumnProps {
  label: string;
  notes: string[];
}

function NotesColumn({ label, notes }: NotesColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] tracking-[0.3em] text-shamal-gold uppercase">
        {label}
      </span>
      <ul className="flex flex-col gap-1.5 font-cabin text-sm font-light text-shamal-white-dim leading-relaxed">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

export const schema = createSchema({
  type: "shamal-voyage",
  title: "Shamal Voyage",
  settings: [
    {
      group: "Background",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          defaultValue: "/placeholders/voyage-forest.jpg",
        },
      ],
    },
    {
      group: "Voyage",
      inputs: [
        {
          type: "text",
          name: "momentLabel",
          label: "Moment label",
          defaultValue: "MOMENT 01",
        },
        {
          type: "text",
          name: "voyageName",
          label: "Voyage name",
          defaultValue: "First Voyage",
        },
        {
          type: "text",
          name: "voyageSubtitle",
          label: "Voyage subtitle",
          defaultValue: "Autumn forest after rain",
        },
        {
          type: "textarea",
          name: "storyText",
          label: "Story",
          defaultValue:
            "A walk through damp Finnish birch after the first autumn rain. Wet bark, cold air, and the quiet smoke of a distant fire — the moment the forest exhales.",
        },
      ],
    },
    {
      group: "Notes",
      inputs: [
        {
          type: "text",
          name: "topNotes",
          label: "Top notes (comma-separated)",
          defaultValue: "Bergamot, Cold air, Wet bark",
        },
        {
          type: "text",
          name: "heartNotes",
          label: "Heart notes (comma-separated)",
          defaultValue: "Birch leaf, Moss, Smoked tea",
        },
        {
          type: "text",
          name: "baseNotes",
          label: "Base notes (comma-separated)",
          defaultValue: "Oud, Cedar, Amber",
        },
      ],
    },
    {
      group: "Bottle",
      inputs: [
        {
          type: "image",
          name: "bottleImage",
          label: "Bottle image",
          defaultValue: "/placeholders/bottle.png",
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
          defaultValue: "€100",
        },
        {
          type: "text",
          name: "edition",
          label: "Edition",
          defaultValue: "First edition · small batch",
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
          defaultValue: "Reserve Your Voyage",
        },
        {
          type: "text",
          name: "ctaLink",
          label: "Link",
          defaultValue: "/products/first-voyage",
        },
      ],
    },
    {
      group: "Social proof",
      inputs: [
        {
          type: "text",
          name: "waitingCount",
          label: "Waiting count",
          defaultValue: "312",
        },
        {
          type: "switch",
          name: "showSocialProof",
          label: "Show social proof",
          defaultValue: true,
        },
      ],
    },
  ],
});
