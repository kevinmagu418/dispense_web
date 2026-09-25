"use client";

import Link from "next/link";

import { useConsent } from "./ConsentProvider";
import { CookieIcon } from "@/components/marketing/app-ui/icons";

/**
 * Consent banner.
 *
 * Non-blocking (no focus trap — the page stays usable), keyboard reachable, and
 * honest about the choice: "Reject optional" is the same size and weight as
 * "Accept all", with no pre-ticked boxes or dark patterns.
 *
 * Layout is composed rather than shrunk: on phones the two decisions sit side by
 * side and the preferences link spans the row, which keeps the banner roughly a
 * third shorter than stacking three full-width buttons — it matters at 320×568.
 * It also steps aside while the mobile navigation is open (see globals.css), so it
 * can never sit on top of the menu.
 */
export function CookieBanner() {
  const { ready, state, acceptAll, rejectOptional, openPreferences } = useConsent();

  if (!ready || state !== "unknown") return null;

  return (
    <div className="consent-banner fixed inset-x-0 bottom-0 z-[60] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
      <div
        role="region"
        aria-label="Cookie consent"
        className="surface-blur mx-auto flex w-full max-w-[58rem] flex-col gap-4 rounded-[20px] border border-line p-4 shadow-[0_24px_65px_-38px_rgba(10,16,32,0.52)] sm:p-5 lg:flex-row lg:items-center lg:gap-7"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-brand-tint text-brand">
            <CookieIcon width={18} height={18} />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-[0.9375rem] font-bold tracking-[-0.01em] text-ink">Your privacy, your choice</h2>
          <p className="t-small max-w-[64ch]">
            Essential cookies keep the website working and remember your choice here. Optional
            analytics cookies help us understand how visitors use Dispense — which pages are read,
            which downloads are used. Nothing optional loads until you say so.
          </p>
          <Link
            href="/privacy#cookies"
            className="t-small link-tap link-underline w-fit font-semibold"
          >
            Read about cookies in our privacy policy
          </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center sm:gap-2.5">
          <button
            type="button"
            onClick={openPreferences}
            className="btn btn-secondary btn-sm col-span-2 w-full px-3 text-[0.8125rem] sm:order-1 sm:w-auto"
          >
            Manage preferences
          </button>
          <button
            type="button"
            onClick={rejectOptional}
            className="btn btn-secondary btn-sm w-full px-3 text-[0.8125rem] sm:order-2 sm:w-auto"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="btn btn-primary btn-sm w-full px-3 text-[0.8125rem] sm:order-3 sm:w-auto"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
