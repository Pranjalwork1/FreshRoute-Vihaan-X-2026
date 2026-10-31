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
  let userName = "FreshRoute Producer";

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      user = authUser;
      sellerId = authUser.id;
      userName =
        authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Seller";
    }
  }

  const listings = await getSellerListings(sellerId);
  const activeListings = listings.filter((l) => l.status === "active");
  const totalAvailableQty = activeListings.reduce(
    (acc, cur) => acc + (Number(cur.quantity_available) || 0),
    0
  );

  return (
    <DashboardLayout
      roleTitle="Farmer & Seller"
      roleSubtitle="Seller workspace"
      navItems={SELLER_NAV}
      userEmail={user?.email}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mh">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <small>Seller workspace</small>
          </div>
          <Link href="/dashboard/seller/listings/new" className="btn">
            List New Produce
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="kp">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <small>Active listings</small>
            <strong>{activeListings.length}</strong>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <small>Available stock</small>
            <strong>{totalAvailableQty > 0 ? `${totalAvailableQty} kg` : "0 kg"}</strong>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <small>Pending offers</small>
            <strong>0</strong>
          </div>
          <div style={{ "--i": 3 } as React.CSSProperties}>
            <small>Active orders</small>
            <strong>0</strong>
          </div>
        </div>

        {/* Listings Panel */}
        <div className="pn2">
          <div className="flex justify-between items-center mb-4">
            <h2>Your listings</h2>
            <Link
              href="/dashboard/seller/listings"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              View all ({listings.length})
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mx-auto mb-3">
                <ProduceSvg name="crate" className="w-6 h-6" />
              </div>
              <p className="text-sm text-[var(--mute)] mb-4">
                No active produce listings in this session. Add your first harvest to connect with commercial buyers.
              </p>
              <Link href="/dashboard/seller/listings/new" className="btn text-xs">
                + Create Produce Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.map((l) => (
                <div key={l.id} className="lr">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[var(--tint)] flex items-center justify-center">
                      <ProduceSvg name={l.category || "tomato"} className="w-6 h-6" />
                    </div>
                    <div>
                      <b>{l.produce_name}</b>
                      <small className="block text-xs text-[var(--mute)]">
                        {l.quantity_available} {l.unit} • ₹{l.price_per_unit}/{l.unit}
                      </small>
                    </div>
                  </div>
                  <span className="tg2">{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
