import type { SVGProps } from "react";

/**
 * Icon set for the in-mockup product UI and the marketing sections.
 * Hand-drawn on a 24px grid so weights stay consistent with Manrope's strokes.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8.2A2.2 2.2 0 0 1 6.2 6h11.6A2.2 2.2 0 0 1 20 8.2v7.6A2.2 2.2 0 0 1 17.8 18H6.2A2.2 2.2 0 0 1 4 15.8z" />
      <path d="M16.5 12h1.2M4 9.8h16" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5.5 6v5.4c0 3.6 2.6 6.9 6.5 8.1 3.9-1.2 6.5-4.5 6.5-8.1V6z" />
      <path d="M9.4 12.2l1.9 1.9 3.4-3.6" />
    </svg>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 15.5l4-5 3.2 3L16 7l4 5" />
      <path d="M4 19.5h16" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4 3.8 10.4a.6.6 0 0 0 0 1.1l6.2 2.4 2.4 6.2a.6.6 0 0 0 1.1 0z" />
      <path d="M20 4l-10 10" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function ArrowDownLeftIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M17 7 7.5 16.5M7.5 10v6.5H14" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M7 17 16.5 7.5M16.5 14V7.5H10" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M17 15.5V11a5 5 0 0 0-10 0v4.5L5.5 17h13z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M14 6.5 8.5 12 14 17.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M6.5 9.5 12 15l5.5-5.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.3l2.7 1.7" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5.5" width="16" height="14" rx="2.2" />
      <path d="M4 10h16M9 5.5V3.8M15 5.5V3.8" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.6" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 4.5 8 12 12l7.5-4z" />
      <path d="M4.5 12 12 16l7.5-4M4.5 16 12 20l7.5-4" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.5l1.6 4.4 4.4 1.6-4.4 1.6L12 16.5l-1.6-4.4L6 10.5l4.4-1.6z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function FingerprintIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.5c-2 0-3.8.8-5.1 2.1M19 9.5a7.4 7.4 0 0 0-3.4-4.1" />
      <path d="M4.8 10.6A7 7 0 0 1 12 6.6c1.9 0 3.7.8 5 2" />
      <path d="M8 18.8a9.6 9.6 0 0 1-1.4-5.2c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4c0 1.6-.3 3-.9 4.3" />
      <path d="M12 12.6v2.6a4.4 4.4 0 0 0 1 2.8" />
      <path d="M15.6 20a7.7 7.7 0 0 1 1.2-2.1" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2.2" />
      <path d="m5.5 8.2 6.5 4.4 6.5-4.4" />
    </svg>
  );
}

export function DeviceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6.5" y="3" width="11" height="18" rx="2.6" />
      <path d="M10.5 6.2h3M11 18.4h2" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12a7 7 0 0 1-12 4.9M5 12a7 7 0 0 1 12-4.9" />
      <path d="M19 6.5V12h-5.5M5 17.5V12h5.5" />
    </svg>
  );
}

export function ScissorsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="7.5" r="2.3" />
      <circle cx="7" cy="16.5" r="2.3" />
      <path d="M8.9 8.9 19 17M8.9 15.1 19 7" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="4.5" width="6" height="6" rx="1.6" />
      <rect x="13.5" y="4.5" width="6" height="6" rx="1.6" />
      <rect x="4.5" y="13.5" width="6" height="6" rx="1.6" />
      <rect x="13.5" y="13.5" width="6" height="6" rx="1.6" />
    </svg>
  );
}

export function CookieIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.4 13.1A7.5 7.5 0 0 1 10.9 4.6c.2-.8-.6-1.5-1.4-1.2A8.9 8.9 0 1 0 20.6 14.5c.3-.8-.4-1.6-1.2-1.4Z" />
      <circle cx="9" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="15.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="9" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Official Brand Logos for payout providers */
export function MpesaLogo({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="#00A859" />
      {/* Safaricom / M-PESA signature double chevron arrow in white */}
      <path
        d="M25.5 12L35 24L25.5 36H19.5L29 24L19.5 12H25.5Z"
        fill="#FFFFFF"
      />
      <path
        d="M18.5 12L28 24L18.5 36H12.5L22 24L12.5 12H18.5Z"
        fill="#E1251B"
      />
    </svg>
  );
}

export function KcbLogo({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="#008037" />
      {/* KCB distinctive white lion head silhouette & shield motif */}
      <path
        d="M24 10C16.27 10 10 16.27 10 24C10 31.73 16.27 38 24 38C31.73 38 38 31.73 38 24C38 16.27 31.73 10 24 10Z"
        fill="#00682B"
      />
      <path
        d="M24 13C21.2 13 18.8 14.8 17.5 17.5C18.8 18.2 20.8 18.5 22.5 18C23.2 16.8 24 15.8 25.5 15.2C27 14.6 28.5 15 29.5 16C30.8 17.3 30.5 19.5 29.5 21C31 20.8 32.5 21.2 33.5 22.5C32.8 24.8 31 26 29 26.5C28 28.5 26.5 30.5 24.5 31.5C22.5 32.5 19.5 32.5 17 31.5C18.5 30.2 20 28.5 20.5 26.5C19 26 17.5 24.8 16.8 23.2C16 21.5 16.2 19.5 17.2 18C15 20.2 13.8 23.2 13.8 26.5C13.8 32.2 18.4 36.8 24.1 36.8C29.8 36.8 34.4 32.2 34.4 26.5C34.4 19.1 29.8 13 24 13Z"
        fill="#B5D334"
      />
      <circle cx="21" cy="22" r="1.5" fill="#008037" />
    </svg>
  );
}

export function EquityLogo({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="#A32A29" />
      {/* Equity Bank iconic solid brown roof / pediment emblem */}
      <path
        d="M24 13L12 23H17V33H31V23H36L24 13Z"
        fill="#FFFFFF"
      />
      <rect x="21" y="25" width="6" height="8" rx="1" fill="#A32A29" />
    </svg>
  );
}

export function BankBuildingIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="#1E293B" />
      {/* Universal Bank Classical Pediment & Pillars in Crisp White */}
      <path d="M24 13L13 19H35L24 13Z" fill="#FFFFFF" />
      <rect x="15" y="21" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      <rect x="21" y="21" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      <rect x="27" y="21" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      <rect x="30" y="21" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      <rect x="12" y="31" width="24" height="3" rx="0.8" fill="#FFFFFF" />
    </svg>
  );
}
