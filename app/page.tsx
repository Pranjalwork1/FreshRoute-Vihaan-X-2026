import React from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { HeroSection } from "@/components/homepage/HeroSection";
import { SearchSection } from "@/components/homepage/SearchSection";
import { CategoriesSection } from "@/components/homepage/CategoriesSection";
import { RecentListingsSection } from "@/components/homepage/RecentListingsSection";
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection";
import { WorkspacesSection } from "@/components/homepage/WorkspacesSection";
import { IntelligenceSection } from "@/components/homepage/IntelligenceSection";
import { ImpactSection } from "@/components/homepage/ImpactSection";
import { CtaSection } from "@/components/homepage/CtaSection";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";
import { getMarketplaceListings, getMarketplaceMetrics } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [listings, metrics] = await Promise.all([
    getMarketplaceListings({ limit: 4 }),
    getMarketplaceMetrics(),
  ]);

  let user = null;
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      user = {
        email: authUser.email,
        fullName: authUser.user_metadata?.full_name,
      };
    }
  }

  return (
    <>
      <ProduceSvgDefs />
      <Header user={user} />
      <main className="w" id="top">
        <HeroSection />
        <SearchSection />
        <CategoriesSection />
        <RecentListingsSection listings={listings} />
        <HowItWorksSection />
        <WorkspacesSection />
        <IntelligenceSection />
        <ImpactSection metrics={metrics} />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
