import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

const WHOLESALER_NAV = [
  { label: "Overview", href: "/dashboard/wholesaler" },
  { label: "Browse Marketplace", href: "/marketplace" },
  { label: "Business Profile", href: "/dashboard/settings/business" },
  { label: "Account Settings", href: "/dashboard/settings/profile" },
  { label: "Switch to Farmer View", href: "/dashboard/seller" },
];

export const dynamic = "force-dynamic";

export default async function WholesalerDashboardPage() {
  const supabase = await createClient();
  let userName = "Wholesale Procurement";
  let userEmail = "";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userName = user.user_metadata?.full_name || "Wholesale Procurement";
      userEmail = user.email || "";
    }
  }

  return (
    <DashboardLayout
      roleTitle="Wholesaler & Bulk Buyer"
      roleSubtitle="Institutional Sourcing"
      navItems={WHOLESALER_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight">
              Wholesale & Institutional Procurement
            </h1>
            <p className="text-sm text-[var(--mute)] mt-1">
              Procure truckload quantities, aggregate from multiple growers, and negotiate bulk pricing.
            </p>
          </div>
          <Link href="/marketplace" className="btn">
            Browse Bulk Lots
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Publish Bulk Demand</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              State your required volume (e.g. 10 tonnes of processing tomatoes), target price, and delivery window to receive quotes from farmer groups.
            </p>
            <button className="btn g text-xs w-full" disabled>
              Post Requirement (Coming in Milestone C)
            </button>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Supplier Discovery</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              Discover accredited producer cooperatives, FPOs, and large farm aggregators verified across states.
            </p>
            <Link href="/marketplace" className="btn text-xs w-full text-center">
              Explore Active Suppliers
            </Link>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
            <h3 className="font-bold text-base mb-2">Multi-Batch Fulfilment</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed mb-4">
              Combine surplus harvests from nearby smallholder farmers to meet large institutional order sizes.
            </p>
            <span className="text-[11px] text-[var(--acc)] font-semibold">
              ✓ Multi-Seller Aggregation Enabled
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

