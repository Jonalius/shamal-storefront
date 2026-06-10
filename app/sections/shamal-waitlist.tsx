import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { useEffect, useRef, useState } from "react";
import { WaitlistForm } from "~/components/waitlist-form";
import { cn } from "~/utils/cn";

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

        <WaitlistForm
          placeholder={placeholder}
          buttonText={buttonText}
          successMessage={successMessage}
          privacyNote={privacyNote}
          className={cn("mt-12", revealClass())}
          style={revealStyle(480)}
        />
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
