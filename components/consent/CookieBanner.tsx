"use client";

import Link from "next/link";

import { useConsent } from "./ConsentProvider";

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
        className="surface-blur mx-auto flex w-full max-w-[70rem] flex-col gap-4 rounded-[18px] border border-line p-4 shadow-[0_30px_70px_-40px_rgba(10,16,32,0.55)] sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
      >
        <div className="flex flex-col gap-2">
          <h2 className="t-h4 text-ink">We use cookies</h2>
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

        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 lg:shrink-0">
          <button
            type="button"
            onClick={openPreferences}
            className="btn btn-secondary btn-sm col-span-2 w-full sm:order-1 sm:w-auto"
          >
            Manage preferences
          </button>
          <button
            type="button"
            onClick={rejectOptional}
            className="btn btn-secondary btn-sm w-full sm:order-2 sm:w-auto"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="btn btn-primary btn-sm w-full sm:order-3 sm:w-auto"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
