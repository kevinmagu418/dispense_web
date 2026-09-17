import Link from "next/link";

import { cn } from "@/lib/utils";

export type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost-dark";
  size?: "md" | "sm";
  /** Emitted through the analytics layer when the element is clicked. */
  event?: string;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
  tabIndex?: number;
};

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/**
 * The site's conversion element. Server-rendered: no client JavaScript is
 * needed for a link to work, and analytics attach through a data attribute
 * handled once by AnalyticsProvider.
 */
export function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  event,
  className,
  ariaLabel,
  external,
  tabIndex,
}: CTAButtonProps) {
  const classes = cn(
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost-dark" && "btn-ghost-dark",
    size === "sm" && "btn-sm",
    className,
  );

  const analyticsProps = event ? { "data-analytics": event } : {};
  const isExternal = external ?? isExternalHref(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        {...analyticsProps}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      {...analyticsProps}
    >
      {children}
    </Link>
  );
}
