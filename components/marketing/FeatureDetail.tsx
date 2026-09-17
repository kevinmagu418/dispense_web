import type { ReactNode } from "react";

import type { Feature } from "@/lib/content/product";
import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";
import { CheckCircleIcon } from "./app-ui/icons";

/**
 * Long-form treatment of a single capability: number, headline, explanation and
 * a product visual. Alternates sides so a long page keeps a rhythm.
 */
export function FeatureDetail({
  feature,
  index,
  visual,
}: {
  feature: Feature;
  index: number;
  visual: ReactNode;
}) {
  const reversed = index % 2 === 1;

  return (
    <section id={feature.id} className="scroll-mt-28 border-t border-line-soft py-16 lg:py-24">
      <div className="container-x">
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
            reversed && "lg:[&>*:first-child]:order-2",
          )}
        >
          <Reveal className="flex flex-col gap-6">
            <span className="flex items-center gap-3">
              <span className="t-num text-[0.8125rem] font-bold text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-brand/40" aria-hidden="true" />
              <span className="t-eyebrow text-faint">{feature.title}</span>
            </span>

            <h2 className="t-h2 max-w-[20ch]">{feature.summary}</h2>
            <p className="t-body max-w-[52ch]">{feature.detail}</p>

            <ul className="mt-2 flex flex-col gap-3">
              {feature.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircleIcon
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 text-brand"
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-subtle">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.06}
            y={28}
            className={cn(
              "flex justify-center rounded-[24px] border border-line-soft bg-canvas-alt/50 p-4 sm:p-6 lg:p-8",
              reversed && "lg:justify-start",
              !reversed && "lg:justify-center",
            )}
          >
            {visual}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
