"use client";

import Link from "next/link";
import { useState } from "react";

import { trackEvent } from "@/lib/analytics";
import type { FaqItem } from "@/lib/content/faq";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { ChevronDownIcon } from "./app-ui/icons";

/**
 * Accessible accordion.
 *
 * Uses a real button with aria-expanded/aria-controls, a labelled region for the
 * panel, and a grid-rows transition so the panel animates without measuring
 * heights in JavaScript. Keyboard and screen-reader behaviour is native.
 */
export function FAQAccordion({
  items,
  defaultOpenId,
  className,
}: {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <ul className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id}>
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => {
                  const next = isOpen ? null : item.id;
                  setOpenId(next);
                  if (next) trackEvent("faq_open", { question: item.question });
                }}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-brand-dark"
              >
                <span
                  className={cn(
                    "t-h4 transition-colors",
                    isOpen ? "text-brand-dark" : "text-ink",
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-300",
                    isOpen
                      ? "rotate-180 border-brand/45 text-brand"
                      : "border-line text-subtle",
                  )}
                >
                  <ChevronDownIcon width={15} height={15} />
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              className={cn(
                "faq-panel grid transition-[grid-template-rows] duration-400 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[68ch] pb-6 pr-10">
                  <p className="t-body">{item.answer}</p>
                  {item.links && item.links.length > 0 ? (
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {item.links.map((link) =>
                        link.href.startsWith("mailto:") ? (
                          <a
                            key={link.href}
                            href={`mailto:${siteConfig.supportEmail}`}
                            className="t-small link-tap link-underline font-semibold"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="t-small link-tap link-underline font-semibold"
                          >
                            {link.label}
                          </Link>
                        ),
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
