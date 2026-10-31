"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDeliveryLocation, DeliveryLocation } from "@/lib/hooks/useDeliveryLocation";

const CURATED_LOCATIONS: (DeliveryLocation & { tag?: string })[] = [
  { locality: "Peepal Gaon", city: "Prayagraj", state: "Uttar Pradesh", pincode: "211012", tag: "Current Area" },
  { locality: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010", tag: "Urban Hub" },
  { locality: "Vashi APMC", city: "Navi Mumbai", state: "Maharashtra", pincode: "400703", tag: "Major APMC" },
  { locality: "Azadpur Mandi", city: "Delhi", state: "Delhi", pincode: "110033", tag: "Largest Mandi" },
  { locality: "Gultekdi Market", city: "Pune", state: "Maharashtra", pincode: "411037", tag: "Agri Terminal" },
  { locality: "Pimpalgaon Hub", city: "Nashik", state: "Maharashtra", pincode: "422001", tag: "Onion/Grape Hub" },
  { locality: "Indira Nagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", tag: "Metro Hub" },
  { locality: "Kolar Mandi Yard", city: "Kolar", state: "Karnataka", pincode: "563101", tag: "Tomato Center" },
  { locality: "Civil Lines", city: "Prayagraj", state: "Uttar Pradesh", pincode: "211001", tag: "Central Hub" },
  { locality: "Guntur Market", city: "Guntur", state: "Andhra Pradesh", pincode: "522004", tag: "Spice Mandi" },
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
      }, 400);
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
      className="loc-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
      onClick={onClose}
    >
      <div
        className="loc-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--line, #E1E7DE)", background: "var(--bg, #F8FAF6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--tint, #E7F1EA)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--acc, #176B45)", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <div>
              <h2 id="location-dialog-title" style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "var(--ink, #19251F)", letterSpacing: "-0.01em" }}>
                Select Delivery Location
              </h2>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--mute, #5F6D65)" }}>
                Find fresh farm rescue batches dispatching near you
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ width: "32px", height: "32px", borderRadius: "50%", background: "transparent", border: "1px solid var(--line, #E1E7DE)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mute, #5F6D65)", cursor: "pointer", fontSize: "14px" }}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          {/* Current GPS Location Card */}
          <div style={{ padding: "14px 16px", borderRadius: "16px", background: "var(--tint, #E7F1EA)", border: "1px solid var(--line, #E1E7DE)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
              <div style={{ width: "38px", height: "38px", minWidth: "38px", borderRadius: "12px", background: "var(--acc, #176B45)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {isDetecting ? (
                  <span style={{ width: "18px", height: "18px", border: "2px solid #ffffff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "20px", height: "20px" }}>
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                  </svg>
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink, #19251F)" }}>
                  {isDetecting ? "Detecting GPS location..." : location ? `${location.locality}, ${location.city}` : "Use Current Location"}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--mute, #5F6D65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {isDetecting ? "Requesting device permission..." : location ? "Detected via browser GPS" : "Detect area via device GPS"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              style={{ padding: "8px 14px", borderRadius: "10px", background: "var(--acc, #176B45)", color: "var(--on, #ffffff)", fontSize: "12px", fontWeight: 700, border: "none", cursor: isDetecting ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0, opacity: isDetecting ? 0.7 : 1 }}
            >
              {isDetecting ? "Detecting..." : location ? "Re-detect" : "Detect"}
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#FEF6F0", border: "1px solid rgba(234, 88, 12, 0.3)", color: "#C2410C", fontSize: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ fontWeight: 700 }}>ℹ</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: "14px", color: "var(--mute, #5F6D65)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "16px", height: "16px" }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, PIN code, or city..."
              style={{ width: "100%", padding: "10px 80px 10px 38px", borderRadius: "14px", border: "1px solid var(--line, #E1E7DE)", background: "var(--bg, #F8FAF6)", fontSize: "13px", color: "var(--ink, #19251F)", outline: "none", boxSizing: "border-box" }}
            />
            {searchQuery && (
              <button
                type="submit"
                style={{ position: "absolute", right: "6px", padding: "6px 12px", borderRadius: "10px", background: "var(--acc, #176B45)", color: "#ffffff", fontSize: "11px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Apply
              </button>
            )}
          </form>

          {/* Preset Hubs */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--mute, #5F6D65)" }}>
                Popular Markets & Hubs
              </span>
              <span style={{ fontSize: "11px", color: "var(--acc, #176B45)", fontWeight: 600 }}>
                {filteredLocations.length} locations
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {filteredLocations.map((item) => (
                <button
                  key={`${item.locality}-${item.city}`}
                  type="button"
                  onClick={() => handleSelectLocation(item)}
                  style={{ padding: "10px 12px", textAlign: "left", borderRadius: "12px", border: "1px solid var(--line, #E1E7DE)", background: "var(--sf, #ffffff)", cursor: "pointer", display: "flex", flexDirection: "column", gap: "2px", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--acc, #176B45)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line, #E1E7DE)")}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--ink, #19251F)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.locality}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--mute, #5F6D65)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.city}, {item.state}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{ paddingTop: "8px", borderTop: "1px solid var(--line, #E1E7DE)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "var(--mute, #5F6D65)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ width: "12px", height: "12px", color: "var(--acc, #176B45)" }}>
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
            </svg>
            <span>Location coordinates stay local to estimate mandi distances.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
