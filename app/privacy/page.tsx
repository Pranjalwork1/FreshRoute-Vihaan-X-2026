import React from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export const metadata = {
  title: "Privacy Policy — FreshRoute",
};

export default function PrivacyPage() {
  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-3xl mx-auto bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-[var(--ink)]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            FreshRoute respects the privacy of farmers, vendors, retailers, wholesalers, and logistics operators. This privacy notice explains how we collect and protect your business contact details, crop listing parameters, and location data.
          </p>
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            We collect account profile details (name, email, phone number), business and farm location data, and produce specifications declared during listing creation.
          </p>
          <h2 className="text-xl font-bold">2. Use of Produce Photographs</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            Photographs uploaded to the produce catalogue are public marketplace assets used solely to assist buyers in inspecting harvest condition.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

