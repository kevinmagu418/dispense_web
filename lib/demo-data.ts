/**
 * Illustrative product data for the website's app mockups and diagrams.
 *
 * Every figure, total and date on the site is DERIVED from this single dataset —
 * nothing is typed into copy by hand. Replace these values with real product
 * data (or wire the marketing site to the app's API) and the visuals follow.
 *
 * The dataset is anchored to "today" so dates always read as current.
 */

import { addDays, nextOccurrenceOfDay, toIsoDate } from "./utils";

export type CategoryKey =
  | "rent"
  | "transport"
  | "groceries"
  | "savings"
  | "emergency"
  | "education";

export type SubWallet = {
  key: CategoryKey;
  name: string;
  /** Amount moved into this sub-wallet. */
  allocated: number;
  /** Amount already paid out of it this cycle. */
  paid: number;
  /** What this sub-wallet exists for — used as the story line. */
  purpose: string;
  /** Tailwind colour token for the category accent. */
  colorClass: string;
  /** Raw hex, for SVG fills. */
  color: string;
  /** The real recipient shown when money leaves this sub-wallet. */
  payee: { name: string; detail: string; logo: string };
  /** Day of month the scheduled payout runs, when a schedule exists. */
  payoutDayOfMonth?: number;
  payoutHour?: string;
  scheduleLabel?: string;
};

const subWallets: SubWallet[] = [
  {
    key: "rent",
    name: "Rent",
    allocated: 18_000,
    paid: 18_000,
    purpose: "Set aside the moment income lands, so rent is never a scramble.",
    colorClass: "text-cat-rent",
    color: "#1565ff",
    payee: { name: "KCB Bank", detail: "Rent account · •••• 2481", logo: "/payouts/kcb.png" },
    payoutDayOfMonth: 5,
    payoutHour: "8:00 AM",
    scheduleLabel: "5th of every month",
  },
  {
    key: "transport",
    name: "Transport",
    allocated: 6_500,
    paid: 4_120,
    purpose: "A daily limit that stays visible, so the week does not run dry.",
    colorClass: "text-cat-transport",
    color: "#16a34a",
    payee: { name: "M-Pesa", detail: "Jane W. · •••• 0934", logo: "/payouts/mpesa.svg" },
  },
  {
    key: "groceries",
    name: "Groceries",
    allocated: 9_200,
    paid: 5_480,
    purpose: "Household money that does not disappear into general spending.",
    colorClass: "text-cat-groceries",
    color: "#111827",
    payee: { name: "Equity Bank", detail: "Groceries account · •••• 7102", logo: "/payouts/equity-bank-kenya-logo.png" },
  },
  {
    key: "savings",
    name: "Savings",
    allocated: 8_480,
    paid: 0,
    purpose: "Quiet, automatic progress — no willpower required each month.",
    colorClass: "text-cat-savings",
    color: "#0e7490",
    payee: { name: "Dispense · Amina K.", detail: "Dispense account · •••• 4408", logo: "/icons/dispense-icon-512.png" },
  },
];

const futureWallets: SubWallet[] = [
  {
    key: "emergency",
    name: "Emergency",
    allocated: 0,
    paid: 0,
    purpose: "Cover for the months that do not go to plan.",
    colorClass: "text-cat-emergency",
    color: "#9333ea",
    payee: { name: "NCBA Bank", detail: "Emergency account · •••• 1840", logo: "/payouts/ncba-bank-logo.png" },
  },
  {
    key: "education",
    name: "Education",
    allocated: 0,
    paid: 0,
    purpose: "School fees and courses, saved in steady instalments.",
    colorClass: "text-cat-education",
    color: "#e11d48",
    payee: { name: "NCBA Bank", detail: "Education account · •••• 6691", logo: "/payouts/ncba-bank-logo.png" },
  },
];

const incomeReceived = 52_000;

const allocatedTotal = subWallets.reduce((sum, wallet) => sum + wallet.allocated, 0);
const unassignedBalance = incomeReceived - allocatedTotal;

/** Dates are computed from today so the mockups never look stale. */
const today = new Date();
const isoToday = toIsoDate(today);

export type ActivityEntry = {
  id: string;
  label: string;
  detail: string;
  amount: number;
  direction: "in" | "out";
  date: string;
  color: string;
};

const activitySeed: Array<Omit<ActivityEntry, "id" | "date"> & { daysAgo: number }> = [
  {
    label: "Rent payout",
    detail: "KCB Bank · Rent sub-wallet",
    amount: 18_000,
    direction: "out",
    daysAgo: 0,
    color: "#1565ff",
  },
  {
    label: "Sent to Amina K.",
    detail: "Dispense-to-Dispense · Savings sub-wallet",
    amount: 2_500,
    direction: "out",
    daysAgo: 2,
    color: "#1565ff",
  },
  {
    label: "Groceries top-up",
    detail: "Groceries sub-wallet",
    amount: 5_480,
    direction: "out",
    daysAgo: 1,
    color: "#111827",
  },
  {
    label: "Transport top-up",
    detail: "Transport sub-wallet",
    amount: 4_120,
    direction: "out",
    daysAgo: 3,
    color: "#16a34a",
  },
  {
    label: "Income received",
    detail: "Main wallet",
    amount: 52_000,
    direction: "in",
    daysAgo: 4,
    color: "#16a34a",
  },
  {
    label: "Savings allocation",
    detail: "Savings sub-wallet",
    amount: 8_480,
    direction: "out",
    daysAgo: 4,
    color: "#0e7490",
  },
];

export const demoProduct = {
  currencyLabel: "KSh",
  incomeReceived,
  allocatedTotal,
  unassignedBalance,
  subWallets,
  futureWallets,
  /** Share of income that has been given a purpose. */
  allocatedShare: Math.round((allocatedTotal / incomeReceived) * 100),
  /** Next scheduled rent payout, computed from the current date. */
  nextRentPayout: nextOccurrenceOfDay(5, today),
  schedulePreview: [5, 12, 28].map((day) => ({
    day,
    date: nextOccurrenceOfDay(day, today),
  })),
  activity: activitySeed.map((entry, index) => ({
    ...entry,
    id: `activity-${index + 1}`,
    date: toIsoDate(addDays(today, -entry.daysAgo)),
  })) satisfies ActivityEntry[],
  today: isoToday,
} as const;

export type DemoProduct = typeof demoProduct;
