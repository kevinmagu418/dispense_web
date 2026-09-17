import type { ReactNode } from "react";

import { demoProduct } from "@/lib/demo-data";
import type { Feature } from "@/lib/content/product";
import { formatDate, formatKes, hexToRgba, percentOf, relativeDayLabel } from "@/lib/utils";

import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  categoryIcons,
  ClockIcon,
  PlusIcon,
  SendIcon,
} from "./app-ui/icons";

/**
 * Compact, data-driven product visuals used by the feature cards, the features
 * page and the how-it-works steps. Every amount, percentage and date is derived
 * from lib/demo-data.ts — nothing in here is hard-coded copy.
 */

function VisualShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[16px] border border-line-soft bg-surface-2 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
      {children}
    </div>
  );
}

export function WalletVisual() {
  const { unassignedBalance, allocatedTotal } = demoProduct;
  return (
    <VisualShell>
      <div
        className="rounded-[14px] p-4 text-white"
        style={{ background: "linear-gradient(135deg, #1565ff 0%, #0e58ec 52%, #0052d4 100%)" }}
      >
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-white/70">
          Available to spend
        </p>
        <p className="mt-2 text-[1.5rem] font-bold leading-none tracking-[-0.03em] tabular-nums">
          {formatKes(unassignedBalance)}
        </p>
        <p className="mt-2 text-[0.75rem] text-white/75">{formatKes(allocatedTotal)} allocated</p>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-surface py-2 text-[0.75rem] font-semibold text-ink">
          <PlusIcon width={13} height={13} className="text-brand" />
          Add money
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-surface py-2 text-[0.75rem] font-semibold text-ink">
          <SendIcon width={13} height={13} className="text-brand" />
          Withdraw
        </span>
      </div>
    </VisualShell>
  );
}

export function SubWalletsVisual() {
  return (
    <VisualShell>
      <ul className="flex flex-col gap-2.5">
        {demoProduct.subWallets.map((wallet) => {
          const Icon = categoryIcons[wallet.icon];
          return (
            <li key={wallet.key} className="flex items-center gap-3">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-[9px]"
                style={{ backgroundColor: hexToRgba(wallet.color, 0.12) }}
              >
                <Icon width={14} height={14} style={{ color: wallet.color }} />
              </span>
              <span className="flex-1 text-[0.8125rem] font-semibold text-ink">{wallet.name}</span>
              <span className="text-[0.8125rem] font-bold tabular-nums text-ink">
                {formatKes(wallet.allocated)}
              </span>
            </li>
          );
        })}
      </ul>
    </VisualShell>
  );
}

export function OrganiseVisual() {
  const { subWallets, incomeReceived, allocatedShare } = demoProduct;
  return (
    <VisualShell>
      <div className="flex items-baseline justify-between">
        <span className="t-small text-ink">Purpose assigned</span>
        <span className="text-[0.9375rem] font-bold tabular-nums text-brand">{allocatedShare}%</span>
      </div>
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-canvas-alt">
        {subWallets.map((wallet) => (
          <span
            key={wallet.key}
            style={{
              width: `${percentOf(wallet.allocated, incomeReceived)}%`,
              backgroundColor: wallet.color,
            }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {subWallets.map((wallet) => (
          <li key={wallet.key} className="flex items-center gap-2 text-[0.75rem] text-subtle">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: wallet.color }}
            />
            {wallet.name}
          </li>
        ))}
      </ul>
    </VisualShell>
  );
}

export function PayoutsVisual() {
  const scheduleOwner: Record<number, string> = {
    5: demoProduct.subWallets[0].name,
    12: demoProduct.subWallets[1].name,
    28: demoProduct.subWallets[3].name,
  };

  return (
    <VisualShell>
      <ul className="flex flex-col gap-2.5">
        {demoProduct.schedulePreview.map((item) => (
          <li key={item.day} className="flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-brand-tint">
              <CalendarIcon width={14} height={14} className="text-brand" />
            </span>
            <span className="flex-1">
              <span className="block text-[0.8125rem] font-semibold text-ink">
                {formatDate(item.date, { weekday: undefined })}
              </span>
              <span className="block text-[0.75rem] text-faint">
                {scheduleOwner[item.day] ?? "Sub-wallet"} · scheduled
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[0.75rem] font-semibold text-subtle">
              <ClockIcon width={11} height={11} className="text-brand" />
              8:00 AM
            </span>
          </li>
        ))}
      </ul>
    </VisualShell>
  );
}

export function ActivityVisual() {
  return (
    <VisualShell>
      <ul className="flex flex-col gap-2.5">
        {demoProduct.activity.slice(0, 3).map((entry) => {
          const positive = entry.direction === "in";
          return (
            <li key={entry.id} className="flex items-center gap-3">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-[9px]"
                style={{ backgroundColor: hexToRgba(entry.color, 0.12) }}
              >
                {positive ? (
                  <ArrowDownLeftIcon width={14} height={14} style={{ color: entry.color }} />
                ) : (
                  <ArrowUpRightIcon width={14} height={14} style={{ color: entry.color }} />
                )}
              </span>
              <span className="flex-1">
                <span className="block text-[0.8125rem] font-semibold text-ink">{entry.label}</span>
                <span className="block text-[0.75rem] text-faint">
                  {relativeDayLabel(new Date(entry.date))}
                </span>
              </span>
              <span
                className="text-[0.8125rem] font-bold tabular-nums"
                style={{ color: positive ? "#16a34a" : "#141c2e" }}
              >
                {positive ? "+" : "−"}
                {formatKes(Math.abs(entry.amount)).replace("KSh ", "")}
              </span>
            </li>
          );
        })}
      </ul>
    </VisualShell>
  );
}

const visuals: Record<Feature["visual"], () => React.JSX.Element> = {
  wallet: WalletVisual,
  subwallets: SubWalletsVisual,
  organize: OrganiseVisual,
  payouts: PayoutsVisual,
  activity: ActivityVisual,
};

export function FeatureVisual({ visual }: { visual: Feature["visual"] }) {
  const Component = visuals[visual];
  return <Component />;
}
