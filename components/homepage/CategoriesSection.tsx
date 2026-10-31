import React from "react";
import Link from "next/link";
import { ProduceSvg } from "@/components/icons/ProduceIcons";

const CATEGORIES = [
  { name: "Vegetables", symbol: "tomato", bg: "#FBE3DE" },
  { name: "Fruits", symbol: "mango", bg: "#FFF0D2" },
  { name: "Grains", symbol: "wheat", bg: "#F6EBC9" },
  { name: "Pulses", symbol: "pulses", bg: "#F3E2D0" },
  { name: "Seasonal Produce", symbol: "pumpkin", bg: "#FFE6C9" },
  { name: "Other Produce", symbol: "crate", bg: "#E8EFE3" },
];

export function CategoriesSection() {
  return (
    <section>
      <div className="hd">
        <div>
          <h2>Browse categories</h2>
          <p className="sub" style={{ margin: 0 }}>
            Jump straight to the produce you need.
          </p>
        </div>
      </div>
      <div className="cats" id="cats" style={{ marginTop: "28px" }}>
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            className="cat"
            href={`/marketplace?category=${encodeURIComponent(c.name)}`}
          >
            <div style={{ background: c.bg }}>
              <ProduceSvg name={c.symbol} />
            </div>
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

