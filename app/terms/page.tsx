import React from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "Terms of Service — FreshRoute",
};

export default function TermsPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-3xl mx-auto bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-[var(--ink)]">
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            Welcome to FreshRoute. By accessing or using our marketplace platform, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h2 className="text-xl font-bold">1. Produce Truthfulness</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            Sellers are strictly required to represent harvest dates, crop condition, and seller-declared quality grades accurately. Fabricating produce availability or misleading buyers regarding perishable shelf life violates marketplace policies.
          </p>
          <h2 className="text-xl font-bold">2. Commercial Role Flexibility</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            Participants may act as both sellers and buyers across distinct transactions under one verified account profile.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

