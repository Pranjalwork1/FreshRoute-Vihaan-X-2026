import React from "react";

const STEPS = [
  {
    icon: "i-l",
    num: "01",
    title: "List produce",
    desc: "Farmers and vendors publish available produce.",
  },
  {
    icon: "i-m",
    num: "02",
    title: "Connect with buyers",
    desc: "Retailers and wholesalers discover suitable listings.",
  },
  {
    icon: "i-t",
    num: "03",
    title: "Arrange logistics",
    desc: "Connect with suitable transport and storage partners.",
  },
  {
    icon: "i-c",
    num: "04",
    title: "Rescue produce",
    desc: "Complete transactions and track documented outcomes.",
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
            <span className="ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <use href={`#${s.icon}`} />
              </svg>
            </span>
            <b>{s.num}</b>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

