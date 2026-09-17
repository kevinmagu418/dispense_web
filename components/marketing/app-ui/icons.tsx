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

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
      <path d="M9.5 20.5v-6h5v6" />
    </svg>
  );
}

export function BusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 16V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5V16" />
      <path d="M5 16h14v1.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16m-8 0v1.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1z" />
      <path d="M5 11h14M9 8h6" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h1.6l1.6 9.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.3L19.2 8H6.2" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="16.5" cy="19" r="1.2" />
    </svg>
  );
}

export function PiggyBankIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13.2c0-2.6 2.3-4.7 5.4-4.7h4.2c2.1 0 3.6 1 4.4 2.6l2 .5v3.3l-1.7.4a5.6 5.6 0 0 1-1.5 2v1.6h-2.4v-1.2h-3.9v1.2H8.1v-1.7A5.5 5.5 0 0 1 4 13.2" />
      <path d="M15.4 8.5V7.2a1.2 1.2 0 0 1 1.2-1.2h.9" />
      <circle cx="9.4" cy="12.6" r="0.9" fill="currentColor" stroke="none" />
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

export function BookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v15H6.5A1.5 1.5 0 0 1 5 17.5z" />
      <path d="M5 17.5A1.5 1.5 0 0 1 6.5 16H18v3H6.5A1.5 1.5 0 0 1 5 17.5zM8.5 8h6M8.5 11.5h4" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8.2A2.2 2.2 0 0 1 6.2 6h11.6A2.2 2.2 0 0 1 20 8.2v7.6A2.2 2.2 0 0 1 17.8 18H6.2A2.2 2.2 0 0 1 4 15.8z" />
      <path d="M16.5 12h1.2M4 9.8h16" />
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

export const categoryIcons = {
  home: HomeIcon,
  bus: BusIcon,
  cart: CartIcon,
  piggy: PiggyBankIcon,
  shield: ShieldIcon,
  book: BookIcon,
} as const;
