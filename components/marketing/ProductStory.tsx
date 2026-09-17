"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

import { storyStages } from "@/lib/content/product";
import { cn } from "@/lib/utils";

import { PhoneMockup } from "./PhoneMockup";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { screenFor } from "./app-ui/screens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pinned product story.
 *
 * Desktop: the device is pinned while the six stages scroll past, and the copy
 * rail tracks the active stage. Mobile: the same story is redesigned as stacked
 * cards — each with its own small device — because a pinned viewport sequence on
 * a phone is a worse experience than a readable, scrollable narrative.
 */
export function ProductStory() {
  const scope = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const pin = pinRef.current;
        if (!pin) return;

        const trigger = ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: `+=${storyStages.length * 85}%`,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              storyStages.length - 1,
              Math.floor(self.progress * storyStages.length),
            );
            if (index !== activeRef.current) {
              activeRef.current = index;
              setActive(index);
            }
          },
        });

        return () => trigger.kill();
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <section id="product-story" ref={scope} className="relative bg-canvas-alt/60">
      <div className="container-x">
        <Reveal className="pt-20 lg:pt-28">
          <SectionHeading
            eyebrow="In motion"
            title="Watch your money find its purpose."
            description="Six moments, in the order they happen. Scroll through the sequence to see how a single balance becomes a plan you can act on."
          />
        </Reveal>
      </div>

      {/* Desktop: pinned sequence */}
      <div
        ref={pinRef}
        className="min-h-screen-safe hidden items-center py-16 lg:flex"
      >
        <div className="container-x w-full">
          <div className="grid grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] items-center gap-14">
            <div className="relative pl-8">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 h-full w-px bg-line"
              >
                <span
                  className="block w-px bg-brand transition-[height] duration-500 ease-out"
                  style={{ height: `${((active + 1) / storyStages.length) * 100}%` }}
                />
              </span>

              <ol className="flex flex-col gap-8">
                {storyStages.map((stage, index) => {
                  const isActive = index === active;
                  return (
                    <li
                      key={stage.id}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "transition-[opacity,transform] duration-500 ease-out",
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "translate-x-0 opacity-45",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "t-num text-[0.8125rem] font-bold",
                            isActive ? "text-brand" : "text-faint",
                          )}
                        >
                          {stage.step}
                        </span>
                        <h3 className={cn("t-h3", isActive ? "text-ink" : "text-subtle")}>
                          {stage.title}
                        </h3>
                      </span>
                      <p
                        className={cn(
                          "t-body mt-2 max-w-[38ch] transition-opacity duration-500",
                          isActive ? "text-subtle opacity-100" : "opacity-70",
                        )}
                      >
                        {stage.description}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="relative flex justify-center">
              <PhoneMockup width={322} glow>
                <div className="relative h-full w-full">
                  {storyStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="screen-stack"
                      data-active={index === active}
                      aria-hidden={index !== active}
                    >
                      {screenFor(stage.screen)}
                    </div>
                  ))}
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked narrative */}
      <div className="container-x flex flex-col gap-6 pb-20 pt-12 lg:hidden">
        {storyStages.map((stage) => (
          <Reveal
            key={stage.id}
            as="article"
            className="rounded-[20px] border border-line bg-surface p-6"
          >
            <span className="flex items-center gap-3">
              <span className="t-num text-[0.8125rem] font-bold text-brand">{stage.step}</span>
              <h3 className="t-h4 text-ink">{stage.title}</h3>
            </span>
            <p className="t-small mt-3">{stage.description}</p>
            <div className="mt-6 flex justify-center">
              <PhoneMockup width={214} decorative>
                {screenFor(stage.screen)}
              </PhoneMockup>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
