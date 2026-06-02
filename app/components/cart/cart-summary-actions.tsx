import { XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartForm } from "@shopify/hydrogen";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Banner } from "~/components/banner";
import { cn } from "~/utils/cn";

const OVERLAY_CLASS =
  "fixed inset-0 z-50 bg-shamal-black/70 data-[state=open]:animate-fade-in";

const CONTENT_WRAPPER_CLASS = cn(
  "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs",
  "[--slide-up-from:20px]",
  "data-[state=open]:animate-slide-up",
);

const PANEL_CLASS =
  "relative w-full max-w-md overflow-hidden bg-shamal-surface p-8 text-shamal-white";

const CLOSE_BUTTON_CLASS =
  "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center text-shamal-white-dim transition-colors duration-300 hover:text-shamal-gold focus-visible:outline-0";

const TITLE_CLASS = "mb-6 font-cormorant text-3xl text-shamal-white";

const INPUT_CLASS =
  "w-full border border-shamal-white-dim/20 bg-transparent p-3 font-light text-shamal-white placeholder:text-shamal-white-dim focus:border-shamal-gold focus:outline-none";

const CANCEL_BUTTON_CLASS =
  "px-4 py-3 text-[11px] font-light tracking-[0.28em] text-shamal-white-dim uppercase transition-colors duration-300 hover:text-shamal-gold disabled:cursor-not-allowed disabled:opacity-50";

const PRIMARY_BUTTON_CLASS =
  "inline-flex min-w-32 items-center justify-center bg-shamal-gold px-6 py-3 text-[11px] font-medium tracking-[0.28em] text-shamal-black uppercase transition-colors duration-300 hover:bg-shamal-gold/90 disabled:cursor-not-allowed disabled:opacity-60";

export function NoteDialog({ cartNote: currentNote }: { cartNote: string }) {
  const [note, setNote] = useState(currentNote);
  const [submitted, setSubmitted] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setSubmitted(true);
    }
  }, [fetcher]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formCartNote = formData.get("cartNote") as string;
    if (formCartNote) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.NoteUpdate,
            inputs: { cartNote: formCartNote },
          }),
        },
        { method: "POST", action: "/cart" },
      );
      setNote(formCartNote);
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={OVERLAY_CLASS} />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setNote(currentNote);
          setSubmitted(false);
        }}
        className={CONTENT_WRAPPER_CLASS}
        aria-describedby={undefined}
      >
        <div className={PANEL_CLASS}>
          <Dialog.Close asChild>
            <button
              type="button"
              className={CLOSE_BUTTON_CLASS}
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </Dialog.Close>

          <Dialog.Title className={TITLE_CLASS}>Add a note</Dialog.Title>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <textarea
              className={cn(INPUT_CLASS, "min-h-24 resize-none")}
              placeholder="Add any special instructions or notes for your order..."
              rows={4}
              name="cartNote"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSubmitted(false);
              }}
            />
            {submitted && (
              <Banner variant="success">Cart note saved successfully</Banner>
            )}
            <div className="flex items-center justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className={CANCEL_BUTTON_CLASS}>
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={fetcher.state !== "idle"}
                className={PRIMARY_BUTTON_CLASS}
              >
                {fetcher.state !== "idle" ? "Saving" : "Save note"}
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function DiscountDialog({
  discountCodes = [],
}: {
  discountCodes: CartApiQueryFragment["discountCodes"];
}) {
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
  const submitted = Boolean(code && fetcher.state === "idle" && fetcher.data);
  const success = Boolean(
    submitted && discountCodes?.find((d) => d.code === code && d.applicable),
  );
  const error = submitted && !success;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const discountCode = formData.get("discountCode") as string;
    if (discountCode) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.DiscountCodesUpdate,
            inputs: {
              discountCode,
              discountCodes: discountCodes.map((d) => d.code),
            },
          }),
        },
        { method: "POST", action: "/cart" },
      );
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={OVERLAY_CLASS} />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setCode("");
          fetcher.data = null;
        }}
        className={CONTENT_WRAPPER_CLASS}
        aria-describedby={undefined}
      >
        <div className={PANEL_CLASS}>
          <Dialog.Close asChild>
            <button
              type="button"
              className={CLOSE_BUTTON_CLASS}
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </Dialog.Close>

          <Dialog.Title className={TITLE_CLASS}>
            Apply a discount code
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                fetcher.data = null;
              }}
              className={INPUT_CLASS}
              type="text"
              name="discountCode"
              placeholder="Discount code"
              required
            />
            {success && (
              <Banner variant="success">Discount applied successfully</Banner>
            )}
            {error && <Banner variant="error">Invalid discount code.</Banner>}
            <div className="flex items-center justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className={CANCEL_BUTTON_CLASS}>
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className={PRIMARY_BUTTON_CLASS}
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Applying" : "Apply"}
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function GiftCardDialog({
  appliedGiftCards = [],
}: {
  appliedGiftCards: CartApiQueryFragment["appliedGiftCards"];
}) {
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
  const submitted = Boolean(code && fetcher.state === "idle" && fetcher.data);
  const success = Boolean(
    submitted &&
      appliedGiftCards?.find((gc) =>
        code.toLowerCase().endsWith(gc.lastCharacters),
      ),
  );
  const error = submitted && !success;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const giftCardCode = formData.get("giftCardCode") as string;
    if (giftCardCode) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.GiftCardCodesAdd,
            inputs: {
              giftCardCodes: [giftCardCode.trim()],
            },
          }),
        },
        { method: "POST", action: "/cart" },
      );
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={OVERLAY_CLASS} />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setCode("");
          fetcher.data = null;
        }}
        className={CONTENT_WRAPPER_CLASS}
        aria-describedby={undefined}
      >
        <div className={PANEL_CLASS}>
          <Dialog.Close asChild>
            <button
              type="button"
              className={CLOSE_BUTTON_CLASS}
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </Dialog.Close>

          <Dialog.Title className={TITLE_CLASS}>
            Redeem a gift card
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className={INPUT_CLASS}
              type="text"
              name="giftCardCode"
              placeholder="Gift card code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                fetcher.data = null;
              }}
              required
            />
            {success && (
              <Banner variant="success">Gift card applied successfully</Banner>
            )}
            {error && <Banner variant="error">Invalid gift card code.</Banner>}
            <div className="flex items-center justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className={CANCEL_BUTTON_CLASS}>
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className={PRIMARY_BUTTON_CLASS}
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state !== "idle" ? "Redeeming" : "Redeem"}
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
