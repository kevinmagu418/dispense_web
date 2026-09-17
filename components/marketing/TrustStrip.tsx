import { principles } from "@/lib/content/product";

/**
 * Product trust strip. Deliberately free of logos, counts and ratings — the
 * claims here are statements about how the product is designed, not social proof.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface/70">
      <div className="container-x py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <h2 className="t-h3 max-w-[26ch] text-ink">
            One place for the money that matters every day.
          </h2>

          <ul className="grid flex-1 gap-8 sm:grid-cols-3 lg:max-w-[50rem] lg:gap-10">
            {principles.map((item) => (
              <li key={item.title} className="flex flex-col gap-2 border-t border-line pt-5">
                <span className="t-h4 text-ink">{item.title}</span>
                <span className="t-small">{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
