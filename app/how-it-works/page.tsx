import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "How It Works — FreshRoute",
  description: "Learn how FreshRoute rescues surplus produce and connects farmers with verified buyers.",
};

export default function HowItWorksPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              How FreshRoute Works
            </h1>
            <p className="lead mx-auto text-lg">
              Connecting surplus harvest to commercial demand in four simple, transparent steps.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center font-bold text-xl shrink-0">
                01
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. Farmers & Vendors List Produce</h3>
                <p className="text-[var(--mute)] leading-relaxed">
                  When a harvest exceeds immediate local market demand or faces transit delays, sellers publish batch details: crop variety, harvest date, available quantity, price, seller-reported grade, and pickup location.
                </p>
              </div>
            </div>

            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center font-bold text-xl shrink-0">
                02
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. Buyers Discover Suitable Listings</h3>
                <p className="text-[var(--mute)] leading-relaxed">
                  Retailers, wholesalers, and bulk buyers filter produce by crop type, location, minimum order quantity, and freshness deadline. Buyers receive transparent pricing directly from the source.
                </p>
              </div>
            </div>

            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center font-bold text-xl shrink-0">
                03
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">3. Transportation & Logistics Coordination</h3>
                <p className="text-[var(--mute)] leading-relaxed">
                  Registered logistics providers discover delivery opportunities along their operating routes. Shared transport options minimize empty vehicle returns and reduce transit overhead.
                </p>
              </div>
            </div>

            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center font-bold text-xl shrink-0">
                04
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">4. Produce Rescued & Value Recovered</h3>
                <p className="text-[var(--mute)] leading-relaxed">
                  Transactions close before perishable crops lose commercial viability. Farmers receive fair payments faster, buyers procure fresh stock, and food loss is systematically reduced.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center p-8 bg-[var(--tint)] rounded-2xl border border-[var(--line)]">
            <h3 className="text-2xl font-bold mb-3 text-[var(--ink)]">
              Ready to eliminate harvest waste?
            </h3>
            <p className="text-[var(--mute)] mb-6 max-w-md mx-auto">
              Join thousands of agricultural producers and commercial buyers on FreshRoute today.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register?intent=sell" className="btn">
                Start Selling
              </Link>
              <Link href="/marketplace" className="btn g">
                Browse Produce
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

