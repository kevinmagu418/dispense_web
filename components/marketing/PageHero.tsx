import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";

/** Shared hero for the secondary routes. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-44 lg:pb-24", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] glow-brand" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] grid-atmosphere opacity-[0.5]"
        style={{
          maskImage: "radial-gradient(70% 70% at 50% 0%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 0%, #000 0%, transparent 78%)",
        }}
      />
      <div className="container-x relative">
        <div className={cn("grid gap-12", aside ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center" : undefined)}>
          <div className="max-w-[46rem]">
            <Reveal className="flex flex-col gap-5">
              <span className="pill pill-brand w-fit">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                {eyebrow}
              </span>
              <h1 className="t-h1 max-w-[20ch]">{title}</h1>
              <p className="t-lead max-w-[54ch]">{description}</p>
              {children ? <div className="mt-2 flex flex-wrap items-center gap-3">{children}</div> : null}
            </Reveal>
          </div>
          {aside ? <div className="hidden lg:block">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
