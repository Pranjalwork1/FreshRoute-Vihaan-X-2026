import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "For Retailers & Wholesalers — FreshRoute",
  description: "Procure farm-fresh surplus produce directly from growers at competitive wholesale rates.",
};

export default function ForBuyersPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Procure Fresh Crops Direct from Farms
            </h1>
            <p className="lead mx-auto text-lg">
              Source verified produce batches, view harvest dates and seller quality grades, and secure fresh inventory before it deteriorates.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/register?intent=buy" className="btn">
                Register as a Buyer
              </Link>
              <Link href="/marketplace" className="btn g">
                Browse Live Marketplace
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Direct Farm Sourcing</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                Skip multiple middleman margins and access fresh harvests directly from verified regional growers and aggregators.
              </p>
            </div>
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Accurate Batch History</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                Know exact harvest dates, packaging types, and storage conditions before agreeing on quantities and prices.
              </p>
            </div>
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Flexible Order Quantities</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                From smaller local retail crates to metric-tonne wholesale truckloads, find batches sized to your demand.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

