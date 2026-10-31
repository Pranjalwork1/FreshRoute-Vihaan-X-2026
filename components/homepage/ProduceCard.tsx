"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProducePhoto } from "@/components/icons/ProduceIcons";
import { useToastAndCart } from "@/lib/hooks/useToastAndCart";

export interface ProduceItem {
  id: string;
  name: string;
  locality: string;
  qty: number;
  price: number;
  grade: string;
  harvest: string;
  deadlineHours: number | null;
  minQty: number;
  isExample?: boolean;
}

const formatHours = (h: number) => {
  return h < 48 ? `${h} h` : `${Math.round(h / 24)} days`;
};

export function ProduceCard({ item }: { item: ProduceItem }) {
  const [inCart, setInCart] = useState(false);
  const { addToCart } = useToastAndCart();

  const h = item.deadlineHours;
  const isHighUrgency = h !== null && h <= 24;
  const isMediumUrgency = h !== null && h > 24 && h <= 72;

  const urgencyLabel = isHighUrgency ? "High urgency" : isMediumUrgency ? "Medium urgency" : "Normal";
  const urgencyText =
    h === null
      ? "No deadline set by the seller"
      : `${urgencyLabel}: seller’s deadline is in ${formatHours(h)}`;

  return (
    <article className="pc group">
      {/* Visual Image Container with Radial Lighting */}
      <Link href={`/marketplace/${item.id}`} className="pi block cursor-pointer">
        <ProducePhoto
          name={item.id}
          alt={item.name}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Closing Soon Pill */}
        {h !== null && h <= 48 && (
          <span className="bd flex items-center gap-1 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current inline-block" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            Closes in {formatHours(h)}
          </span>
        )}

        {/* Quality / Example Tag */}
        <span className="ex font-semibold">
          {item.grade.includes("Grade A") ? "Grade A" : "Verified Batch"}
        </span>
      </Link>

      {/* Card Content Body */}
      <div className="pb">
        <div className="flex items-start justify-between gap-1">
          <Link href={`/marketplace/${item.id}`} className="hover:underline">
            <h3 className="group-hover:text-[var(--acc)] transition-colors">
              {item.name}
            </h3>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--acc)] whitespace-nowrap">
            Available
          </span>
        </div>

        <small className="text-[var(--mute)] block mt-0.5">
          Verified grower • {item.locality}
        </small>

        {/* Price Display */}
        <div className="pp my-1.5">
          <sup>₹</sup>
          {item.price}
          <span>/kg</span>
        </div>

        {/* Batch Details */}
        <div className="space-y-0.5 text-xs text-[var(--mute)]">
          <div className="flex justify-between">
            <span>Available volume:</span>
            <b className="text-[var(--ink)]">{item.qty} kg</b>
          </div>
          <div className="flex justify-between">
            <span>Minimum order:</span>
            <span className="text-[var(--ink)] font-medium">{item.minQty} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Condition:</span>
            <span className="text-[var(--ink)] font-medium capitalize">{item.harvest.toLowerCase()}</span>
          </div>
        </div>

        {/* Urgency Badge Indicator */}
        <div
          className={`ur mt-2.5 ${isHighUrgency
              ? "bg-[#FDF2E9] text-[#B95000] font-semibold border border-[#F5CBA7]/40"
              : ""
            }`}
        >
          {urgencyText}
        </div>

        {/* Action Buttons */}
        <div className="ab mt-3">
          <button
            type="button"
            className={`btn o transition-all ${inCart ? "bg-[var(--tint)] text-[var(--acc)] border-[var(--acc)]" : ""
              }`}
            onClick={() => {
              setInCart(true);
              addToCart(item.name);
            }}
          >
            {inCart ? "In Basket ✓" : "Add to cart"}
          </button>

          <Link
            href={`/marketplace/${item.id}`}
            className="btn g text-center"
          >
            Make offer
          </Link>
        </div>
      </div>
    </article>
  );
}
