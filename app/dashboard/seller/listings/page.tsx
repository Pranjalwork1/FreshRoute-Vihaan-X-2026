"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProduceBatch } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
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

export default function SellerListingsPage() {
  const [listings, setListings] = useState<ProduceBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("produce_batches")
            .select(`
              *,
              batch_images (
                id,
                batch_id,
                storage_path,
                display_order
              )
            `)
            .eq("seller_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setListings(
              data.map((b: any) => ({
                ...b,
                images: b.batch_images || [],
              }))
            );
            setLoading(false);
            return;
          }
        }
      }

      // Fallback local fetch
      const res = await fetch("/api/listings/my-listings");
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.warn("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "active" | "paused" | "archived"
  ) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/listings/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: nextStatus } : l))
        );
        setActionMsg(`Listing status updated to ${nextStatus}.`);
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this batch listing?")) return;

    try {
      const res = await fetch(`/api/listings/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "archived" }),
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: "archived" as const } : l
          )
        );
        setActionMsg("Listing archived.");
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      roleTitle="Farmer & Seller"
      roleSubtitle="Produce Inventory"
      navItems={SELLER_NAV}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
            <p className="text-xs text-[var(--mute)]">
              Manage all active, paused and archived produce batches
            </p>
          </div>
          <Link href="/dashboard/seller/listings/new" className="btn text-xs">
            + Add New Produce
          </Link>
        </div>

        {actionMsg && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
            {actionMsg}
          </div>
        )}

        {loading ? (
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-12 text-center text-sm text-[var(--mute)]">
            Loading your produce inventory...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-[var(--tint)] rounded-full flex items-center justify-center text-[var(--acc)]">
              <ProduceSvg name="crate" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-1">No Produce Listed Yet</h3>
            <p className="text-xs text-[var(--mute)] max-w-sm mx-auto mb-6">
              You haven’t published any harvest or surplus batches yet. Put your surplus in front of serious buyers today.
            </p>
            <Link href="/dashboard/seller/listings/new" className="btn text-xs">
              List Your First Batch
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((l) => {
              const hasImg = l.images && l.images.length > 0;
              const imgUrl = hasImg ? l.images![0].storage_path : null;

              return (
                <div
                  key={l.id}
                  className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[var(--tint)] border border-[var(--line)] overflow-hidden shrink-0 flex items-center justify-center">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={l.produce_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProduceSvg name="tomato" className="w-10 h-10" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-[var(--mute)] bg-gray-100 px-2 py-0.5 rounded">
                          {l.batch_code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            l.status === "active"
                              ? "bg-green-100 text-green-800"
                              : l.status === "paused"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {l.status.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[var(--mute)]">
                          {l.quality_grade}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--ink)]">
                        {l.produce_name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--mute)] mt-1">
                        <span>
                          <strong>Available:</strong> {l.quantity_available}{" "}
                          {l.unit} / {l.quantity_total} {l.unit}
                        </span>
                        <span>
                          <strong>Price:</strong> ₹{l.price_per_unit}/{l.unit}
                        </span>
                        <span>
                          <strong>Harvest:</strong>{" "}
                          {l.harvest_date
                            ? new Date(l.harvest_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Link
                      href={`/marketplace/${l.id}`}
                      className="btn g text-xs py-1.5 px-3"
                    >
                      View
                    </Link>
                    {l.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(l.id, l.status as any)}
                        className="py-1.5 px-3 rounded-xl border border-[var(--line)] text-xs font-semibold hover:bg-gray-100"
                      >
                        {l.status === "active" ? "Pause" : "Resume"}
                      </button>
                    )}
                    {l.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => handleArchive(l.id)}
                        className="py-1.5 px-3 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

