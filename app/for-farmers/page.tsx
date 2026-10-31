import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "For Farmers & Sellers — FreshRoute",
  description: "Sell surplus crops directly to verified retailers and wholesalers with transparent pricing.",
};

export default function ForFarmersPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Direct Access to Serious Buyers
            </h1>
            <p className="lead mx-auto text-lg">
              Never dump surplus harvest again. Turn excess perishable crops into immediate working revenue.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/register?intent=sell" className="btn">
                Register as a Farmer
              </Link>
              <Link href="/login" className="btn g">
                Sign In to Dashboard
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Fair, Transparent Prices</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                Set your own unit price and minimum order quantities. Indicate if prices are negotiable for bulk buyers.
              </p>
            </div>
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Fast Produce Rescue</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                Highlight harvest urgency deadlines so buyers looking for immediate dispatch can rescue batches without delay.
              </p>
            </div>
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Multi-Role Flexibility</h3>
              <p className="text-[var(--mute)] text-sm leading-relaxed">
                You can sell your harvest and simultaneously procure seeds or bulk staples as a buyer with one single account.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

