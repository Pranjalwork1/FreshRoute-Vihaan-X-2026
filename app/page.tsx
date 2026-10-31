import React from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { HeroCarousel } from "@/components/homepage/HeroCarousel";
import { WhySection } from "@/components/homepage/WhySection";
import { RescueDemo } from "@/components/homepage/RescueDemo";
import { MarketplacePanels } from "@/components/homepage/MarketplacePanels";
import { ClosingSoonSection } from "@/components/homepage/ClosingSoonSection";
import { RecentlyListedSection } from "@/components/homepage/RecentlyListedSection";
import { CategoriesSection } from "@/components/homepage/CategoriesSection";
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection";
import { WorkspacesSection } from "@/components/homepage/WorkspacesSection";
import { IntelligenceSection } from "@/components/homepage/IntelligenceSection";
import { TrustSection } from "@/components/homepage/TrustSection";
import { ImpactSection } from "@/components/homepage/ImpactSection";
import { DemoFab } from "@/components/homepage/DemoFab";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
        role: authUser.user_metadata?.role,
      };
    }
  }

  return (
    <div id="site">
      <ProduceSvgDefs />
      <Header user={user} />
      <main className="w" id="top">
        <HeroCarousel />
        <WhySection />
        <RescueDemo />
        <MarketplacePanels />
        <ClosingSoonSection />
        <RecentlyListedSection />
        <CategoriesSection />
        <HowItWorksSection />
        <WorkspacesSection />
        <IntelligenceSection />
        <TrustSection />
        <ImpactSection />
      </main>
      <Footer />
      <DemoFab />
    </div>
  );
}
