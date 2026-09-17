"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { LogoMark } from "./LogoMark";

/**
 * QR destination panel.
 *
 * The QR image itself cannot be drawn until the production origin is fixed
 * (NEXT_PUBLIC_SITE_URL), because the code must encode that exact URL — a
 * pattern that scans to nothing would be worse than none. Until then this shows
 * a deliberately composed placeholder plus a "copy the link" action, which is
 * genuinely useful and fires `qr_download_click`.
 *
 * Clipboard access is feature-detected: where it is unavailable the action is
 * simply not offered.
 *
 * The badge is passed in from a server component so the real brand lockup can be
 * rendered here without pulling server-only asset detection into the client
 * bundle.
 */
/**
 * Client detection that is hydration-safe: the server renders the button's
 * absence and the client fills it in after hydration, without React reporting an
 * HTML mismatch (which is what a bare `typeof navigator` check causes).
 */
const subscribeNoop = () => () => {};

export function QrPlaceholder({
  url,
  badge,
  className,
}: {
  url: string;
  badge?: ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const canCopy = isClient && typeof navigator !== "undefined" && !!navigator.clipboard;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* Clipboard blocked (permissions or insecure context): leave the link visible. */
      setCopied(false);
    }
  };

  return (
    <figure
      className={cn("flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6", className)}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[13rem]">
        <div className="absolute inset-0 rounded-[14px] border border-line bg-canvas-alt/60" />
        {/* Corner brackets — a recognisable scan frame without faking a code */}
        <span aria-hidden="true" className="absolute left-3 top-3 size-6 rounded-tl-[8px] border-l-2 border-t-2 border-brand/45" />
        <span aria-hidden="true" className="absolute right-3 top-3 size-6 rounded-tr-[8px] border-r-2 border-t-2 border-brand/45" />
        <span aria-hidden="true" className="absolute bottom-3 left-3 size-6 rounded-bl-[8px] border-b-2 border-l-2 border-brand/45" />
        <span aria-hidden="true" className="absolute bottom-3 right-3 size-6 rounded-br-[8px] border-b-2 border-r-2 border-brand/45" />
        <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] bg-surface shadow-[0_10px_30px_-16px_rgba(10,16,32,0.4)]">
          {badge ?? <LogoMark size={30} />}
        </span>
      </div>

      <figcaption className="flex flex-col gap-3">
        <span className="text-[0.9375rem] font-semibold text-ink">Point your camera here</span>
        <span className="t-small">
          The QR code is generated from the site&rsquo;s own address once the production domain is
          configured. It will open <span className="font-medium text-subtle">{url}</span> — this
          download page.
        </span>

        {canCopy ? (
          <button
            type="button"
            onClick={copy}
            data-analytics="qr_download_click"
            data-analytics-label="copy download link"
            className="btn btn-secondary btn-sm mt-1 w-fit"
          >
            {copied ? "Link copied" : "Copy this link"}
          </button>
        ) : null}
      </figcaption>
    </figure>
  );
}
