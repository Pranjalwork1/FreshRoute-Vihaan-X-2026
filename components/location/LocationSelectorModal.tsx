"use client";

import React, { useState } from "react";
import { useDeliveryLocation, DeliveryLocation } from "@/lib/hooks/useDeliveryLocation";

const PRESET_REGIONS: DeliveryLocation[] = [
  { locality: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010" },
  { locality: "Vashi APMC", city: "Navi Mumbai", state: "Maharashtra", pincode: "400703" },
  { locality: "Azadpur Mandi", city: "Delhi", state: "Delhi", pincode: "110033" },
  { locality: "Indira Nagar", city: "Bengaluru", state: "Karnataka", pincode: "560038" },
  { locality: "Gultekdi Market", city: "Pune", state: "Maharashtra", pincode: "411037" },
  { locality: "Nashik Central", city: "Nashik", state: "Maharashtra", pincode: "422001" },
];

export function LocationSelectorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { location, status, errorMsg, detectLocation, setManualLocation } = useDeliveryLocation();
  const [manualInput, setManualInput] = useState("");
  const [inputError, setInputError] = useState("");

  if (!isOpen) return null;

  const handleUseCurrentLocation = async () => {
    const success = await detectLocation();
    if (success) {
      onClose();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualInput.trim();
    if (!trimmed) {
      setInputError("Please enter your locality, city, or 6-digit PIN code.");
      return;
    }

    // Check if it's a 6-digit PIN code
    if (/^\d{6}$/.test(trimmed)) {
      setManualLocation({
        locality: `PIN ${trimmed}`,
        city: "Verified Area",
        pincode: trimmed,
      });
      onClose();
      return;
    }

    // Otherwise split by comma or whitespace
    const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
    const locality = parts[0] || "Custom Area";
    const city = parts[1] || (parts[0] ? `${parts[0]} Region` : "Nearby");

    setManualLocation({
      locality,
      city,
    });
    onClose();
  };

  const handleSelectPreset = (preset: DeliveryLocation) => {
    setManualLocation(preset);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loc-modal-title"
    >
      <div
        className="w-full max-w-md bg-[var(--sf)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--bg)]">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[var(--acc)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <h3 id="loc-modal-title" className="font-bold text-base text-[var(--ink)]">
              Choose Delivery Location
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--mute)] hover:bg-[var(--line)] transition"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Current selected location banner if exists */}
          {location && (
            <div className="p-3 rounded-2xl bg-[var(--tint)] border border-[var(--acc)]/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[var(--mute)] block text-[11px]">Currently selected:</span>
                <b className="text-[var(--acc)] text-sm">
                  {location.locality}, {location.city}
                </b>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[var(--acc)] text-white text-[10px] font-bold">
                Active
              </span>
            </div>
          )}

          {/* Primary Action: Use Geolocation */}
          <div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={status === "detecting"}
              className="w-full py-3 px-4 rounded-xl bg-[var(--acc)] hover:bg-[var(--acc2)] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {status === "detecting" ? (
                <>
                  <span className="spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Detecting your location...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                  <span>Use my current location</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-[var(--mute)] mt-1.5 text-center leading-tight">
              Only requests location on click. Exact coordinates remain private and are never stored publicly.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <span className="font-bold text-amber-600">ℹ</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--line)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--mute)]">
              or enter manually
            </span>
            <div className="flex-1 h-px bg-[var(--line)]" />
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Gomti Nagar, Lucknow or 226010"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setInputError("");
                }}
                className="flex-1 py-2 px-3.5 rounded-xl border border-[var(--line)] text-sm bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--acc)] focus:ring-1 focus:ring-[var(--acc)]"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-[var(--tint)] text-[var(--acc)] hover:bg-[var(--acc)] hover:text-white font-bold text-xs border border-[var(--acc)]/30 transition"
              >
                Apply
              </button>
            </div>
            {inputError && <span className="text-[11px] text-red-600 block">{inputError}</span>}
          </form>

          {/* Preset Popular Agricultural & Urban Hubs */}
          <div>
            <span className="text-xs font-semibold text-[var(--mute)] block mb-2">
              Quick Selection:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_REGIONS.map((region) => (
                <button
                  key={region.locality}
                  type="button"
                  onClick={() => handleSelectPreset(region)}
                  className="text-left p-2.5 rounded-xl border border-[var(--line)] hover:border-[var(--acc)] hover:bg-[var(--tint)]/50 transition group"
                >
                  <b className="text-xs text-[var(--ink)] group-hover:text-[var(--acc)] block">
                    {region.locality}
                  </b>
                  <small className="text-[11px] text-[var(--mute)]">
                    {region.city}, {region.state}
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

