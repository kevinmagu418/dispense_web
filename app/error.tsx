"use client";

import { useEffect } from "react";

import { CTAButton } from "@/components/marketing/CTAButton";

/**
 * Route-level error boundary. Rendered entirely client-side by Next.js, so it
 * uses no server-only imports and offers a real recovery path (reset).
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Errors are surfaced in the console for diagnostics; no data is sent anywhere.
    console.error("[dispense] route error:", error.message);
  }, [error]);

  return (
    <section className="pt-32 pb-24 sm:pt-40 lg:pt-48 lg:pb-32">
      <div className="container-x">
        <div className="max-w-[40rem]">
          <span className="pill">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-faint" />
            Something went wrong
          </span>
          <h1 className="t-h1 mt-6">This section did not load properly.</h1>
          <p className="t-lead mt-5">
            The page hit an unexpected problem while rendering. Trying again usually resolves it — if it
            does not, the rest of the site is still available.
          </p>
          {error.digest ? (
            <p className="t-small mt-4 text-faint">Reference: {error.digest}</p>
          ) : null}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => reset()} className="btn btn-primary">
              Try again
            </button>
            <CTAButton href="/" variant="secondary">
              Back to the homepage
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
