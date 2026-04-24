import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalStoryProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  label: string;
  headline: string;
  paragraph1: string;
  paragraph2: string;
  pill1Title: string;
  pill1Body: string;
  pill2Title: string;
  pill2Body: string;
  pill3Title: string;
  pill3Body: string;
  ctaText: string;
  ctaLink: string;
}

export default function ShamalStory(props: ShamalStoryProps) {
  const {
    ref,
    label,
    headline,
    paragraph1,
    paragraph2,
    pill1Title,
    pill1Body,
    pill2Title,
    pill2Body,
    pill3Title,
    pill3Body,
    ctaText,
    ctaLink,
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

  return (
    <section
      ref={ref}
      {...rest}
      id="story"
      className="relative w-full bg-shamal-black py-32 text-shamal-white md:py-40"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-[860px] flex-col items-center px-6 text-center"
      >
        <span
          className={cn(
            "text-[11px] tracking-[0.4em] text-shamal-gold uppercase",
            revealClass(),
          )}
          style={revealStyle(0)}
        >
          {label}
        </span>

        <div
          className={cn("mt-10 w-full", revealClass())}
          style={revealStyle(150)}
        >
          <DiamondDivider />
        </div>

        <h2
          className={cn(
            "mt-10 font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl",
            revealClass(),
          )}
          style={revealStyle(300)}
        >
          {headline}
        </h2>

        <div className="mt-12 flex max-w-[640px] flex-col gap-6">
          <p
            className={cn(
              "font-cabin text-base font-light text-shamal-white-dim leading-relaxed md:text-lg",
              revealClass(),
            )}
            style={revealStyle(450)}
          >
            {paragraph1}
          </p>
          <p
            className={cn(
              "font-cabin text-base font-light text-shamal-white-dim leading-relaxed md:text-lg",
              revealClass(),
            )}
            style={revealStyle(600)}
          >
            {paragraph2}
          </p>
        </div>

        <div
          className={cn("mt-16 w-full", revealClass())}
          style={revealStyle(750)}
        >
          <DiamondDivider />
        </div>

        <div className="mt-16 grid w-full grid-cols-1 md:grid-cols-3">
          <Pillar
            icon={<HandIcon className="h-7 w-7" />}
            title={pill1Title}
            body={pill1Body}
            className={cn(
              "md:border-r md:border-shamal-gold/30",
              revealClass(),
            )}
            style={revealStyle(900)}
          />
          <Pillar
            icon={<LeafIcon className="h-7 w-7" />}
            title={pill2Title}
            body={pill2Body}
            className={cn(
              "md:border-r md:border-shamal-gold/30",
              revealClass(),
            )}
            style={revealStyle(1050)}
          />
          <Pillar
            icon={<BatchIcon className="h-7 w-7" />}
            title={pill3Title}
            body={pill3Body}
            className={revealClass()}
            style={revealStyle(1200)}
          />
        </div>

        <div
          className={cn("mt-16 w-full", revealClass())}
          style={revealStyle(1350)}
        >
          <DiamondDivider />
        </div>

        <Link
          to={ctaLink}
          className={cn(
            "mt-16 inline-flex items-center justify-center border border-shamal-gold px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-gold uppercase transition-colors duration-300 hover:bg-shamal-gold/10",
            revealClass(),
          )}
          style={revealStyle(1500)}
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

function DiamondDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4">
      <span className="h-px w-24 bg-gradient-to-r from-transparent to-shamal-gold/55" />
      <span className="text-[10px] text-shamal-gold">◆</span>
      <span className="h-px w-24 bg-gradient-to-l from-transparent to-shamal-gold/55" />
    </div>
  );
}

interface PillarProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  className?: string;
  style?: React.CSSProperties;
}

function Pillar({ icon, title, body, className, style }: PillarProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-4 px-6 py-8", className)}
      style={style}
    >
      <span className="text-shamal-gold">{icon}</span>
      <span className="text-[11px] tracking-[0.3em] text-shamal-white uppercase">
        {title}
      </span>
      <p className="max-w-[220px] font-cabin text-sm font-light text-shamal-white-dim leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function HandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.54l-3.45-4.4a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.5c1 1.5.5 7.5-4.5 12.5-1.8 1.8-3.8 2.8-6 3" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

function BatchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" />
      <path d="M7 9h10" />
      <path d="M7 13h10" />
      <path d="M7 17h6" />
    </svg>
  );
}

export const schema = createSchema({
  type: "shamal-story",
  title: "Shamal Story",
  settings: [
    {
      group: "Label",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "OUR STORY",
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
          defaultValue: "Where Nordic Silence Meets Eastern Mystery",
        },
        {
          type: "textarea",
          name: "paragraph1",
          label: "Paragraph 1",
          defaultValue:
            "Born in the quiet forests of Finland, Shamal draws its essence from the ancient perfume traditions of the East and the untouched wilderness of the North.",
        },
        {
          type: "textarea",
          name: "paragraph2",
          label: "Paragraph 2",
          defaultValue:
            "Each fragrance is handcrafted in our Lohja atelier, where we blend precious oud with Nordic botanicals, creating scents that tell stories of distant places and forgotten memories.",
        },
      ],
    },
    {
      group: "Pillar 1",
      inputs: [
        {
          type: "text",
          name: "pill1Title",
          label: "Title",
          defaultValue: "HANDCRAFTED",
        },
        {
          type: "textarea",
          name: "pill1Body",
          label: "Body",
          defaultValue: "Each bottle blended by hand at our Lohja atelier",
        },
      ],
    },
    {
      group: "Pillar 2",
      inputs: [
        {
          type: "text",
          name: "pill2Title",
          label: "Title",
          defaultValue: "OUD & NORDIC BOTANICALS",
        },
        {
          type: "textarea",
          name: "pill2Body",
          label: "Body",
          defaultValue:
            "Ancient Eastern resins meet Finnish forest ingredients",
        },
      ],
    },
    {
      group: "Pillar 3",
      inputs: [
        {
          type: "text",
          name: "pill3Title",
          label: "Title",
          defaultValue: "LIMITED VOYAGES",
        },
        {
          type: "textarea",
          name: "pill3Body",
          label: "Body",
          defaultValue: "Every fragrance is a small batch, numbered edition",
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
          defaultValue: "Explore the Collection",
        },
        {
          type: "text",
          name: "ctaLink",
          label: "Link",
          defaultValue: "#shop",
        },
      ],
    },
  ],
});
