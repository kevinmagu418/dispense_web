"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { demoProduct } from "@/lib/demo-data";
import { formatKes, hexToRgba, percentOf } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";
import { categoryIcons, LayersIcon } from "./app-ui/icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The signature transition: one undifferentiated balance becomes
 * purpose-driven sub-wallets as the reader scrolls.
 *
 * The animation is scroll-linked (scrubbed) rather than a one-shot reveal, so
 * the reader controls the pacing. Totals either side of the split are derived
 * from the same dataset, which is why they always reconcile.
 */
export function MoneyFlow() {
  const scope = useRef<HTMLDivElement | null>(null);
  const { incomeReceived, allocatedTotal, unassignedBalance, subWallets } = demoProduct;
  const assignedShare = percentOf(allocatedTotal, incomeReceived);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        if (!root) return;

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            end: "bottom 72%",
            scrub: 0.7,
          },
        });

        timeline
          .fromTo(
            root.querySelectorAll("[data-money-pool]"),
            { scale: 1, y: 0 },
            { scale: 0.975, y: 0, duration: 0.22 },
            0,
          )
          .fromTo(
            root.querySelectorAll("[data-money-link]"),
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.24, transformOrigin: "top center" },
            0.12,
          )
          .fromTo(
            root.querySelectorAll("[data-money-row]"),
            { y: 26, opacity: 0, scaleY: 0.55, transformOrigin: "top center" },
            { y: 0, opacity: 1, scaleY: 1, duration: 0.5, stagger: 0.11 },
            0.24,
          )
          .fromTo(
            root.querySelectorAll("[data-money-summary]"),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.8,
          );
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <section id="money" className="section">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="The problem"
              title="One balance has to answer too many questions at once."
              description="When everything sits in the same place, the number on your screen cannot tell you whether the rent is covered or whether this week is already spent. The information you need is not missing — it is just unlabelled."
            />

            <div className="flex flex-col gap-6 border-l-2 border-brand/30 pl-6">
              <p className="t-h4 text-ink">Dispense labels it before you spend it.</p>
              <p className="t-body">
                Income lands in your wallet and is immediately given structure: an amount for rent, a
                smaller line for transport, something set aside for savings. Same money — a decision
                you can see.
              </p>
            </div>
          </div>

          <div
            ref={scope}
            className="relative rounded-[24px] border border-line bg-surface p-5 shadow-[0_30px_80px_-60px_rgba(10,16,32,0.5)] sm:p-7"
          >
            <div
              data-money-pool
              data-motion=""
              className="rounded-[18px] p-5 text-white"
              style={{
                background: "linear-gradient(135deg, #1565ff 0%, #0e58ec 52%, #0052d4 100%)",
              }}
            >
              <span className="flex items-center gap-2 text-white/75">
                <LayersIcon width={15} height={15} />
                <span className="t-eyebrow">One balance</span>
              </span>
              <p className="mt-3 text-[2rem] font-bold leading-none tracking-[-0.035em] tabular-nums sm:text-[2.25rem]">
                {formatKes(incomeReceived)}
              </p>
              <p className="mt-2 text-[0.8125rem] text-white/75">
                Income received. Nothing labelled yet.
              </p>
            </div>

            <span
              data-money-link
              data-motion=""
              className="mx-auto mt-1 block h-7 w-px origin-top bg-brand/35"
              aria-hidden="true"
            />

            <ul className="mt-1 flex flex-col gap-2.5">
              {subWallets.map((wallet) => {
                const Icon = categoryIcons[wallet.icon];
                return (
                  <li
                    key={wallet.key}
                    data-money-row
                    data-motion=""
                    className="flex items-center gap-3.5 rounded-[14px] border border-line-soft bg-surface-2 px-4 py-3"
                  >
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-[11px]"
                      style={{ backgroundColor: hexToRgba(wallet.color, 0.12) }}
                    >
                      <Icon width={17} height={17} style={{ color: wallet.color }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold text-ink">
                        {wallet.name}
                      </span>
                      <span className="hidden text-[0.8125rem] leading-snug text-subtle sm:block">
                        {wallet.purpose}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[0.9375rem] font-bold tabular-nums text-ink">
                        {formatKes(wallet.allocated)}
                      </span>
                      <span className="block text-[0.6875rem] text-faint">
                        {percentOf(wallet.allocated, incomeReceived)}% of income
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <div
              data-money-summary
              data-motion=""
              className="mt-6 flex flex-col gap-2 rounded-[14px] bg-canvas px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="t-small">
                <strong className="font-semibold text-ink">{assignedShare}%</strong> of income now has
                a purpose
              </span>
              <span className="t-small tabular-nums">
                {formatKes(allocatedTotal)} assigned ·{" "}
                <strong className="font-semibold text-ink">
                  {formatKes(unassignedBalance)}
                </strong>{" "}
                still free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
