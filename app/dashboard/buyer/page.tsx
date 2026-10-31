import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMarketplaceListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

const BUYER_NAV = [
  { label: "Overview", href: "/dashboard/buyer" },
  { label: "Browse Produce", href: "/marketplace" },
  { label: "My Orders", href: "/dashboard/buyer/orders" },
  { label: "Business Profile", href: "/dashboard/settings/business" },
  { label: "Account Settings", href: "/dashboard/settings/profile" },
  { label: "Switch to Farmer View", href: "/dashboard/seller" },
];

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const supabase = await createClient();
  let userName = "Retailer Partner";
  let userEmail = "";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userName = user.user_metadata?.full_name || "Retailer Partner";
      userEmail = user.email || "";
    }
  }

  const activeListings = await getMarketplaceListings({ limit: 4 });

  return (
    <DashboardLayout
      roleTitle="Retailer & Buyer"
      roleSubtitle="Buyer workspace"
      navItems={BUYER_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="mh">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <small>Buyer workspace</small>
          </div>
          <Link href="/marketplace" className="btn">
            Browse Produce
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="kp">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <small>Total purchases</small>
            <strong>₹0</strong>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <small>Active orders</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <small>Pending deliveries</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 3 } as React.CSSProperties}>
            <small>Available listings</small>
            <strong>{activeListings.length}</strong>
          </div>
        </div>

        {/* Recommended Nearby Listings Panel */}
        <div className="pn2">
          <div className="flex justify-between items-center mb-4">
            <h2>Recommended nearby listings</h2>
            <Link
              href="/marketplace"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              Browse all ({activeListings.length})
            </Link>
          </div>

          {activeListings.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mx-auto mb-3">
                <ProduceSvg name="tomato" className="w-6 h-6" />
              </div>
              <p className="text-sm text-[var(--mute)] mb-4">
                No active listings match your current delivery radius.
              </p>
              <Link href="/marketplace" className="btn text-xs">
                Explore All Regions
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {activeListings.map((item) => (
                <div key={item.id} className="lr">
                  <span className="lt">
                    <ProduceSvg name={item.category || "tomato"} className="w-8 h-8" />
                  </span>
                  <div>
                    <b className="text-sm font-semibold">{item.produce_name}</b>
                    <small>
                      {item.pickup_location_text?.split(",").slice(-2).join(",") || "Regional"} • ₹{item.price_per_unit}/{item.unit}
                    </small>
                  </div>
                  <Link href={`/marketplace?item=${item.id}`} className="tg2">
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
