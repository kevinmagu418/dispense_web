import { demoProduct } from "@/lib/demo-data";
import { formatDate, formatKes, percentOf } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { categoryIcons, LayersIcon, SendIcon, WalletIcon } from "./app-ui/icons";

/**
 * Editorial section: product education for readers searching for budgeting and
 * money-organisation guidance, plus a plain diagram of how money moves through
 * Dispense. Text is server-rendered and written to be read, not to rank.
 */
export function EditorialNote() {
  const { incomeReceived, allocatedTotal, unassignedBalance, subWallets, allocatedShare } =
    demoProduct;

  const flow = [
    {
      id: "income",
      label: "Income lands",
      detail: `${formatKes(incomeReceived)} arrives in your personal wallet`,
      icon: <WalletIcon width={17} height={17} className="text-brand" />,
    },
    {
      id: "wallet",
      label: "One balance, fully visible",
      detail: `${formatKes(unassignedBalance)} stays unassigned and spendable`,
      icon: <LayersIcon width={17} height={17} className="text-brand" />,
    },
    {
      id: "subwallets",
      label: "Sub-wallets take their share",
      detail: `${allocatedShare}% of income assigned to ${subWallets.length} purposes`,
      icon: <LayersIcon width={17} height={17} className="text-brand" />,
    },
    {
      id: "payouts",
      label: "Payouts run on schedule",
      detail: `Rent is set to leave on ${formatDate(demoProduct.nextRentPayout, {
        day: "numeric",
        month: "long",
        year: undefined,
      })}, as configured`,
      icon: <SendIcon width={17} height={17} className="text-brand" />,
    },
  ];

  return (
    <section className="section-tight">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
          <Reveal className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Why it helps"
              title="Money stops being a guess when it has a job."
            />
            <div className="prose-dispense max-w-[54ch]">
              <p>
                Most budgeting advice asks you to record everything after the fact and hope the
                pattern becomes clear. It rarely does — by the time the numbers are written down,
                the decisions that mattered have already been made.
              </p>
              <p>
                Dispense works the other way round. You decide what the money is for before it is
                spent: rent, transport, groceries, savings. Each purpose gets its own sub-wallet and
                its own amount, so the balance you read in the morning is the amount you can actually
                use — not a total that still has obligations hiding inside it.
              </p>
              <p>
                That matters most for the costs that arrive on a schedule. Rent is the obvious one:
                when it is set aside on the day income lands and scheduled to pay out on the date it
                is due, it stops competing with daily spending. Transport is the other: a weekly
                amount that stays visible makes it obvious when the month is running hot, well before
                the last week.
              </p>
              <p>
                None of this needs a spreadsheet, and none of it needs you to become a different kind
                of person with money. It needs the categories to exist, the amounts to be honest, and
                the schedule to run without a reminder.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-6">
            <div className="rounded-[24px] border border-line bg-surface p-6 sm:p-8">
              <p className="t-eyebrow text-faint">How money moves</p>

              <ol className="mt-7 flex flex-col">
                {flow.map((step, index) => (
                  <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < flow.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[19px] top-10 h-[calc(100%-1.5rem)] w-px bg-line"
                      />
                    ) : null}
                    <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-surface-2">
                      {step.icon}
                    </span>
                    <span className="flex flex-col gap-1 pt-1.5">
                      <span className="text-[0.9375rem] font-semibold text-ink">{step.label}</span>
                      <span className="t-small">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 border-t border-line-soft pt-6">
                {subWallets.map((wallet) => {
                  const Icon = categoryIcons[wallet.icon];
                  return (
                    <span key={wallet.key} className="flex items-center gap-2">
                      <Icon width={15} height={15} style={{ color: wallet.color }} />
                      <span className="text-[0.8125rem] text-subtle">
                        {wallet.name}{" "}
                        <span className="tabular-nums text-faint">
                          {percentOf(wallet.allocated, incomeReceived)}%
                        </span>
                      </span>
                    </span>
                  );
                })}
                <span className="flex items-center gap-2">
                  <WalletIcon width={15} height={15} className="text-faint" />
                  <span className="text-[0.8125rem] text-subtle">
                    Unassigned{" "}
                    <span className="tabular-nums text-faint">
                      {percentOf(unassignedBalance, incomeReceived)}%
                    </span>
                  </span>
                </span>
              </div>

              <p className="t-small mt-6 text-faint">
                Figures show an example month — {formatKes(incomeReceived)} received and{" "}
                {formatKes(allocatedTotal)} given a purpose. Your own amounts are yours to set.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
