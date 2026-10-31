import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs, ProduceSvg } from "@/components/icons/ProduceIcons";
import { getListingById } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";

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
      <main className="w py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--mute)] mb-6">
          <Link href="/marketplace" className="hover:underline">
            Marketplace
          </Link>
          <span>/</span>
          <Link
            href={`/marketplace?category=${encodeURIComponent(listing.category)}`}
            className="hover:underline"
          >
            {listing.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--ink)] font-semibold">
            {listing.produce_name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Photographs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[var(--tint)] border border-[var(--line)] flex items-center justify-center relative">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={listing.produce_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProduceSvg name="tomato" className="w-40 h-40" />
              )}
              <div className="absolute top-4 left-4 bg-[var(--sf)]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[var(--acc)] border border-[var(--line)]">
                {listing.quality_grade}
              </div>
            </div>

            {hasImages && listing.images!.length > 1 && (
              <div className="flex gap-3">
                {listing.images!.map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--sf)]"
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

            {/* Specifications Card */}
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-base text-[var(--ink)]">
                Batch Specifications & Harvest History
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[var(--mute)] block">Batch Code</span>
                  <span className="font-bold">{listing.batch_code}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Variety / Cultivar</span>
                  <span className="font-bold">{listing.variety || "Standard Regional"}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Harvest Date</span>
                  <span className="font-bold">
                    {listing.harvest_date
                      ? new Date(listing.harvest_date).toLocaleDateString()
                      : "Harvested recently"}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Packaging Type</span>
                  <span className="font-bold">{listing.packaging_type || "Crates"}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Current Condition</span>
                  <span className="font-bold">{listing.current_condition || "Firm & Fresh"}</span>
                </div>
                <div>
                  <span className="text-[var(--mute)] block">Storage Condition</span>
                  <span className="font-bold">{listing.storage_condition || "Ambient Shade"}</span>
                </div>
              </div>

              {listing.description && (
                <div className="pt-4 border-t border-[var(--line)]">
                  <span className="text-xs text-[var(--mute)] block mb-1">
                    Producer Notes:
                  </span>
                  <p className="text-sm text-[var(--ink)] leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing, Seller & Purchase Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--acc)]">
                  {listing.category}
                </span>
                <h1 className="text-3xl font-extrabold text-[var(--ink)] mt-1">
                  {listing.produce_name}
                </h1>
                <p className="text-xs text-[var(--mute)] mt-1">
                  📍 {listing.pickup_location_text || "Regional Farm Location"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--tint)] border border-[var(--line)]">
                <div className="text-3xl font-black text-[var(--acc)]">
                  ₹{listing.price_per_unit}
                  <span className="text-sm font-normal text-[var(--mute)]">
                    /{listing.unit}
                  </span>
                </div>
                <div className="text-xs text-[var(--mute)] mt-1 flex justify-between">
                  <span>Minimum Order: {listing.minimum_order_quantity} {listing.unit}</span>
                  {listing.is_negotiable && (
                    <span className="font-bold text-[var(--acc)]">
                      ✓ Negotiable for bulk
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Available Stock:</span>
                  <span className="font-bold text-sm text-[var(--acc)]">
                    {listing.quantity_available} {listing.unit}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Total Batch Harvested:</span>
                  <span className="font-semibold">{listing.quantity_total} {listing.unit}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Seller Quality Declaration:</span>
                  <span className="font-semibold">{listing.quality_grade}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--line)]">
                  <span className="text-[var(--mute)]">Dispatch Deadline:</span>
                  <span className="font-semibold text-amber-700">
                    {listing.availability_deadline
                      ? new Date(listing.availability_deadline).toLocaleString()
                      : "Immediate dispatch"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {user ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="btn w-full text-center py-3"
                      onClick={() =>
                        alert(
                          `Connecting you with seller ${listing.seller?.full_name || "Producer"}. In milestone C, direct instant purchase and transport booking will complete checkout.`
                        )
                      }
                    >
                      Request Quote / Contact Seller
                    </button>
                    <p className="text-[11px] text-center text-[var(--mute)]">
                      Direct seller communication • Zero hidden commission
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/login?redirectTo=/marketplace/${listing.id}`}
                      className="btn w-full text-center py-3"
                    >
                      Login to Contact Seller
                    </Link>
                    <p className="text-[11px] text-center text-[var(--mute)]">
                      Verified buyers receive direct grower phone & WhatsApp details.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--mute)] mb-3">
                Seller Information
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--tint)] flex items-center justify-center font-bold text-[var(--acc)] text-base">
                  {listing.seller?.full_name?.[0] || "S"}
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--ink)]">
                    {listing.seller?.business_name || listing.seller?.full_name || "Verified Agricultural Producer"}
                  </div>
                  <div className="text-xs text-[var(--mute)]">
                    {listing.pickup_location_text?.split(",").slice(1).join(",") || "Regional Cultivator"}
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

