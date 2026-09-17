import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level — keeps the document outline semantic per page. */
  as?: "h2" | "h3";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          <span aria-hidden="true" className="h-px w-6 bg-brand/45" />
          <span className="t-eyebrow text-brand">{eyebrow}</span>
        </span>
      ) : null}
      <Tag id={id} className="t-h2 max-w-[22ch] text-balance">
        {title}
      </Tag>
      {description ? (
        <p className={cn("t-lead max-w-[52ch]", align === "center" && "mx-auto")}>{description}</p>
      ) : null}
    </div>
  );
}
