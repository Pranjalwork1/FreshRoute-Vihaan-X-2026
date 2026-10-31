"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProducePhoto } from "@/components/icons/ProduceIcons";

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
  const [offerSent, setOfferSent] = useState(false);
  const [inCart, setInCart] = useState(false);

  const h = item.deadlineHours;
  const urgencyText =
    h === null
      ? "No deadline set by the seller"
      : `${h <= 24 ? "High" : h <= 72 ? "Medium" : "Low"} urgency: seller’s deadline is in ${formatHours(h)}`;

  return (
    <article className="pc">
      <div className="pi">
        <ProducePhoto name={item.id} alt={item.name} />
        {h !== null && h <= 48 && (
          <span className="bd">Closes in {formatHours(h)}</span>
        )}
        <span className="ex">Example</span>
      </div>

      <div className="pb">
        <h3>{item.name}</h3>
        <small>Example seller, {item.locality}</small>

        <div className="pp">
          <sup>₹</sup>
          {item.price}
          <span>/kg</span>
        </div>

        <small>
          {item.qty} kg available, minimum {item.minQty} kg
        </small>
        <small>
          {item.grade}, {item.harvest.toLowerCase()}
        </small>

        <div className="ur">{urgencyText}</div>

        <div className="ab">
          <button
            type="button"
            className="btn o"
            onClick={() => {
              setInCart(true);
              alert(`Added ${item.name} to cart.`);
            }}
          >
            {inCart ? "In Cart ✓" : "Add to cart"}
          </button>
          <Link
            href={`/marketplace?item=${item.id}`}
            className="btn g text-center"
          >
            Make an offer
          </Link>
        </div>
      </div>
    </article>
  );
}
