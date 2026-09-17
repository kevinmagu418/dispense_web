"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  configureAnalytics,
  consentUpdated,
  pageView,
  trackEvent,
  type AnalyticsEvent,
  type AnalyticsParams,
} from "@/lib/analytics";

import { useConsent } from "@/components/consent/ConsentProvider";

/**
 * Analytics runtime.
 *
 * Sits between the consent state and the analytics module:
 *   · configures the measurement id (build-time value)
 *   · forwards every consent change, so nothing loads before consent and sending
 *     stops the moment consent is withdrawn
 *   · emits page views on client-side route changes — and once more when consent
 *     is granted mid-session, so the current page is counted
 *   · delegates clicks on any element carrying `data-analytics`, which lets every
 *     section stay a server component
 */
export function AnalyticsProvider({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const { categories, analyticsGranted } = useConsent();

  useEffect(() => {
    configureAnalytics(measurementId);
  }, [measurementId]);

  useEffect(() => {
    consentUpdated(categories);
  }, [categories]);

  useEffect(() => {
    if (!analyticsGranted) return;
    pageView(pathname);
  }, [pathname, analyticsGranted]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-analytics]");
      if (!trigger) return;

      const name = trigger.dataset.analytics as AnalyticsEvent | undefined;
      if (!name) return;

      trackEvent(name, {
        label: trigger.dataset.analyticsLabel ?? trigger.textContent?.trim().slice(0, 60) ?? "",
        path: window.location.pathname,
      });
    };

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

/** Fires a single event when a route or section is viewed (consent-gated). */
export function TrackView({ event, params }: { event: AnalyticsEvent; params?: AnalyticsParams }) {
  useEffect(() => {
    trackEvent(event, params ?? {});
  }, [event, params]);

  return null;
}
