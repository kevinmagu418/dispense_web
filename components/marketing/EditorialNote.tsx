import { demoProduct } from "@/lib/demo-data";
import Image from "next/image";
import { formatDate, formatKes, percentOf } from "@/lib/utils";

import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { LayersIcon, SendIcon, WalletIcon } from "./app-ui/icons";

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
            <div className="group relative overflow-hidden rounded-[24px] border border-[#dce7fb] bg-[linear-gradient(145deg,#ffffff_0%,#fbfdff_58%,#f3f7ff_100%)] p-6 shadow-[0_18px_45px_-34px_rgba(21,101,255,0.34),0_2px_8px_-4px_rgba(10,16,32,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#bfd3f7] hover:shadow-[0_24px_58px_-34px_rgba(21,101,255,0.42),0_8px_18px_-12px_rgba(10,16,32,0.16)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-8">
              <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-brand/[0.07] blur-3xl" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#1565ff_0.7px,transparent_0.7px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,black,transparent_68%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-brand/10 pb-5">
                <div>
                  <p className="t-eyebrow text-brand-dark/70">How money moves</p>
                  <p className="mt-1.5 text-[0.8125rem] font-semibold text-ink">A clear path from income to purpose</p>
                </div>
                <span className="shrink-0 rounded-full border border-brand/15 bg-brand-tint px-2.5 py-1 text-[0.6875rem] font-bold text-brand-dark">
                  Live example
                </span>
              </div>

              <ol className="relative z-10 mt-6 flex flex-col gap-2.5">
                {flow.map((step, index) => (
                  <li key={step.id} className="relative flex gap-3.5 rounded-[16px] border border-brand/10 bg-white/65 p-3.5 transition-colors duration-300 hover:border-brand/20 hover:bg-white/90 motion-reduce:transition-none">
                    {index < flow.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[29px] top-[3.75rem] -bottom-[0.625rem] w-px bg-brand/15"
                      />
                    ) : null}
                    <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-brand/15 bg-[linear-gradient(145deg,#f7faff_0%,#e7f0ff_100%)] text-brand shadow-[0_8px_18px_-12px_rgba(21,101,255,0.7)]">
                      {step.icon}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1 pt-0.5">
                      <span className="text-[0.9375rem] font-semibold text-ink">{step.label}</span>
                      <span className="t-small">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="relative z-10 mt-6 flex flex-wrap gap-x-4 gap-y-3 border-t border-brand/10 pt-6">
                {subWallets.map((wallet) => {
                  return (
                    <span key={wallet.key} className="flex items-center gap-2">
                      <Image src={wallet.payee.logo} alt="" width={20} height={20} className="size-5 rounded-[6px] object-cover" />
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

              <p className="t-small relative z-10 mt-6 text-faint">
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
