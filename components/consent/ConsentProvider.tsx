"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  deniedCategories,
  getConsentServerSnapshot,
  getConsentSnapshot,
  resolveDecision,
  subscribeConsent,
  writeConsent,
  type ConsentCategories,
  type ConsentRecord,
  type ConsentState,
} from "@/lib/consent";

/**
 * Consent context.
 *
 * Holds the decision, exposes the visitor actions and keeps the analytics layer
 * in sync. `useSyncExternalStore` is used so the server renders the "unknown"
 * state and the client takes over after hydration without a mismatch — and the
 * same hook tells us whether we are past hydration, which is what keeps the
 * banner from flashing for visitors who have already decided.
 */

type ConsentContextValue = {
  /** `unknown` until a decision has been stored. */
  state: ConsentState;
  record: ConsentRecord | null;
  categories: ConsentCategories;
  /** True once the client has taken over from the server render. */
  ready: boolean;
  analyticsGranted: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (categories: ConsentCategories) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** No-op subscription used to detect the client without an effect. */
const subscribeNoop = () => () => {};

export function ConsentProvider({ children }: { children: ReactNode }) {
  const record = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const categories = useMemo<ConsentCategories>(
    () => (record ? record.categories : deniedCategories()),
    [record],
  );

  const state: ConsentState = record ? record.state : "unknown";

  const acceptAll = useCallback(() => {
    writeConsent({ necessary: true, analytics: true, marketing: false }, "accepted");
    setPreferencesOpen(false);
  }, []);

  const rejectOptional = useCallback(() => {
    writeConsent(deniedCategories(), "rejected");
    setPreferencesOpen(false);
  }, []);

  const savePreferences = useCallback((next: ConsentCategories) => {
    const normalized: ConsentCategories = {
      necessary: true,
      analytics: !!next.analytics,
      marketing: !!next.marketing,
    };
    writeConsent(normalized, resolveDecision(normalized));
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      record,
      categories,
      ready,
      analyticsGranted: categories.analytics === true,
      preferencesOpen,
      acceptAll,
      rejectOptional,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      state,
      record,
      categories,
      ready,
      preferencesOpen,
      acceptAll,
      rejectOptional,
      savePreferences,
      openPreferences,
      closePreferences,
    ],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return context;
}
