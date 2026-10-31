import React from "react";
import { ProduceCard } from "./ProduceCard";
import { SAMPLE_PRODUCE } from "./ClosingSoonSection";

export function RecentlyListedSection() {
  const recentItems = SAMPLE_PRODUCE.slice(0, 8);

  return (
    <section id="marketplace" style={{ padding: "24px 0 40px" }}>
      <div className="hd">
        <div>
          <h2>Recently listed produce</h2>
          <p className="sub" style={{ margin: 0 }}>
            Real produce photos with example listings. Sellers, prices and quantities are synthetic.
          </p>
        </div>
      </div>

      <div className="gd" id="gd">
        {recentItems.map((item) => (
          <ProduceCard key={item.id} item={item} />
        ))}
      </div>

      <p className="fn">The live site shows real active listings from the database.</p>
    </section>
  );
}
