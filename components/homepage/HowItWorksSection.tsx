import React from "react";

const STEPS = [
  {
    num: "1",
    title: "List your surplus",
    desc: "Add photos, quantity, price and your pickup deadline. Takes less than two minutes.",
  },
  {
    num: "2",
    title: "Get matched",
    desc: "Retailers, wholesalers and commercial kitchens in your delivery radius see the lot immediately.",
  },
  {
    num: "3",
    title: "Line up transport",
    desc: "Choose from matched local logistics providers or opt for self-pickup with real-time tracking.",
  },
  {
    num: "4",
    title: "Deliver & settle",
    desc: "Batch is verified against seller declarations, the order completes, and funds settle cleanly.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how">
      <h2>How FreshRoute works</h2>
      <p className="sub">Four steps from a full crate to a completed delivery.</p>

      <div className="steps" id="steps">
        {STEPS.map((s) => (
          <div key={s.num} className="st">
            <span className="sn">{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
