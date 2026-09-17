/** Shared UI constants: motion timing and layout rhythm. */

export const motion = {
  /** Duration tokens (seconds) used by GSAP timelines. */
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  reveal: 0.75,
  /** Default ease for reveals — calm, no overshoot. */
  ease: "power3.out",
  easeSoft: "power2.out",
} as const;

export const layout = {
  /** Vertical offset used by the "money finds its purpose" sequence. */
  phoneWidth: 320,
  phoneAspect: 660 / 320,
} as const;

export const sectionIds = {
  hero: "hero",
  money: "money",
  features: "features",
  story: "product-story",
  screens: "screens",
  video: "demo",
  faq: "faq",
  cta: "download",
} as const;
