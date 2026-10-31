import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

const LOGISTICS_NAV = [
  { label: "Overview", href: "/dashboard/logistics" },
  { label: "Available Delivery Jobs", href: "/dashboard/logistics" },
  { label: "My Vehicles", href: "/dashboard/settings/business" },
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
      roleSubtitle="Logistics workspace"
      navItems={LOGISTICS_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="mh">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <small>Logistics workspace</small>
          </div>
          <Link href="/dashboard/settings/business" className="btn">
            Add a Vehicle
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="kp">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <small>Open jobs</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <small>Active deliveries</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <small>Quotes pending</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 3 } as React.CSSProperties}>
            <small>Vehicles</small>
            <strong>1</strong>
          </div>
        </div>

        {/* Available Delivery Jobs Panel */}
        <div className="pn2">
          <div className="flex justify-between items-center mb-4">
            <h2>Available delivery jobs</h2>
            <span className="text-xs text-[var(--mute)]">Radius: 50 km</span>
          </div>

          <div className="text-center py-10">
            <p className="text-sm text-[var(--mute)] mb-4">
              No delivery requests currently need transport in your registered corridor. As buyers purchase surplus, transport jobs will appear here.
            </p>
            <Link href="/dashboard/settings/business" className="btn g text-xs">
              Update Operating Corridors
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
