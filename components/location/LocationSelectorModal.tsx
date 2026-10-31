"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDeliveryLocation, DeliveryLocation } from "@/lib/hooks/useDeliveryLocation";

const CURATED_LOCATIONS: (DeliveryLocation & { tag?: string })[] = [
  { locality: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010", tag: "Urban Hub" },
  { locality: "Vashi APMC", city: "Navi Mumbai", state: "Maharashtra", pincode: "400703", tag: "Major APMC" },
  { locality: "Azadpur Mandi", city: "Delhi", state: "Delhi", pincode: "110033", tag: "Largest Mandi" },
  { locality: "Gultekdi Market", city: "Pune", state: "Maharashtra", pincode: "411037", tag: "Agri Terminal" },
  { locality: "Indira Nagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", tag: "Metro Hub" },
  { locality: "Pimpalgaon Hub", city: "Nashik", state: "Maharashtra", pincode: "422001", tag: "Onion/Grape Hub" },
  { locality: "Kolar Mandi Yard", city: "Kolar", state: "Karnataka", pincode: "563101", tag: "Tomato Center" },
  { locality: "Guntur Market", city: "Guntur", state: "Andhra Pradesh", pincode: "522004", tag: "Spice Mandi" },
  { locality: "Azad Nagar", city: "Kanpur", state: "Uttar Pradesh", pincode: "208002", tag: "Commercial Hub" },
  { locality: "Sector 26 Mandi", city: "Chandigarh", state: "Punjab", pincode: "160019", tag: "Grain/Veg Market" },
];

export function LocationSelectorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { location, status, errorMsg, detectLocation, setManualLocation } = useDeliveryLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetectingLocal, setIsDetectingLocal] = useState(false);

  // Auto trigger detection if opened without a selected location
  useEffect(() => {
    if (isOpen && !location && status === "idle") {
      setIsDetectingLocal(true);
      detectLocation().finally(() => setIsDetectingLocal(false));
    }
  }, [isOpen, location, status, detectLocation]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleUseCurrentLocation = async () => {
    setIsDetectingLocal(true);
    const success = await detectLocation();
    setIsDetectingLocal(false);
    if (success) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleSelectLocation = (loc: DeliveryLocation) => {
    setManualLocation(loc);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    if (/^\d{6}$/.test(q)) {
      handleSelectLocation({
        locality: `PIN ${q}`,
        city: "Delivery Zone",
        pincode: q,
      });
      return;
    }

    const parts = q.split(",").map((s) => s.trim()).filter(Boolean);
    handleSelectLocation({
      locality: parts[0] || "Custom Area",
      city: parts[1] || `${parts[0]} Region`,
    });
  };

  // Filter curated locations by search query
  const filteredLocations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CURATED_LOCATIONS;
    return CURATED_LOCATIONS.filter(
      (item) =>
        item.locality.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        (item.pincode && item.pincode.includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const isDetecting = status === "detecting" || isDetectingLocal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[var(--sf)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[var(--line)] bg-[var(--bg)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--tint)] border border-[var(--acc)]/20 flex items-center justify-center text-[var(--acc)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div>
              <h2 id="location-dialog-title" className="text-lg font-extrabold text-[var(--ink)] tracking-tight">
                Select Delivery Location
              </h2>
              <p className="text-xs text-[var(--mute)]">
                Accurate location ensures fresh farm rescue batches near you
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--tint)] hover:bg-[var(--line)] flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] transition-colors"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* GPS Detection Action Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F5FAF6] to-[#EAF4EE] border border-[#35A66F]/25 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--acc)] text-white shadow-sm shrink-0">
                  {isDetecting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="absolute w-full h-full rounded-2xl bg-[var(--acc)] opacity-25 animate-ping" />
                      <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="8" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                      </svg>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    {isDetecting ? "Detecting GPS coordinates..." : "Use Current Location"}
                  </h3>
                  <p className="text-xs text-[var(--mute)]">
                    {isDetecting
                      ? "Requesting browser location permission..."
                      : "Instant detection via device GPS & Geocoding"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isDetecting}
                className="py-2.5 px-4 rounded-xl bg-[var(--acc)] hover:bg-[var(--acc2)] text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isDetecting ? "Detecting..." : "Detect Location"}
              </button>
            </div>

            {/* Error or Permission Alert */}
            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <span className="font-bold text-amber-600 text-sm">⚠️</span>
                <div className="space-y-0.5">
                  <p className="font-semibold">{errorMsg}</p>
                  <p className="text-[11px] text-amber-800/80">
                    You can search your area or select a regional APMC hub below.
                  </p>
                </div>
              </div>
            )}

            {/* Active Selected Location Badge */}
            {location && !isDetecting && (
              <div className="mt-3 pt-3 border-t border-[#35A66F]/15 flex items-center justify-between text-xs">
                <span className="text-[var(--mute)]">Currently set to:</span>
                <span className="font-extrabold text-[var(--acc)] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--acc)] inline-block" />
                  {location.locality}, {location.city}
                  {location.pincode && ` (${location.pincode})`}
                </span>
              </div>
            )}
          </div>

          {/* Search Input Field */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[var(--mute)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, PIN code, Mandi, or City..."
                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] text-sm text-[var(--ink)] placeholder:text-[var(--mute)] focus:outline-none focus:border-[var(--acc)] focus:ring-2 focus:ring-[var(--acc)]/20 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 rounded-xl bg-[var(--acc)] text-white text-xs font-bold hover:bg-[var(--acc2)] transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
          </form>

          {/* Curated Regional Hubs & Mandis */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--mute)]">
                Popular Agricultural & Commercial Hubs
              </span>
              <span className="text-[11px] text-[var(--acc)] font-semibold">
                {filteredLocations.length} locations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredLocations.map((item) => (
                <button
                  key={`${item.locality}-${item.city}`}
                  type="button"
                  onClick={() => handleSelectLocation(item)}
                  className="p-3 text-left rounded-2xl border border-[var(--line)] bg-[var(--sf)] hover:border-[var(--acc)] hover:bg-[var(--tint)]/60 transition-all group flex items-start justify-between cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-[var(--ink)] group-hover:text-[var(--acc)] transition-colors truncate">
                      {item.locality}
                    </div>
                    <div className="text-[11px] text-[var(--mute)] truncate">
                      {item.city}, {item.state}
                    </div>
                    {item.pincode && (
                      <div className="text-[10px] text-[var(--mute)] font-mono mt-0.5">
                        PIN: {item.pincode}
                      </div>
                    )}
                  </div>

                  {item.tag && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--acc)] border border-[var(--acc)]/20 shrink-0">
                      {item.tag}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-6 text-xs text-[var(--mute)]">
                No matching preset found. Press <b>Apply</b> to use &quot;{searchQuery}&quot; as your custom delivery area.
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-[var(--line)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--mute)]">
            <svg className="w-3.5 h-3.5 text-[var(--acc)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
            </svg>
            <span>Coordinates are kept strictly local for mandi distance calculations. Never shared publicly.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
