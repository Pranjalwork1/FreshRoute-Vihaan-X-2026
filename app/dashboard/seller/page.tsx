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
      roleSubtitle="Producer Operations"
      navItems={SELLER_NAV}
      userEmail={user?.email}
      userName={userName}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="text-sm text-[var(--mute)] mt-1">
              Your produce is exposed to active commercial buyers and regional Mandis.
            </p>
          </div>
          <Link href="/dashboard/seller/listings/new" className="btn">
            + List New Produce
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Active Listings
            </span>
            <div className="text-3xl font-extrabold text-[var(--acc)] mt-2">
              {activeListings.length}
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Live in marketplace
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Available Quantity
            </span>
            <div className="text-3xl font-extrabold text-[var(--ink)] mt-2">
              {totalAvailableQty > 0 ? totalAvailableQty.toLocaleString() : "0"}
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Units across batches
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Pending Offers
            </span>
            <div className="text-3xl font-extrabold text-[var(--sig)] mt-2">
              0
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              New quote requests
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Produce Rescued
            </span>
            <div className="text-3xl font-extrabold text-green-700 mt-2">
              0 kg
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Awaiting completed sales
            </div>
          </div>
        </div>

        {/* Recently Listed Produce Section */}
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Produce Batches</h2>
            <Link
              href="/dashboard/seller/listings"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              View all ({listings.length})
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[var(--tint)] text-[var(--acc)] flex items-center justify-center mx-auto mb-3">
                <ProduceSvg name="crate" className="w-6 h-6" />
              </div>
              <p className="text-sm text-[var(--mute)] mb-4">
                No produce has been listed yet. Add your first crop batch to connect with buyers.
              </p>
              <Link href="/dashboard/seller/listings/new" className="btn text-xs">
                Create First Listing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {listings.slice(0, 3).map((l) => (
                <div key={l.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--ink)]">
                        {l.produce_name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 font-medium">
                        {l.category}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--mute)] mt-1">
                      {l.quantity_available} {l.unit} remaining • ₹{l.price_per_unit}/{l.unit}
                    </div>
                  </div>
                  <Link
                    href={`/marketplace/${l.id}`}
                    className="btn g text-xs py-1.5 px-3"
                  >
                    View Listing
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

