import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs, ProducePhoto } from "@/components/icons/ProduceIcons";
import { getListingById } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { ListingActionBox } from "@/components/marketplace/ListingActionBox";

interface Props {
  params: Promise<{
    listingId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: Props) {
  const { listingId } = await params;
  const listing = await getListingById(listingId);

  if (!listing) {
    notFound();
  }

  const supabase = await createClient();
  let user = null;
  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      user = { email: authUser.email };
    }
  }

  const hasImages = listing.images && listing.images.length > 0;
  const primaryImage = hasImages ? listing.images![0].storage_path : null;

  return (
    <>
      <ProduceSvgDefs />
      <Header user={user} />
      <main className="w py-10" id="main-content">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
          <Link href="/marketplace" className="hover:text-[var(--acc)] hover:underline">
            Marketplace
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/marketplace?category=${encodeURIComponent(listing.category)}`}
            className="hover:text-[var(--acc)] hover:underline"
          >
            {listing.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--ink)] font-semibold truncate max-w-[200px] sm:max-w-none">
            {listing.produce_name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: 3D Produce Stage & Batch Specifications */}
          <div className="lg:col-span-7 space-y-6">
            <div className="cg group min-h-[380px] p-8 flex items-center justify-center relative overflow-hidden">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={listing.produce_name}
                  className="w-full max-h-[340px] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <ProducePhoto
                  name={listing.id}
                  alt={listing.produce_name}
                  className="w-56 h-56 md:w-64 md:h-64 object-contain filter drop-shadow-2xl"
                />
              )}

              {/* Quality & Verified Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[var(--sf)]/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-[var(--acc)] border border-[var(--line)] shadow-sm">
                  {listing.quality_grade}
                </span>
                <span className="bg-[var(--tint)] px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--acc)] border border-[var(--acc)]/20 shadow-sm">
                  Direct Farm Batch
                </span>
              </div>

              {/* Availability countdown pill */}
              {listing.availability_deadline && (
                <div className="absolute bottom-4 right-4 bg-[var(--sf)]/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Dispatch: {new Date(listing.availability_deadline).toLocaleDateString()}
                </div>
              )}
            </div>

            {hasImages && listing.images!.length > 1 && (
              <div className="flex gap-3">
                {listing.images!.map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--sf)] shadow-xs"
                  >
                    <img
                      src={img.storage_path}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Batch Specifications Card */}
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-5 shadow-xs">
              <h3 className="font-bold text-base text-[var(--ink)] flex items-center gap-2">
                <span>📋</span> Batch Specifications & Harvest Traceability
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Batch Code</span>
                  <span className="font-bold font-mono text-[var(--ink)]">{listing.batch_code}</span>
                </div>
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Variety / Cultivar</span>
                  <span className="font-bold text-[var(--ink)]">{listing.variety || "Standard Regional"}</span>
                </div>
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Harvest Date</span>
                  <span className="font-bold text-[var(--ink)]">
                    {listing.harvest_date
                      ? new Date(listing.harvest_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Harvested recently"}
                  </span>
                </div>
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Packaging Type</span>
                  <span className="font-bold text-[var(--ink)]">{listing.packaging_type || "Crates"}</span>
                </div>
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Current Condition</span>
                  <span className="font-bold text-[var(--ink)]">{listing.current_condition || "Firm & Fresh"}</span>
                </div>
                <div className="p-3 bg-[var(--tint)]/50 rounded-xl border border-[var(--line)]/50">
                  <span className="text-[var(--mute)] block text-[11px] mb-0.5">Storage Protocol</span>
                  <span className="font-bold text-[var(--ink)]">{listing.storage_condition || "Ambient Shade"}</span>
                </div>
              </div>

              {listing.description && (
                <div className="pt-4 border-t border-[var(--line)]">
                  <span className="text-xs font-bold text-[var(--ink)] block mb-1">
                    Producer Field Notes:
                  </span>
                  <p className="text-xs text-[var(--mute)] leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing, Verified Producer & Interactive Action Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--acc)]">
                  {listing.category} • Fresh Batch
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] mt-1 tracking-tight">
                  {listing.produce_name}
                </h1>
                <p className="text-xs text-[var(--mute)] mt-1.5 flex items-center gap-1.5">
                  <span>📍</span> {listing.pickup_location_text || "Regional Farm Location"}
                </p>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-xl bg-[var(--tint)] border border-[var(--line)]">
                <div className="text-3xl font-black text-[var(--acc)] flex items-baseline">
                  <sup className="text-lg font-bold">₹</sup>
                  {listing.price_per_unit}
                  <span className="text-xs font-normal text-[var(--mute)] ml-1">
                    /{listing.unit}
                  </span>
                </div>
                <div className="text-xs text-[var(--mute)] mt-1 flex justify-between">
                  <span>Minimum order: {listing.minimum_order_quantity} {listing.unit}</span>
                  {listing.is_negotiable && (
                    <span className="font-bold text-[var(--acc)]">
                      ✓ Negotiable on bulk
                    </span>
                  )}
                </div>
                {listing.bulk_pricing_details && (
                  <p className="text-[11px] text-[var(--acc)] font-medium mt-1">
                    Bulk discount: {listing.bulk_pricing_details}
                  </p>
                )}
              </div>

              {/* Volume Indicators */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Available Stock:</span>
                  <span className="font-bold text-sm text-[var(--acc)]">
                    {listing.quantity_available} {listing.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Total Batch Harvested:</span>
                  <span className="font-semibold text-[var(--ink)]">{listing.quantity_total} {listing.unit}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Quality Grade:</span>
                  <span className="font-semibold text-[var(--ink)]">{listing.quality_grade}</span>
                </div>
              </div>

              {/* Interactive Client Action Component */}
              <ListingActionBox
                listing={listing}
                isAuthenticated={!!user}
              />
            </div>

            {/* Verified Seller Info Card */}
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--mute)] mb-3">
                Verified Seller & Hub
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--tint)] border border-[var(--line)] flex items-center justify-center font-bold text-[var(--acc)] text-base shrink-0">
                  {listing.seller?.full_name?.[0] || "F"}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[var(--ink)] truncate">
                    {listing.seller?.business_name || listing.seller?.full_name || "Verified Agricultural Producer"}
                  </div>
                  <div className="text-xs text-[var(--mute)] truncate">
                    {listing.pickup_location_text?.split(",").slice(1).join(",") || "Regional Cultivator"}
                  </div>
                  <div className="text-[11px] text-[var(--acc)] font-semibold mt-0.5">
                    ✓ KYC Verified • Direct Farm Dispatch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
