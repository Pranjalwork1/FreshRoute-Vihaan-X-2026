import React from "react";

interface Props {
  metrics: {
    produceListed: string;
    produceSold: string;
    completedDeliveries: string;
    activeFarmers: string;
    activeBuyers: string;
    divertedWaste: string;
  };
}

export function ImpactSection({ metrics }: Props) {
  const items = [
    { label: "Produce listed", val: metrics.produceListed },
    { label: "Produce sold", val: metrics.produceSold },
    { label: "Completed deliveries", val: metrics.completedDeliveries },
    { label: "Active farmers", val: metrics.activeFarmers },
    { label: "Active buyers", val: metrics.activeBuyers },
    { label: "Produce diverted from waste", val: metrics.divertedWaste },
  ];

  return (
    <section>
      <h2>Building a Smarter, More Connected Food Supply Chain</h2>
      <p className="sub">
        Every year, millions of tonnes of edible harvests are discarded because cultivators lack immediate local buyers or coordinated transit before quality deteriorates. FreshRoute is engineered to connect surplus crops to commercial demand, preventing avoidable agricultural losses.
      </p>

      <div className="im" id="im">
        {items.map((item, i) => (
          <div key={i}>
            <b>{item.val}</b>
            <span>{item.label}</span>
            <small>
              {item.val === "–" ? "Awaiting real data" : "Verified network count"}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
