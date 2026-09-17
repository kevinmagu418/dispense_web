"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ElementType, type ReactNode } from "react";

import { motion as motionTokens } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds of delay before this element animates. */
  delay?: number;
  /** Vertical travel in pixels. */
  y?: number;
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: number;
  /** Start position — "top 85%" suits most editorial sections. */
  start?: string;
  id?: string;
};

/**
 * The single scroll-reveal primitive for the site.
 *
 * Content is pre-hidden only through [data-motion], which the boot script
 * activates (and only when motion is welcome). GSAP takes ownership of the
 * element in the same tick it removes that attribute, so a reveal never leaves
 * content hidden: if the animation layer fails to boot, the boot script's timer
 * reveals everything instead.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 22,
  stagger,
  start = "top 85%",
  id,
}: RevealProps) {
  const scope = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const staggered = typeof stagger === "number" && stagger > 0;
        const targets = staggered ? Array.from(element.children) : element;

        /* Hand the element over from the CSS pre-hide to GSAP. The from-state of
           the tween below is applied immediately, so nothing flashes. */
        element.removeAttribute("data-motion");

        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: motionTokens.reveal,
            ease: motionTokens.ease,
            delay,
            stagger: staggered ? stagger : 0,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: element,
              start,
              once: true,
            },
          },
        );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        element.removeAttribute("data-motion");
        const children = Array.from(element.children);
        gsap.set(children.length > 0 && stagger ? children : element, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <Tag ref={scope} id={id} data-motion="" className={className}>
      {children}
    </Tag>
  );
}
