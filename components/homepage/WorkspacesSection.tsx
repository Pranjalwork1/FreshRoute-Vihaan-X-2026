"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProducePhoto, ProduceSvg } from "@/components/icons/ProduceIcons";

interface WorkspaceCardData {
  art: string;
  isSvg?: boolean;
  title: string;
  desc: string;
  ctaText: string;
  roleHref: string;
  insideItems: string[];
}

const WORKSPACE_CARDS: WorkspaceCardData[] = [
  {
    art: "corn",
    title: "For Farmers",
    desc: "Reach more buyers and manage produce listings.",
    ctaText: "Start selling",
    roleHref: "/register?role=seller",
    insideItems: [
      "Add New Produce",
      "My Listings",
      "Inventory",
      "Buyer Offers",
      "Orders",
      "Logistics",
      "Earnings and Payments",
    ],
  },
  {
    art: "pomegranate",
    title: "For Retailers",
    desc: "Find nearby produce and place smaller orders.",
    ctaText: "Join as a retailer",
    roleHref: "/register?role=buyer",
    insideItems: [
      "Browse Produce",
      "My Orders",
      "My Requirements",
      "Offers",
      "Saved Listings",
      "Delivery Tracking",
      "Payments",
    ],
  },
  {
    art: "crate",
    isSvg: true,
    title: "For Wholesalers",
    desc: "Publish bulk requirements and negotiate purchases.",
    ctaText: "Join as a wholesaler",
    roleHref: "/register?role=wholesaler",
    insideItems: [
      "Publish bulk requirements",
      "Compare quotations",
      "Track large orders",
      "Manage suppliers",
      "Multi-batch fulfilment",
      "Download invoices",
    ],
  },
  {
    art: "i-t",
    isSvg: true,
    title: "For Logistics Providers",
    desc: "Discover delivery requests and offer transportation services.",
    ctaText: "Join as a provider",
    roleHref: "/register?role=logistics",
    insideItems: [
      "Available Delivery Jobs",
      "My Vehicles",
      "My Quotes",
      "Active Deliveries",
      "Delivery History",
      "Earnings",
    ],
  },
];

export function WorkspacesSection() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="who">
      <h2>Who can use FreshRoute?</h2>
      <p className="sub">
        Every account gets its own workspace. Flip a card to preview what’s inside. You can combine activities, such as selling and buying.
      </p>

      <div className="who" id="whogrid">
        {WORKSPACE_CARDS.map((card, idx) => {
          const isFlipped = !!flippedCards[idx];
          return (
            <div
              key={card.title}
              className={`fw ${isFlipped ? "flip" : ""}`}
            >
              <div className="cd">
                {/* Front face */}
                <div className="fa f" style={{ pointerEvents: isFlipped ? "none" : "auto" }}>
                  <div className="art">
                    {card.isSvg ? (
                      <ProduceSvg name={card.art} className="w-16 h-16 text-[var(--acc)]" />
                    ) : (
                      <ProducePhoto name={card.art} alt={card.title} />
                    )}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <Link className="btn" href={card.roleHref}>
                    {card.ctaText}
                  </Link>
                  <button
                    type="button"
                    className="lk"
                    onClick={() => toggleFlip(idx)}
                  >
                    Preview workspace
                  </button>
                </div>

                {/* Back face */}
                <div className="fa b" style={{ pointerEvents: !isFlipped ? "none" : "auto" }}>
                  <h4>Inside your workspace</h4>
                  <ul>
                    {card.insideItems.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                  <Link className="btn" href={card.roleHref}>
                    {card.ctaText}
                  </Link>
                  <button
                    type="button"
                    className="lk"
                    onClick={() => toggleFlip(idx)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="fn">
        Admin accounts are assigned by operators and can’t be chosen at sign-up.
      </p>
    </section>
  );
}
