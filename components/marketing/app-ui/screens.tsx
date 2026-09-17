import type { ReactNode } from "react";

import { demoProduct, type ActivityEntry, type SubWallet } from "@/lib/demo-data";
import { formatKes, hexToRgba, percentOf, relativeDayLabel } from "@/lib/utils";
import {
  ActivityIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  categoryIcons,
  ChevronLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  PlusIcon,
  SendIcon,
  WalletIcon,
} from "./icons";

/**
 * The product UI shown inside every phone mockup on this site.
 *
 * These screens are rendered as real DOM (not images) so they stay crisp at any
 * size and can be animated. They are the site's canonical visual of the
 * Dispense app and are replaced by real screenshots wherever those are supplied
 * — see components/marketing/AppScreenshot.tsx.
 *
 * Layout is authored at a fixed 300 × 640 design size and scaled by the phone
 * frame, so proportions never drift between breakpoints.
 */

export const SCREEN_WIDTH = 300;
export const SCREEN_HEIGHT = 640;

const phoneGradient = "linear-gradient(135deg, #1565ff 0%, #0e58ec 52%, #0052d4 100%)";

function StatusBar() {
  return (
    <div className="flex h-[26px] shrink-0 items-center justify-between px-[16px] pt-[6px] text-[10.5px] font-semibold text-ink">
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-[4px] opacity-80">
        <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true">
          <rect x="0" y="5.5" width="2.4" height="3.5" rx="0.7" fill="currentColor" />
          <rect x="3.6" y="4" width="2.4" height="5" rx="0.7" fill="currentColor" />
          <rect x="7.2" y="2.2" width="2.4" height="6.8" rx="0.7" fill="currentColor" />
          <rect x="10.8" y="0.4" width="2.4" height="8.6" rx="0.7" fill="currentColor" opacity="0.45" />
        </svg>
        <svg width="12" height="9" viewBox="0 0 12 9" aria-hidden="true">
          <path
            d="M1 3.1a7.4 7.4 0 0 1 10 0M3 5.3a4.6 4.6 0 0 1 6 0M5.95 7.4l.05.05"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <svg width="16" height="9" viewBox="0 0 16 9" aria-hidden="true">
          <rect
            x="0.5"
            y="0.5"
            width="13"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeOpacity="0.5"
            fill="none"
          />
          <rect x="2" y="2" width="9.5" height="5" rx="1" fill="currentColor" />
          <path d="M14.8 3.2v2.6" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  );
}

function ScreenFrame({
  children,
  tint = false,
  name,
}: {
  children: ReactNode;
  tint?: boolean;
  /** Identifies the screen for auditing and asset mapping. */
  name: string;
}) {
  return (
    <div
      data-screen={name}
      className="flex flex-col overflow-hidden text-ink"
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: tint ? "#f6f7fb" : "#ffffff",
      }}
    >
      <StatusBar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function CategoryChip({ wallet, size = 26 }: { wallet: SubWallet; size?: number }) {
  const Icon = categoryIcons[wallet.icon];
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[9px]"
      style={{ width: size, height: size, backgroundColor: hexToRgba(wallet.color, 0.12) }}
    >
      <Icon width={15} height={15} style={{ color: wallet.color }} />
    </span>
  );
}

function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[11.5px] font-bold tracking-[-0.01em] text-ink">{children}</p>
      {action ? <p className="text-[10px] font-medium text-faint">{action}</p> : null}
    </div>
  );
}

function MiniButton({ children, variant = "light" }: { children: ReactNode; variant?: "light" | "ghost" }) {
  return (
    <span
      className={
        variant === "light"
          ? "flex flex-1 items-center justify-center gap-[5px] rounded-[10px] bg-white py-[7px] text-[10.5px] font-bold text-brand-dark"
          : "flex flex-1 items-center justify-center gap-[5px] rounded-[10px] border border-white/35 bg-white/10 py-[7px] text-[10.5px] font-bold text-white"
      }
    >
      {children}
    </span>
  );
}

function AmountRow({
  entry,
  wallet,
  part,
}: {
  entry: ActivityEntry;
  wallet?: SubWallet;
  /** Optional hook used by the hero to animate individual rows. */
  part?: string;
}) {
  const positive = entry.direction === "in";
  return (
    <div
      data-screen-part={part}
      className="flex items-center gap-[10px] rounded-[12px] bg-white px-[10px] py-[7px]"
    >
      <span
        className="flex size-[26px] shrink-0 items-center justify-center rounded-[9px]"
        style={{ backgroundColor: hexToRgba(entry.color, 0.12) }}
      >
        {positive ? (
          <ArrowDownLeftIcon width={14} height={14} style={{ color: entry.color }} />
        ) : (
          <ArrowUpRightIcon width={14} height={14} style={{ color: entry.color }} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold text-ink">{entry.label}</span>
        <span className="block text-[9.5px] text-faint">
          {wallet?.name ?? entry.detail}
        </span>
      </span>
      <span
        className="shrink-0 text-[11px] font-bold tabular-nums"
        style={{ color: positive ? "#16a34a" : "#141c2e" }}
      >
        {positive ? "+" : "−"}
        {formatKes(Math.abs(entry.amount)).replace("KSh ", "")}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Wallet                                                                     */
/* -------------------------------------------------------------------------- */

export function WalletScreen() {
  const { unassignedBalance, allocatedTotal, subWallets, activity, incomeReceived } = demoProduct;
  const allocated = percentOf(allocatedTotal, incomeReceived);

  return (
    <ScreenFrame tint name="wallet">
      <div className="flex items-center justify-between px-[16px] pt-[8px]">
        <div>
          <p className="text-[10px] font-medium text-subtle">Good morning</p>
          <p className="text-[15px] font-bold tracking-[-0.025em] text-ink">Your wallet</p>
        </div>
        <span className="flex size-[30px] items-center justify-center rounded-full border border-line bg-white">
          <BellIcon width={15} height={15} className="text-subtle" />
        </span>
      </div>

      <div className="px-[16px] pt-[9px]">
        <div
          data-screen-part="card"
          className="rounded-[18px] p-[14px] text-white"
          style={{ background: phoneGradient }}
        >
          <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/70">
            Available to spend
          </p>
          <span className="mt-[3px] block overflow-hidden pb-[2px]">
            <span
              data-screen-part="balance"
              className="block text-[27px] font-bold leading-none tracking-[-0.035em] tabular-nums"
            >
              {formatKes(unassignedBalance)}
            </span>
          </span>
          <p className="mt-[6px] text-[10px] font-medium text-white/80">
            {formatKes(allocatedTotal)} allocated · {allocated}% of income
          </p>
          <div className="mt-[10px] flex gap-[7px]">
            <MiniButton>
              <PlusIcon width={12} height={12} />
              Add money
            </MiniButton>
            <MiniButton variant="ghost">
              <SendIcon width={12} height={12} />
              Withdraw
            </MiniButton>
          </div>
        </div>
      </div>

      <div className="px-[16px] pt-[11px]">
        <SectionLabel action={`${subWallets.length} active`}>Sub-wallets</SectionLabel>
      </div>

      <div className="flex flex-col gap-[5px] px-[16px] pt-[6px]">
        {subWallets.map((wallet) => (
          <div
            key={wallet.key}
            data-screen-part="subwallet"
            className="flex items-center gap-[10px] rounded-[12px] bg-white px-[10px] py-[7px]"
          >
            <CategoryChip wallet={wallet} />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold text-ink">{wallet.name}</span>
              <span className="block text-[9.5px] text-faint">Allocated</span>
            </span>
            <span className="text-[11px] font-bold tabular-nums text-ink">
              {formatKes(wallet.allocated)}
            </span>
          </div>
        ))}
      </div>

      <div className="px-[16px] pt-[11px]">
        <SectionLabel action="Today">Recent activity</SectionLabel>
      </div>

      <div className="flex flex-col gap-[5px] px-[16px] pt-[6px]">
        {activity.slice(0, 2).map((entry) => (
          <AmountRow key={entry.id} entry={entry} part="activity" />
        ))}
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-wallet                                                                 */
/* -------------------------------------------------------------------------- */

export function SubWalletScreen({
  wallet,
  showSchedule = true,
  ctaLabel = "Top up",
}: {
  wallet: SubWallet;
  showSchedule?: boolean;
  ctaLabel?: string;
}) {
  const remaining = wallet.allocated - wallet.paid;
  const paidPercent = percentOf(wallet.paid, wallet.allocated);
  const activity = demoProduct.activity
    .filter((entry) => entry.detail.toLowerCase().includes(wallet.name.toLowerCase()))
    .slice(0, 3);

  return (
    <ScreenFrame tint name={`sub-wallet-${wallet.key}`}>
      <div className="flex items-center gap-[8px] px-[16px] pt-[8px]">
        <span className="flex size-[26px] items-center justify-center rounded-full bg-white">
          <ChevronLeftIcon width={14} height={14} className="text-subtle" />
        </span>
        <p className="text-[13px] font-bold tracking-[-0.02em] text-ink">{wallet.name}</p>
      </div>

      <div className="px-[16px] pt-[11px]">
        <div className="rounded-[18px] border border-line bg-white p-[13px]">
          <div className="flex items-center gap-[10px]">
            <CategoryChip wallet={wallet} size={32} />
            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-faint">
                Allocated
              </p>
              <p className="text-[20px] font-bold leading-tight tracking-[-0.03em] tabular-nums text-ink">
                {formatKes(wallet.allocated)}
              </p>
            </div>
          </div>

          <div className="mt-[10px] flex items-center justify-between text-[9.5px] font-semibold">
            <span className="text-subtle">
              Paid <span className="tabular-nums text-ink">{formatKes(wallet.paid)}</span>
            </span>
            <span className="text-subtle">
              Remaining <span className="tabular-nums text-ink">{formatKes(remaining)}</span>
            </span>
          </div>
          <div className="mt-[5px] h-[6px] w-full overflow-hidden rounded-full bg-canvas-alt">
            <span
              className="block h-full rounded-full"
              style={{ width: `${paidPercent}%`, backgroundColor: wallet.color }}
            />
          </div>
          <div className="mt-[10px] flex gap-[7px]">
            <MiniButton>
              <PlusIcon width={12} height={12} />
              {ctaLabel}
            </MiniButton>
          </div>
        </div>
      </div>

      {showSchedule ? (
        <div className="px-[16px] pt-[11px]">
          <div className="rounded-[14px] border border-line bg-white p-[10px]">
            <p className="text-[10.5px] font-bold text-ink">Payout schedule</p>
            <div className="mt-[7px] flex flex-col gap-[6px] text-[10px]">
              <span className="flex items-center gap-[8px] text-subtle">
                <CalendarIcon width={13} height={13} className="text-brand" />
                {wallet.scheduleLabel ?? "Not scheduled yet"}
              </span>
              <span className="flex items-center gap-[8px] text-subtle">
                <ClockIcon width={13} height={13} className="text-brand" />
                {wallet.payoutHour ?? "Choose a time"}
              </span>
              <span className="flex items-center gap-[8px] text-subtle">
                <CheckCircleIcon width={13} height={13} className="text-cat-income" />
                Provider selected when the payout is configured
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-[16px] pt-[11px]">
        <SectionLabel action="All">Activity</SectionLabel>
      </div>
      <div className="flex flex-col gap-[5px] px-[16px] pt-[6px]">
        {(activity.length > 0 ? activity : demoProduct.activity.slice(0, 2)).map((entry) => (
          <AmountRow key={entry.id} entry={entry} wallet={wallet} />
        ))}
      </div>

      <div className="mt-auto px-[16px] pb-[10px]">
        <p className="text-[9.5px] leading-relaxed text-faint">{wallet.purpose}</p>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* Payout                                                                     */
/* -------------------------------------------------------------------------- */

export function PayoutScreen() {
  const rent = demoProduct.subWallets[0];
  const { nextRentPayout } = demoProduct;
  const dueLabel = new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(nextRentPayout);

  return (
    <ScreenFrame tint name="payout">
      <div className="flex items-center justify-between px-[16px] pt-[8px]">
        <span className="flex size-[26px] items-center justify-center rounded-full bg-white">
          <ChevronLeftIcon width={14} height={14} className="text-subtle" />
        </span>
        <p className="text-[12.5px] font-bold tracking-[-0.02em] text-ink">Payout</p>
        <span className="size-[26px]" />
      </div>

      <div className="px-[16px] pt-[12px] text-center">
        <CategoryChip wallet={rent} size={38} />
        <p className="mt-[8px] text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
          From {rent.name}
        </p>
        <p className="mt-[4px] text-[30px] font-bold leading-none tracking-[-0.035em] tabular-nums text-ink">
          {formatKes(rent.allocated)}
        </p>
        <span className="mt-[8px] inline-flex items-center gap-[5px] rounded-full bg-[#e7f7ee] px-[9px] py-[4px] text-[9.5px] font-bold text-[#15803d]">
          <ClockIcon width={11} height={11} />
          Scheduled
        </span>
      </div>

      <div className="px-[16px] pt-[11px]">
        <div className="overflow-hidden rounded-[14px] border border-line bg-white">
          {[
            { label: "Runs on", value: `${dueLabel} · ${rent.payoutHour ?? "8:00 AM"}` },
            { label: "Repeats", value: rent.scheduleLabel ?? "Once" },
            { label: "Provider", value: "Your saved payout method" },
            { label: "Leaves wallet", value: formatKes(rent.allocated) },
          ].map((row, index) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-[11px] py-[8px] text-[10px] ${
                index > 0 ? "border-t border-line-soft" : ""
              }`}
            >
              <span className="text-faint">{row.label}</span>
              <span className="font-semibold text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[16px] pt-[11px]">
        <div className="rounded-[14px] border border-line-soft bg-white p-[10px]">
          <p className="flex items-center gap-[7px] text-[9.5px] font-semibold text-subtle">
            <LockIcon width={12} height={12} className="text-brand" />
            Only this sub-wallet is affected
          </p>
          <p className="mt-[5px] text-[9.5px] leading-relaxed text-faint">
            The rest of your wallet and your other sub-wallets stay untouched.
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-[7px] px-[16px] pb-[12px]">
        <span className="flex items-center justify-center gap-[6px] rounded-[12px] bg-brand py-[9px] text-[11px] font-bold text-white">
          <CheckCircleIcon width={13} height={13} />
          Payout scheduled
        </span>
        <span className="text-center text-[10px] font-semibold text-brand-dark">
          Edit amount or date
        </span>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* Activity                                                                   */
/* -------------------------------------------------------------------------- */

export function ActivityScreen() {
  const { activity, allocatedTotal, incomeReceived } = demoProduct;
  const groups: Array<{ label: string; entries: ActivityEntry[] }> = [];

  for (const entry of activity) {
    const label = relativeDayLabel(new Date(entry.date));
    const group = groups.find((item) => item.label === label);
    if (group) {
      group.entries.push(entry);
    } else {
      groups.push({ label, entries: [entry] });
    }
  }

  return (
    <ScreenFrame name="activity">
      <div className="px-[16px] pt-[8px]">
        <p className="text-[15px] font-bold tracking-[-0.025em] text-ink">Activity</p>
        <p className="mt-[2px] text-[10px] text-subtle">
          {formatKes(incomeReceived)} in · {formatKes(allocatedTotal)} assigned
        </p>
      </div>

      <div className="mt-[11px] flex min-h-0 flex-1 flex-col gap-[10px] px-[16px]">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-[5px]">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-faint">
              {group.label}
            </p>
            {group.entries.map((entry) => (
              <AmountRow key={entry.id} entry={entry} />
            ))}
          </div>
        ))}
      </div>

      <div className="px-[16px] pb-[10px] pt-[9px]">
        <span className="flex items-center justify-center gap-[6px] rounded-[12px] border border-line bg-white py-[8px] text-[10.5px] font-bold text-ink">
          <ActivityIcon width={13} height={13} className="text-brand" />
          See the full month
        </span>
      </div>
    </ScreenFrame>
  );
}

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

export function HomeScreen() {
  const { unassignedBalance, subWallets, activity } = demoProduct;
  const quickActions = [
    { label: "Add", icon: PlusIcon },
    { label: "Send", icon: SendIcon },
    { label: "Wallet", icon: WalletIcon },
    { label: "Activity", icon: ActivityIcon },
  ];

  return (
    <ScreenFrame tint name="home">
      <div className="flex items-center justify-between px-[16px] pt-[8px]">
        <div>
          <p className="text-[10px] font-medium text-subtle">Good morning</p>
          <p className="text-[15px] font-bold tracking-[-0.025em] text-ink">Dispense</p>
        </div>
        <span className="flex size-[30px] items-center justify-center rounded-full border border-line bg-white">
          <BellIcon width={15} height={15} className="text-subtle" />
        </span>
      </div>

      <div className="px-[16px] pt-[9px]">
        <div className="rounded-[18px] p-[14px] text-white" style={{ background: phoneGradient }}>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/70">
            Available to spend
          </p>
          <p className="mt-[3px] text-[26px] font-bold leading-none tracking-[-0.035em] tabular-nums">
            {formatKes(unassignedBalance)}
          </p>
          <div className="mt-[10px] flex gap-[7px]">
            <MiniButton>
              <PlusIcon width={12} height={12} />
              Add money
            </MiniButton>
            <MiniButton variant="ghost">
              <SendIcon width={12} height={12} />
              Withdraw
            </MiniButton>
          </div>
        </div>
      </div>

      <div className="px-[16px] pt-[11px]">
        <div className="grid grid-cols-4 gap-[6px]">
          {quickActions.map((action) => (
            <span
              key={action.label}
              className="flex flex-col items-center gap-[5px] rounded-[12px] bg-white py-[8px]"
            >
              <action.icon width={15} height={15} className="text-brand" />
              <span className="text-[9px] font-semibold text-subtle">{action.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="px-[16px] pt-[11px]">
        <SectionLabel action={`${subWallets.length} active`}>Sub-wallets</SectionLabel>
      </div>
      <div className="mt-[7px] flex gap-[7px] overflow-hidden px-[16px]">
        {subWallets.slice(0, 3).map((wallet) => (
          <div key={wallet.key} className="w-[112px] shrink-0 rounded-[14px] bg-white p-[10px]">
            <CategoryChip wallet={wallet} />
            <p className="mt-[7px] text-[10px] font-semibold text-subtle">{wallet.name}</p>
            <p className="text-[13px] font-bold tracking-[-0.02em] tabular-nums text-ink">
              {formatKes(wallet.allocated)}
            </p>
          </div>
        ))}
      </div>

      <div className="px-[16px] pt-[11px]">
        <SectionLabel action="Today">This week</SectionLabel>
      </div>
      <div className="flex flex-col gap-[5px] px-[16px] pt-[6px]">
        {activity.slice(0, 2).map((entry) => (
          <AmountRow key={entry.id} entry={entry} />
        ))}
      </div>
    </ScreenFrame>
  );
}

/** Maps a story/step identifier to the screen component that illustrates it. */
export function screenFor(kind: string) {
  switch (kind) {
    case "rent":
      return <SubWalletScreen wallet={demoProduct.subWallets[0]} />;
    case "transport":
      return <SubWalletScreen wallet={demoProduct.subWallets[1]} showSchedule={false} />;
    case "savings":
      return <SubWalletScreen wallet={demoProduct.subWallets[3]} showSchedule={false} ctaLabel="Allocate" />;
    case "payout":
      return <PayoutScreen />;
    case "activity":
      return <ActivityScreen />;
    case "subwallets":
      return <WalletScreen />;
    case "home":
      return <HomeScreen />;
    case "wallet":
    default:
      return <WalletScreen />;
  }
}
