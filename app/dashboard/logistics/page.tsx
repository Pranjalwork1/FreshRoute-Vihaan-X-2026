import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

const LOGISTICS_NAV = [
  { label: "Overview", href: "/dashboard/logistics" },
  { label: "Browse Marketplace", href: "/marketplace" },
  { label: "Business Profile", href: "/dashboard/settings/business" },
  { label: "Account Settings", href: "/dashboard/settings/profile" },
  { label: "Switch to Farmer View", href: "/dashboard/seller" },
];

export const dynamic = "force-dynamic";

export default async function LogisticsDashboardPage() {
  const supabase = await createClient();
  let userName = "Logistics Partner";
  let userEmail = "";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userName = user.user_metadata?.full_name || "Logistics Partner";
      userEmail = user.email || "";
    }
  }

  return (
    <DashboardLayout
      roleTitle="Logistics Provider"
      roleSubtitle="Freight & Cold Storage Fleet"
      navItems={LOGISTICS_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight">
              Logistics & Cold-Chain Fleet
            </h1>
            <p className="text-sm text-[var(--mute)] mt-1">
              Connect transport capacity to agricultural produce pickup routes.
            </p>
          </div>
          <Link href="/marketplace" className="btn">
            View Regional Batches
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Vehicle Profile Registered</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              Your transport profile is active. Verified vehicles receive automated alerts when produce matches your operating corridors.
            </p>
            <div className="text-xs font-semibold text-[var(--acc)]">
              ✓ Active Route Carrier
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Backhaul & Shared Loads</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              Prevent empty return trips by picking up surplus batches on your existing return journeys between rural mandis and city centers.
            </p>
            <div className="text-xs font-semibold text-[var(--mute)]">
              Corridor Matching Active
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Cold Storage Integration</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              Reefer trucks and partner packhouses can be tagged directly to perishable batch listings for temperature-controlled transit.
            </p>
            <div className="text-xs font-semibold text-[var(--mute)]">
              Temperature Monitoring Ready
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

