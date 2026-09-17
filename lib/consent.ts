/**
 * Cookie / storage consent — the single source of truth.
 *
 * Everything is centralised here so no component invents its own storage key,
 * its own categories or its own idea of what "accepted" means:
 *
 *   · versioned record (bumping CONSENT_VERSION invalidates older decisions)
 *   · a small state machine: unknown → accepted | rejected | customized
 *   · storage access wrapped so a blocked or unavailable localStorage degrades to
 *     an in-memory decision instead of breaking the site
 *   · a subscription surface for `useSyncExternalStore` and cross-tab sync
 *
 * No analytics or marketing script is loaded from here — this module only
 * records and broadcasts the visitor's decision.
 */

export const CONSENT_VERSION = "1.0";
export const CONSENT_STORAGE_KEY = "dispense.consent";

export type ConsentCategory = "necessary" | "analytics" | "marketing";
export type ConsentDecision = "accepted" | "rejected" | "customized";
export type ConsentState = "unknown" | ConsentDecision;

export type ConsentCategories = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  version: string;
  state: ConsentDecision;
  categories: ConsentCategories;
  decidedAt: string;
};

export type ConsentCategoryDefinition = {
  id: ConsentCategory;
  label: string;
  /** Shown in the preferences panel — plain language, no legalese. */
  description: string;
  /** Necessary cookies cannot be switched off. */
  required: boolean;
  /** What is stored, for the curious. */
  detail: string;
};

export const consentCategoryDefinitions: readonly ConsentCategoryDefinition[] = [
  {
    id: "necessary",
    label: "Necessary",
    description:
      "Keeps the website working and remembers the choice you make here. Without these, the site cannot function correctly.",
    detail: "Stores your cookie decision and basic preferences. Always active.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Helps us understand website usage — which pages are read, how long people stay, which calls to action and downloads are used.",
    detail:
      "Counts page views, clicks and video interactions. No names, emails, account or financial data.",
    required: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Would allow us to measure advertising campaigns and show relevant ads on other platforms. Not in use today.",
    detail: "No marketing or advertising cookies are set on this site.",
    required: false,
  },
];

/** Marketing stays off unless it is genuinely introduced later. */
export function defaultCategories(): ConsentCategories {
  return { necessary: true, analytics: false, marketing: false };
}

export function deniedCategories(): ConsentCategories {
  return { necessary: true, analytics: false, marketing: false };
}

export function isAnalyticsGranted(categories: ConsentCategories): boolean {
  return categories.analytics === true;
}

function isCategoryRecord(value: unknown): value is ConsentCategories {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.necessary === "boolean" && typeof record.analytics === "boolean";
}

export function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.version === CONSENT_VERSION &&
    typeof record.state === "string" &&
    ["accepted", "rejected", "customized"].includes(record.state as string) &&
    isCategoryRecord(record.categories) &&
    typeof record.decidedAt === "string"
  );
}

/* ------------------------------------------------------------------ storage */

/** In-memory fallback used when storage is unavailable (private mode, policy). */
let fallbackRecord: ConsentRecord | null = null;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = window.localStorage;
    /* Touch it: Safari in private mode exposes localStorage but throws on write. */
    const probe = "__dispense_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentRecord | null {
  const storage = getStorage();
  if (!storage) return fallbackRecord;

  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentRecord(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(
  categories: ConsentCategories,
  state: ConsentDecision,
): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    state,
    categories: { necessary: true, analytics: !!categories.analytics, marketing: !!categories.marketing },
    decidedAt: new Date().toISOString(),
  };

  fallbackRecord = record;

  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      /* Storage full or blocked: the in-memory record keeps this visit correct. */
    }
  }

  cachedSnapshot = record;
  emit();
  return record;
}

export function clearConsent(): void {
  fallbackRecord = null;
  cachedSnapshot = null;
  const storage = getStorage();
  try {
    storage?.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

/** Derives the state label from a set of toggles. */
export function resolveDecision(categories: ConsentCategories): ConsentDecision {
  if (categories.analytics && categories.marketing) return "accepted";
  if (!categories.analytics && !categories.marketing) return "rejected";
  return "customized";
}

/* --------------------------------------------------------------- observers */

let cachedSnapshot: ConsentRecord | null | undefined;
const listeners = new Set<() => void>();
let storageListenerBound = false;

function emit(): void {
  for (const listener of listeners) listener();
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
  cachedSnapshot = undefined;
  emit();
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);

  if (!storageListenerBound && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
    storageListenerBound = true;
  }

  return () => {
    listeners.delete(listener);
  };
}

/** Stable snapshot for `useSyncExternalStore` (undefined = not read yet). */
export function getConsentSnapshot(): ConsentRecord | null {
  if (cachedSnapshot === undefined) cachedSnapshot = readConsent();
  return cachedSnapshot;
}

export function getConsentServerSnapshot(): ConsentRecord | null {
  return null;
}

/** Invalidates the cache — used after external storage changes. */
export function refreshConsent(): ConsentRecord | null {
  cachedSnapshot = undefined;
  return getConsentSnapshot();
}
