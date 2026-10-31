import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

const WHOLESALER_NAV = [
  { label: "Overview", href: "/dashboard/wholesaler" },
  { label: "Publish Requirement", href: "/dashboard/wholesaler" },
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
      roleSubtitle="Bulk buyer workspace"
      navItems={WHOLESALER_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="mh">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <small>Bulk buyer workspace</small>
          </div>
          <Link href="/marketplace" className="btn">
            Publish Requirement
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="kp">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <small>Open requirements</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <small>Quotes received</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <small>Large orders</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 3 } as React.CSSProperties}>
            <small>Deliveries scheduled</small>
            <strong>0</strong>
          </div>
        </div>

        {/* Quotes Panel */}
        <div className="pn2">
          <div className="flex justify-between items-center mb-4">
            <h2>Quotes to compare</h2>
            <Link
              href="/marketplace"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              Browse active listings
            </Link>
          </div>

          <div className="text-center py-10">
            <p className="text-sm text-[var(--mute)] mb-4">
              You have no active bulk requirements published. Post your weekly demand to receive aggregated supplier quotations.
            </p>
            <Link href="/marketplace" className="btn text-xs">
              + Post Bulk Requirement
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
