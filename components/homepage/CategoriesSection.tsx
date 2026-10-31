import React from "react";
import Link from "next/link";
import { ProducePhoto, ProduceSvg } from "@/components/icons/ProduceIcons";

const CATEGORIES = [
  { name: "Vegetables", key: "tomato", slug: "vegetables" },
  { name: "Fruits", key: "pomegranate", slug: "fruits" },
  { name: "Grains", key: "corn", slug: "grains" },
  { name: "Pulses", key: "pulses", slug: "pulses", isSvg: true },
  { name: "Seasonal Produce", key: "cauliflower", slug: "seasonal" },
  { name: "Other Produce", key: "ginger", slug: "other" },
];

export function CategoriesSection() {
  return (
    <section id="cats" style={{ paddingTop: "24px" }}>
      <h2>Shop by category</h2>
      <div className="cats" id="catgrid" style={{ marginTop: "24px" }}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            className="cat"
            href={`/marketplace?category=${cat.slug}`}
          >
            <div style={{ background: "#F4F7F2" }}>
              {cat.isSvg ? (
                <ProduceSvg name={cat.key} className="w-12 h-12" />
              ) : (
                <ProducePhoto name={cat.key} alt={cat.name} />
              )}
            </div>
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
