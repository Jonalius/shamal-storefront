import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface ShamalJournalTeaserData {
  blogHandle: string;
  eyebrow: string;
  headline: string;
  ctaText: string;
}

interface TeaserArticle {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  tags: string[];
  image: {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
}

interface JournalTeaserLoaderData {
  blogHandle: string;
  articles: TeaserArticle[];
}

interface ShamalJournalTeaserProps
  extends HydrogenComponentProps<JournalTeaserLoaderData>,
    ShamalJournalTeaserData {
  ref: React.Ref<HTMLElement>;
}

const PLACEHOLDER_ARTICLES: TeaserArticle[] = [
  {
    id: "placeholder-1",
    handle: "",
    title: "An article from the Journal will appear here.",
    excerpt: "Publish posts to the journal blog to populate this teaser.",
    publishedAt: "",
    tags: ["the-journal"],
    image: null,
  },
  {
    id: "placeholder-2",
    handle: "",
    title: "Stories on fragrance, place and memory.",
    excerpt:
      "Each card links to the most recent journal article once available.",
    publishedAt: "",
    tags: ["the-journal"],
    image: null,
  },
  {
    id: "placeholder-3",
    handle: "",
    title: "Quiet reflections from the Lohja atelier.",
    excerpt: "Add three or more posts to the journal blog for the full layout.",
    publishedAt: "",
    tags: ["the-journal"],
    image: null,
  },
];

export default function ShamalJournalTeaser(props: ShamalJournalTeaserProps) {
  const { ref, eyebrow, headline, ctaText, loaderData, ...rest } = props;
  const fetchedArticles = loaderData?.articles ?? [];
  const blogHandle = loaderData?.blogHandle ?? "journal";
  const articles =
    fetchedArticles.length > 0 ? fetchedArticles : PLACEHOLDER_ARTICLES;
  const isPlaceholder = fetchedArticles.length === 0;

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
      className="w-full bg-shamal-surface py-24 text-shamal-white"
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
          <h2
            className={cn(
              "mt-5 font-cormorant text-3xl text-shamal-white md:text-5xl",
              revealClass(),
            )}
            style={revealStyle(120)}
          >
            {headline}
          </h2>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {articles.map((article, index) => (
            <TeaserCard
              key={article.id}
              article={article}
              blogHandle={blogHandle}
              isPlaceholder={isPlaceholder}
              className={revealClass()}
              style={revealStyle(240 + index * 120)}
            />
          ))}
        </div>

        <div
          className={cn("mt-16 text-center", revealClass())}
          style={revealStyle(640)}
        >
          <Link
            to={`/blogs/${blogHandle}`}
            className="group/cta inline-flex items-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase"
          >
            <span className="relative">
              {ctaText}
              <span className="absolute right-0 -bottom-1 left-0 h-px origin-left scale-x-0 bg-shamal-gold transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface TeaserCardProps {
  article: TeaserArticle;
  blogHandle: string;
  isPlaceholder?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function TeaserCard({
  article,
  blogHandle,
  isPlaceholder,
  className,
  style,
}: TeaserCardProps) {
  const href = `/blogs/${blogHandle}/${article.handle}`;
  const tag = article.tags?.[0];
  const image = article.image;
  const excerpt = article.excerpt?.trim();

  const mediaInner = image?.url ? (
    <img
      src={image.url}
      alt={image.altText || article.title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-shamal-black via-shamal-surface to-shamal-black" />
  );

  return (
    <article className={cn("group flex flex-col", className)} style={style}>
      {isPlaceholder ? (
        <div
          aria-hidden="true"
          className="relative block aspect-[4/3] overflow-hidden bg-shamal-black"
        >
          {mediaInner}
        </div>
      ) : (
        <Link
          to={href}
          className="relative block aspect-[4/3] overflow-hidden bg-shamal-black"
        >
          {mediaInner}
        </Link>
      )}
      <div className="mt-5 flex flex-col">
        {tag && (
          <span className="text-[10px] font-light tracking-[0.32em] text-shamal-gold uppercase">
            {formatTag(tag)}
          </span>
        )}
        <h3 className="mt-2 font-cormorant text-xl text-shamal-white md:text-2xl">
          {isPlaceholder ? (
            <span className="text-shamal-white-dim italic">
              {article.title}
            </span>
          ) : (
            <Link
              to={href}
              className="transition-colors duration-300 hover:text-shamal-gold"
            >
              {article.title}
            </Link>
          )}
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-shamal-white-dim leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

function formatTag(tag: string): string {
  return tag.replace(/-/g, " ").toUpperCase();
}

const JOURNAL_TEASER_QUERY = `#graphql
  query journalTeaserArticles(
    $language: LanguageCode
    $country: CountryCode
    $blogHandle: String!
    $first: Int!
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          handle
          title
          excerpt
          publishedAt
          tags
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

interface JournalTeaserQueryResult {
  blog?: {
    handle: string;
    articles: {
      nodes: TeaserArticle[];
    };
  } | null;
}

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<ShamalJournalTeaserData>): Promise<JournalTeaserLoaderData> => {
  const { language, country } = weaverse.storefront.i18n;
  const blogHandle = data.blogHandle?.trim() || "journal";
  const result = await weaverse.storefront.query<JournalTeaserQueryResult>(
    JOURNAL_TEASER_QUERY,
    {
      variables: {
        language,
        country,
        blogHandle,
        first: 3,
      },
    },
  );
  return {
    blogHandle,
    articles: result?.blog?.articles?.nodes ?? [],
  };
};

export const schema = createSchema({
  type: "shamal-journal-teaser",
  title: "Shamal Journal Teaser",
  limit: 1,
  enabledOn: {
    pages: ["INDEX"],
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
          name: "headline",
          label: "Headline",
          defaultValue: "On Fragrance, Place & Memory",
        },
      ],
    },
    {
      group: "Source",
      inputs: [
        {
          type: "text",
          name: "blogHandle",
          label: "Blog handle",
          defaultValue: "journal",
        },
      ],
    },
    {
      group: "CTA",
      inputs: [
        {
          type: "text",
          name: "ctaText",
          label: "CTA text",
          defaultValue: "Read the Journal",
        },
      ],
    },
  ],
});
