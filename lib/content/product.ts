/**
 * Product-facing marketing copy that must stay consistent between the
 * homepage, the features page and the how-it-works page.
 *
 * Everything here describes capabilities the mobile app actually has.
 * Unreleased work is kept in `futureCapabilities` and is always labelled.
 */

export type Feature = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  /** Copy shown on the features page deep-dive. */
  points: string[];
  size: "large" | "medium" | "small";
  visual: "wallet" | "subwallets" | "organize" | "payouts" | "activity" | "transfers";
};

export const features: Feature[] = [
  {
    id: "wallet",
    title: "Personal wallet",
    summary: "Your central place to understand your available money.",
    detail:
      "One balance that tells you what you can actually spend today, with adding and withdrawing money kept simple and separate from everything you have already committed.",
    points: [
      "A single available balance, always up to date",
      "Add money and withdraw without digging through screens",
      "Clear separation between assigned and unassigned money",
    ],
    size: "large",
    visual: "wallet",
  },
  {
    id: "sub-wallets",
    title: "Sub-wallets",
    summary: "Dedicated spaces for the money that already has a job.",
    detail:
      "Rent, transport, groceries, savings, emergency and education each get their own space, so a balance stops being one number you have to remember the meaning of.",
    points: [
      "Create the categories you actually live with",
      "Allocate money into each one, then top up as you go",
      "See allocated, paid and remaining at a glance",
    ],
    size: "large",
    visual: "subwallets",
  },
  {
    id: "organised-spending",
    title: "Organised spending",
    summary: "Give your money a clear purpose before you spend it.",
    detail:
      "Because every amount sits inside a named category, spending decisions get faster and looser ends get caught early, long before the end of the month.",
    points: [
      "Every amount has a name and a purpose",
      "Spending is measured against what you set aside",
      "Leftovers are visible, so you can reallocate on purpose",
    ],
    size: "medium",
    visual: "organize",
  },
  {
    id: "payouts",
    title: "Payouts",
    summary: "Move money where it needs to go, on a schedule you set.",
    detail:
      "Configure how much should leave a sub-wallet, which provider it should go through, and the date and time it should run. Then let it happen without a reminder.",
    points: [
      "Set an amount per payout, per sub-wallet",
      "Choose the provider when you configure the payout",
      "Schedule a date and time, and track each payout's status",
    ],
    size: "medium",
    visual: "payouts",
  },
  {
    id: "activity",
    title: "Activity",
    summary: "Understand what is happening with your money.",
    detail:
      "A running history of what came in, what moved between your wallet and sub-wallets, and what went out through a payout. It is organised by the day it happened.",
    points: [
      "Every movement recorded with its category",
      "Day-by-day history of income, allocations and payouts",
      "Payout status visible from the moment it is scheduled",
    ],
    size: "medium",
    visual: "activity",
  },
  {
    id: "dispense-to-dispense",
    title: "Dispense to Dispense",
    summary: "Send directly to another person’s Dispense account.",
    detail:
      "Move money to another Dispense user by account details, with the recipient, amount and status visible in your activity history.",
    points: [
      "Pay another Dispense account directly",
      "See who is being paid before you confirm",
      "Keep transfers alongside every other wallet movement",
    ],
    size: "medium",
    visual: "transfers",
  },
];

export const futureCapabilities = [
  {
    title: "Shared sub-wallets",
    summary: "Plan a household goal with more than one person contributing to it.",
  },
  {
    title: "Spending insights",
    summary: "Patterns across categories, explained in plain language.",
  },
  {
    title: "Goal-based targets",
    summary: "Set a target amount and a date, and let a sub-wallet track the gap.",
  },
];

/** Identifiers resolved to a device screen by components/marketing/app-ui/screens.tsx. */
export type ScreenKind =
  | "home"
  | "wallet"
  | "subwallets"
  | "rent"
  | "transport"
  | "savings"
  | "payout"
  | "activity";

export type StoryStage = {
  id: string;
  step: string;
  title: string;
  description: string;
  screen: ScreenKind;
};

export const storyStages: StoryStage[] = [
  {
    id: "wallet",
    step: "01",
    title: "Your wallet",
    description:
      "Dispense opens on one clear number: what you can spend right now. Everything else is already accounted for underneath it.",
    screen: "wallet",
  },
  {
    id: "rent",
    step: "02",
    title: "Rent moves first",
    description:
      "The moment income lands, rent is allocated into its own sub-wallet with the payout already scheduled.",
    screen: "rent",
  },
  {
    id: "transport",
    step: "03",
    title: "Transport holds a daily line",
    description:
      "A weekly amount for getting around, visible at all times, so commuting never quietly eats the rest of the month.",
    screen: "transport",
  },
  {
    id: "savings",
    step: "04",
    title: "Savings build without effort",
    description:
      "Money you would otherwise spend by accident sits in a sub-wallet that is out of the way and growing.",
    screen: "savings",
  },
  {
    id: "payout",
    step: "05",
    title: "Payouts run on schedule",
    description:
      "Each sub-wallet can pay out through the provider you chose, on the date and time you set. Its status, and yours, stay visible from the start.",
    screen: "payout",
  },
  {
    id: "activity",
    step: "06",
    title: "Activity closes the loop",
    description:
      "Income, allocations and payouts recorded in order, so the month can be understood in a single scroll.",
    screen: "activity",
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
  detail: string;
  visual: ScreenKind;
};

export const howItWorksSteps: Step[] = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up with your email, confirm the code we send you and set a PIN.",
    detail:
      "Account setup is deliberately short: verify your email address with a one-time code, complete a profile, confirm the device you are using, then choose a PIN that unlocks the app.",
    visual: "wallet",
  },
  {
    number: "02",
    title: "Set up your money",
    description: "Add money to your wallet so there is something to organise.",
    detail:
      "Your personal wallet is the centre of Dispense. Money arrives there first, stays visible as a single balance, and only moves when you decide where it belongs.",
    visual: "wallet",
  },
  {
    number: "03",
    title: "Create the sub-wallets you need",
    description: "Name the purposes your money serves and allocate into each one.",
    detail:
      "Rent, transport, groceries, savings, emergency and education. Build the set that matches your life, allocate an amount to each, and adjust as the month changes.",
    visual: "subwallets",
  },
  {
    number: "04",
    title: "Manage spending and payouts",
    description: "Configure how much leaves each sub-wallet, through which provider, and when.",
    detail:
      "Set a payout amount, choose the provider it runs through and give it a date and time. Dispense keeps the schedule and shows the status as it goes.",
    visual: "payout",
  },
  {
    number: "05",
    title: "Track your activity",
    description: "See what came in, what you allocated and what went out.",
    detail:
      "A dated history of movements keeps the picture honest and makes the next month easier to plan than the last one.",
    visual: "activity",
  },
];

export const principles = [
  {
    title: "Purpose before spending",
    body: "Money is easier to manage when it is labelled before it leaves.",
  },
  {
    title: "Fewer screens, less guessing",
    body: "The answer to \u201ccan I afford this?\u201d should be one glance away.",
  },
  {
    title: "Automation you can inspect",
    body: "Scheduled payouts stay visible, editable and accountable.",
  },
];
