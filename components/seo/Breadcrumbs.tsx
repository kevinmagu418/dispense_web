import Link from "next/link";

import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail. Pair with breadcrumbSchema() for structured data. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("t-small", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="link-tap text-subtle transition-colors hover:text-brand-dark"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
