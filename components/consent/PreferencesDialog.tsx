"use client";

import Link from "next/link";
import { useState } from "react";

import { consentCategoryDefinitions } from "@/lib/consent";
import { cn } from "@/lib/utils";

import { useConsent } from "./ConsentProvider";
import { Dialog } from "./Dialog";

/**
 * Preference centre.
 *
 * Every category explains itself in one sentence, necessary cookies are shown as
 * always active rather than hidden, and nothing is pre-selected in the visitor's
 * favour. Changes are only stored when "Save preferences" is used.
 *
 * The panel is mounted only while it is open, which means the draft always starts
 * from the stored decision — no effect, nothing to reset.
 */

function category(id: "necessary" | "analytics" | "marketing") {
  return (
    consentCategoryDefinitions.find((entry) => entry.id === id) ?? consentCategoryDefinitions[0]
  );
}

function Switch({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-t border-line-soft py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-label`} className="t-h4 text-ink">
          {label}
        </span>
        <span id={`${id}-description`} className="t-small max-w-[46ch]">
          {description}
        </span>
      </div>

      {disabled ? (
        <span className="pill shrink-0" aria-describedby={`${id}-description`}>
          Always active
        </span>
      ) : (
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-description`}
          onClick={() => onChange?.(!checked)}
          className={cn(
            "relative mt-1 flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200",
            checked ? "border-brand bg-brand" : "border-line bg-canvas-alt",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(10,16,32,0.35)] transition-transform duration-200",
              checked ? "translate-x-[1.55rem]" : "translate-x-[0.15rem]",
            )}
          />
        </button>
      )}
    </div>
  );
}

function PreferencesPanel({ onClose }: { onClose: () => void }) {
  const { categories, savePreferences, acceptAll, rejectOptional } = useConsent();
  const [draft, setDraft] = useState({
    analytics: categories.analytics,
    marketing: categories.marketing,
  });

  return (
    <Dialog
      open
      onClose={onClose}
      labelledBy="consent-preferences-title"
      describedBy="consent-preferences-intro"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 id="consent-preferences-title" className="t-h3 text-ink">
            Cookie preferences
          </h2>
          <p id="consent-preferences-intro" className="t-small max-w-[48ch]">
            Choose what this website may store. Necessary cookies keep it working and remember this
            decision; everything else is optional.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cookie preferences"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-brand/40 hover:text-brand-dark"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-7">
        <Switch
          id="consent-necessary"
          label={category("necessary").label}
          description={category("necessary").description}
          checked
          disabled
        />
        <Switch
          id="consent-analytics"
          label={category("analytics").label}
          description={category("analytics").description}
          checked={draft.analytics}
          onChange={(next) => setDraft((current) => ({ ...current, analytics: next }))}
        />
        <Switch
          id="consent-marketing"
          label={category("marketing").label}
          description={category("marketing").description}
          checked={draft.marketing}
          onChange={(next) => setDraft((current) => ({ ...current, marketing: next }))}
        />
      </div>

      <p className="t-small mt-5 text-faint">
        You can change this at any time from the footer of any page, or read more in the{" "}
        <Link href="/privacy#cookies" onClick={onClose} className="link-underline font-semibold">
          privacy policy
        </Link>
        .
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => savePreferences({ necessary: true, ...draft })}
          className="btn btn-primary w-full"
        >
          Save preferences
        </button>
        <button type="button" onClick={acceptAll} className="btn btn-secondary w-full">
          Accept all
        </button>
        <button type="button" onClick={rejectOptional} className="btn btn-secondary w-full">
          Reject optional
        </button>
      </div>
    </Dialog>
  );
}

export function PreferencesDialog() {
  const { preferencesOpen, closePreferences } = useConsent();

  /* Mounted only while open: the draft therefore always starts from the stored
     decision, and focus handling runs on a genuinely fresh subtree. */
  if (!preferencesOpen) return null;
  return <PreferencesPanel onClose={closePreferences} />;
}
