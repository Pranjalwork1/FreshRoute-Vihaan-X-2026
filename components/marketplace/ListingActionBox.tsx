"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToastAndCart } from "@/lib/hooks/useToastAndCart";
import { ProduceBatch } from "@/lib/types";

interface ListingActionBoxProps {
  listing: ProduceBatch;
  isAuthenticated: boolean;
}

export function ListingActionBox({ listing, isAuthenticated }: ListingActionBoxProps) {
  const { addToCart } = useToastAndCart();
  const [inCart, setInCart] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [offerQty, setOfferQty] = useState(listing.minimum_order_quantity || 50);
  const [offerPrice, setOfferPrice] = useState(listing.price_per_unit || 20);
  const [offerNote, setOfferNote] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);

  const handleAddToCart = () => {
    addToCart(listing.produce_name);
    setInCart(true);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSuccess(true);
    setTimeout(() => {
      setShowOfferModal(false);
      setOfferSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Dynamic pricing summary */}
      <div className="flex items-center justify-between text-xs text-[var(--mute)] px-1">
        <span>Order quantity:</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={listing.minimum_order_quantity || 1}
            max={listing.quantity_available || 1000}
            value={offerQty}
            onChange={(e) => setOfferQty(Number(e.target.value))}
            className="w-20 px-2 py-1 text-right font-bold text-sm bg-[var(--tint)] border border-[var(--line)] rounded-lg text-[var(--ink)]"
          />
          <span className="font-semibold text-[var(--ink)]">{listing.unit}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline py-2 px-3 rounded-xl bg-[var(--tint)] border border-[var(--line)] text-xs">
        <span className="text-[var(--mute)]">Estimated Subtotal:</span>
        <span className="text-base font-extrabold text-[var(--ink)]">
          ₹{(offerQty * listing.price_per_unit).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`btn o py-3 text-sm font-semibold transition-all ${
            inCart ? "bg-[var(--tint)] text-[var(--acc)] border-[var(--acc)]" : ""
          }`}
        >
          {inCart ? "In Basket ✓" : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={() => setShowOfferModal(true)}
          className="btn g py-3 text-sm font-semibold text-center"
        >
          Make Offer
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowContactModal(true)}
        className="w-full py-2.5 px-4 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--tint)] transition-colors flex items-center justify-center gap-2"
      >
        <span>📞</span> Contact Verified Seller
      </button>

      <p className="text-[11px] text-center text-[var(--mute)] pt-1">
        Direct grower connection • Verified APMC / FPO source • Zero middleman margin
      </p>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute top-4 right-4 text-lg text-[var(--mute)] hover:text-[var(--ink)]"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-[var(--ink)] mb-1">
              Make an Offer for {listing.produce_name}
            </h3>
            <p className="text-xs text-[var(--mute)] mb-4">
              Submit your proposed price and volume directly to {listing.seller?.business_name || "the seller"}.
            </p>

            {offerSuccess ? (
              <div className="p-4 bg-[var(--tint)] border border-[var(--acc)]/30 rounded-xl text-center space-y-2">
                <span className="text-2xl">✓</span>
                <p className="text-xs font-bold text-[var(--acc)]">Offer Submitted Successfully!</p>
                <p className="text-[11px] text-[var(--mute)]">
                  The producer will review and confirm via SMS / WhatsApp notification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Requested Quantity ({listing.unit})
                  </label>
                  <input
                    type="number"
                    min={listing.minimum_order_quantity}
                    max={listing.quantity_available}
                    value={offerQty}
                    onChange={(e) => setOfferQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold"
                    required
                  />
                  <span className="text-[11px] text-[var(--mute)]">
                    Minimum order: {listing.minimum_order_quantity} {listing.unit}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Proposed Price per {listing.unit} (Listed: ₹{listing.price_per_unit})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-[var(--mute)]">₹</span>
                    <input
                      type="number"
                      min={1}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Special notes / logistics preference (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={offerNote}
                    onChange={(e) => setOfferNote(e.target.value)}
                    placeholder="e.g. Can pick up tomorrow with our own 3-ton truck..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="btn o flex-1 py-2.5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn g flex-1 py-2.5 text-xs font-semibold"
                  >
                    Submit Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Seller Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-lg text-[var(--mute)] hover:text-[var(--ink)]"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-[var(--ink)] mb-1">
              Seller Contact Details
            </h3>
            <p className="text-xs text-[var(--mute)] mb-4">
              Reach out directly to arrange inspection or farm gate pickup.
            </p>

            <div className="space-y-3 p-4 bg-[var(--tint)] rounded-xl border border-[var(--line)] text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Contact Name:</span>
                <span className="font-bold text-[var(--ink)]">
                  {listing.seller?.full_name || "Verified Producer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Farm / Business:</span>
                <span className="font-semibold text-[var(--ink)]">
                  {listing.seller?.business_name || "Agro FPO Member"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Direct Phone:</span>
                <a
                  href={`tel:${listing.seller?.phone || "+919822012345"}`}
                  className="font-bold text-[var(--acc)] hover:underline"
                >
                  {listing.seller?.phone || "+91 98220 12345"}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mute)]">Location:</span>
                <span className="font-semibold text-[var(--ink)] text-right">
                  {listing.pickup_location_text?.split(",").slice(0, 2).join(",") || "Nashik, MH"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${listing.seller?.phone || "+919822012345"}`}
                className="btn g flex-1 py-2.5 text-xs text-center font-semibold"
              >
                Call Seller
              </a>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="btn o flex-1 py-2.5 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
