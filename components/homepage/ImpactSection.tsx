import React from "react";

const IMPACT_METRICS = [
  "Produce listed",
  "Produce sold",
  "Completed deliveries",
  "Active farmers",
  "Active buyers",
  "Produce diverted from waste",
];

export function ImpactSection() {
  return (
    <section>
      <h2>Impact, measured honestly</h2>
      <p className="sub">
        Live figures appear here only once there is enough real transaction data. Until then, these are the things we will count, and nothing is estimated.
      </p>

      <div className="im" id="im">
        {IMPACT_METRICS.map((metric) => (
          <div key={metric}>
            <b>—</b>
            <span>{metric}</span>
            <small>Awaiting real data</small>
          </div>
        ))}
      </div>
    </section>
  );
}
