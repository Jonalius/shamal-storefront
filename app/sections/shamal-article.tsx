import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useRouteLoaderData } from "react-router";
import type { ArticleQuery } from "storefront-api.generated";
import type { RootLoader } from "~/root";
import { cn } from "~/utils/cn";

interface ShamalArticleProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  backLabel: string;
  publisherName: string;
}

type ArticleLoaderData = {
  article: NonNullable<NonNullable<ArticleQuery["blog"]>["articleByHandle"]>;
  blog: { handle: string };
  formattedDate: string;
};

const PROSE_CLASS = cn(
  "font-cabin text-shamal-white-dim",
  "[&>p]:my-6 [&>p]:text-lg [&>p]:leading-relaxed",
  "[&>p:first-child]:mt-0",
  "[&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:font-cormorant [&_h2]:text-3xl [&_h2]:text-shamal-white [&_h2]:tracking-wide md:[&_h2]:text-4xl",
  "[&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:font-cormorant [&_h3]:text-xl [&_h3]:text-shamal-white [&_h3]:tracking-wide md:[&_h3]:text-2xl",
  "[&_em]:font-cormorant [&_em]:text-shamal-gold/90 [&_em]:italic",
  "[&_strong]:font-medium [&_strong]:text-shamal-white",
  "[&_a]:text-shamal-gold [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-shamal-white",
  "[&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:pl-0",
  "[&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:text-lg [&_ul>li]:leading-relaxed",
  "[&_ul>li]:before:absolute [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:left-0 [&_ul>li]:before:text-[8px] [&_ul>li]:before:text-shamal-gold [&_ul>li]:before:content-['◆']",
  "[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:my-2 [&_ol>li]:text-lg",
  "[&_blockquote]:my-8 [&_blockquote]:border-shamal-gold/40 [&_blockquote]:border-l [&_blockquote]:pl-6 [&_blockquote]:font-cormorant [&_blockquote]:text-2xl [&_blockquote]:text-shamal-white [&_blockquote]:italic",
  "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:bg-[radial-gradient(circle,_var(--color-shamal-gold)_1px,_transparent_1.5px)] [&_hr]:bg-center [&_hr]:bg-no-repeat [&_hr]:bg-[length:6px_6px] [&_hr]:h-2",
  "[&_img]:my-10 [&_img]:w-full",
);

export default function ShamalArticle(props: ShamalArticleProps) {
  const { ref, backLabel, publisherName, ...rest } = props;
  const data = useLoaderData<ArticleLoaderData>();
  const rootData = useRouteLoaderData<RootLoader>("root");

  const article = data?.article;
  const blogHandle = data?.blog?.handle ?? "journal";
  const formattedDate = data?.formattedDate ?? "";

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
      { threshold: 0.05 },
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

  if (!article) {
    return (
      <section
        ref={ref}
        {...rest}
        className="w-full bg-shamal-black py-32 text-shamal-white"
      />
    );
  }

  const tag = article.tags?.[0];
  const image = article.image;
  const authorName = article.author?.name;
  const { bodyHtml, faqs } = splitFaqFromHtml(article.contentHtml);
  const articleHref = `/blogs/${blogHandle}/${article.handle}`;
  const domain = rootData?.layout?.shop?.primaryDomain?.url ?? "";
  const fullUrl = domain
    ? `${domain.replace(/\/$/, "")}${articleHref}`
    : articleHref;

  const articleSchema = buildArticleSchema({
    article,
    url: fullUrl,
    publisherName,
  });
  const faqSchema = faqs.length > 0 ? buildFaqSchema(faqs) : null;

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-shamal-black text-shamal-white"
    >
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div ref={containerRef} className="mx-auto w-full">
        <header className="mx-auto flex max-w-[760px] flex-col items-center px-6 py-24 text-center md:px-10 md:py-32">
          {tag && (
            <span
              className={cn(
                "text-[10px] font-light tracking-[0.4em] text-shamal-gold uppercase",
                revealClass(),
              )}
              style={revealStyle(0)}
            >
              {formatTag(tag)}
            </span>
          )}
          <h1
            className={cn(
              "mt-6 font-cormorant text-4xl text-shamal-white leading-[1.1] md:text-6xl",
              revealClass(),
            )}
            style={revealStyle(120)}
          >
            {article.title}
          </h1>
          {(authorName || formattedDate) && (
            <p
              className={cn(
                "mt-6 text-xs font-light tracking-[0.2em] text-shamal-white-dim uppercase",
                revealClass(),
              )}
              style={revealStyle(240)}
            >
              {authorName ? `By ${authorName}` : ""}
              {authorName && formattedDate ? " · " : ""}
              {formattedDate}
            </p>
          )}
          <div
            aria-hidden="true"
            className={cn("mt-10 flex items-center gap-4", revealClass())}
            style={revealStyle(360)}
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-shamal-gold/55" />
            <span className="text-[10px] text-shamal-gold">◆</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-shamal-gold/55" />
          </div>
        </header>

        {image?.url && (
          <div
            className={cn(
              "mx-auto max-w-[1000px] px-6 md:px-10",
              revealClass(),
            )}
            style={revealStyle(420)}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-shamal-surface">
              <img
                src={image.url}
                alt={image.altText || article.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[680px] px-6 py-16 md:px-10 md:py-24">
          <div
            suppressHydrationWarning
            className={PROSE_CLASS}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Shopify article HTML
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {faqs.length > 0 && (
            <div className="mt-16 border-shamal-white-dim/15 border-t pt-12">
              <h2 className="font-cormorant text-3xl text-shamal-white tracking-wide md:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-8 divide-y divide-shamal-white-dim/15">
                {faqs.map((faq) => (
                  <FaqItem
                    key={faq.question}
                    question={faq.question}
                    answerHtml={faq.answerHtml}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 text-center">
            <Link
              to={`/blogs/${blogHandle}`}
              className="group/back inline-flex items-center gap-2 text-[11px] font-light tracking-[0.28em] text-shamal-gold uppercase"
            >
              <span aria-hidden="true">←</span>
              <span className="relative">
                {backLabel}
                <span className="absolute right-0 -bottom-1 left-0 h-px origin-right scale-x-0 bg-shamal-gold transition-transform duration-300 ease-out group-hover/back:scale-x-100" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FaqItemProps {
  question: string;
  answerHtml: string;
}

function FaqItem({ question, answerHtml }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 text-left transition-colors duration-300 hover:text-shamal-gold"
      >
        <span className="font-cormorant text-xl text-shamal-white md:text-2xl">
          {question}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[10px] text-shamal-gold transition-transform duration-300",
            open ? "rotate-45" : "rotate-0",
          )}
        >
          ◆
        </span>
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div
            className={cn(
              "pt-4 font-cabin text-base text-shamal-white-dim leading-relaxed",
              "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
              "[&_a]:text-shamal-gold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-shamal-white",
            )}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Shopify article HTML
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        </div>
      </div>
    </div>
  );
}

function formatTag(tag: string): string {
  return tag.replace(/-/g, " ").toUpperCase();
}

interface ParsedFaq {
  question: string;
  answerHtml: string;
  answerText: string;
}

interface SplitResult {
  bodyHtml: string;
  faqs: ParsedFaq[];
}

const FAQ_HEADING_PATTERN =
  /<h2\b[^>]*>\s*(?:<[^>]+>\s*)*frequently\s+asked\s+questions(?:\s*<\/[^>]+>)*\s*<\/h2>/i;

export function splitFaqFromHtml(html: string): SplitResult {
  if (!html) return { bodyHtml: "", faqs: [] };
  const match = html.match(FAQ_HEADING_PATTERN);
  if (!match || match.index === undefined) {
    return { bodyHtml: html, faqs: [] };
  }
  const bodyHtml = html.slice(0, match.index).trim();
  const faqHtml = html.slice(match.index + match[0].length);
  return { bodyHtml, faqs: parseFaqEntries(faqHtml) };
}

function parseFaqEntries(html: string): ParsedFaq[] {
  const faqs: ParsedFaq[] = [];
  const h3Pattern = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
  const matches: Array<{ index: number; length: number; question: string }> =
    [];
  let m: RegExpExecArray | null = h3Pattern.exec(html);
  while (m !== null) {
    matches.push({
      index: m.index,
      length: m[0].length,
      question: stripHtml(m[1]).trim(),
    });
    m = h3Pattern.exec(html);
  }
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const answerStart = current.index + current.length;
    const answerEnd = next ? next.index : html.length;
    const answerHtml = html.slice(answerStart, answerEnd).trim();
    const answerText = stripHtml(answerHtml).trim();
    if (current.question && answerText) {
      faqs.push({ question: current.question, answerHtml, answerText });
    }
  }
  return faqs;
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

interface BuildArticleSchemaArgs {
  article: ArticleLoaderData["article"];
  url: string;
  publisherName: string;
}

function buildArticleSchema({
  article,
  url,
  publisherName,
}: BuildArticleSchemaArgs) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: publisherName,
    },
  };
  if (article.author?.name) {
    schema.author = {
      "@type": "Person",
      name: article.author.name,
    };
  }
  if (article.image?.url) {
    schema.image = article.image.url;
  }
  if (article.seo?.description) {
    schema.description = article.seo.description;
  }
  return schema;
}

function buildFaqSchema(faqs: ParsedFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerText,
      },
    })),
  };
}

export const schema = createSchema({
  type: "shamal-article",
  title: "Shamal Article",
  limit: 1,
  enabledOn: {
    pages: ["ARTICLE"],
  },
  settings: [
    {
      group: "Article",
      inputs: [
        {
          type: "text",
          name: "backLabel",
          label: "Back link label",
          defaultValue: "Back to the Journal",
        },
        {
          type: "text",
          name: "publisherName",
          label: "Publisher name (schema)",
          defaultValue: "Shamal",
        },
      ],
    },
  ],
});
