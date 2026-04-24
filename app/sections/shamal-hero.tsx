import { HandbagIcon } from "@phosphor-icons/react";
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

const NAV_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "The Voyages", href: "#voyages" },
  { label: "The Journal", href: "#journal" },
  { label: "Shop", href: "#shop" },
] as const;

interface ShamalHeroProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  backgroundImage: WeaverseImage | string;
  wordmark: string;
  dividerSubtitle: string;
  headline: string;
  subtext: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  teaserText: string;
  showTeaser: boolean;
}

export default function ShamalHero(props: ShamalHeroProps) {
  const {
    ref,
    backgroundImage,
    wordmark,
    dividerSubtitle,
    headline,
    subtext,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    teaserText,
    showTeaser,
    ...rest
  } = props;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const imageUrl =
    typeof backgroundImage === "string"
      ? backgroundImage
      : backgroundImage?.url;

  return (
    <section
      ref={ref}
      {...rest}
      className="relative min-h-screen w-full overflow-hidden bg-shamal-black text-shamal-white"
    >
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-out",
          scrolled
            ? "border-b border-shamal-white/10 bg-shamal-black/95 backdrop-blur-sm"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="font-cormorant text-lg tracking-[0.45em] text-shamal-white uppercase md:text-xl"
          >
            <span className="ml-[0.45em]">SHAMAL</span>
          </Link>
          <div className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] font-light tracking-[0.28em] text-shamal-white-dim uppercase transition-colors duration-300 hover:text-shamal-gold"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label="Open cart"
            className="flex h-9 w-9 items-center justify-center text-shamal-white transition-colors duration-300 hover:text-shamal-gold"
          >
            <HandbagIcon className="h-5 w-5" weight="light" />
          </button>
        </div>
      </nav>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-shamal-black/40 via-shamal-black/30 to-shamal-black"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center">
        <div className="flex w-full max-w-[640px] flex-col items-center">
          <h1
            className="animate-fade-in-up font-cormorant text-5xl text-shamal-gold md:text-6xl"
            style={{ letterSpacing: "0.55em" }}
          >
            <span className="ml-[0.55em]">{wordmark}</span>
          </h1>

          <div
            aria-hidden="true"
            className="mt-8 h-px w-[200px] animate-fade-in-up bg-gradient-to-r from-transparent via-shamal-gold/55 to-transparent [animation-delay:150ms]"
          />

          <p className="mt-6 animate-fade-in-up font-cormorant text-sm text-shamal-white-dim italic tracking-[0.15em] [animation-delay:300ms]">
            {dividerSubtitle}
          </p>

          <h2 className="mt-12 animate-fade-in-up font-cormorant text-5xl font-light text-shamal-white leading-tight md:text-6xl lg:text-7xl [animation-delay:450ms]">
            {headline}
          </h2>

          <p className="mt-8 max-w-lg animate-fade-in-up font-cabin text-base font-light text-shamal-white-dim leading-relaxed md:text-lg [animation-delay:600ms]">
            {subtext}
          </p>

          <div className="mt-12 flex w-full animate-fade-in-up flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:750ms]">
            <Link
              to={primaryCtaLink}
              className="inline-flex items-center justify-center bg-shamal-gold px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90"
            >
              {primaryCtaText}
            </Link>
            <Link
              to={secondaryCtaLink}
              className="inline-flex items-center justify-center border border-shamal-gold-dim/60 bg-transparent px-10 py-4 text-xs font-medium tracking-[0.28em] text-shamal-gold uppercase transition-colors duration-300 hover:border-shamal-gold hover:bg-shamal-gold/10"
            >
              {secondaryCtaText}
            </Link>
          </div>

          {showTeaser && teaserText && (
            <div className="mt-16 flex w-full animate-fade-in-up items-center justify-center gap-4 [animation-delay:900ms]">
              <span
                aria-hidden="true"
                className="h-px w-16 bg-gradient-to-r from-transparent to-shamal-gold-dim"
              />
              <span className="text-[10px] tracking-[0.4em] text-shamal-white-dim uppercase">
                {teaserText}
              </span>
              <span
                aria-hidden="true"
                className="h-px w-16 bg-gradient-to-l from-transparent to-shamal-gold-dim"
              />
            </div>
          )}
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

export const schema = createSchema({
  type: "shamal-hero",
  title: "Shamal Hero",
  settings: [
    {
      group: "Background",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
          // TODO: replace with real Shamal photography
          defaultValue: "/placeholders/hero-forest.jpg",
        },
      ],
    },
    {
      group: "Brand",
      inputs: [
        {
          type: "text",
          name: "wordmark",
          label: "Wordmark",
          defaultValue: "SHAMAL",
        },
        {
          type: "text",
          name: "dividerSubtitle",
          label: "Divider subtitle",
          defaultValue: "— Finland —",
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
          name: "subtext",
          label: "Subtext",
          defaultValue: "Artisan Perfume Brand based in Finland",
        },
      ],
    },
    {
      group: "Primary CTA",
      inputs: [
        {
          type: "text",
          name: "primaryCtaText",
          label: "Button text",
          defaultValue: "Begin Your Journey",
        },
        {
          type: "text",
          name: "primaryCtaLink",
          label: "Link",
          defaultValue: "/products/discovery-set",
        },
      ],
    },
    {
      group: "Secondary CTA",
      inputs: [
        {
          type: "text",
          name: "secondaryCtaText",
          label: "Button text",
          defaultValue: "Join the Waitlist",
        },
        {
          type: "text",
          name: "secondaryCtaLink",
          label: "Link",
          defaultValue: "#waitlist",
        },
      ],
    },
    {
      group: "Teaser",
      inputs: [
        {
          type: "text",
          name: "teaserText",
          label: "Teaser text",
          defaultValue: "Summer Fragrance Löyly · Arriving Soon",
        },
        {
          type: "switch",
          name: "showTeaser",
          label: "Show teaser",
          defaultValue: true,
        },
      ],
    },
  ],
});
