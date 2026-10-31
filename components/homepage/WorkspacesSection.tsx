"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

interface WorkspaceCard {
  id: string;
  symbol: string;
  title: string;
  desc: string;
  btnText: string;
  link: string;
  features: string[];
}

const WORKSPACES: WorkspaceCard[] = [
  {
    id: "farmer",
    symbol: "wheat",
    title: "For Farmers",
    desc: "Reach more buyers and manage produce listings.",
    btnText: "Start selling",
    link: "/register?intent=farmer",
    features: [
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
    id: "retailer",
    symbol: "mango",
    title: "For Retailers",
    desc: "Find nearby produce and place smaller orders.",
    btnText: "Join as a retailer",
    link: "/register?intent=retailer",
    features: [
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
    id: "wholesaler",
    symbol: "crate",
    title: "For Wholesalers",
    desc: "Publish bulk requirements and negotiate purchases.",
    btnText: "Join as a wholesaler",
    link: "/register?intent=wholesaler",
    features: [
      "Publish bulk requirements",
      "Compare quotations",
      "Track large orders",
      "Manage suppliers",
      "Multi-batch fulfilment",
      "Download invoices",
    ],
  },
  {
    id: "logistics",
    symbol: "i-t",
    title: "For Logistics Providers",
    desc: "Discover delivery requests and offer transportation services.",
    btnText: "Join as a provider",
    link: "/register?intent=logistics_provider",
    features: [
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
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="who">
      <h2>Who can use FreshRoute?</h2>
      <p className="sub">
        Every account gets its own workspace. Flip a card to preview what’s
        inside. You can combine activities, such as selling and buying.
      </p>

      <div className="who" id="who">
        {WORKSPACES.map((w) => {
          const isFlipped = !!flipped[w.id];
          return (
            <div key={w.id} className={`fw ${isFlipped ? "flip" : ""}`}>
              <div className="cd">
                {/* Front Side */}
                <div className="fa f" inert={isFlipped ? true : undefined}>
                  <div className="art">
                    {w.symbol === "i-t" ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-12 h-12"
                      >
                        <use href="#i-t" />
                      </svg>
                    ) : (
                      <ProduceSvg name={w.symbol} />
                    )}
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <Link className="btn" href={w.link}>
                    {w.btnText}
                  </Link>
                  <button
                    type="button"
                    className="lk"
                    onClick={() => toggleFlip(w.id)}
                  >
                    Preview workspace
                  </button>
                </div>

                {/* Back Side */}
                <div className="fa b" inert={!isFlipped ? true : undefined}>
                  <h4>Inside your workspace</h4>
                  <ul>
                    {w.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <Link className="btn" href={w.link}>
                    {w.btnText}
                  </Link>
                  <button
                    type="button"
                    className="lk"
                    onClick={() => toggleFlip(w.id)}
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

