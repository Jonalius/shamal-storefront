import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { ArticleFragment, BlogQuery } from "storefront-api.generated";
import { cn } from "~/utils/cn";

interface ShamalJournalIndexProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  eyebrow: string;
  headlineOverride: string;
  subhead: string;
  readMoreLabel: string;
}

type JournalArticle = ArticleFragment & {
  tags?: string[];
  publishedAt: string;
};

export default function ShamalJournalIndex(props: ShamalJournalIndexProps) {
  const { ref, eyebrow, headlineOverride, subhead, readMoreLabel, ...rest } =
    props;

  const data = useLoaderData<
    Partial<BlogQuery> & { articles?: JournalArticle[] }
  >();
  const blog = data?.blog;
  const articles = data?.articles ?? [];
  const blogHandle = blog?.handle ?? "journal";
  const headline = headlineOverride?.trim() || blog?.title || "The Journal";

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
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

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-shamal-black py-24 text-shamal-white md:py-32"
    >
      <div ref={containerRef} className="mx-auto max-w-[1280px] px-6 md:px-10">
        <header className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <span
            className={cn(
              "text-[10px] font-light tracking-[0.4em] text-shamal-gold uppercase",
              revealClass(),
            )}
            style={revealStyle(0)}
          >
            {eyebrow}
          </span>
          <div
            aria-hidden="true"
            className={cn("mt-6 flex items-center gap-4", revealClass())}
            style={revealStyle(120)}
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-shamal-gold/55" />
            <span className="text-[10px] text-shamal-gold">◆</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-shamal-gold/55" />
          </div>
          <h1
            className={cn(
              "mt-6 font-cormorant text-4xl text-shamal-white md:text-6xl",
              revealClass(),
            )}
            style={revealStyle(240)}
          >
            {headline}
          </h1>
          {subhead && (
            <p
              className={cn(
                "mt-4 font-cormorant text-lg text-shamal-white-dim italic md:text-xl",
                revealClass(),
              )}
              style={revealStyle(360)}
            >
              {subhead}
            </p>
          )}
        </header>

        {articles.length === 0 ? (
          <p
            className={cn(
              "mt-20 text-center font-cormorant text-2xl text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(480)}
          >
            New stories will appear here soon.
          </p>
        ) : (
          <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            {articles.map((article, index) => (
              <JournalCard
                key={article.id}
                article={article}
                blogHandle={blogHandle}
                readMoreLabel={readMoreLabel}
                className={revealClass()}
                style={revealStyle(480 + index * 120)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface JournalCardProps {
  article: JournalArticle;
  blogHandle: string;
  readMoreLabel: string;
  className?: string;
  style?: React.CSSProperties;
}

function JournalCard({
  article,
  blogHandle,
  readMoreLabel,
  className,
  style,
}: JournalCardProps) {
  const href = `/blogs/${blogHandle}/${article.handle}`;
  const tag = article.tags?.[0];
  const image = article.image;
  const excerpt = article.excerpt?.trim();

  return (
    <article className={cn("group flex flex-col", className)} style={style}>
      <Link
        to={href}
        className="relative block aspect-[4/3] overflow-hidden bg-shamal-surface"
      >
        {image?.url ? (
          <img
            src={image.url}
            alt={image.altText || article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-shamal-surface via-shamal-black to-shamal-black" />
        )}
      </Link>

      <div className="mt-6 flex flex-col">
        {tag && (
          <span className="text-[10px] font-light tracking-[0.35em] text-shamal-gold uppercase">
            {formatTag(tag)}
          </span>
        )}
        <h2 className="mt-3 font-cormorant text-2xl text-shamal-white md:text-3xl">
          <Link
            to={href}
            className="transition-colors duration-300 hover:text-shamal-gold"
          >
            {article.title}
          </Link>
        </h2>
        {excerpt && (
          <p className="mt-3 line-clamp-2 text-sm text-shamal-white-dim leading-relaxed md:text-base">
            {excerpt}
          </p>
        )}
        <Link
          to={href}
          className="group/cta mt-5 inline-flex w-fit items-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase"
        >
          <span className="relative">
            {readMoreLabel}
            <span className="absolute right-0 -bottom-1 left-0 h-px origin-left scale-x-0 bg-shamal-gold transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function formatTag(tag: string): string {
  return tag.replace(/-/g, " ").toUpperCase();
}

export const schema = createSchema({
  type: "shamal-journal-index",
  title: "Shamal Journal Index",
  limit: 1,
  enabledOn: {
    pages: ["BLOG"],
  },
  settings: [
    {
      group: "Header",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow label",
          defaultValue: "THE JOURNAL",
        },
        {
          type: "text",
          name: "headlineOverride",
          label: "Headline override",
          defaultValue: "",
          placeholder: "Defaults to the blog title",
        },
        {
          type: "text",
          name: "subhead",
          label: "Subhead",
          defaultValue: "On Fragrance, Place & Memory",
        },
      ],
    },
    {
      group: "Cards",
      inputs: [
        {
          type: "text",
          name: "readMoreLabel",
          label: "Read more label",
          defaultValue: "Read",
        },
      ],
    },
  ],
});
