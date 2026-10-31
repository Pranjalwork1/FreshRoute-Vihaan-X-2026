import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMarketplaceListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

const BUYER_NAV = [
  { label: "Overview", href: "/dashboard/buyer" },
  { label: "Browse Marketplace", href: "/marketplace" },
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
      roleSubtitle="Produce Procurement Hub"
      navItems={BUYER_NAV}
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        <div className="bg-[var(--tint)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight">
              Buyer Workspace
            </h1>
            <p className="text-sm text-[var(--mute)] mt-1">
              Source fresh surplus harvests directly from verified regional growers.
            </p>
          </div>
          <Link href="/marketplace" className="btn">
            Explore Live Produce
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Live Listings
            </span>
            <div className="text-3xl font-extrabold text-[var(--acc)] mt-2">
              {activeListings.length}
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Available now
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Saved Produce
            </span>
            <div className="text-3xl font-extrabold text-[var(--ink)] mt-2">
              0
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Bookmarked batches
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Active Enquiries
            </span>
            <div className="text-3xl font-extrabold text-[var(--sig)] mt-2">
              0
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              Quotes awaiting reply
            </div>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
            <span className="text-xs text-[var(--mute)] font-medium">
              Deliveries
            </span>
            <div className="text-3xl font-extrabold text-blue-700 mt-2">
              0
            </div>
            <div className="text-[11px] text-[var(--mute)] mt-1">
              In transit
            </div>
          </div>
        </div>

        {/* Recommended Produce */}
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recommended Surplus Batches</h2>
            <Link
              href="/marketplace"
              className="text-xs font-semibold text-[var(--acc)] hover:underline"
            >
              Browse Full Marketplace →
            </Link>
          </div>

          {activeListings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--mute)]">
                No active produce listings available at this moment. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeListings.map((l) => (
                <div
                  key={l.id}
                  className="border border-[var(--line)] rounded-xl p-4 bg-[var(--sf)] hover:shadow transition flex flex-col"
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-[var(--tint)] flex items-center justify-center mb-3">
                    {l.images && l.images.length > 0 ? (
                      <img
                        src={l.images[0].storage_path}
                        alt={l.produce_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProduceSvg name="tomato" className="w-12 h-12" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[var(--ink)]">
                    {l.produce_name}
                  </h3>
                  <div className="text-xs text-[var(--mute)]">
                    {l.quantity_available} {l.unit} available
                  </div>
                  <div className="text-base font-extrabold text-[var(--acc)] mt-2">
                    ₹{l.price_per_unit}/{l.unit}
                  </div>
                  <Link
                    href={`/marketplace/${l.id}`}
                    className="btn g text-xs text-center mt-3 py-1.5"
                  >
                    View Details
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

