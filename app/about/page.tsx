import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "About FreshRoute — Mission & Impact",
  description: "FreshRoute connects farmers, vendors, retailers, wholesalers, and logistics providers to rescue surplus perishable produce.",
};

export default function AboutPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              From Surplus to Opportunity
            </h1>
            <p className="lead mx-auto text-lg">
              FreshRoute connects farmers, local vendors, retailers, wholesalers and logistics providers to rescue surplus perishable produce before it loses commercial value.
            </p>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 space-y-6 text-[var(--mute)] leading-relaxed">
            <h2 className="text-2xl font-bold text-[var(--ink)]">Our Core Philosophy</h2>
            <p>
              FreshRoute is not just another vegetable-selling website. It is an intelligent produce marketplace engineered to tackle the acute issue of agricultural loss: where farmers are forced to discard edible harvests due to lack of immediate local buyers or transit coordination.
            </p>
            <p>
              By matching surplus produce with regional commercial demand, facilitating transparent quality disclosure, and linking freight transport, FreshRoute prevents avoidable food waste and creates economic liquidity for cultivators.
            </p>

            <h2 className="text-2xl font-bold text-[var(--ink)] pt-4">Multi-Role Architecture</h2>
            <p>
              Modern agricultural participants rarely fit into a rigid single box. A farmer who sells tomatoes may also need to purchase bulk onions or grains for secondary retail. FreshRoute is architected with a multi-role model where one account seamlessly accesses both seller and buyer workspaces without friction.
            </p>

            <div className="pt-6 border-t border-[var(--line)] flex gap-4">
              <Link href="/register" className="btn">
                Join FreshRoute
              </Link>
              <Link href="/marketplace" className="btn g">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

