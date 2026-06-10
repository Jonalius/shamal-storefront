import { useState } from "react";
import { cn } from "~/utils/cn";

// Web3Forms access key is public by design (client-side submission).
// Signups are delivered to info@shamal.fi.
const WEB3FORMS_ACCESS_KEY = "eb9f21a4-8439-4def-929c-b1f030d20f82";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface WaitlistFormProps {
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyNote: string;
  /**
   * Optional context (e.g. a product title) included in the signup email so
   * homepage / section / per-product signups are distinguishable for info@.
   */
  context?: string;
  /** Applied to the root element (form wrapper or success message). */
  className?: string;
  style?: React.CSSProperties;
}

export function WaitlistForm(props: WaitlistFormProps) {
  const {
    placeholder,
    buttonText,
    successMessage,
    privacyNote,
    context,
    className,
    style,
  } = props;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    // homepage vs section vs product signups are distinguishable in the email.
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    const subject = context
      ? `New Shamal waitlist signup — ${context}`
      : `New Shamal waitlist signup (${page || "/"})`;

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
          product: context ?? "",
          subject,
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

  if (status === "success") {
    return (
      <p
        className={cn(
          "font-cormorant text-xl text-shamal-white-dim italic",
          className,
        )}
        style={style}
      >
        {successMessage}
      </p>
    );
  }

  return (
    <div className={cn("w-full", className)} style={style}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0"
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

      {privacyNote && (
        <p className="mt-4 text-[10px] font-light text-shamal-white-dim/70">
          {privacyNote}
        </p>
      )}
    </div>
  );
}
