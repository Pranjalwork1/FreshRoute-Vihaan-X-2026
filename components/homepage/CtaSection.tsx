import React from "react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-16">
      <div className="bg-[var(--tint)] border border-[var(--line)] rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-sm">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--acc)] bg-white px-3 py-1 rounded-full border border-[var(--line)]">
          Join FreshRoute
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight mt-4 mb-4 max-w-2xl mx-auto">
          Have Produce to Sell? Looking for Better Supply Opportunities?
        </h2>
        <p className="text-sm text-[var(--mute)] max-w-lg mx-auto mb-8 leading-relaxed">
          Whether you cultivate fresh harvests or procure commercial volumes, FreshRoute helps you reduce post-harvest waste and connect with verified regional partners.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register?intent=sell" className="btn py-3 px-6 text-sm">
            Join as a Seller
          </Link>
          <Link href="/register?intent=buy" className="btn g py-3 px-6 text-sm bg-white">
            Join as a Buyer
          </Link>
        </div>
      </div>
    </section>
  );
}

