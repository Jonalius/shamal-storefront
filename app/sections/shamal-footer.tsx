import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { Link } from "react-router";
import { cn } from "~/utils/cn";

interface LinkPair {
  text: string;
  url: string;
}

interface ShamalFooterProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  brandLogo: WeaverseImage | string;
  brandTagline1: string;
  brandTagline2: string;
  handcraftedLabel: string;
  handcraftedStatement: string;
  exploreLabel: string;
  exploreLink1Text: string;
  exploreLink1Url: string;
  exploreLink2Text: string;
  exploreLink2Url: string;
  exploreLink3Text: string;
  exploreLink3Url: string;
  exploreLink4Text: string;
  exploreLink4Url: string;
  contactLabel: string;
  contactCity: string;
  contactAtelier: string;
  contactEmail: string;
  copyright: string;
  policy1Text: string;
  policy1Url: string;
  policy2Text: string;
  policy2Url: string;
  policy3Text: string;
  policy3Url: string;
}

export default function ShamalFooter(props: ShamalFooterProps) {
  const {
    ref,
    brandLogo,
    brandTagline1,
    brandTagline2,
    handcraftedLabel,
    handcraftedStatement,
    exploreLabel,
    exploreLink1Text,
    exploreLink1Url,
    exploreLink2Text,
    exploreLink2Url,
    exploreLink3Text,
    exploreLink3Url,
    exploreLink4Text,
    exploreLink4Url,
    contactLabel,
    contactCity,
    contactAtelier,
    contactEmail,
    copyright,
    policy1Text,
    policy1Url,
    policy2Text,
    policy2Url,
    policy3Text,
    policy3Url,
    ...rest
  } = props;

  const exploreLinks: LinkPair[] = [
    { text: exploreLink1Text, url: exploreLink1Url },
    { text: exploreLink2Text, url: exploreLink2Url },
    { text: exploreLink3Text, url: exploreLink3Url },
    { text: exploreLink4Text, url: exploreLink4Url },
  ];

  const policyLinks: LinkPair[] = [
    { text: policy1Text, url: policy1Url },
    { text: policy2Text, url: policy2Url },
    { text: policy3Text, url: policy3Url },
  ];

  const logoUrl =
    typeof brandLogo === "string"
      ? brandLogo || "/shamal-logo-gold.png"
      : brandLogo?.url || "/shamal-logo-gold.png";
  const logoAlt =
    typeof brandLogo === "object" && brandLogo?.altText
      ? brandLogo.altText
      : "Shamal";

  return (
    <footer ref={ref} {...rest} className="w-full bg-shamal-black px-6 py-20">
      <div className="mx-auto mb-16 flex justify-center">
        <GoldDivider />
      </div>

      <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
        <span className="text-[11px] tracking-[0.4em] text-shamal-gold uppercase">
          {handcraftedLabel}
        </span>
        <p className="mt-4 font-cormorant text-base text-shamal-white-dim italic">
          {handcraftedStatement}
        </p>
        <div className="mt-6 flex w-full justify-center">
          <GoldDivider />
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-3">
        <div className="flex flex-col">
          <img
            src={logoUrl}
            alt={logoAlt}
            className="mb-6 h-40 w-auto object-contain"
          />
          <p className="font-cabin text-sm text-shamal-white-dim leading-relaxed">
            {brandTagline1}
          </p>
          <p className="mt-2 font-cabin text-sm text-shamal-white-dim italic leading-relaxed">
            {brandTagline2}
          </p>
        </div>

        <div className="flex flex-col">
          <span className="mb-6 text-[11px] tracking-[0.4em] text-shamal-gold uppercase">
            {exploreLabel}
          </span>
          <ul className="flex flex-col gap-3">
            {exploreLinks.map((link) => (
              <li key={`${link.text}-${link.url}`}>
                <Link
                  to={link.url}
                  className="font-cabin text-sm text-shamal-white-dim transition-colors duration-300 hover:text-shamal-gold"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <span className="mb-6 text-[11px] tracking-[0.4em] text-shamal-gold uppercase">
            {contactLabel}
          </span>
          <p className="font-cabin text-sm text-shamal-white-dim">
            {contactCity}
          </p>
          <p className="mt-2 font-cabin text-sm text-shamal-white-dim">
            {contactAtelier}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 font-cabin text-sm text-shamal-white-dim transition-colors duration-300 hover:text-shamal-gold"
          >
            {contactEmail}
          </a>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto mt-20 flex max-w-[1200px] flex-col items-center gap-4 border-t border-shamal-gold-dim/20 pt-6",
          "md:flex-row md:justify-between",
        )}
      >
        <p className="text-[11px] text-shamal-white-dim/70">{copyright}</p>
        <ul className="flex gap-6">
          {policyLinks.map((link) => (
            <li key={`${link.text}-${link.url}`}>
              <Link
                to={link.url}
                className="text-[11px] tracking-[0.28em] text-shamal-white-dim/70 uppercase transition-colors duration-300 hover:text-shamal-gold"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function GoldDivider() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-shamal-gold-dim to-transparent"
    />
  );
}

export const schema = createSchema({
  type: "shamal-footer",
  title: "Shamal Footer",
  settings: [
    {
      group: "Handcrafted",
      inputs: [
        {
          type: "text",
          name: "handcraftedLabel",
          label: "Label",
          defaultValue: "HANDCRAFTED IN FINLAND",
        },
        {
          type: "textarea",
          name: "handcraftedStatement",
          label: "Statement",
          defaultValue:
            "Blended at our Lohja atelier. Ancient oud. Nordic botanicals. Small batch only.",
        },
      ],
    },
    {
      group: "Brand",
      inputs: [
        {
          type: "image",
          name: "brandLogo",
          label: "Brand logo",
          defaultValue: "/shamal-logo-gold.png",
        },
        {
          type: "textarea",
          name: "brandTagline1",
          label: "Tagline 1",
          defaultValue: "Artisan fragrances handcrafted in Helsinki, Finland.",
        },
        {
          type: "textarea",
          name: "brandTagline2",
          label: "Tagline 2",
          defaultValue: "Where Nordic silence meets Eastern mystery.",
        },
      ],
    },
    {
      group: "Explore",
      inputs: [
        {
          type: "text",
          name: "exploreLabel",
          label: "Heading",
          defaultValue: "EXPLORE",
        },
        {
          type: "text",
          name: "exploreLink1Text",
          label: "Link 1 text",
          defaultValue: "Our Story",
        },
        {
          type: "text",
          name: "exploreLink1Url",
          label: "Link 1 url",
          defaultValue: "#story",
        },
        {
          type: "text",
          name: "exploreLink2Text",
          label: "Link 2 text",
          defaultValue: "The Voyages",
        },
        {
          type: "text",
          name: "exploreLink2Url",
          label: "Link 2 url",
          defaultValue: "#voyages",
        },
        {
          type: "text",
          name: "exploreLink3Text",
          label: "Link 3 text",
          defaultValue: "The Journal",
        },
        {
          type: "text",
          name: "exploreLink3Url",
          label: "Link 3 url",
          defaultValue: "/journal",
        },
        {
          type: "text",
          name: "exploreLink4Text",
          label: "Link 4 text",
          defaultValue: "Shop All",
        },
        {
          type: "text",
          name: "exploreLink4Url",
          label: "Link 4 url",
          defaultValue: "#shop",
        },
      ],
    },
    {
      group: "Contact",
      inputs: [
        {
          type: "text",
          name: "contactLabel",
          label: "Heading",
          defaultValue: "CONTACT",
        },
        {
          type: "text",
          name: "contactCity",
          label: "City",
          defaultValue: "Helsinki, Finland",
        },
        {
          type: "text",
          name: "contactAtelier",
          label: "Atelier",
          defaultValue: "Lohja Atelier",
        },
        {
          type: "text",
          name: "contactEmail",
          label: "Email",
          defaultValue: "hello@shamal.fi",
        },
      ],
    },
    {
      group: "Bottom",
      inputs: [
        {
          type: "text",
          name: "copyright",
          label: "Copyright",
          defaultValue: "© 2026 Shamal. All rights reserved.",
        },
        {
          type: "text",
          name: "policy1Text",
          label: "Policy 1 text",
          defaultValue: "Privacy",
        },
        {
          type: "text",
          name: "policy1Url",
          label: "Policy 1 url",
          defaultValue: "/policies/privacy-policy",
        },
        {
          type: "text",
          name: "policy2Text",
          label: "Policy 2 text",
          defaultValue: "Terms",
        },
        {
          type: "text",
          name: "policy2Url",
          label: "Policy 2 url",
          defaultValue: "/policies/terms-of-service",
        },
        {
          type: "text",
          name: "policy3Text",
          label: "Policy 3 text",
          defaultValue: "Shipping",
        },
        {
          type: "text",
          name: "policy3Url",
          label: "Policy 3 url",
          defaultValue: "/policies/shipping-policy",
        },
      ],
    },
  ],
});
