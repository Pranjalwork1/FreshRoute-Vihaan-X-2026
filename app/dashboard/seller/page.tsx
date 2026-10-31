import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/server";
import { getSellerListings } from "@/lib/data/listings";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

const SELLER_NAV = [
  { label: "Overview", href: "/dashboard/seller" },
  { label: "My Listings", href: "/dashboard/seller/listings" },
  { label: "Add Produce", href: "/dashboard/seller/listings/new" },
  { label: "Business Profile", href: "/dashboard/settings/business" },
  { label: "Manage Roles", href: "/dashboard/settings/roles" },
  { label: "Account Settings", href: "/dashboard/settings/profile" },
  { label: "Marketplace", href: "/marketplace" },
];

export const dynamic = "force-dynamic";

export default async function SellerOverviewPage() {
  const supabase = await createClient();
  let user = null;
  let sellerId = "demo-seller-id";
  let userName = "FreshRoute Farmer";

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      user = authUser;
      sellerId = authUser.id;
      userName =
        authUser.user_metadata?.full_name ||
        authUser.email?.split("@")[0] ||
        "Farmer Partner";
    }
  }

  const rawListings = await getSellerListings(sellerId);
  const activeDbListings = rawListings.filter((l) => l.status === "active");

  // Fallback demo listings when account is freshly created
  const fallbackListings = [
    {
      id: "f-1",
      category: "corn",
      produce_name: "Sweet Corn",
      quantity_available: 400,
      unit: "kg",
      price_per_unit: 24,
      variety: "Grade B (seller-declared)",
      status: "3 offers",
      closes_in: "14 hours",
    },
    {
      id: "f-2",
      category: "tomato",
      produce_name: "Desi Tomatoes",
      quantity_available: 500,
      unit: "kg",
      price_per_unit: 20,
      variety: "Grade A (freshly harvested)",
      status: "Active",
      closes_in: "18 hours",
    },
    {
      id: "f-3",
      category: "potato",
      produce_name: "Red Potatoes",
      quantity_available: 300,
      unit: "kg",
      price_per_unit: 18,
      variety: "Grade A (stored in cold chain)",
      status: "Listed",
      closes_in: "5 days",
    },
  ];

  const displayListings =
    rawListings.length > 0 ? rawListings : fallbackListings;

  const totalQty =
    activeDbListings.length > 0
      ? activeDbListings.reduce(
          (acc, cur) => acc + (Number(cur.quantity_available) || 0),
          0
        )
      : 1200;

  return (
    <DashboardLayout
      roleTitle="Farmer & Seller"
      roleSubtitle="Seller workspace"
      navItems={SELLER_NAV}
      userEmail={user?.email}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Header with Title and Primary Action */}
        <div className="mh">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <small>Farmer & Seller workspace • Direct Producer</small>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/seller/listings/new" className="btn">
              + List New Produce
            </Link>
          </div>
        </div>

        {/* Live Notification Banner */}
        <div className="nt">
          <span>⚡ Sweet corn batch closes in 14 hours and has 3 active buyer offers.</span>{" "}
          <Link href="/dashboard/seller/listings">
            <b>Review offers now →</b>
          </Link>
        </div>

        {/* 4 Standard KPI Cards */}
        <div className="kp">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <small>Active listings</small>
            <strong>
              {activeDbListings.length > 0 ? activeDbListings.length : 3}
            </strong>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <small>Available stock</small>
            <strong>{totalQty >= 1000 ? `${(totalQty / 1000).toFixed(1)} T` : `${totalQty} kg`}</strong>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <small>Pending offers</small>
            <strong>5</strong>
          </div>
          <div style={{ "--i": 3 } as React.CSSProperties}>
            <small>Active orders</small>
            <strong>8</strong>
          </div>
        </div>

        {/* Primary Listings Panel */}
        <div className="pn2">
          <div className="pn2-head">
            <div>
              <h2 className="text-lg font-bold">Your produce listings</h2>
              <small className="text-[var(--mute)]">
                Active crops, stock levels, and commercial buyer offers
              </small>
            </div>
            <Link
              href="/dashboard/seller/listings"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              View all ({displayListings.length})
            </Link>
          </div>

          <div className="space-y-1">
            {displayListings.map((l: any) => (
              <div key={l.id} className="lr">
                <span className="lt">
                  <ProduceSvg
                    name={l.category || "tomato"}
                    className="w-8 h-8"
                  />
                </span>
                <div>
                  <b className="text-sm font-semibold">{l.produce_name}</b>
                  <small>
                    {l.quantity_available} {l.unit || "kg"} • ₹{l.price_per_unit}/{l.unit || "kg"}
                    {l.variety ? ` • ${l.variety}` : ""}
                  </small>
                </div>
                <span className="tg2">{l.status || "Listed"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Link
            href="/dashboard/seller/listings/new"
            className="p-4 rounded-xl border border-[var(--line)] bg-[var(--sf)] hover:border-[var(--acc)] transition group block"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <ProduceSvg name="crate" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold mb-1">Add Harvest Batch</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed">
              List surplus fruits, vegetables, or grains to receive fast wholesale offers.
            </p>
          </Link>

          <Link
            href="/dashboard/settings/business"
            className="p-4 rounded-xl border border-[var(--line)] bg-[var(--sf)] hover:border-[var(--acc)] transition group block"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <ProduceSvg name="truck" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold mb-1">Farmer Trust Verification</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed">
              Upload Kisan Credit Card or Aadhaar details to earn verified seller badge.
            </p>
          </Link>

          <Link
            href="/marketplace"
            className="p-4 rounded-xl border border-[var(--line)] bg-[var(--sf)] hover:border-[var(--acc)] transition group block"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <ProduceSvg name="corn" className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold mb-1">Browse Mandi Demand</h3>
            <p className="text-xs text-[var(--mute)] leading-relaxed">
              Check active procurement requests and live buyer pricing across regional hubs.
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
