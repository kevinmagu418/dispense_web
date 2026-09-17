"use client";

import { cn } from "@/lib/utils";

import { useConsent } from "./ConsentProvider";

/**
 * Reopens the preference centre from anywhere (footer, privacy page). Consent is
 * never a one-time decision: a link to change it stays available on every page.
 */
export function ConsentPreferencesButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={cn(
        "t-small link-tap cursor-pointer text-subtle transition-colors hover:text-brand-dark",
        className,
      )}
    >
      Cookie preferences
    </button>
  );
}
