/**
 * Provider-agnostic analytics.
 *
 * The rest of the site never talks to a vendor. Components call
 * `trackEvent()` / `pageView()` or add a `data-analytics` attribute; this module
 * decides whether anything is actually sent, based on:
 *
 *   1. CONSENT — nothing is sent while consent is unknown or rejected. When
 *      analytics consent is granted the provider initialises, and when it is
 *      withdrawn sending stops immediately.
 *   2. CONFIGURATION — if NEXT_PUBLIC_ANALYTICS_ID is empty, no vendor script is
 *      loaded at all. Events are still recorded in a bounded in-memory log so the
 *      instrumentation is testable and debuggable without a vendor.
 *
 * Privacy rules enforced here:
 *   · no personal data — no emails, names, phone numbers, account or financial
 *     values, form contents or tokens ever enter an event
 *   · only the minimum useful properties per event
 *   · click events are named after the click, never claimed as installations
 *   · time on page is measured only while the tab is visible, and reported as
 *     engagement, never as attention
 *
 * Connecting a different provider (Plausible, PostHog, …) means implementing one
 * `AnalyticsProvider` object and registering it — no component changes.
 */

import { isAnalyticsGranted, readConsent, type ConsentCategories } from "./consent";

export const ANALYTICS_EVENTS = [
  /* Lifecycle */
  "session_start",
  "page_view",
  "page_exit",
  "engagement_heartbeat",
  "analytics_consent_changed",
  /* Navigation and calls to action */
  "hero_download_click",
  "hero_how_it_works_click",
  "navbar_download_click",
  "footer_download_click",
  "final_cta_download_click",
  "waitlist_join_click",
  /* Download funnel */
  "download_page_view",
  "android_download_click",
  "ios_download_click",
  "qr_download_click",
  /* Content interaction */
  "feature_interaction",
  "faq_open",
  "blog_post_open",
  "video_loaded",
  "video_play",
  "video_pause",
  "video_complete",
  "video_25_percent",
  "video_50_percent",
  "video_75_percent",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Only flat, non-identifying values are allowed. */
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export type AnalyticsStatus = "uninitialized" | "enabled" | "disabled";

type DebugLogEntry = { event: AnalyticsEvent; params: AnalyticsParams; at: number };

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  __dispenseAnalyticsEvents?: DebugLogEntry[];
  __dispenseAnalyticsState?: {
    status: AnalyticsStatus;
    consent: boolean | null;
    measurementId: string;
    /** Consent transitions, not measurement events — see the note in consentUpdated. */
    consentHistory: Array<{ at: number; granted: boolean }>;
  };
};

const DEBUG_LOG_LIMIT = 50;
const ENGAGEMENT_INTERVAL_MS = 15_000;

let measurementId = "";
let consent: boolean | null = null;
let status: AnalyticsStatus = "uninitialized";
let scriptRequested = false;
let engagementTimer: number | null = null;
let visibleSince: number | null = null;
let sessionStarted = false;
let consentHistory: Array<{ at: number; granted: boolean }> = [];

function win(): AnalyticsWindow | null {
  return typeof window === "undefined" ? null : (window as AnalyticsWindow);
}

/* ------------------------------------------------------------ configuration */

/** Called once by the layout/analytics provider with the build-time id. */
export function configureAnalytics(id: string): void {
  measurementId = id.trim();
}

export function getAnalyticsStatus(): AnalyticsStatus {
  return status;
}

/** Test/debug surface. Contains no personal data by construction. */
function publishState(): void {
  const target = win();
  if (!target) return;
  target.__dispenseAnalyticsState = { status, consent, measurementId, consentHistory };
}

function logForDiagnostics(event: AnalyticsEvent, params: AnalyticsParams): void {
  const target = win();
  if (!target) return;
  const entry: DebugLogEntry = { event, params, at: Date.now() };
  target.__dispenseAnalyticsEvents = [...(target.__dispenseAnalyticsEvents ?? []), entry].slice(
    -DEBUG_LOG_LIMIT,
  );

  if (process.env.NODE_ENV !== "production" && measurementId === "") {
    console.debug("[dispense:analytics]", event, params);
  }
}

/* -------------------------------------------------------------- providers */

type AnalyticsProviderAdapter = {
  name: string;
  /** Injects the vendor script; must be idempotent. */
  load: (id: string) => void;
  send: (payload: { event: AnalyticsEvent; params: AnalyticsParams }) => void;
  pageView: (payload: { path: string; title: string }) => void;
  consent: (granted: boolean) => void;
};

/**
 * gtag-compatible provider (Google Analytics, and anything else that speaks the
 * same dataLayer protocol). Loaded with `async` after consent only.
 */
const gtagProvider: AnalyticsProviderAdapter = {
  name: "gtag",
  load(id) {
    const target = win();
    if (!target || scriptRequested) return;
    scriptRequested = true;

    target.dataLayer = target.dataLayer ?? [];
    target.gtag =
      target.gtag ??
      function gtag(...args: unknown[]) {
        (target.dataLayer as unknown[]).push(args);
      };

    const script = document.createElement("script");
    script.id = "dispense-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);

    target.gtag("js", new Date());
    target.gtag("config", id, {
      /* Page views are sent explicitly, after consent, so nothing is measured
         in the window between load and a decision. */
      send_page_view: false,
      anonymize_ip: true,
    });
  },
  send({ event, params }) {
    win()?.gtag?.("event", event, params);
  },
  pageView({ path, title }) {
    win()?.gtag?.("event", "page_view", { page_path: path, page_title: title });
  },
  consent(granted) {
    win()?.gtag?.("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  },
};

let provider: AnalyticsProviderAdapter | null = null;

function activeProvider(): AnalyticsProviderAdapter | null {
  if (!measurementId) return null;
  if (!provider) provider = gtagProvider;
  return provider;
}

/* --------------------------------------------------------------- lifecycle */

/**
 * Enables or disables measurement. Called whenever the consent decision for the
 * analytics category changes (including on first load).
 */
export function consentUpdated(categories: ConsentCategories): void {
  const granted = isAnalyticsGranted(categories);
  const changed = consent !== granted;
  consent = granted;

  if (changed) {
    /* Recorded as a consent transition rather than a measurement event: a visitor
       who has not consented must not appear in the event log at all. */
    consentHistory = [...consentHistory, { at: Date.now(), granted }].slice(-10);
  }

  publishState();

  if (granted) {
    if (status !== "enabled") {
      status = "enabled";
      activeProvider()?.load(measurementId);
      activeProvider()?.consent(true);
      startSession();
    }
  } else {
    if (status !== "disabled") {
      activeProvider()?.consent(false);
      status = "disabled";
      stopEngagementTracking();
    }
  }

  publishState();
}

function startSession(): void {
  if (sessionStarted) return;
  sessionStarted = true;
  const path = window.location.pathname;
  logForDiagnostics("session_start", { landing_path: path });
  activeProvider()?.send({ event: "session_start", params: { landing_path: path } });
  startEngagementTracking();
}

/**
 * True when an event may leave the browser.
 *
 * Consent is normally pushed in by the provider, but effects run child-first, so
 * a section that mounts before the provider has synced would otherwise drop its
 * first event. Reading the stored decision here (cached in lib/consent) keeps the
 * gate correct no matter which order components mount in — and it can only ever
 * enable tracking for a visitor who already said yes.
 */
export function isTrackingEnabled(): boolean {
  if (consent === null) {
    const record = readConsent();
    if (record) consent = isAnalyticsGranted(record.categories);
  }
  return consent === true;
}

/* ---------------------------------------------------------------- reporting */

export function pageView(path: string, title?: string): void {
  const safeTitle = title ?? (typeof document !== "undefined" ? document.title : "");
  if (!isTrackingEnabled()) {
    return;
  }
  logForDiagnostics("page_view", { path });
  activeProvider()?.pageView({ path, title: safeTitle });
}

export function trackEvent(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  if (!isTrackingEnabled()) {
    /* Deliberately silent: no vendor is contacted and nothing is buffered, so a
       visitor who has not consented cannot be measured retroactively. */
    return;
  }

  logForDiagnostics(event, params);
  activeProvider()?.send({ event, params });
}

/** No personal identifiers are ever set on the marketing site. */
export function identify(): void {
  /* Intentionally a no-op: this site has no accounts and must not build profiles. */
}

/* --------------------------------------------------------------- engagement */

/**
 * Engagement heartbeat.
 *
 * Accumulates visible time only — a background tab contributes nothing — and
 * reports at a calm interval rather than per second. The accumulated value is
 * reported as engagement seconds, never as proof of attention.
 */
export function startEngagementTracking(): void {
  if (typeof window === "undefined" || engagementTimer !== null) return;

  visibleSince = document.visibilityState === "visible" ? Date.now() : null;

  engagementTimer = window.setInterval(() => {
    if (document.visibilityState !== "visible" || visibleSince === null) return;
    const seconds = Math.round((Date.now() - visibleSince) / 1000);
    visibleSince = Date.now();
    if (seconds > 0) trackEvent("engagement_heartbeat", { seconds_visible: seconds });
  }, ENGAGEMENT_INTERVAL_MS);

  document.addEventListener("visibilitychange", handleVisibilityChange);
}

export function stopEngagementTracking(): void {
  if (typeof window === "undefined") return;
  if (engagementTimer !== null) {
    window.clearInterval(engagementTimer);
    engagementTimer = null;
  }
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  visibleSince = null;
}

function handleVisibilityChange(): void {
  if (document.visibilityState === "visible") {
    visibleSince = Date.now();
    return;
  }

  if (visibleSince !== null && isTrackingEnabled()) {
    const seconds = Math.round((Date.now() - visibleSince) / 1000);
    visibleSince = null;
    if (seconds > 0) {
      trackEvent("page_exit", { seconds_visible: seconds, path: window.location.pathname });
    }
  }
}
