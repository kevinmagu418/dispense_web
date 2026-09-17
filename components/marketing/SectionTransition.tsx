import { cn } from "@/lib/utils";

/**
 * A calm horizontal break between major sections: hairline rule with an
 * optional numbered or labelled marker. Used instead of decorative shapes.
 */
export function SectionTransition({
  label,
  number,
  className,
}: {
  label?: string;
  number?: string;
  className?: string;
}) {
  if (!label && !number) {
    return (
      <div className={cn("container-x", className)}>
        <div className="hairline" />
      </div>
    );
  }

  return (
    <div className={cn("container-x", className)}>
      <div className="flex items-center gap-5">
        <div className="hairline flex-1" />
        <div className="flex items-center gap-3 whitespace-nowrap">
          {number ? (
            <span className="t-num text-[0.8125rem] font-bold text-brand">{number}</span>
          ) : null}
          {label ? (
            <span className="t-eyebrow text-faint">{label}</span>
          ) : null}
        </div>
        <div className="hairline flex-1" />
      </div>
    </div>
  );
}
