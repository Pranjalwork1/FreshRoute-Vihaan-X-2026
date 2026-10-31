"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FreshRouteLogo } from "@/components/icons/ProduceIcons";
import { useDeliveryLocation } from "@/lib/hooks/useDeliveryLocation";
import { useToastAndCart } from "@/lib/hooks/useToastAndCart";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";

export function Header({
  user,
}: {
  user?: { email?: string; fullName?: string; role?: string } | null;
}) {
  const [category, setCategory] = useState("All categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { location, status: locationStatus, detectLocation } = useDeliveryLocation();
  const { cartCount } = useToastAndCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenLocationModal = () => {
    setIsLocationModalOpen(true);
    // Directly request browser GPS permission on click
    detectLocation();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/marketplace?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(category)}`;
    } else {
      window.location.href = "/marketplace";
    }
  };

  const dashboardHref = user
    ? user.role === "buyer"
      ? "/dashboard/buyer"
      : user.role === "wholesaler"
      ? "/dashboard/wholesaler"
      : user.role === "logistics"
      ? "/dashboard/logistics"
      : user.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/seller"
    : "/login";

  return (
    <>
      {/* 1. Utility Top Bar with Real Delivery Location */}
      <div className="ub">
        <div className="w">
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              id="loc-btn"
              onClick={handleOpenLocationModal}
              className="flex items-center gap-2 py-1 px-2.5 rounded-lg text-inherit hover:text-white hover:bg-white/10 transition-all cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-[#35A66F]"
              aria-label="Select delivery location"
            >
              <span className="relative flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 flex-shrink-0 text-[#35A66F]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
                {mounted && locationStatus === "detecting" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#35A66F] animate-ping" />
                )}
              </span>
              {mounted && locationStatus === "detecting" ? (
                <span className="animate-pulse font-medium text-white">Detecting your location...</span>
              ) : mounted && location ? (
                <span>
                  Deliver to — <b className="text-white font-semibold">{location.locality}, {location.city}</b>
                  <span className="ml-1.5 text-[11px] underline opacity-85 hover:opacity-100 font-semibold text-[#80D2A6]">
                    (Change)
                  </span>
                </span>
              ) : (
                <span>
                  Deliver to — <b className="text-white font-semibold">Set your location</b>
                </span>
              )}
            </button>
          </span>

          <span>
            <Link href="/register?role=seller">Sell on FreshRoute</Link>
            <span className="opacity-80 cursor-pointer">हिन्दी</span>
            <Link href="/contact">Help</Link>
          </span>
        </div>
      </div>

      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* 2. Main Forest Green Header */}
      <header className="tp">
        <div className="w mb">
          <Link className="logo" href="/">
            <FreshRouteLogo />
            FreshRoute
          </Link>

          <form className="sb" role="search" onSubmit={handleSearch}>
            <select
              id="cat"
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All categories</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
              <option>Pulses</option>
              <option>Seasonal Produce</option>
              <option>Other Produce</option>
            </select>
            <input
              placeholder="Search produce"
              aria-label="Search produce"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {user ? (
            <Link className="ac" href={dashboardHref}>
              Hello, {user.fullName || user.email?.split("@")[0] || "Partner"}
              <b>Workspace & Account</b>
            </Link>
          ) : (
            <Link className="ac" href="/login">
              Hello, sign in
              <b>Account and workspace</b>
            </Link>
          )}

          <Link className="ca" href="/marketplace" aria-label="Cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 4h3l2.4 11h9.2L20 8H7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            <i id="cn">{cartCount}</i>
          </Link>
        </div>

        {/* 3. Category Strip */}
        <nav className="cs" aria-label="Categories">
          <div className="w" id="cs">
            <Link href="/marketplace">☰ All</Link>
            <Link href="/marketplace?category=vegetables">Vegetables</Link>
            <Link href="/marketplace?category=fruits">Fruits</Link>
            <Link href="/marketplace?category=grains">Grains</Link>
            <Link href="/marketplace?category=pulses">Pulses</Link>
            <Link href="/marketplace?category=seasonal">Seasonal Produce</Link>
            <a href="/#demo">Live demo</a>
            <a href="/#closing-soon">Closing soon</a>
            <Link href="/register?role=logistics">Logistics</Link>
            <Link href="/register?role=wholesaler">Storage</Link>
            <Link href="/register?role=seller">Sell on FreshRoute</Link>
          </div>
        </nav>
      </header>
    </>
  );
}
