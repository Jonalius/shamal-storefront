import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

// Web3Forms access key is public by design (client-side submission).
// Signups are delivered to info@shamal.fi.
const WEB3FORMS_ACCESS_KEY = "eb9f21a4-8439-4def-929c-b1f030d20f82";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface ShamalWaitlistProps extends HydrogenComponentProps {
  ref: React.Ref<HTMLElement>;
  label: string;
  headline: string;
  subtext: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyNote: string;
}

export default function ShamalWaitlist(props: ShamalWaitlistProps) {
  const {
    ref,
    label,
    headline,
    subtext,
    placeholder,
    buttonText,
    successMessage,
    privacyNote,
    ...rest
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    // Stay on the page (no HTML form navigation) and include the page path so
    // homepage vs Nordic Seasons signups are distinguishable in the email.
    const page = typeof window !== "undefined" ? window.location.pathname : "";

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          email: trimmedEmail,
          page,
          subject: `New Shamal waitlist signup (${page || "/"})`,
          from_name: "Shamal Waitlist",
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
      } | null;

      if (response.ok && result?.success) {
        setStatus("success");
      } else {
        setErrorMessage("Something went wrong — please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  return (
    <section
      ref={ref}
      {...rest}
      id="waitlist"
      className="w-full bg-shamal-black py-24 md:py-32"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-[520px] flex-col items-center px-6 text-center"
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
          className={cn("mt-8 w-full", revealClass())}
          style={revealStyle(120)}
        >
          <DiamondDivider />
        </div>

        <h2
          className={cn(
            "mt-6 font-cormorant text-4xl font-light text-shamal-white leading-tight md:text-5xl",
            revealClass(),
          )}
          style={revealStyle(240)}
        >
          {headline}
        </h2>

        <p
          className={cn(
            "mt-4 font-cabin text-base font-light text-shamal-white-dim leading-relaxed",
            revealClass(),
          )}
          style={revealStyle(360)}
        >
          {subtext}
        </p>

        {status === "success" ? (
          <p
            className={cn(
              "mt-12 font-cormorant text-xl text-shamal-white-dim italic",
              revealClass(),
            )}
            style={revealStyle(480)}
          >
            {successMessage}
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className={cn(
                "mt-12 flex w-full flex-col gap-3 sm:flex-row sm:gap-0",
                revealClass(),
              )}
              style={revealStyle(480)}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                placeholder={placeholder}
                aria-label={placeholder}
                className="flex-1 border border-shamal-gold-dim/40 bg-shamal-surface px-5 py-4 font-cabin text-shamal-white placeholder:text-shamal-white-dim/60 focus:border-shamal-gold focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-shamal-gold px-8 py-4 text-[11px] font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Joining..." : buttonText}
              </button>
            </form>

            {status === "error" && (
              <p
                role="alert"
                className="mt-4 font-cabin text-xs font-light text-red-300/80"
              >
                {errorMessage}
              </p>
            )}

            <p
              className={cn(
                "mt-4 text-[10px] font-light text-shamal-white-dim/70",
                revealClass(),
              )}
              style={revealStyle(600)}
            >
              {privacyNote}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function DiamondDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-shamal-gold/55" />
      <span className="text-[10px] text-shamal-gold">◆</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-shamal-gold/55" />
    </div>
  );
}

export const schema = createSchema({
  type: "shamal-waitlist",
  title: "Shamal Waitlist",
  settings: [
    {
      group: "Label",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Section label",
          defaultValue: "JOIN THE WAITLIST",
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
          defaultValue: "Don't miss the launch.",
        },
        {
          type: "textarea",
          name: "subtext",
          label: "Subtext",
          defaultValue:
            "Join the waitlist. First access, before public launch.",
        },
      ],
    },
    {
      group: "Form",
      inputs: [
        {
          type: "text",
          name: "placeholder",
          label: "Email placeholder",
          defaultValue: "Your email address",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Join the Waitlist",
        },
        {
          type: "text",
          name: "successMessage",
          label: "Success message",
          defaultValue:
            "You're on the list. We'll let you know when the voyages arrive.",
        },
        {
          type: "text",
          name: "privacyNote",
          label: "Privacy note",
          defaultValue: "Notification only. No spam.",
        },
      ],
    },
  ],
});
