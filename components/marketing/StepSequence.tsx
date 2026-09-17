"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { howItWorksSteps } from "@/lib/content/product";

import { PhoneMockup } from "./PhoneMockup";
import { screenFor } from "./app-ui/screens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sequential narrative for the how-it-works route.
 *
 * Each step reveals as it enters the viewport — copy first, device second — so
 * the reader moves through the flow in the same order a new user would. Reduced
 * motion gets static, fully visible steps.
 */
export function StepSequence() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", scope.current);
        const timelines = steps.map((step) => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: step, start: "top 74%", once: true },
          });

          timeline
            .fromTo(
              step.querySelectorAll("[data-step-text] > *"),
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: "power3.out" },
            )
            .fromTo(
              step.querySelectorAll("[data-step-visual]"),
              { opacity: 0, y: 34, scale: 0.975 },
              { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
              0.12,
            )
            .fromTo(
              step.querySelectorAll("[data-step-ghost]"),
              { opacity: 0, x: -22 },
              { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
              0,
            );

          return timeline;
        });

        return () => timelines.forEach((timeline) => timeline.kill());
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="pb-10">
      {howItWorksSteps.map((step, index) => {
        const reversed = index % 2 === 1;
        return (
          <article
            key={step.number}
            data-step
            className="border-t border-line-soft py-16 lg:py-24"
          >
            <div className="container-x">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div
                  className={[
                    "relative flex flex-col gap-5",
                    reversed ? "lg:order-2" : "lg:order-1",
                  ].join(" ")}
                >
                  <span
                    data-step-ghost
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-2 -top-14 select-none text-[6rem] font-bold leading-none tracking-[-0.05em] text-ink/[0.045] sm:text-[8rem]"
                  >
                    {step.number}
                  </span>

                  <div data-step-text className="relative flex flex-col gap-4">
                    <span data-motion="" className="flex items-center gap-3">
                      <span className="t-num text-[0.8125rem] font-bold text-brand">
                        {step.number}
                      </span>
                      <span className="h-px w-8 bg-brand/40" aria-hidden="true" />
                      <span className="t-eyebrow text-faint">Step {index + 1} of {howItWorksSteps.length}</span>
                    </span>
                    <h2 data-motion="" className="t-h2 max-w-[18ch]">
                      {step.title}
                    </h2>
                    <p data-motion="" className="t-lead max-w-[40ch]">
                      {step.description}
                    </p>
                    <p data-motion="" className="t-body max-w-[48ch]">
                      {step.detail}
                    </p>
                  </div>
                </div>

                <div
                  data-step-visual
                  data-motion=""
                  className={[
                    "flex justify-center",
                    reversed ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end",
                  ].join(" ")}
                >
                  <PhoneMockup width={264}>
                    {screenFor(step.visual)}
                  </PhoneMockup>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
