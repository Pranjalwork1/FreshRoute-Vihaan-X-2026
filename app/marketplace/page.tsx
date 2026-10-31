import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs, ProduceSvg } from "@/components/icons/ProduceIcons";
import { getMarketplaceListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface SearchParamsProps {
  searchParams: Promise<{
    category?: string;
    location?: string;
    query?: string;
    grade?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "newest" | "price_low" | "price_high";
  }>;
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

export default async function MarketplacePage({ searchParams }: SearchParamsProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "All categories";
  const location = resolvedParams.location || "";
  const query = resolvedParams.query || "";
  const grade = resolvedParams.grade || "All grades";
  const sortBy = resolvedParams.sortBy || "newest";

  const listings = await getMarketplaceListings({
    category,
    location,
    query,
    grade,
    sortBy,
  });

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

  return (
    <>
      <ProduceSvgDefs />
      <Header user={user} />
      <main className="w py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Produce Marketplace
            </h1>
            <p className="text-sm text-[var(--mute)] mt-1">
              Live surplus agricultural lots from verified regional farmers and aggregators.
            </p>
          </div>
          <Link href="/dashboard/seller/listings/new" className="btn text-xs">
            + List Produce as Seller
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <form
          method="GET"
          action="/marketplace"
          className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <label>
            Produce Name
            <input
              name="query"
              defaultValue={query}
              placeholder="e.g. Tomatoes, Onions"
            />
          </label>

          <label>
            Category
            <select name="category" defaultValue={category}>
              <option>All categories</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
              <option>Pulses</option>
              <option>Seasonal Produce</option>
              <option>Other Produce</option>
            </select>
          </label>

          <label>
            Location
            <input
              name="location"
              defaultValue={location}
              placeholder="District or State"
            />
          </label>

          <label>
            Quality Grade
            <select name="grade" defaultValue={grade}>
              <option>All grades</option>
              <option>Grade A</option>
              <option>Grade B</option>
              <option>Grade C</option>
              <option>Ungraded</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button type="submit" className="btn flex-1 text-center py-2.5 text-xs">
              Apply Filters
            </button>
            <Link
              href="/marketplace"
              className="btn g text-xs py-2.5 px-3 flex items-center justify-center"
              title="Reset"
            >
              Reset
            </Link>
          </div>
        </form>

        {/* Active Results Summary */}
        <div className="flex justify-between items-center mb-6 text-xs text-[var(--mute)]">
          <span>
            Showing <strong>{listings.length}</strong> active batch
            {listings.length === 1 ? "" : "es"}
          </span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <Link
              href={`/marketplace?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&sortBy=newest`}
              className={`hover:underline ${sortBy === "newest" ? "font-bold text-[var(--acc)]" : ""}`}
            >
              Newest
            </Link>
            •
            <Link
              href={`/marketplace?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&sortBy=price_low`}
              className={`hover:underline ${sortBy === "price_low" ? "font-bold text-[var(--acc)]" : ""}`}
            >
              Price: Low to High
            </Link>
            •
            <Link
              href={`/marketplace?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&sortBy=price_high`}
              className={`hover:underline ${sortBy === "price_high" ? "font-bold text-[var(--acc)]" : ""}`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-12 text-center my-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--tint)] rounded-full flex items-center justify-center text-[var(--acc)]">
              <ProduceSvg name="crate" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Matching Produce Found</h3>
            <p className="text-[var(--mute)] max-w-md mx-auto mb-6 text-sm">
              We couldn’t find any active listings matching your current filter criteria. Try adjusting the category or clearing the search terms.
            </p>
            <Link href="/marketplace" className="btn g text-xs mr-3">
              Clear All Filters
            </Link>
            <Link href="/dashboard/seller/listings/new" className="btn text-xs">
              List This Produce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((l) => {
              const hasImage = l.images && l.images.length > 0;
              const primaryImage = hasImage ? l.images![0].storage_path : null;
              const symbol = getSymbolForBatch(l.produce_name, l.category);
              const bgColor = getCategoryColor(l.category);

              return (
                <article key={l.id} className="pc group">
                  <div className="pi">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={l.produce_name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <ProduceSvg name={symbol} className="w-20 h-20" />
                    )}
                    <span className="ex font-semibold">
                      {l.quality_grade || "Grade A"}
                    </span>
                  </div>

                  <div className="pb">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="group-hover:text-[var(--acc)] transition-colors">
                        {l.produce_name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--acc)] whitespace-nowrap">
                        Active
                      </span>
                    </div>

                    <small className="text-[var(--mute)] block mt-0.5">
                      {l.seller?.business_name || l.seller?.full_name || "Verified Grower"}
                      {l.pickup_location_text ? ` • ${l.pickup_location_text.split(",")[0]}` : ""}
                    </small>

                    <div className="pp my-1.5">
                      <sup>₹</sup>
                      {l.price_per_unit}
                      <span>/{l.unit}</span>
                    </div>

                    <div className="space-y-0.5 text-xs text-[var(--mute)]">
                      <div className="flex justify-between">
                        <span>Available volume:</span>
                        <b className="text-[var(--ink)]">{l.quantity_available} {l.unit}</b>
                      </div>
                      <div className="flex justify-between">
                        <span>Harvest date:</span>
                        <span className="text-[var(--ink)] font-medium">
                          {l.harvest_date
                            ? new Date(l.harvest_date).toLocaleDateString()
                            : "Today"}
                        </span>
                      </div>
                    </div>

                    <div className="ur mt-2.5">
                      {l.availability_deadline
                        ? `Deadline: ${new Date(l.availability_deadline).toLocaleDateString()}`
                        : "Ready for immediate dispatch"}
                    </div>

                    <div className="ab mt-3">
                      <Link
                        className="btn w-full text-center"
                        href={`/marketplace/${l.id}`}
                      >
                        View Details & Offer
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

