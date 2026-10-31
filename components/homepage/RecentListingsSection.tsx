import React from "react";
import Link from "next/link";
import { ProduceBatch } from "@/lib/types";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

interface Props {
  listings: ProduceBatch[];
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Vegetables":
      return "#FBE3DE";
    case "Fruits":
      return "#FFF0D2";
    case "Grains":
      return "#F6EBC9";
    case "Pulses":
      return "#F3E2D0";
    case "Seasonal Produce":
      return "#FFE6C9";
    default:
      return "#E8EFE3";
  }
}

function getSymbolForBatch(name: string, category: string) {
  const n = name.toLowerCase();
  if (n.includes("tomato")) return "tomato";
  if (n.includes("potato")) return "potato";
  if (n.includes("onion")) return "onion";
  if (n.includes("chilli") || n.includes("mirch")) return "chilli";
  if (n.includes("mango")) return "mango";
  if (n.includes("wheat") || n.includes("rice")) return "wheat";
  if (n.includes("dal") || n.includes("chana") || n.includes("pulse")) return "pulses";
  if (n.includes("pumpkin") || n.includes("watermelon")) return "pumpkin";
  return category === "Fruits" ? "mango" : category === "Grains" ? "wheat" : "crate";
}

export function RecentListingsSection({ listings }: Props) {
  return (
    <section id="marketplace" style={{ paddingTop: "24px" }}>
      <div className="hd">
        <div>
          <h2>Recently listed produce</h2>
          <p className="sub">
            Each card shows who is selling, how much, and how urgent it is, with the reason.
          </p>
        </div>
        <Link className="btn g" href="/marketplace">
          View All Produce
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-[var(--sf)] border border-[var(--line)] rounded-[18px] p-10 text-center my-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--tint)] rounded-full flex items-center justify-center text-[var(--acc)]">
            <ProduceSvg name="crate" className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">No active produce listed yet</h3>
          <p className="text-[var(--mute)] max-w-md mx-auto mb-6 text-sm">
            Be the first farmer or vendor to list your fresh harvest or surplus batch on FreshRoute.
          </p>
          <Link href="/dashboard/seller/listings/new" className="btn">
            List First Batch
          </Link>
        </div>
      ) : (
        <div className="lst" id="lst">
          {listings.slice(0, 4).map((listing) => {
            const hasImage = listing.images && listing.images.length > 0;
            const primaryImage = hasImage ? listing.images![0].storage_path : null;
            const symbol = getSymbolForBatch(listing.produce_name, listing.category);
            const bgColor = getCategoryColor(listing.category);

            return (
              <article key={listing.id} className="li">
                <div className="ph" style={{ background: bgColor }}>
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={listing.produce_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProduceSvg name={symbol} />
                  )}
                  <em>{listing.quality_grade || "Grade A"}</em>
                </div>

                <div className="lb">
                  <h3>{listing.produce_name}</h3>
                  <small>
                    {listing.seller?.business_name || listing.seller?.full_name || "Verified Seller"}
                    {listing.pickup_location_text ? `, ${listing.pickup_location_text}` : ""}
                  </small>
                  <small>
                    {listing.quantity_available} {listing.unit} available
                  </small>
                  <small>
                    {listing.harvest_date
                      ? `Harvested ${new Date(listing.harvest_date).toLocaleDateString()}`
                      : "Recently harvested"}
                  </small>

                  <div className="pr">
                    ₹{listing.price_per_unit}
                    <span>/{listing.unit}</span>
                  </div>

                  <div className="ur">
                    {listing.availability_deadline
                      ? `Available until ${new Date(listing.availability_deadline).toLocaleDateString()}`
                      : "Fresh dispatch available"}
                  </div>

                  <Link className="btn" href={`/marketplace/${listing.id}`}>
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="fn">
        Real-time active listings from the FreshRoute marketplace network.
      </p>
    </section>
  );
}

