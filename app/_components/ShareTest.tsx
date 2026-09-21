"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { trackEvent, type EventName } from "../_analytics/analytics";

type ShareTestProps = {
  heading: string;
  description: string;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
  clickEvent: EventName;
  successEvent: EventName;
};

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

async function copyLink(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // Older browsers and restricted contexts can still use the selection fallback.
  }
  return legacyCopy(url);
}

export default function ShareTest({ heading, description, shareTitle, shareText, shareUrl, clickEvent, successEvent }: ShareTestProps) {
  const headingId = useId();
  const nativeShare = useSyncExternalStore(
    () => () => undefined,
    () => typeof navigator.share === "function",
    () => false,
  );
  const [copyMode, setCopyMode] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const useNativeShare = nativeShare && !copyMode;

  async function handleShare() {
    setStatus("idle");
    if (useNativeShare && typeof navigator.share === "function") {
      trackEvent(clickEvent, { share_method: "native" });
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        trackEvent(successEvent, { share_method: "native" });
        return;
      } catch (error) {
        if (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError") return;
        setCopyMode(true);
      }
    } else {
      trackEvent(clickEvent, { share_method: "copy" });
    }

    const copied = await copyLink(shareUrl);
    if (copied) {
      setStatus("copied");
      trackEvent(successEvent, { share_method: "copy" });
    } else {
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
      <h2 id={headingId} className="text-xl font-semibold tracking-tight text-neutral-900">{heading}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
      <button type="button" onClick={handleShare} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:bg-neutral-200 sm:w-auto">
        {useNativeShare ? "Dela testet" : "Kopiera länk"}
      </button>
      <p className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-red-700" : "text-neutral-600"}`} role="status" aria-live="polite">
        {status === "copied" ? "Länken är kopierad" : status === "error" ? "Länken kunde inte kopieras" : ""}
      </p>
    </section>
  );
}
