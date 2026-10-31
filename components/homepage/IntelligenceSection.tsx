import React from "react";

const INTEL_FEATURES = [
  {
    icon: "i-m",
    title: "Intelligent buyer matching",
    desc: "Buyers who can’t meet your quantity, grade or deadline are removed first. The rest are ranked with reasons shown.",
  },
  {
    icon: "i-k",
    title: "Produce urgency assessment",
    desc: "Urgency comes from the seller’s deadline and the details they give, and the basis is always explained.",
  },
  {
    icon: "i-t",
    title: "Shared transport recommendations",
    desc: "See compatible deliveries that could share a vehicle, with every assumption listed before you accept.",
  },
  {
    icon: "i-s",
    title: "Cold-storage discovery",
    desc: "Find facilities that suit your produce, with capacity, conditions and charges.",
  },
  {
    icon: "i-b",
    title: "Rescue plan comparison",
    desc: "Compare sale, split sale, storage or processing side by side by estimated recovery value.",
  },
];

export function IntelligenceSection() {
  return (
    <section id="intel">
      <h2>Smarter decisions. Less avoidable waste.</h2>
      <p className="sub">
        FreshRoute Intelligence helps you weigh your options using real listings, buyers and vehicles on the platform. It supports your decision. It doesn’t promise savings or prevent spoilage.
      </p>

      <div className="ft" id="ft">
        {INTEL_FEATURES.map((item) => (
          <div key={item.title} className="fe">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <use href={`#${item.icon}`} />
            </svg>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
